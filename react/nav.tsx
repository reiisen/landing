"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;

      // within the first screenful: always visible
      if (y <= window.innerHeight) {
        setHidden(false);
        lastY.current = y;
        return;
      }

      const dy = y - lastY.current;
      if (Math.abs(dy) < 8) return; // ignore tiny jitter

      setHidden(dy > 0); // down = hide, up = show
      lastY.current = y;
    };

    lastY.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="group sticky top-0 z-50 h-10">
      <nav
        className={`flex h-10 items-center gap-4 bg-white px-4 transition-transform duration-200 dark:bg-black ${
          hidden
            ? "-translate-y-full group-hover:translate-y-0 group-focus-within:translate-y-0"
            : ""
        }`}
      >
        <Link href="/">Home</Link>
        <Link href="/blog">Blog</Link>
      </nav>
    </div>
  );
}
