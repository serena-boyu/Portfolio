// Portfolio data — projects, emojis, project case study content.
// Exposed on window for use across babel scripts.

// Asset resolver: uses the inlined blob URL (set by the standalone bundler on
// window.__resources) when present, otherwise falls back to the relative path.
window.ASSET = (id, path) => (window.__resources && window.__resources[id]) || path;

// ── Where to put your own photos ───────────────────────────────────────────
// Every image on the site is driven by a `src` path you set in code. Drop your
// files into the assets/ folder and point these at them, e.g. "assets/me.jpg".
//   • Portrait (About page):     window.PORTRAIT_SRC below
//   • Project thumbnails (Home): add `img:` to a PROJECTS entry
//   • Emoji hover photos:        add `img:` to an EMOJIS entry
//   • Project cover image:       `coverSrc` on a PROJECT_PAGE entry
//   • Case-study section images: `figures: [{ src, caption }]` on a section
//   • Galleries / journey / archive: `src` on each item in the data below
window.PORTRAIT_SRC = "assets/funPics/serena_ng_portrait_2.jpg"; // e.g. "assets/portrait.jpg"

const PROJECTS = [
  {
    id: "epic",
    title: "Epic Systems",
    blurb: "Improving the patient experience of software for emergency departments worldwide.",
    role: "Patient Experience Designer",
    year: "2025",
    duration: "Ongoing",
    team: "Designers, PMs, clinical SMEs",
    thumb: "stripe",
    color: "rgb(196, 30, 58)",
  },
  {
    id: "searchneu",
    title: "SearchNEU",
    blurb: "Redesigning mobile for a course search tool used by Northeastern students.",
    role: "Lead Designer",
    year: "2024",
    duration: "12 weeks",
    team: "Solo design, 4 engineers",
    thumb: "image", // uses real asset
    color: "rgb(232, 76, 76)",
    img: "assets/projectThumbnails/searchneu.png",
  },
  {
    id: "jfk",
    title: "JFK Airport T4",
    blurb: "An internal security dashboard for escort requests at Terminal 4.",
    role: "Product Designer, Reuters Studio",
    year: "2023",
    duration: "8 weeks",
    team: "2 designers, PM, 5 engineers",
    thumb: "stripes",
    color: "rgb(21, 60, 110)",
    img: "assets/projectThumbnails/jfkt4.webp",
  },
  {
    id: "snyk",
    title: "Snyk Cybersecurity",
    blurb: "Revealing code dependencies with SBOMs for transparent development.",
    role: "Product Design Intern",
    year: "2023",
    duration: "Summer internship",
    team: "Designer, PM, 6 engineers",
    thumb: "stripe",
    color: "rgb(78, 36, 142)",
    img: "assets/projectThumbnails/snyk.png",
  },
  {
    id: "ecolab",
    title: "Reuters x Ecolab",
    blurb: "Interactive data-driven sustainability insights, told through scrollytelling.",
    role: "Designer, Reuters Studio",
    year: "2023",
    duration: "10 weeks",
    team: "Designer, editor, dev, illustrator",
    thumb: "stripe",
    color: "rgb(34, 110, 90)",
  },
];

const EMOJIS = [
  {
    char: "🍵",
    title: "Matcha season, year-round",
    body: "I run on matcha lattes. Three a week, minimum. The ritual matters as much as the caffeine.",
  },
  {
    char: "🐉",
    title: "Chinese dragon dance!",
    body: "I learned and performed Chinese dragon dance with my college troupe. Synchronizing with 8+ people teaches you a lot about teamwork.",
    img: "assets/funPics/emojiHovers/dragondance.jpg",
  },
  {
    char: "📷",
    title: "Capturing the world",
    body: "I have a Canon EOS R50, which is a small but mighty camera. I also took grad pics for my college friends!",
  },
  {
    char: "🍽️",
    title: "Certified foodie",
    body: "Follow me on Beli @serenang to see my restaurant rankings! I especially love a good ramen.",
  },
  {
    char: "💻",
    title: "Always tinkering",
    body: "Latest adventure is using AI to vibe codde my designs fast. I've also dabbled in Arduino, laser cutting, and 3D printing.",
  },
  {
    char: "🧋",
    title: "Boba is a food group",
    body: "Earl grey milk tea with 50% sugar + less ice. My bar is high since my homemade milk tea is quite good :)",
  },
  {
    char: "🎧",
    title: "Music and concert goer",
    body: "I always have music playing as I work. My playlists are a mix of pop, k-pop, r&b, lo-fi, and movie soundtracks.",
  },
];

