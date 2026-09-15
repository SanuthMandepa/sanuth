"use client";

import { useCallback, useState } from "react";
import Preloader from "@/components/ui/Preloader";
import Hero from "@/components/sections/Hero";

export default function Home() {
  const [loading, setLoading] = useState(true);

  const handleComplete = useCallback(() => setLoading(false), []);

  return (
    <>
      {loading && <Preloader onComplete={handleComplete} />}
      <main>
        <Hero ready={!loading} />
      </main>
    </>
  );
}
