import Link from "next/link";
import { SidebarShell } from "./shell";
import { getPostIndexes } from "@/ts/post";

export async function Sidebar() {
  const posts = await getPostIndexes();

  return (
    <SidebarShell>
      <nav aria-label="Blog posts">
        <Link href="/blog" className="font-semibold">All posts</Link>
        <ul className="mt-4 space-y-2">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`}>{p.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </SidebarShell>
  );
}
