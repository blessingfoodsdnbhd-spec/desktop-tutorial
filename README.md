# Keith Tan Studio — Website

A static, premium interior design website. **All editable content lives in one
file: `content.js`.** Edit that one file and every page updates.

---

## How to edit your website

There is **one file you need to know**: [`content.js`](./content.js).

Open it on GitHub:
1. Go to https://github.com/blessingfoodsdnbhd-spec/desktop-tutorial
2. Click **`content.js`**
3. Click the pencil icon (✏️ Edit) at the top right
4. Make your changes
5. Scroll down → click **Commit changes** → **Commit changes**
6. Wait 1–2 minutes for GitHub Pages to rebuild
7. Refresh your website (`Ctrl + Shift + R` to bypass cache)

Anything inside `content.js` is what shows on the website.

---

## Common edits

### Change studio name, phone, email
Open `content.js`, find the `studio:` block at the top:

```js
studio: {
  name:           "Keith Tan Studio",
  email:          "keithtan@gmail.com",
  phoneDisplay:   "+60 10 464 6983",
  phoneRaw:       "60104646983",   // digits only, used for tel: + WhatsApp
  ...
}
```
Just edit the text between the `"…"` quotes. Keep the quotes and commas.

### Add a new project
Find the `projects:` array. Each project is one `{ … }` block.
Copy any block, paste it above or below, and edit:

```js
{
  id:           "my-new-project",          // url slug, no spaces
  name:         "The Lim Family Home",
  type:         "residential",             // residential | commercial | hospitality
  location:     "Bangsar, KL",
  year:         2025,
  area:         "320 m²",
  scope:        "Renovation, FF&E",
  photographer: "Adrian Wong",
  coverImage:   "https://YOUR-IMAGE-URL.jpg",
  shortDesc:    "One-line description.",
  longDesc: [
    "First paragraph.",
    "Second paragraph."
  ],
  gallery: [
    "https://image1.jpg",
    "https://image2.jpg"
  ],
  featured: true                          // true = appears on homepage
},
```

### Replace an image
Find the image URL in `content.js` and replace it. Image URLs must:
- start with `https://`
- end in `.jpg`, `.jpeg`, `.png`, or `.webp`

Easiest hosting: upload your photo to Imgur, Cloudinary, or directly to this
GitHub repo, then copy the link.

### Edit a team member, service, or value
Same pattern — find the block (in `team:`, `services:`, `values:`), edit the
text, save.

### Remove an item
Delete the whole `{ … }` block including its trailing comma.

---

## Three rules to avoid breaking the site

1. **Keep the punctuation** — every `:`, `"`, `,`, `{`, `}`, `[`, `]` matters.
2. **Text goes in double quotes** — `"like this"` not `'like this'`.
3. **Use straight quotes** `"` not curly quotes `“ ”`. If you copy text from
   Word or Pages, retype the quotes.

If a page goes blank: open the browser console (right-click → Inspect →
Console) — it will tell you which line in `content.js` has the problem.

---

## Files

| File | What it is | Edit it? |
| --- | --- | --- |
| `content.js` | All editable text + images | ✅ **Yes — your main file** |
| `index.html` | Homepage skeleton | Only if changing layout |
| `portfolio.html` | Portfolio skeleton | Only if changing layout |
| `project.html` | Project detail template | Only if changing layout |
| `about.html` | About skeleton | Only if changing layout |
| `services.html` | Services skeleton | Only if changing layout |
| `contact.html` | Contact + map + form | Only if changing layout |
| `styles.css` | Visual design (colours, fonts) | Only if changing styling |
| `render.js` | Auto-fills pages from `content.js` | Don't touch |
| `script.js` | Nav menu, scroll animations, form | Don't touch |

---

## Local preview

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Live site

https://blessingfoodsdnbhd-spec.github.io/desktop-tutorial/
