/**
 * Single source of truth for every piece of copy on the site.
 *
 * Everything here is transcribed from Sanuth_Mandepa_CV.pdf so the site and the
 * CV can never drift apart again. When the CV changes, change this file — the
 * sections read from it and will follow.
 *
 * TODO(sanuth): fields marked `null` need real values. See the notes in each
 * block. Images go in /public/projects/ and are referenced from `cover`.
 */

export type ProjectStatus = "shipped" | "building" | "research" | "archived";

export interface Project {
  /** Two-digit index shown as the editorial section number. */
  index: string;
  slug: string;
  title: string;
  subtitle: string;
  /** Short kicker shown above the title. */
  discipline: string;
  period: string;
  status: ProjectStatus;
  role: string | null;
  context: string | null;
  stack: string[];
  /** 2–4 sentences. The narrative version. */
  summary: string;
  /** Bullet-level detail, straight from the CV. */
  highlights: string[];
  /** Headline numbers rendered as big editorial stats. */
  metrics: { value: string; label: string }[];
  links: { live: string | null; github: string | null };
  /** Path under /public. Falls back to a typographic placeholder when null. */
  cover: string | null;
  /** Extra imagery for the detail view. */
  gallery: string[];
}

export const projects: Project[] = [
  {
    index: "01",
    slug: "rxray",
    title: "RxRay",
    subtitle: "Medical Claim Auditing System",
    discipline: "AI Systems / Full-Stack",
    period: "Jul 2026 — Aug 2026",
    status: "shipped",
    role: "Sole engineer",
    context: "Built during Ascentic AI Launch Pad 2026",
    stack: [
      "Python",
      "LangGraph",
      "FastAPI",
      "Google Document AI",
      "Anthropic Claude API",
      "Next.js",
    ],
    summary:
      "A fraud and coherence engine for medical insurance claims. It reads the source documents, cross-checks them against each other and against public drug data, and reasons about whether the clinical story holds together — then hands a reviewer the evidence rather than just a verdict.",
    highlights: [
      "Built a 22-check fraud and coherence engine spanning document forensics, cross-document consistency and clinical reasoning grounded in RxNorm and openFDA data.",
      "Orchestrated the checks as a 7-node LangGraph state machine with a human-in-the-loop gate for low-confidence decisions, achieving 30 of 30 identical outcomes across repeated runs.",
      "Created an offline fixture and replay layer enabling the full test suite to run with network access disabled.",
      "Shipped the full stack solo: a FastAPI and Server-Sent Events backend and a Next.js reviewer UI with inline evidence highlighting on source documents.",
    ],
    metrics: [
      { value: "22", label: "Fraud & coherence checks" },
      { value: "7", label: "LangGraph nodes" },
      { value: "30/30", label: "Deterministic runs" },
    ],
    // TODO(sanuth): paste the real URLs — they are hyperlinks in the CV PDF
    // that I could not read out of the file.
    links: { live: null, github: null },
    // TODO(sanuth): add /public/projects/rxray-reviewer.png — the reviewer UI
    // with inline evidence highlighting. This is the strongest single image
    // you have; it leads the whole work section.
    cover: null,
    gallery: [],
  },
  {
    index: "02",
    slug: "chagasight",
    title: "ChagaSight",
    subtitle: "ECG Disease Screening with Vision Transformers",
    discipline: "Deep Learning / Medical AI",
    period: "Aug 2025 — Jun 2026",
    status: "research",
    role: "Final-year research project",
    context: "BEng dissertation, University of Westminster / IIT",
    stack: [
      "Python",
      "PyTorch",
      "NumPy",
      "SciPy",
      "Flask",
      "React",
      "Docker",
      "WFDB",
      "HuggingFace Spaces",
      "Vercel",
    ],
    summary:
      "Chagas disease is diagnosed late because screening at scale is expensive. This is a dual-pathway Vision Transformer ensemble that screens for it directly from a standard 12-lead ECG — pretrained self-supervised on roughly 366,000 unlabelled recordings, because labelled cardiac data is scarce.",
    highlights: [
      "Built a dual-pathway ViT ensemble combining 1D temporal and 2D spatial Vision Transformer pathways with REPA cross-modal alignment, for Chagas disease screening from 12-lead ECG recordings.",
      "Built the preprocessing pipeline in NumPy and SciPy, then ran self-supervised pretraining (MAE and ST-MEM) on roughly 366,000 unlabelled ECG recordings from PTB-XL, CODE-15% and SaMi-Trop, with 5-fold stratified cross-validation.",
      "Achieved AUROC 0.8707 with the dual-pathway ensemble, ahead of both single-pathway baselines (1D: 0.8567, 2D: 0.7079).",
      "Containerised a Flask inference API with Docker and deployed it to HuggingFace Spaces, with a React frontend on Vercel for ECG upload and real-time inference.",
    ],
    metrics: [
      { value: "0.8707", label: "AUROC, dual-pathway ensemble" },
      { value: "366K", label: "Unlabelled ECGs pretrained on" },
      { value: "5-fold", label: "Stratified cross-validation" },
    ],
    // TODO(sanuth): paste the real Live Demo + GitHub URLs.
    links: { live: null, github: null },
    // TODO(sanuth): add /public/projects/chagasight-ui.png
    cover: null,
    gallery: [],
  },
  {
    index: "03",
    slug: "emberloft",
    title: "Emberloft Studio",
    subtitle: "Design and Development Studio",
    discipline: "Studio / Web",
    period: "May 2026 — Present",
    status: "building",
    role: "Co-founder",
    context: "Four-person studio, pre-launch",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "GSAP", "Three.js"],
    summary:
      "A four-person studio taking on web, mobile and UI/UX work. I designed and built the studio site end to end — the GSAP scroll sequences and Three.js scenes are mine.",
    highlights: [
      "Co-founded a four-person studio for web, mobile and UI/UX work (pre-launch).",
      "Designed and built the studio site end to end, including GSAP scroll sequences and Three.js scenes.",
    ],
    metrics: [
      { value: "4", label: "Person team" },
      { value: "3", label: "Disciplines — web, mobile, UI/UX" },
    ],
    // TODO(sanuth): paste the real Live Site URL.
    links: { live: null, github: null },
    // TODO(sanuth): add /public/projects/emberloft-site.png + logo
    cover: null,
    gallery: [],
  },
  {
    index: "04",
    slug: "pearmo",
    title: "Pearmo",
    subtitle: "Curated-Matching Mobile App",
    discipline: "Mobile / Product",
    period: "Jun 2026 — Present",
    status: "building",
    role: "Co-founder",
    context: "Android, pre-beta",
    stack: ["Flutter", "Supabase", "Riverpod"],
    summary:
      "An Android app built on Flutter with a Supabase backend. The first prototype taught us enough that we rebuilt the core features and backend logic from scratch rather than patching it.",
    highlights: [
      "Co-building an Android app on Flutter with a Supabase backend (pre-beta).",
      "Rebuilt core features and backend logic after the initial prototype.",
    ],
    metrics: [{ value: "Pre-beta", label: "Current stage" }],
    // TODO(sanuth): paste the real Live Site URL.
    links: { live: null, github: null },
    // TODO(sanuth): add 2–3 portrait phone screenshots to
    // /public/projects/pearmo-1.png etc.
    cover: null,
    gallery: [],
  },
  {
    index: "05",
    slug: "internova",
    title: "Internova",
    subtitle: "Coding and Mock Interview Practice Platform",
    discipline: "Full-Stack / AI",
    period: "Sep 2023 — Jun 2024",
    status: "archived",
    role: "Team project",
    context: "Software Development Group Project",
    stack: [
      "Python",
      "Flask",
      "LangChain",
      "OpenAI API",
      "Docker",
      "Google Cloud Run",
      "React",
      "MongoDB",
    ],
    summary:
      "A practice platform for coding and mock interviews. Beyond the answers themselves, it listened to how candidates sounded — a speech emotion analysis service scored delivery, and a retrieval layer gave contextual feedback on content.",
    highlights: [
      "Built a speech emotion analysis service in Flask with an MFCC-based inference pipeline over REST, containerised with Docker and deployed on Google Cloud Run.",
      "Integrated a retrieval-augmented generation component to give users contextual feedback on their interview answers.",
    ],
    metrics: [],
    // TODO(sanuth): paste the real GitHub URL.
    links: { live: null, github: null },
    cover: null,
    gallery: [],
  },
];

