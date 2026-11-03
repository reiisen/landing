"use client";

import { useState } from "react";

export function SidebarShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* touch only: tap outside to close */}
      {open && (
        <div
          className="fixed inset-0 z-30 hidden [@media(hover:none)]:block"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="group fixed left-3 top-1/2 z-40 -translate-y-1/2">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="blog-sidebar"
          aria-label="Blog posts"
          className="grid size-10 place-items-center rounded-lg bg-white shadow-md ring-1 ring-black/10 dark:bg-neutral-900 dark:ring-white/10"
        >
          ≡
        </button>

        {/* pl-2 is a transparent bridge so the hover doesn't drop in the gap */}
        <div
          id="blog-sidebar"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) setOpen(false);
          }}
          className={`absolute left-full top-1/2 -translate-y-1/2 pl-2 transition-[opacity,visibility] duration-150 group-hover:visible group-hover:opacity-100 group-has-[:focus-visible]:visible group-has-[:focus-visible]:opacity-100 ${
            open ? "visible opacity-100" : "invisible opacity-0"
          }`}
        >
          <aside className="max-h-[70vh] w-56 overflow-y-auto rounded-lg bg-white p-4 shadow-lg ring-1 ring-black/10 dark:bg-neutral-900 dark:ring-white/10">
            {children}
          </aside>
        </div>
      </div>
    </>
  );
}
