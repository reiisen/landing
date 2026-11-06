// app/page.tsx
import { Change } from "@/react/change";
import Link from "next/link";

export default function Home() {
  return (
    <div
      className={"flex h-[calc(100dvh-3.5rem)] flex-col items-start justify-center gap-5 px-4"}
    >
      <div>
        <h1 className="text-xl font-normal">hi.</h1>
        <p className="mt-1 text-sm opacity-60">welcome to my personal space.</p>
      </div>

      <div className="flex gap-3 text-sm">
        <Link
          href="/blog"
          className="rounded-md px-3 py-1 ring-1 ring-black/20 hover:bg-black/5 dark:ring-white/20 dark:hover:bg-white/10"
        >
          blog
        </Link>
        <Change className="border border-line px-3 py-1 hover:bg-ink hover:text-paper" />
      </div>
    </div>
  );
}
