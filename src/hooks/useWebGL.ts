"use client";

import { useEffect, useState } from "react";

/**
 * Whether this browser can actually give us a WebGL context.
 *
 * `null` while unknown, so callers can render nothing rather than flashing a
 * fallback in the split second before the probe runs. Every canvas in the app
 * must gate on this: mounting a react-three-fiber Canvas without WebGL throws
 * "Error creating WebGL context" straight into the page.
 */
export function useWebGLSupport(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    let ok = false;
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ??
        canvas.getContext("webgl") ??
        canvas.getContext("experimental-webgl");
      ok = Boolean(gl);
      // Release the probe context immediately; browsers cap how many exist.
      const lose = (gl as WebGLRenderingContext | null)?.getExtension(
        "WEBGL_lose_context"
      );
      lose?.loseContext();
    } catch {
      ok = false;
    }
    // Probing needs the DOM, so the result can only be known after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(ok);
  }, []);

  return supported;
}
