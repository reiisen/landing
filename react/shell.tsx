// components/sidebar-shell.tsx
"use client";

import { useState } from "react";

export function Shell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* small screens only: tap outside to close */}
      {open && (
        <div className="fixed inset-0 z-30 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* small screens only: toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="toc-panel"
        className="fixed bottom-4 left-4 z-50 border border-line bg-paper px-3 py-1 text-sm lg:hidden"
      >
        {open ? "Close" : "Contents"}
      </button>

      {/* one panel: popover above the button on small screens, always-on at lg+ */}
      <aside
        id="toc-panel"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setOpen(false);
        }}
        className={`fixed z-40 overflow-y-auto border border-line bg-paper p-4 text-sm
          bottom-14 left-4 max-h-[60vh] w-64
          lg:bottom-auto lg:left-6 lg:top-1/2 lg:max-h-[70vh] lg:w-56 lg:-translate-y-1/2 lg:block
          ${open ? "block" : "hidden"}`}
      >
        {children}
      </aside>
    </>
  );
}
