import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import SmoothScroll from "@/components/ui/SmoothScroll";

export const metadata: Metadata = {
  title: "Sanuth Mandepa | Creative Developer & Web Engineer",
  description:
    "Portfolio of Sanuth Mandepa – a Creative Developer specializing in Next.js, Three.js, GSAP, and high-fidelity interactive web experiences. Available for hire.",
  keywords: [
    "Creative Developer",
    "Frontend Engineer",
    "Next.js",
    "Three.js",
    "GSAP",
    "WebGL",
    "Portfolio",
    "Sanuth Mandepa",
  ],
  openGraph: {
    title: "Sanuth Mandepa | Creative Developer",
    description:
      "Award-winning web developer crafting immersive digital experiences with Next.js, Three.js, and GSAP.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SmoothScroll>
          <CustomCursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
