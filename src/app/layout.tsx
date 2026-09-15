import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { profile } from "@/data/content";

/* Archivo carries both a weight and a width axis, which is what lets the
   display type compress without swapping to a second family. Self-hosted by
   next/font, so no request ever reaches Google from the visitor's browser. */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

/* Note the variable name: it must NOT collide with the `--font-mono` stack
   composed in globals.css, or that declaration becomes self-referential and
   resolves to nothing. */
const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s — ${profile.name}`,
  },
  description:
    "Software Engineering graduate working across the stack — Vision Transformers for ECG disease screening, a LangGraph medical claim auditing system, and production web and mobile work from Sri Lanka.",
  keywords: [
    "Software Engineer",
    "Graduate Software Engineer",
    "Full-Stack Developer",
    "Machine Learning",
    "Vision Transformers",
    "LangGraph",
    "Next.js",
    "Python",
    "Sanuth Mandepa",
  ],
  authors: [{ name: profile.name, url: profile.site }],
  creator: profile.name,
  openGraph: {
    type: "profile",
    locale: "en_GB",
    url: profile.site,
    siteName: profile.name,
    title: `${profile.name} — ${profile.title}`,
    description:
      "Vision Transformers for ECG disease screening, a LangGraph medical claim auditing system, and production web and mobile work.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.title}`,
    description:
      "Vision Transformers for ECG disease screening, a LangGraph medical claim auditing system, and production web and mobile work.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#111110" },
  ],
  colorScheme: "light dark",
};

/* Resolve the theme before first paint so there is no flash of the wrong
   ground colour. Runs ahead of hydration by design. */
const themeScript = `
(function(){
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
  document.documentElement.classList.add('js-ready');
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning>
        <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />
        <SmoothScroll>
          <CustomCursor />
          {children}
        </SmoothScroll>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
