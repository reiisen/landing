import { getMdFiles, readMdFile } from "@/ts/post";
import { Suspense } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export async function generateStaticParams() {
  const files = await getMdFiles()
  return files.map(
    (file) => {
      return { slug: file }
    }
  )
}

async function Content({ params }: { params: Promise<{slug: string}>}) {
  const { slug } = await params;
  const content = (await readMdFile(slug + ".md")).content

  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{ blockquote: ({ children }) => <blockquote className="whitespace-pre-line">{children}</blockquote>}}
      >
        {content}
      </Markdown>
    </article>
  ) 
}

export default function Page({ params }: { params: Promise<{slug: string}>}) {
  return (
    <div>
      <Suspense fallback={null}>
        <Content params={params}/>
      </Suspense>
    </div>
  )
}
