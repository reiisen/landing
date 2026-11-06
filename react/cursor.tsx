"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // touch devices have no pointer to follow
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, opacity: 0 });

    const setDotX = gsap.quickSetter(dot.current, "x", "px"); // snaps to the pointer
    const setDotY = gsap.quickSetter(dot.current, "y", "px");
    const ringX = gsap.quickTo(ring.current, "x", { duration: calm ? 0 : 0.45, ease: "power3" }); // trails
    const ringY = gsap.quickTo(ring.current, "y", { duration: calm ? 0 : 0.45, ease: "power3" });

    let visible = false;
    const show = (v: boolean) => {
      if (visible === v) return;
      visible = v;
      gsap.to([dot.current, ring.current], { opacity: v ? 1 : 0, duration: 0.2, overwrite: "auto" });
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!visible) {
        // first move: appear under the pointer instead of gliding in from the corner
        gsap.set(ring.current, { x: e.clientX, y: e.clientY });
      }
      setDotX(e.clientX);
      setDotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      show(true);
    };

    const over = (e: PointerEvent) => {
      const hot = (e.target as Element | null)?.closest("a, button, [data-cursor]");
      gsap.to(ring.current, { scale: hot ? 1.7 : 1, duration: 0.25, ease: "power2.out", overwrite: "auto" });
      gsap.to(dot.current, { scale: hot ? 0 : 1, duration: 0.2, overwrite: "auto" });
    };
    const down = () => gsap.to(ring.current, { scale: 0.7, duration: 0.15 });
    const up = () => over({ target: document.elementFromPoint(0, 0) } as unknown as PointerEvent);
    const leave = () => show(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    root.addEventListener("pointerleave", leave);

    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      root.removeEventListener("pointerleave", leave);
    };
  });

  return (
    <>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] size-1.5 bg-white mix-blend-difference"
      />
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] size-9 border border-white mix-blend-difference"
      />
    </>
  );
}
