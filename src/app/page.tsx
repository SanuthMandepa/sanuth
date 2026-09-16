"use client";

import { useCallback, useState } from "react";
import Preloader from "@/components/ui/Preloader";
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import Work from "@/components/sections/Work";
import About from "@/components/sections/About";
import Record from "@/components/sections/Record";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  const [loading, setLoading] = useState(true);

  const handleComplete = useCallback(() => setLoading(false), []);

  return (
    <>
      {loading && <Preloader onComplete={handleComplete} />}
      <Navbar />
      <main>
        <Hero ready={!loading} />
        <Work />
        <About />
        <Record />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
