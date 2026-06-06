"use client";

import { useState, useCallback } from "react";
import Preloader from "@/components/ui/Preloader";
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";

export default function Home() {
  const [loading, setLoading] = useState(true);

  const handlePreloaderComplete = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <>
      {loading && <Preloader onComplete={handlePreloaderComplete} />}

      <main
        style={{
          visibility: loading ? "hidden" : "visible",
          transition: "visibility 0s",
        }}
      >
        <Navbar />
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Contact />
      </main>
    </>
  );
}
