#!/usr/bin/env python3
"""
find_leads.py — Sales lead finder for Keith Tan Studio (interior design).

Finds commercial businesses (restaurants, cafes, hotels, offices, retail...) in a
given area using free OpenStreetMap data, then exports a clean prospect list to CSV.

No API key required. Uses only the Python standard library, so there is nothing to
`pip install`. Just run it.

Data sources (both free, no key):
  - Nominatim  -> turns an area name like "Bangsar, Kuala Lumpur" into a search area
  - Overpass   -> returns businesses (name, phone, website, address...) in that area

Quick start:
  python3 find_leads.py --area "Bangsar, Kuala Lumpur" --types restaurant,cafe,hotel
  python3 find_leads.py --area "Petaling Jaya" --types restaurant --require phone --out pj.csv
  python3 find_leads.py --list-types

Note: OpenStreetMap has no star ratings. If you need ratings / review counts,
that is the Google Places upgrade we discussed (needs a Google API key).
"""

import argparse
import csv
import json
import sys
import time
import urllib.parse
import urllib.request

USER_AGENT = "keith-tan-studio-sales-agent/0.1 (lead finder)"

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
]

# Friendly category name -> list of OSM tag selectors.
# A selector of (key, None) means "the key exists with any value".
CATEGORIES = {
    "restaurant": [("amenity", "restaurant")],
    "cafe":       [("amenity", "cafe")],
    "bar":        [("amenity", "bar"), ("amenity", "pub")],
    "fast_food":  [("amenity", "fast_food")],
    "hotel":      [("tourism", "hotel"), ("tourism", "guest_house"), ("tourism", "hostel")],
    "office":     [("office", None)],
    "retail":     [("shop", None)],
    "salon":      [("shop", "hairdresser"), ("shop", "beauty"), ("leisure", "spa")],
    "gym":        [("leisure", "fitness_centre")],
    "clinic":     [("amenity", "clinic"), ("amenity", "dentist"), ("amenity", "doctors")],
    "bakery":     [("shop", "bakery")],
}

CSV_COLUMNS = [
    "name", "category", "phone", "website", "email", "address",
    "opening_hours", "cuisine", "osm_url", "source", "lat", "lon", "score",
]


def _get(url, headers=None, data=None, timeout=90):
    req = urllib.request.Request(url, data=data, headers=headers or {})
    req.add_header("User-Agent", USER_AGENT)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read().decode("utf-8")


def geocode_area(name):
    """Resolve an area name to a bounding box (south, west, north, east).

    Uses the bounding box of Nominatim's best match. The box scales naturally with
    the place: a suburb gives a small box, a city a large one. A point-like match
    (e.g. a single node) is padded to ~2 km so the search area is never empty.
    """
    query = urllib.parse.urlencode({"q": name, "format": "json", "limit": 5})
    raw = _get(f"{NOMINATIM_URL}?{query}")
    results = json.loads(raw)
    if not results:
        raise SystemExit(f"Could not find any place called {name!r}. Try a broader name.")

    top = results[0]
    # Nominatim boundingbox order is [south, north, west, east] (as strings).
    south, north, west, east = (float(x) for x in top["boundingbox"])

    min_span = 0.02  # ~2.2 km, guards against a point-like result
    if (north - south) < min_span or (east - west) < min_span:
        lat, lon = (north + south) / 2, (east + west) / 2
        south, north = lat - min_span / 2, lat + min_span / 2
        west, east = lon - min_span / 2, lon + min_span / 2

    print(f"  matched: {top.get('display_name', name)}", file=sys.stderr)
    print(f"  search box: S{south:.4f} W{west:.4f} N{north:.4f} E{east:.4f}", file=sys.stderr)
    return (south, west, north, east)


def _selector_to_overpass(key, value):
    if value is None:
        return f'["{key}"]'
    return f'["{key}"="{value}"]'


def build_overpass_query(bbox, types, timeout=90):
    south, west, north, east = bbox
    scope = f"({south},{west},{north},{east})"

    lines = []
    for t in types:
        for key, value in CATEGORIES[t]:
            sel = _selector_to_overpass(key, value)
            lines.append(f"  nwr{sel}{scope};")

    body = "\n".join(lines)
    return f"[out:json][timeout:{timeout}];\n(\n{body}\n);\nout tags center;"


def run_overpass(query):
    data = urllib.parse.urlencode({"data": query}).encode("utf-8")
    last_err = None
    for endpoint in OVERPASS_ENDPOINTS:
        try:
            raw = _get(endpoint, data=data)
            return json.loads(raw).get("elements", [])
        except Exception as e:  # network/boundary failure -> try the mirror
            last_err = e
            time.sleep(2)
    raise SystemExit(f"Overpass request failed on all endpoints: {last_err}")


def classify(tags, types):
    """Return the first selected category whose tag selector matches these tags."""
    for t in types:
        for key, value in CATEGORIES[t]:
            if key in tags and (value is None or tags[key] == value):
                return t
    return ""


