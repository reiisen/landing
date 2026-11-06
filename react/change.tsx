"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Change({ className }: { className?: string }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [covering, setCovering] = useState(false);

  const go = () => {
    dialog.current?.close();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push("/about");
      return;
    }
    setCovering(true); // the cover slides up, then onTransitionEnd navigates
  };

  return (
    <>
      <Link
        href="/about"
        className={className}
        onClick={(e) => {
          e.preventDefault();
          dialog.current?.showModal();
        }}
      >
        about me
      </Link>

      <dialog
        ref={dialog}
        className="m-auto border border-line bg-paper p-6 text-ink backdrop:bg-black/40"
      >
        <p className="text-sm">the about page is animated and preloads its assets first. continue?</p>
        <div className="mt-4 flex gap-3 text-sm">
          <button onClick={go} className="border border-line px-3 py-1 hover:bg-ink hover:text-paper">
            yes
          </button>
          <button
            onClick={() => dialog.current?.close()}
            className="border border-line px-3 py-1 hover:bg-ink hover:text-paper"
          >
            no
          </button>
        </div>
      </dialog>

      {/* transition cover */}
      <div
        aria-hidden
        onTransitionEnd={() => {
          if (covering) router.push("/about");
        }}
        className={`fixed inset-0 z-[90] bg-ink transition-transform duration-700 ease-in-out ${
          covering ? "translate-y-0" : "pointer-events-none translate-y-full"
        }`}
      />
    </>
  );
}
