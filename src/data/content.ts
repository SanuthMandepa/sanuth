/**
 * Single source of truth for every piece of copy on the site.
 *
 * Transcribed from Sanuth_Mandepa_CV.pdf, then cut to roughly a third of its
 * original length: on screen the detail belongs in the CV, not the page.
 *
 * House style: no em dashes anywhere. Use a comma, a full stop, or a plain
 * hyphen in ranges.
 *
 * TODO(sanuth): fields marked `null` need real values. Images go in
 * /public/projects/ and are referenced from `cover`.
 */

export type ProjectStatus = "shipped" | "building" | "research" | "archived";

export interface Project {
  index: string;
  slug: string;
  title: string;
  /** One short line under the title. */
  subtitle: string;
  discipline: string;
  period: string;
  status: ProjectStatus;
  /** lucide-react icon name, resolved in the component. */
  icon: string;
  /** Two sentences at most. */
  summary: string;
  /** Two at most, one line each. */
  highlights: string[];
  metrics: { value: string; label: string }[];
  /** Trimmed to the five that actually signal something. */
  stack: string[];
  links: { live: string | null; github: string | null };
  cover: string | null;
  /** How the photo fills the card. Portrait mockups need "contain". */
  coverFit?: "cover" | "contain";
  /** object-position, to keep the interesting part clear of the details panel. */
  coverPosition?: string;
}

export const projects: Project[] = [
  {
    index: "01",
    slug: "rxray",
    title: "RxRay",
    subtitle: "Medical claim auditing",
    discipline: "AI Systems",
    period: "Jul 2026 - Aug 2026",
    status: "shipped",
    icon: "ScanSearch",
    summary:
      "A fraud and coherence engine for medical insurance claims. It reads the source documents, checks them against each other and against public drug data, then hands a reviewer the evidence rather than just a verdict.",
    highlights: [
      "22 checks across document forensics, cross-document consistency and clinical reasoning.",
      "Shipped solo: FastAPI backend, Next.js reviewer UI with inline evidence highlighting.",
    ],
    metrics: [
      { value: "22", label: "Checks" },
      { value: "7", label: "Graph nodes" },
      { value: "30/30", label: "Deterministic" },
    ],
    stack: ["Python", "LangGraph", "FastAPI", "Claude API", "Next.js"],
    // TODO(sanuth): the CV links these, but as embedded PDF hyperlinks I
    // cannot read. Paste the real URLs.
    links: { live: null, github: null },
    cover: "/projects/rxray.png",
    coverPosition: "72% 6%",
  },
  {
    index: "02",
    slug: "chagasight",
    title: "ChagaSight",
    subtitle: "ECG disease screening",
    discipline: "Machine Learning",
    period: "Aug 2025 - Jun 2026",
    status: "research",
    icon: "Activity",
    summary:
      "Screens for Chagas disease straight from a standard 12-lead ECG. A dual-pathway Vision Transformer ensemble, pretrained self-supervised on roughly 366,000 unlabelled recordings because labelled cardiac data is scarce.",
    highlights: [
      "Beat both single-pathway baselines (1D 0.8567, 2D 0.7079) with the ensemble.",
      "Flask inference API in Docker on HuggingFace Spaces, React frontend on Vercel.",
    ],
    metrics: [
      { value: "0.8707", label: "AUROC" },
      { value: "366K", label: "ECGs pretrained" },
      { value: "5", label: "Fold CV" },
    ],
    stack: ["PyTorch", "Python", "Flask", "Docker", "React"],
    links: { live: null, github: null },
    cover: "/projects/chagasight.png",
    coverPosition: "88% 8%",
  },
  {
    index: "03",
    slug: "emberloft",
    title: "Emberloft",
    subtitle: "Design and development studio",
    discipline: "Studio",
    period: "May 2026 - Present",
    status: "building",
    icon: "Flame",
    summary:
      "A four-person studio taking on web, mobile and UI/UX work. I designed and built the studio site end to end, including the scroll sequences and 3D scenes.",
    highlights: [
      "Co-founded, currently pre-launch.",
      "Built the site end to end with GSAP and Three.js.",
    ],
    metrics: [
      { value: "4", label: "Person team" },
      { value: "3", label: "Disciplines" },
    ],
    stack: ["Next.js", "TypeScript", "Tailwind", "GSAP", "Three.js"],
    links: { live: null, github: null },
    cover: "/projects/emberloft.png",
    coverPosition: "72% 24%",
  },
  {
    index: "04",
    slug: "pearmo",
    title: "Pearmo",
    subtitle: "Curated-matching mobile app",
    discipline: "Mobile",
    period: "Jun 2026 - Present",
    status: "building",
    icon: "Smartphone",
    summary:
      "An Android app on Flutter with a Supabase backend. The first prototype taught us enough that we rebuilt the core features and backend logic rather than patching them.",
    highlights: [
      "Co-founded, currently pre-beta.",
      "Rebuilt core features and backend logic after the prototype.",
    ],
    metrics: [{ value: "Pre-beta", label: "Stage" }],
    stack: ["Flutter", "Dart", "Supabase", "Riverpod"],
    links: { live: null, github: null },
    cover: "/projects/pearmo.webp",
    coverFit: "contain",
    coverPosition: "78% 50%",
  },
  {
    index: "05",
    slug: "internova",
    title: "Internova",
    subtitle: "Interview practice platform",
    discipline: "Full-stack",
    period: "Sep 2023 - Jun 2024",
    status: "archived",
    icon: "Mic",
    summary:
      "Interview practice that scores what you say and how you sound. A speech emotion service rated delivery, while a retrieval layer gave feedback on the answers themselves.",
    highlights: [
      "MFCC-based speech emotion service, containerised on Google Cloud Run.",
      "Retrieval-augmented feedback on interview answers.",
    ],
    metrics: [],
    stack: ["Python", "Flask", "LangChain", "Docker", "MongoDB"],
    links: { live: null, github: null },
    // TODO(sanuth): drop internova.jpg into /public/projects to replace
    // the generated waveform diagram.
    cover: null,
  },
];

