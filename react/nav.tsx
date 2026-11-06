"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const built = new Date(process.env.NEXT_PUBLIC_BUILD_TIME!)
  .toISOString()
  .slice(0, 16)
  .replace("T", " ");

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;

      if (y <= window.innerHeight) {
        setHidden(false);
        lastY.current = y;
        return;
      }

      const dy = y - lastY.current;
      if (Math.abs(dy) < 8) return;

      setHidden(dy > 0);
      lastY.current = y;
    };

    lastY.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="group sticky top-0 z-50 h-10">
      <nav
        className={`flex h-10 items-center gap-4 border-b border-line/50 bg-paper px-4 transition-transform duration-200 ${
          hidden
            ? "-translate-y-full group-hover:translate-y-0 group-focus-within:translate-y-0"
            : ""
        }`}
      >
        <Link href="/">Home</Link>
        <Link href="/blog">Blog</Link>

        <p className="ml-auto hidden truncate text-xs text-ink/60 md:block">
          {process.env.NEXT_PUBLIC_BUILT_WITH}
          <span className="mx-2">/</span>
          built {built} UTC
        </p>
      </nav>
    </div>
  );
}
