import { getPostIndexes } from "@/ts/post";
import Link from "next/link";

export default async function Page() {
  const posts = await getPostIndexes();

  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>Blog</h1>
      <ul className="list-none p-0">
        {posts.map((post) => {
          const date = new Date(post.date);
          return (
            <li key={post.slug} className="my-8 p-0">
              <h2 className="mb-1 mt-0 text-xl">
                <Link href={`/blog/${post.slug}`} className="no-underline hover:underline">
                  {post.title}
                </Link>
              </h2>
              <time dateTime={date.toISOString()} className="text-sm opacity-60">
                {date.toLocaleDateString("en-US", { dateStyle: "medium" })}
              </time>
              <p className="mt-2">{post.preview}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