export interface TimelineEntry {
  index: string;
  period: string;
  title: string;
  org: string;
  location: string | null;
  kind: "work" | "education" | "honour";
  detail: string[];
}

export const timeline: TimelineEntry[] = [
  {
    index: "01",
    period: "Jul 2026 — Sep 2026",
    title: "Ascentic AI Launch Pad 2026 — Top 20",
    org: "Ascentic",
    location: null,
    kind: "honour",
    detail: [
      "Selected into an AI accelerator cohort of 50 builders paired with 48 industry mentors, and advanced to the Top 20.",
      "Built RxRay during the program.",
    ],
  },
  {
    index: "02",
    period: "Aug 2024 — Aug 2025",
    title: "Intern Web Designer",
    org: "Weblook International (Pvt) Ltd",
    location: "Colombo, Sri Lanka",
    kind: "work",
    detail: [
      "Worked in a cross-functional web team across design, build and QA, including scroll and interaction animations with GSAP.",
      "Built and maintained responsive production websites in WordPress using Elementor, Divi and WooCommerce.",
      "Produced wireframes and UI flows in Figma, then implemented them as live pages.",
      "Ran manual QA on live sites, documented defects and handled post-deployment change requests without breaking design consistency.",
    ],
  },
  {
    index: "03",
    period: "Sep 2022 — Sep 2026",
    title: "BEng (Hons) Software Engineering with Industrial Placement",
    org: "University of Westminster, United Kingdom",
    location: "Delivered by the Informatics Institute of Technology, Colombo",
    kind: "education",
    detail: ["Upper Second Class Honours (2:1)."],
  },
  {
    index: "04",
    period: "2012 — 2021",
    title: "G.C.E. Advanced Level, Biological Science Stream",
    org: "Ananda College",
    location: "Colombo 10, Sri Lanka",
    kind: "education",
    detail: [],
  },
];

