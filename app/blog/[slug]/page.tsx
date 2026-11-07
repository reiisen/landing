import { TocBox } from "@/react/toc";
import { getMdFiles, getToc, readMdFile } from "@/ts/post";
import { Suspense } from "react";
import { MarkdownAsync } from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import rehypeStarryNight from "rehype-starry-night"
import { getMdComponents } from "@/react/presets";

export async function generateStaticParams() {
  const files = await getMdFiles();
  return files.map((file) => ({ slug: file }));
}

async function Post({ params }: { params: Promise<{ slug: string }> }) {
  "use cache";

  const { slug } = await params;
  const { content } = await readMdFile(slug + ".md");
  const items = getToc(content, 3);

  return (
    <>
      <TocBox items={items} />
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <MarkdownAsync
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug, rehypeStarryNight]}
          components={getMdComponents(slug)}
        >
          {content}
        </MarkdownAsync>
      </article>
    </>
  );
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={null}>
      <Post params={params} />
    </Suspense>
  );
}