export interface TimelineEntry {
  index: string;
  period: string;
  title: string;
  org: string;
  kind: "work" | "education" | "honour";
  icon: string;
  /** One line. Two at the very most. */
  detail: string;
}

export const timeline: TimelineEntry[] = [
  {
    index: "01",
    period: "Jul 2026 - Sep 2026",
    title: "Ascentic AI Launch Pad, Top 20",
    org: "Ascentic",
    kind: "honour",
    icon: "Trophy",
    detail:
      "Selected into a cohort of 50 builders with 48 industry mentors, and advanced to the Top 20. Built RxRay during the program.",
  },
  {
    index: "02",
    period: "Aug 2024 - Aug 2025",
    title: "Intern Web Designer",
    org: "Weblook International, Colombo",
    kind: "work",
    icon: "Briefcase",
    detail:
      "A full placement year across design, build and QA. Shipped responsive production sites, wireframed in Figma, and built scroll animations with GSAP.",
  },
  {
    index: "03",
    period: "Sep 2022 - Sep 2026",
    title: "BEng (Hons) Software Engineering",
    org: "University of Westminster, via IIT Colombo",
    kind: "education",
    icon: "GraduationCap",
    detail: "Upper Second Class Honours (2:1), with an industrial placement year.",
  },
  {
    index: "04",
    period: "2012 - 2021",
    title: "G.C.E. Advanced Level",
    org: "Ananda College, Colombo",
    kind: "education",
    icon: "BookOpen",
    detail: "Biological Science stream.",
  },
];

export interface Certification {
  name: string;
  issuer: string;
  note: string | null;
  /** TODO(sanuth): the CV links each of these. Paste the URLs. */
  url: string | null;
}

export const certifications: Certification[] = [
  { name: "Introduction to Cloud 101", issuer: "AWS Educate", note: null, url: null },
  { name: "Version Control", issuer: "Meta", note: null, url: null },
  { name: "API Fundamentals Student Expert", issuer: "Postman", note: null, url: null },
  { name: "Introduction to Generative AI", issuer: "Google", note: null, url: null },
  { name: "Foundations of Project Management", issuer: "Google", note: null, url: null },
  {
    name: "Python for Everybody",
    issuer: "University of Michigan",
    note: "3 of 5 courses",
    url: null,
  },
  { name: "What Is Generative AI", issuer: "LinkedIn Learning", note: null, url: null },
  { name: "React.js Essential Training", issuer: "LinkedIn Learning", note: null, url: null },
  { name: "PHP Essential Training", issuer: "LinkedIn Learning", note: null, url: null },
  {
    name: "UX Design Professional Certificate",
    issuer: "Google",
    note: "2 of 8 courses",
    url: null,
  },
  {
    name: "Fundamentals of Digital Marketing",
    issuer: "Google Digital Garage",
    note: null,
    url: null,
  },
];

export const skillGroups = [
  {
    label: "Languages",
    icon: "Code2",
    items: ["Python", "TypeScript", "JavaScript", "Dart", "Java", "PHP", "SQL"],
  },
  {
    label: "Frontend",
    icon: "Palette",
    items: ["React", "Next.js", "Tailwind", "Flutter", "GSAP", "Three.js", "Figma"],
  },
  {
    label: "Backend and Data",
    icon: "Database",
    items: ["FastAPI", "Flask", "Node.js", "PostgreSQL", "MongoDB", "Supabase", "Firebase"],
  },
  {
    label: "AI and ML",
    icon: "BrainCircuit",
    items: [
      "PyTorch",
      "Vision Transformers",
      "Self-supervised learning",
      "LangGraph",
      "LangChain",
      "Claude API",
    ],
  },
  {
    label: "DevOps and Cloud",
    icon: "Cloud",
    items: ["Docker", "Git", "GitHub Actions", "AWS", "GCP", "Azure", "Vercel", "pytest"],
  },
];

export const profile = {
  name: "Sanuth Mandepa",
  firstName: "Sanuth",
  lastName: "Mandepa",
  title: "Graduate Software Engineer",
  location: "Kalutara, Sri Lanka",
  email: "dssanuthmandepa@gmail.com",
  phoneDisplay: "+94 76 087 4718",
  phoneHref: "+94760874718",
  github: "https://github.com/SanuthMandepa",
  linkedin: "https://linkedin.com/in/sanuthmandepa",
  site: "https://sanuth.vercel.app",
  cv: "/cv.pdf",
  /* Cutout PNG with a real alpha channel. The shaders depend on that alpha. */
  portrait: "/portrait.png",
  available: true,
  /** Two short paragraphs. The CV carries the rest. */
  bio: [
    "Software Engineering graduate with a full placement year behind me and a habit of shipping things end to end.",
    "My research applied Vision Transformers to ECG disease screening. Since then I built a LangGraph claim auditing system solo, and I co-build a Flutter app and a small studio. I work across the stack, not in one lane.",
  ],
  /** Headline numbers for the hero. */
  stats: [
    { value: "5", label: "Projects shipped" },
    { value: "12", label: "Months in industry" },
    { value: "Top 20", label: "Ascentic AI 2026" },
  ],
};

export const sections = [
  { id: "index", label: "Home", n: "00" },
  { id: "work", label: "Work", n: "01" },
  { id: "about", label: "About", n: "02" },
  { id: "record", label: "Record", n: "03" },
  { id: "contact", label: "Contact", n: "04" },
];
