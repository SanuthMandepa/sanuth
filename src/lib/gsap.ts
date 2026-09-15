"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { Observer } from "gsap/Observer";
import { CustomEase } from "gsap/CustomEase";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// GSAP 3.13+ ships every former "Club" plugin in the public package, so all of
// these are available without a licence key.
if (typeof window !== "undefined") {
  gsap.registerPlugin(
    ScrollTrigger,
    SplitText,
    Flip,
    Observer,
    CustomEase,
    ScrollToPlugin
  );

  // A single house easing curve. Slow start, decisive middle, long settle —
  // this is what makes the whole site feel like one piece rather than a pile
  // of separate animations.
  CustomEase.create("swiss", "0.16, 1, 0.3, 1");
  CustomEase.create("swissIn", "0.7, 0, 0.84, 0");
  CustomEase.create("swissInOut", "0.87, 0, 0.13, 1");

  gsap.defaults({ ease: "swiss", duration: 1 });
}

/** True when the visitor has asked the OS to reduce motion. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, SplitText, Flip, Observer, CustomEase };
