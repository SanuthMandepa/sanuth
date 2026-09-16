import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { profile } from "@/data/content";

/* One family across the whole site. Archivo carries a width axis as well as
   weight, which covers everything from the display headline to small labels
   without pulling in a second download. */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title: {
    default: `${profile.name}, ${profile.title}`,
    template: `%s | ${profile.name}`,
  },
  description:
    "Software Engineering graduate working across the stack. Vision Transformers for ECG screening, a LangGraph claim auditing system, and production web and mobile work.",
  keywords: [
    "Software Engineer",
    "Graduate Software Engineer",
    "Full-Stack Developer",
    "Machine Learning",
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
    title: `${profile.name}, ${profile.title}`,
    description:
      "Vision Transformers for ECG screening, a LangGraph claim auditing system, and production web and mobile work.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name}, ${profile.title}`,
    description:
      "Vision Transformers for ECG screening, a LangGraph claim auditing system, and production web and mobile work.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#fff6ee",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={archivo.variable} suppressHydrationWarning>
      <head>
        {/* Marks JS as live before paint, so [data-reveal] only hides itself
            when something is actually able to reveal it again. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js-ready')`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