// Project case study sections (used on /projects/searchneu page)
const PROJECT_PAGE = {
  epic: {
    title: "Epic Systems",
    subtitle: "Improving the patient experience of software for emergency departments worldwide.",
    cover: "image",
    meta: [
      { label: "Role", value: "Patient Experience Designer" },
      { label: "Team", value: "Designers, PMs, clinical SMEs" },
      { label: "Timeline", value: "2025 · Ongoing" },
      { label: "Tools", value: "Figma, Dovetail, clinical research" },
    ],
    sections: [
      {
        id: "summary",
        eyebrow: "01",
        title: "Summary",
        body: [
          "Epic's software runs the emergency departments of hospitals around the world. I work on the patient experience team, focused on the moments patients and their families actually touch — check-in, status, and discharge.",
          "The work spans the screens patients see directly and the clinician-facing tools that shape how care is communicated, all under the constraints of a regulated, safety-critical environment.",
        ],
        callout: {
          stat: "ER",
          label: "the highest-stress, highest-stakes setting in a hospital — and the least forgiving of bad design.",
        },
      },
      {
        id: "background",
        eyebrow: "02",
        title: "Background",
        body: [
          "Emergency departments are chaotic by nature: unscheduled arrivals, fluctuating acuity, and patients who are frightened, in pain, or unable to advocate for themselves.",
          "Historically, ED software has been optimized for throughput and documentation — not for the person in the bed. The opportunity was to bring patient-experience thinking into a domain built around clinical efficiency.",
        ],
      },
      {
        id: "research",
        eyebrow: "03",
        title: "Research",
        body: [
          "I partner with clinical subject-matter experts, observe in live ED settings, and synthesize feedback from the health systems that use Epic to ground every decision in real workflows.",
          "A recurring theme: uncertainty is the worst part of an ER visit. Patients and families consistently rank \"not knowing what's happening or how long it will take\" above almost everything else.",
        ],
        callout: {
          stat: "#1",
          label: "patient frustration in the ED is uncertainty about wait time and next steps — not the wait itself.",
        },
      },
      {
        id: "wireframes",
        eyebrow: "04",
        title: "Wireframes & Iterations",
        body: [
          "Concepts have to be validated against clinical safety before anything else — a clearer screen that introduces ambiguity into a clinician's workflow is a non-starter.",
          "I iterate closely with clinical SMEs, testing how status and communication patterns hold up across the full range of ED scenarios, from a sprained ankle to a trauma activation.",
        ],
      },
      {
        id: "feedback",
        eyebrow: "05",
        title: "Feedback & Refinement",
        body: [
          "Because Epic is deployed across many health systems, refinement means designing for configurability — what works for a large urban trauma center has to also work for a small rural ED.",
          "Feedback loops run through clinical reviewers and health-system partners, and changes are pressure-tested for safety, accessibility, and the realities of a busy floor.",
        ],
      },
      {
        id: "final",
        eyebrow: "06",
        title: "Final Designs",
        body: [
          "The work focuses on making status and next steps legible to patients and families, while keeping clinicians' tools fast and unambiguous.",
          "Because this is ongoing, the deeper detail — flows, screens, and outcomes — is covered in the protected case study and in conversation.",
        ],
      },
      {
        id: "reflection",
        eyebrow: "07",
        title: "Reflection",
        body: [
          "Designing for emergency care has sharpened my respect for constraints: in this domain, clarity isn't a nicety, it's a safety feature.",
          "The most rewarding part is that small improvements in communication compound — when a patient understands what's happening, the entire department runs a little calmer.",
        ],
      },
    ],
  },

  searchneu: {
    title: "SearchNEU",
    subtitle: "Redesigning mobile for the course search tool used by 30,000+ Northeastern students.",
    cover: "image",
    // Cover image at the top of the page — swap this path to change it.
    coverSrc: window.ASSET("searchneu", "assets/searchneu.png"),
    meta: [
      { label: "Role", value: "Lead Product Designer" },
      { label: "Team", value: "1 designer, 4 engineers" },
      { label: "Timeline", value: "12 weeks · Spring 2024" },
      { label: "Tools", value: "Figma, FigJam, Maze" },
    ],
    sections: [
      {
        id: "summary",
        eyebrow: "01",
        title: "Summary",
        figures: [{ src: window.ASSET("searchneu", "assets/searchneu.png"), caption: "Redesigned mobile course details page." }],
        body: [
          "SearchNEU is the open-source course search tool used by every Northeastern student at the start of every semester. Its mobile experience hadn't been touched in four years.",
          "I redesigned the mobile flow end-to-end — search, filter, course detail, and section selection — and the new flow shipped to 32,000 students for the Fall 2024 registration window.",
        ],
        callout: {
          stat: "62%",
          label: "of traffic was on mobile, but the site was a desktop layout in disguise.",
        },
      },
      {
        id: "background",
        eyebrow: "02",
        title: "Background",
        body: [
          "SearchNEU was born in a dorm room in 2017 and grew, lovingly, by accretion. By 2024 the desktop UI had been polished but mobile was still a 1:1 squish of the desktop layout.",
          "Filters lived behind a tiny pill that nobody tapped. Section availability — the entire reason students use the tool — was buried under three taps. I started by sitting next to friends as they registered.",
        ],
      },
      {
        id: "research",
        eyebrow: "03",
        title: "Research",
        body: [
          "I shadowed nine students through registration day, ran a 200-person survey, and combed through every GitHub issue tagged \"mobile\" since 2020.",
          "Three patterns kept showing up: (1) students kept their phone open while comparing on a laptop, (2) the only filters anyone used were time-of-day and seats-available, and (3) people memorized CRNs and pasted them into the registrar separately.",
        ],
        callout: {
          stat: "9 / 9",
          label: "students opened the desktop site on mobile to verify CRNs mid-registration.",
        },
      },
      {
        id: "wireframes",
        eyebrow: "04",
        title: "Wireframes & Iterations",
        body: [
          "The first round leaned on a bottom sheet for filters — quick to reach, easy to dismiss. It tested well in moderated sessions but stumbled on the secondary filters (NUPath, course level) that needed more space.",
          "I split the difference: a sticky filter bar with the two top filters always visible, and a full-screen sheet for the long tail. Iteration four was the one I shipped.",
        ],
      },
      {
        id: "feedback",
        eyebrow: "05",
        title: "Feedback & Refinement",
        body: [
          "An unmoderated test on Maze with 41 students surfaced a new problem: the section list scrolled independently of the course header, and people lost their place.",
          "I pinned the course code and a one-line summary to the top of the section list. In the second round, time-on-task for \"find an open Honors section\" dropped 38%.",
        ],
      },
      {
        id: "final",
        eyebrow: "06",
        title: "Final Designs",
        figures: [{ src: window.ASSET("searchneu", "assets/searchneu.png"), caption: "Final shipped mobile flow." }],
        body: [
          "The final flow ships in three pieces: a streamlined search header, a sticky filter bar, and a course detail view that opens directly into section selection.",
          "All three are now built into the SearchNEU mobile bundle and have been live since August 2024.",
        ],
      },
      {
        id: "reflection",
        eyebrow: "07",
        title: "Reflection",
        body: [
          "The biggest lesson: mobile registration isn't a smaller version of the desktop task. It's a different task — people are usually comparing, verifying, or copying CRNs, not searching from scratch.",
          "If I did it again I'd start the research from the registrar side, not the search side. The handoff between SearchNEU and the registrar is where the real friction lives, and it's where I want to take this work next.",
        ],
      },
    ],
  },

  jfk: {
    title: "JFK Airport T4",
    subtitle: "An internal security dashboard for submitting and reviewing escort requests at Terminal 4.",
    cover: "image",
    meta: [
      { label: "Role", value: "Product Designer, Ronik" },
      { label: "Team", value: "2 designers, PM, 5 engineers" },
      { label: "Timeline", value: "8 weeks · 2023" },
      { label: "Tools", value: "Figma, Miro, Dovetail" },
    ],
    sections: [
      {
        id: "summary",
        eyebrow: "01",
        title: "Summary",
        body: [
          "Terminal 4 at JFK runs hundreds of escort requests a day — vendors, contractors, and visitors who need a badged employee to accompany them airside. The process lived in email threads and a shared spreadsheet.",
          "I designed an internal dashboard that lets staff submit, route, and approve escort requests in one place, with a clear audit trail for security compliance.",
        ],
        callout: {
          stat: "300+",
          label: "escort requests a day were being tracked by hand across email and spreadsheets.",
        },
      },
      {
        id: "background",
        eyebrow: "02",
        title: "Background",
        body: [
          "T4 is the busiest international terminal in the US, and its security operations are governed by strict TSA and Port Authority rules. Every airside escort has to be logged, approved, and traceable.",
          "The existing workflow was a patchwork: a request form emailed to a shared inbox, manually copied into a spreadsheet, and approved over the phone. Nothing was searchable and nothing was auditable.",
        ],
      },
      {
        id: "research",
        eyebrow: "03",
        title: "Research",
        body: [
          "I ran contextual interviews with security coordinators, dispatchers, and the badged staff who actually perform escorts, then mapped the full request lifecycle end to end.",
          "The breakpoints were all in the handoffs — a request would stall because nobody knew whose turn it was to act. Status was the single most-asked question and the hardest thing to find.",
        ],
        callout: {
          stat: "5 roles",
          label: "touched a single request before it was approved, with no shared view of status.",
        },
      },
      {
        id: "wireframes",
        eyebrow: "04",
        title: "Wireframes & Iterations",
        body: [
          "Early concepts treated this like a generic ticketing tool. It tested poorly — coordinators think in shifts and gates, not tickets.",
          "I reframed the dashboard around a live queue grouped by status, with the requester, escort, and gate visible at a glance. Approving or reassigning happens inline, without opening a detail view.",
        ],
      },
      {
        id: "feedback",
        eyebrow: "05",
        title: "Feedback & Refinement",
        body: [
          "Testing with dispatchers on shift surfaced an accessibility constraint I'd missed: the operations floor is loud and bright, and staff scan the board from several feet away.",
          "I pushed up type sizes, raised contrast on status chips, and added color-plus-icon coding so urgent requests read instantly from across the room.",
        ],
      },
      {
        id: "final",
        eyebrow: "06",
        title: "Final Designs",
        body: [
          "The shipped dashboard centers on a status-grouped queue, an inline request form, and a complete audit log for every action taken on a request.",
          "It replaced the email-and-spreadsheet workflow for T4 security operations and gave coordinators a single source of truth for the first time.",
        ],
      },
      {
        id: "reflection",
        eyebrow: "07",
        title: "Reflection",
        body: [
          "Designing for a high-stakes, regulated operations environment taught me to respect the constraints first — the physical room, the compliance rules, the existing habits — before touching the interface.",
          "The win wasn't a prettier form. It was making status legible to everyone at once, which is what actually moved requests through the pipeline faster.",
        ],
      },
    ],
  },

  snyk: {
    title: "Snyk Cybersecurity",
    subtitle: "Revealing code dependencies with Software Bills of Materials (SBOMs) for transparent development.",
    cover: "image",
    meta: [
      { label: "Role", value: "Product Design Intern" },
      { label: "Team", value: "Designer, PM, 6 engineers" },
      { label: "Timeline", value: "Summer 2023" },
      { label: "Tools", value: "Figma, Maze, Linear" },
    ],
    sections: [
      {
        id: "summary",
        eyebrow: "01",
        title: "Summary",
        body: [
          "Snyk helps developers find and fix vulnerabilities in their code and its dependencies. My internship focused on SBOMs — a complete inventory of every component in a piece of software.",
          "I designed the SBOM generation and viewing experience, helping developers understand not just their own code, but the full tree of open-source dependencies underneath it.",
        ],
        callout: {
          stat: "80%+",
          label: "of a modern codebase is open-source dependencies the developer didn't write.",
        },
      },
      {
        id: "background",
        eyebrow: "02",
        title: "Background",
        body: [
          "New regulations and enterprise security teams increasingly require an SBOM — a formal, exportable list of every dependency in a product. For most teams, producing one was a manual, painful chore.",
          "Snyk already had the dependency data. The opportunity was to turn that data into an SBOM developers could generate, read, and share without leaving their workflow.",
        ],
      },
      {
        id: "research",
        eyebrow: "03",
        title: "Research",
        body: [
          "I interviewed developers and security engineers about how they currently produce and consume SBOMs, and audited competing tools and the emerging SPDX / CycloneDX standards.",
          "Developers didn't want another report to read. They wanted to answer specific questions — \"do I ship this vulnerable package?\" — and move on.",
        ],
        callout: {
          stat: "2 formats",
          label: "(SPDX & CycloneDX) had to be supported without exposing their complexity to users.",
        },
      },
      {
        id: "wireframes",
        eyebrow: "04",
        title: "Wireframes & Iterations",
        body: [
          "My first direction was a dense, table-first SBOM browser. It was technically complete but overwhelming, and it buried the one thing people came for: risk.",
          "I iterated toward a layered view — a high-level summary with risk surfaced first, expandable into the full dependency tree only when a developer needed to dig in.",
        ],
      },
      {
        id: "feedback",
        eyebrow: "05",
        title: "Feedback & Refinement",
        body: [
          "Usability sessions showed that export was a bigger moment than I'd assumed — handing an SBOM to a security team is a high-trust action, and people wanted to know exactly what they were sharing.",
          "I added a clear export preview and format picker so developers could see and choose what left their hands before they sent it on.",
        ],
      },
      {
        id: "final",
        eyebrow: "06",
        title: "Final Designs",
        body: [
          "The final experience generates an SBOM in a click, leads with a risk-first summary, lets developers drill into the full dependency tree, and exports cleanly to the standard formats.",
          "It shipped as part of Snyk's developer experience work and informed how dependency transparency is presented across the product.",
        ],
      },
      {
        id: "reflection",
        eyebrow: "07",
        title: "Reflection",
        body: [
          "Designing a deeply technical, standards-bound feature taught me to hide complexity without removing it — give people the simple answer first and the full detail on demand.",
          "It also reset how I scope an internship project: I went in wanting to redesign everything, and the real impact came from making one workflow genuinely trustworthy.",
        ],
      },
    ],
  },

  ecolab: {
    title: "Reuters x Ecolab",
    subtitle: "Interactive, data-driven sustainability insights told through editorial scrollytelling.",
    cover: "image",
    meta: [
      { label: "Role", value: "Designer, Ronik" },
      { label: "Team", value: "Designer, editor, dev, illustrator" },
      { label: "Timeline", value: "10 weeks · 2023" },
      { label: "Tools", value: "Figma, After Effects, D3" },
    ],
    sections: [
      {
        id: "summary",
        eyebrow: "01",
        title: "Summary",
        body: [
          "A branded editorial piece for Reuters, sponsored by Ecolab, on water stewardship and corporate sustainability — built as an interactive, scroll-driven story.",
          "I designed the visual system and the scrollytelling experience, turning dense sustainability data into a sequence of clear, animated narrative moments.",
        ],
        callout: {
          stat: "1 story",
          label: "carrying multiple datasets — readable on a phone on the train or a desktop at a desk.",
        },
      },
      {
        id: "background",
        eyebrow: "02",
        title: "Background",
        body: [
          "Reuters branded-content pieces have to clear a high editorial bar — they sit alongside the newsroom's journalism, so they can't read like an ad.",
          "Ecolab's story was data-heavy: water usage, savings, and impact figures across industries. The challenge was making that data feel like a narrative rather than a report.",
        ],
      },
      {
        id: "research",
        eyebrow: "03",
        title: "Research",
        body: [
          "I studied award-winning scrollytelling from the NYT, Reuters Graphics, and The Pudding to understand the pacing of data-driven stories, and worked closely with the editor to find the spine of the narrative.",
          "The insight: each data point needed one job and one moment. Trying to show everything at once is what makes data journalism collapse into noise.",
        ],
        callout: {
          stat: "60%",
          label: "of readers were expected on mobile — every interaction had to work with a thumb.",
        },
      },
      {
        id: "wireframes",
        eyebrow: "04",
        title: "Wireframes & Iterations",
        body: [
          "I storyboarded the piece as a film first — scene by scene — before designing a single screen, mapping which figure would animate in at each scroll beat.",
          "Early builds had too many simultaneous animations competing for attention. I cut hard, giving each chart room to land before the next one began.",
        ],
      },
      {
        id: "feedback",
        eyebrow: "05",
        title: "Feedback & Refinement",
        body: [
          "Reuters' editorial team pushed on clarity and restraint — anything decorative that didn't serve the data had to go. Working with the developer, we tuned scroll triggers so animations felt motivated, not gratuitous.",
          "On mobile, I simplified the most complex charts into stacked, sequential reveals so nothing required a pinch or a squint.",
        ],
      },
      {
        id: "final",
        eyebrow: "06",
        title: "Final Designs",
        body: [
          "The published piece moves through a sequence of animated data scenes, each introducing one idea, building to Ecolab's overall water-impact story.",
          "It ran as branded content on Reuters and met the newsroom's editorial standards for clarity and credibility.",
        ],
      },
      {
        id: "reflection",
        eyebrow: "07",
        title: "Reflection",
        body: [
          "Scrollytelling is editing as much as design — the discipline was deciding what not to show at each step so the reader never felt lost.",
          "Pairing tightly with an editor and a developer from day one is what made the data feel like a story instead of a dashboard. I'd start every data piece this way now.",
        ],
      },
    ],
  },
};

window.PROJECTS = PROJECTS;
window.EMOJIS = EMOJIS;
window.PROJECT_PAGE = PROJECT_PAGE;
