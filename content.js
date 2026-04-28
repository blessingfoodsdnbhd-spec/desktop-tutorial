/* ==============================================================
   ALL EDITABLE WEBSITE CONTENT — EDIT ME
   ==============================================================
   This is the only file you need to edit to update the website.
   - Change the studio name, phone, email, etc.
   - Add / remove / re-order projects below.
   - Replace any image URL with your own image link.

   RULES (avoid breaking the page):
   1. Keep all the punctuation: , : { } [ ] " "
   2. Each text value goes inside double quotes:  "like this"
   3. Each item in a list ends with a comma, except sometimes
      the last one — when in doubt, leave the comma there.
   4. After saving, refresh the website to see your changes.

   QUICK GUIDE:
   - To add a project: copy a project block { ... }, paste it,
     and edit the name / images / text. Set "featured: true" to
     show it on the homepage.
   - To add a team member: same thing — copy a person block.
   - To replace an image: copy the link to your image (must end
     in .jpg / .jpeg / .png / .webp) and paste it where the
     existing URL is.
   ============================================================== */

window.SITE = {

  /* --------------------------------------------------------------
     STUDIO INFO — used in the navigation, every footer, contact
     page, and the WhatsApp button.
     -------------------------------------------------------------- */
  studio: {
    name:           "Keith Tan Studio",
    subtitle:       "Interior Design",
    foundedYear:    2008,

    email:          "keithtan@gmail.com",
    phoneDisplay:   "+60 10 464 6983",     // shown to people
    phoneRaw:       "60104646983",         // digits only, for tel: + WhatsApp

    locationLine1:  "Kuala Lumpur",
    locationLine2:  "Malaysia",
    hoursLine1:     "Monday — Friday",
    hoursLine2:     "10:00 — 18:00 MYT",
    hoursNote:      "By appointment only",

    mapEmbedUrl:    "https://www.google.com/maps?q=Kuala+Lumpur,+Malaysia&output=embed",

    // Used for sharing previews and the WhatsApp pre-filled message
    siteUrl:        "https://blessingfoodsdnbhd-spec.github.io/desktop-tutorial/",
    whatsappMsg:    "Hello Keith Tan Studio, I'd like to discuss a project."
  },


  /* --------------------------------------------------------------
     HOMEPAGE — hero image and headline
     -------------------------------------------------------------- */
  hero: {
    image:    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2400&q=85",
    eyebrow:  "Keith Tan Studio · Est. 2008",
    titleHTML:"Designing Spaces<br/>That <em>Inspire</em>",
    lead:     "A studio for residential and commercial interiors — where light, proportion, and craft are composed in quiet."
  },

  homeIntro: {
    eyebrow:  "The Studio",
    titleHTML:"A small studio composing timeless residential and<br/>commercial interiors — image-led, never decorated."
  },

  homeCta: {
    eyebrow:    "Begin a Project",
    titleHTML:  "Let's design a space that<br/><em>feels</em> like home.",
    text:       "We accept a small number of new commissions each year. Tell us about your space, your vision, and your timeline.",
    buttonText: "Start a Project"
  },


  /* --------------------------------------------------------------
     PROJECTS — copy a { ... } block to add a new project.
     - "type" controls the portfolio filter:
        "residential" | "commercial" | "hospitality"
     - "featured: true" makes it appear on the homepage.
     - "id" is used in the URL: project.html?id=this-id
     - "gallery" can have any number of images.
     -------------------------------------------------------------- */
  projects: [

    {
      id:           "damansara-residence",
      name:         "The Damansara Residence",
      type:         "residential",
      location:     "Bukit Damansara, KL",
      year:         2024,
      area:         "240 m²",
      scope:        "Renovation, FF&E",
      photographer: "Adrian Wong",
      coverImage:   "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85",
      shortDesc:    "A full-home renovation in Bukit Damansara — restoring proportion and natural light.",
      longDesc: [
        "A full-home renovation in Bukit Damansara, restoring the original proportions of a 1990s hillside residence while introducing a quiet contemporary palette of limewashed plaster, oak parquet, and travertine.",
        "Existing mouldings and timber floors were carefully preserved. New interventions were kept few but precise: a sculptural plaster kitchen, bespoke joinery in burnished bronze, and a custom marble bath."
      ],
      gallery: [
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2000&q=85",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=85"
      ],
      featured: true
    },

    {
      id:           "bali-villa",
      name:         "Casa Ombra",
      type:         "residential",
      location:     "Bali, Indonesia",
      year:         2023,
      area:         "420 m²",
      scope:        "Full Build, FF&E",
      photographer: "Adrian Wong",
      coverImage:   "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85",
      shortDesc:    "A tropical villa overlooking the Ayung river — quietly modern, deeply rooted in place.",
      longDesc: [
        "A new-build villa retreat above the Ayung river in Ubud. The brief asked for a building that disappears into the landscape — open to the breeze, framed by teak and lava stone.",
        "Indonesian craftspeople collaborated on every threshold, from the hand-rubbed plaster walls to the carved teak screens that filter the western sun."
      ],
      gallery: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2000&q=85",
        "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85"
      ],
      featured: true
    },

    {
      id:           "ashbury-hotel",
      name:         "The Ashbury",
      type:         "hospitality",
      location:     "Bukit Bintang, KL",
      year:         2023,
      area:         "1,800 m²",
      scope:        "Boutique Hotel · Public Areas",
      photographer: "Studio AY",
      coverImage:   "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85",
      shortDesc:    "A 32-key boutique hotel in central KL — restrained, romantic, and quietly Malaysian.",
      longDesc: [
        "Located on a quiet stretch off Jalan Bukit Bintang, The Ashbury is a 32-key boutique hotel built on a refined material palette of oak, brass, and unpolished travertine.",
        "Public spaces are conceived as a sequence of rooms: an arrival foyer, a library lounge, a courtyard restaurant — all connected by warm light and slow detail."
      ],
      gallery: [
        "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=2000&q=85",
        "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=85"
      ],
      featured: true
    },

    {
      id:           "north-bay-loft",
      name:         "North Bay Loft",
      type:         "residential",
      location:     "Penang, Malaysia",
      year:         2022,
      area:         "180 m²",
      scope:        "Renovation, FF&E",
      photographer: "Adrian Wong",
      coverImage:   "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1800&q=85",
      shortDesc:    "A waterfront loft in George Town — stripped back to its bones and re-imagined as a quiet retreat.",
      longDesc: [
        "Originally a 1970s warehouse on the George Town waterfront, the loft was stripped to its concrete bones and re-composed as a single great room with a sleeping platform.",
        "The colour story is held by the patina of the existing concrete and the hand-thrown ceramics that punctuate every shelf."
      ],
      gallery: [
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85",
        "https://images.unsplash.com/photo-1503174971373-b1f69850bded?auto=format&fit=crop&w=1600&q=85"
      ],
      featured: true
    },

    {
      id:           "studio-verre",
      name:         "Studio Verre",
      type:         "commercial",
      location:     "KLCC",
      year:         2022,
      area:         "640 m²",
      scope:        "Workplace · Full Fit-out",
      photographer: "Adrian Wong",
      coverImage:   "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85",
      shortDesc:    "A creative agency office in KLCC — quiet, daylit, and arranged around a central library.",
      longDesc: [
        "A 640m² workplace for a creative agency on the 30th floor of a KLCC tower, planned around a generous central library.",
        "Open desks line the perimeter to claim the best of the daylight, while focus rooms, phone booths, and a kitchen lounge are nested in the deeper plan."
      ],
      gallery: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
      ],
      featured: false
    },

    {
      id:           "villa-serena",
      name:         "Villa Serena",
      type:         "residential",
      location:     "Damansara Heights",
      year:         2022,
      area:         "560 m²",
      scope:        "New Build, FF&E",
      photographer: "Adrian Wong",
      coverImage:   "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1800&q=85",
      shortDesc:    "A family residence designed around a central courtyard and a long, slow stair.",
      longDesc: [
        "A new family home in Damansara Heights, organised around a central courtyard that invites tropical light and rain into the heart of the plan.",
        "A travertine staircase rises slowly through the house — a quiet armature for the family's accumulating life."
      ],
      gallery: [
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=85"
      ],
      featured: false
    }

  ],


  /* --------------------------------------------------------------
     SERVICES — what we offer. Add / remove items freely.
     -------------------------------------------------------------- */
  services: [
    {
      number: "01",
      title:  "Interior Design",
      image:  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
      desc:   "A full-service offering — concept, FF&E, lighting, and bespoke detailing — for clients commissioning a complete interior.",
      items: [
        "Concept & design development",
        "Space planning & spatial composition",
        "Materials, finishes & lighting design",
        "Furniture, fixtures & equipment (FF&E)",
        "Art curation & final styling"
      ]
    },
    {
      number: "02",
      title:  "Renovation",
      image:  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      desc:   "Architectural renovation and refurbishment for heritage homes, contemporary apartments, and commercial spaces.",
      items: [
        "Heritage restoration & conservation",
        "Structural alterations & reconfiguration",
        "Permitting & technical drawings",
        "Project management & site supervision",
        "Trusted contractor & trades network"
      ]
    },
    {
      number: "03",
      title:  "Consultation",
      image:  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
      desc:   "Targeted, time-bounded packages for clients who want our perspective without commissioning a full project.",
      items: [
        "Half-day or full-day in-home consultation",
        "Colour, material & lighting reviews",
        "Furniture sourcing & layout advice",
        "Pre-purchase property review",
        "Written recommendations report"
      ]
    },
    {
      number: "04",
      title:  "Custom Solutions",
      image:  "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=80",
      desc:   "Bespoke joinery, custom furniture, and signature finishes designed exclusively for your space.",
      items: [
        "Bespoke joinery & cabinetry",
        "One-of-a-kind furniture pieces",
        "Custom lighting & metalwork",
        "Stone, plaster & specialty finishes",
        "Limited-edition collaborations"
      ]
    }
  ],


  /* --------------------------------------------------------------
     ABOUT PAGE — story, values, team, press
     -------------------------------------------------------------- */
  about: {
    pageHeading:  "A studio shaped by craft, restraint, and a love of considered detail.",
    pageLead:     "Keith Tan Studio was founded in Kuala Lumpur in 2008 by Keith Tan, with the conviction that interiors should age with grace, reward closer looking, and feel inevitable.",

    storyImage:   "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=80",
    storyHeading: "Seventeen years of refining a single idea.",
    storyText: [
      "What began as a small two-person studio in Kuala Lumpur has grown into a regional practice serving clients across Malaysia, Singapore, and Indonesia. Throughout, we've held to a single conviction: that a well-designed space should feel quietly alive — generous to those who use it, sympathetic to those who built it, and humble enough to carry the traces of a life well lived.",
      "We collaborate closely with architects, master craftspeople, artists, and a curated network of suppliers to deliver projects that are as considered in their joinery as they are in their narrative."
    ],
    signature:    "— Keith Tan, Founder & Creative Director"
  },

  values: [
    { number: "01", title: "Restraint",   text: "The discipline to subtract until only the essential remains. We design for clarity, calm, and lasting beauty — never for novelty." },
    { number: "02", title: "Craft",       text: "Every joint, finish, and seam is considered. We work with craftspeople who share our respect for time, tools, and materials." },
    { number: "03", title: "Permanence",  text: "We design rooms to last decades, not seasons. We choose materials that age well and details that resist fashion." }
  ],

  team: [
    { name: "Keith Tan",      role: "Founder & Creative Director", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80" },
    { name: "Wei Lin",        role: "Design Director",             photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80" },
    { name: "Amir Hassan",    role: "Senior Architect",            photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=900&q=80" },
    { name: "Priya Devi",     role: "Materials & FF&E",            photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80" },
    { name: "Marcus Lee",     role: "Project Lead",                photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80" },
    { name: "Sarah Chen",     role: "Studio Manager",              photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80" }
  ],

  press: ["AD Malaysia", "Tatler Homes", "Robb Report", "Dezeen", "Wallpaper*"],


  /* --------------------------------------------------------------
     PROCESS STEPS — shown on Services page
     -------------------------------------------------------------- */
  process: [
    { number: "01 — Discovery", title: "Listen",  text: "We begin with a conversation to understand your space, your way of life, and the feeling you want the rooms to hold." },
    { number: "02 — Concept",   title: "Compose", text: "A design narrative emerges — proportions, light, material palette — captured in mood and plan." },
    { number: "03 — Develop",   title: "Detail",  text: "Every joint, finish, and fixture is drawn, costed, and prototyped with our trusted craftspeople." },
    { number: "04 — Deliver",   title: "Deliver", text: "We oversee the build, place every object with care, and hand over a finished space ready for the life ahead." }
  ]

};