export interface Certification {
  name: string;
  issuer: string;
  /** Present when the CV notes a partial completion. */
  note: string | null;
  /** TODO(sanuth): the CV links each of these; paste the URLs here. */
  url: string | null;
}

/** All eleven, in CV order. */
export const certifications: Certification[] = [
  {
    name: "AWS Educate: Introduction to Cloud 101",
    issuer: "Amazon Web Services",
    note: null,
    url: null,
  },
  { name: "Version Control", issuer: "Meta", note: null, url: null },
  {
    name: "Postman API Fundamentals Student Expert",
    issuer: "Postman",
    note: null,
    url: null,
  },
  {
    name: "Introduction to Generative AI",
    issuer: "Google",
    note: null,
    url: null,
  },
  {
    name: "Foundations of Project Management",
    issuer: "Google",
    note: null,
    url: null,
  },
  {
    name: "Python for Everybody Specialization",
    issuer: "University of Michigan (Coursera)",
    note: "3 of 5 courses",
    url: null,
  },
  {
    name: "What Is Generative AI",
    issuer: "LinkedIn Learning",
    note: null,
    url: null,
  },
  {
    name: "React.js Essential Training",
    issuer: "LinkedIn Learning",
    note: null,
    url: null,
  },
  {
    name: "PHP Essential Training",
    issuer: "LinkedIn Learning",
    note: null,
    url: null,
  },
  {
    name: "Google UX Design Professional Certificate",
    issuer: "Google (Coursera)",
    note: "2 of 8 courses",
    url: null,
  },
  {
    name: "The Fundamentals of Digital Marketing",
    issuer: "Google Digital Garage",
    note: null,
    url: null,
  },
];

/** Grouped exactly as the CV groups them. */
export const skillGroups = [
  {
    label: "Languages",
    items: [
      "Python",
      "TypeScript",
      "JavaScript",
      "Dart",
      "Java",
      "PHP",
      "SQL",
      "HTML",
      "CSS",
    ],
  },
  {
    label: "Frontend & Design",
    items: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "Flutter",
      "GSAP",
      "Three.js",
      "Figma",
      "WordPress",
    ],
  },
  {
    label: "Backend & Data",
    items: [
      "FastAPI",
      "Flask",
      "Node.js",
      "REST APIs",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "SQLite",
      "Supabase",
      "Firebase",
    ],
  },
  {
    label: "AI & Machine Learning",
    items: [
      "PyTorch",
      "Vision Transformers",
      "Self-supervised learning",
      "OpenCV",
      "LangGraph",
      "LangChain",
      "Anthropic Claude API",
      "OpenAI API",
    ],
  },
  {
    label: "DevOps, Cloud & Testing",
    items: [
      "Docker",
      "Git",
      "GitHub Actions",
      "AWS",
      "Google Cloud Platform",
      "Azure",
      "Vercel",
      "pytest",
      "Playwright",
      "Postman",
    ],
  },
];

export const profile = {
  name: "Sanuth Mandepa",
  firstName: "Sanuth",
  lastName: "Mandepa",
  title: "Graduate Software Engineer",
  location: "Kalutara, Sri Lanka",
  email: "dssanuthmandepa@gmail.com",
  // Formatted to match the CV exactly.
  phoneDisplay: "+94 76 087 4718",
  phoneHref: "+94760874718",
  github: "https://github.com/SanuthMandepa",
  linkedin: "https://linkedin.com/in/sanuthmandepa",
  site: "https://sanuth.vercel.app",
  cv: "/cv.pdf",
  available: true,
  /** The CV profile paragraph, tightened slightly for screen reading. */
  bio: [
    "Software Engineering graduate with a completed industrial placement year and experience building and shipping software end to end.",
    "My final-year research project applied self-supervised Vision Transformers to disease screening from ECG signals. Since then I have built a LangGraph-orchestrated medical claim auditing system solo, and I currently co-build a Flutter mobile app and a small web development studio.",
    "I work across the stack rather than in one lane, and I am comfortable owning a feature end to end, including testing and deployment.",
  ],
};

export const sections = [
  { id: "index", label: "Index", n: "00" },
  { id: "work", label: "Work", n: "01" },
  { id: "about", label: "About", n: "02" },
  { id: "record", label: "Record", n: "03" },
  { id: "contact", label: "Contact", n: "04" },
];