def extract(el, types):
    tags = el.get("tags", {})
    name = tags.get("name") or tags.get("name:en")
    if not name:
        return None

    phone = tags.get("phone") or tags.get("contact:phone") or tags.get("contact:mobile") or ""
    website = tags.get("website") or tags.get("contact:website") or tags.get("url") or ""
    email = tags.get("email") or tags.get("contact:email") or ""

    parts = []
    hn, st = tags.get("addr:housenumber"), tags.get("addr:street")
    if hn and st:
        parts.append(f"{hn} {st}")
    elif st:
        parts.append(st)
    for k in ("addr:suburb", "addr:city", "addr:postcode", "addr:state"):
        if tags.get(k):
            parts.append(tags[k])
    address = ", ".join(parts)

    lat = el.get("lat") or (el.get("center") or {}).get("lat")
    lon = el.get("lon") or (el.get("center") or {}).get("lon")

    score = (1 if phone else 0) + (1 if website else 0) + (1 if email else 0)

    return {
        "name": name,
        "category": classify(tags, types),
        "phone": phone,
        "website": website,
        "email": email,
        "address": address,
        "opening_hours": tags.get("opening_hours", ""),
        "cuisine": tags.get("cuisine", ""),
        "osm_url": f"https://www.openstreetmap.org/{el.get('type')}/{el.get('id')}",
        "source": "OpenStreetMap",
        "lat": lat,
        "lon": lon,
        "score": score,
    }


def dedupe(rows):
    """Drop duplicates (same name within ~100m), keeping the most complete record."""
    best = {}
    for r in rows:
        lat = round(float(r["lat"]), 3) if r["lat"] is not None else None
        lon = round(float(r["lon"]), 3) if r["lon"] is not None else None
        key = (r["name"].strip().lower(), lat, lon)
        if key not in best or r["score"] > best[key]["score"]:
            best[key] = r
    return list(best.values())


def write_csv(rows, path):
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_COLUMNS)
        writer.writeheader()
        for r in rows:
            writer.writerow(r)


def parse_types(value):
    types = [t.strip() for t in value.split(",") if t.strip()]
    unknown = [t for t in types if t not in CATEGORIES]
    if unknown:
        raise SystemExit(
            f"Unknown type(s): {', '.join(unknown)}.\n"
            f"Valid types: {', '.join(CATEGORIES)}\n"
            f"(run with --list-types to see them)"
        )
    return types


def main(argv=None):
    parser = argparse.ArgumentParser(
        description="Find commercial sales leads from free OpenStreetMap data.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="Example:\n"
               '  python3 find_leads.py --area "Bangsar, Kuala Lumpur" '
               "--types restaurant,cafe,hotel --out leads.csv",
    )
    parser.add_argument("--area", help='Area to search, e.g. "Bangsar, Kuala Lumpur"')
    parser.add_argument("--types", default="restaurant,cafe,bar,hotel",
                        help="Comma list of business types (default: restaurant,cafe,bar,hotel)")
    parser.add_argument("--require", default="",
                        help="Comma list of fields a lead MUST have, e.g. phone,website")
    parser.add_argument("--limit", type=int, default=0,
                        help="Max number of leads to keep (0 = no limit)")
    parser.add_argument("--out", default="leads.csv", help="Output CSV path (default: leads.csv)")
    parser.add_argument("--list-types", action="store_true", help="List available business types and exit")
    args = parser.parse_args(argv)

    if args.list_types:
        print("Available business types:")
        for name, sels in CATEGORIES.items():
            desc = ", ".join(k if v is None else f"{k}={v}" for k, v in sels)
            print(f"  {name:<11} ({desc})")
        return 0

    if not args.area:
        parser.error("--area is required (e.g. --area \"Bangsar, Kuala Lumpur\")")

    types = parse_types(args.types)
    # --require uses field names (phone/website/email), not category names.
    required_fields = [f.strip() for f in args.require.split(",") if f.strip()]
    for f in required_fields:
        if f not in ("phone", "website", "email"):
            raise SystemExit(f"--require only supports: phone, website, email (got {f!r})")

    print(f"Resolving area: {args.area} ...", file=sys.stderr)
    bbox = geocode_area(args.area)
    time.sleep(1)  # be polite to Nominatim

    print(f"Searching for: {', '.join(types)} ...", file=sys.stderr)
    query = build_overpass_query(bbox, types)
    elements = run_overpass(query)

    rows = [r for r in (extract(el, types) for el in elements) if r]
    rows = dedupe(rows)

    if required_fields:
        rows = [r for r in rows if all(r[f] for f in required_fields)]

    rows.sort(key=lambda r: (-r["score"], r["name"].lower()))

    if args.limit > 0:
        rows = rows[: args.limit]

    write_csv(rows, args.out)
    with_phone = sum(1 for r in rows if r["phone"])
    with_web = sum(1 for r in rows if r["website"])
    print(f"\nDone. {len(rows)} leads written to {args.out}", file=sys.stderr)
    print(f"  with phone:   {with_phone}", file=sys.stderr)
    print(f"  with website: {with_web}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
