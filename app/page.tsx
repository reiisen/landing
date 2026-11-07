import { Change } from "@/react/change";
import Link from "next/link";

export default function Page() {
  return (
    <div
      className={"w-xl flex flex-1 flex-col items-start justify-center gap-5 px-4"}
    >
      <div>
        <h1 className="text-xl font-normal">hi.</h1>
        <p className="mt-1 text-sm opacity-60">welcome to my personal space.</p>
      </div>

      <div className="flex gap-3 text-sm">
        <Link
          href="/blog"
          className="border border-line px-3 py-1"
        >
          blog
        </Link>
        <Change className="border border-line px-3 py-1" />
      </div>
    </div>
  );
}
