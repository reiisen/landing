import fs from "node:fs/promises"
import path from "node:path";
import matter from "gray-matter";
import { visit } from "unist-util-visit";
import { fromMarkdown } from "mdast-util-from-markdown";
import GithubSlugger from "github-slugger"
import { toString } from "mdast-util-to-string";

export type PostIndexEntry = {
  slug: string
  title: string
  date: Date
  preview: string
}

export type PostMetadata = { title: string
  date: string
}

export type MdData = {
  data: PostMetadata
  content: string
}

export type Toc = {
  depth: number
  text: string
  id: string
}

export function generatePreview(raw: string) {
  const preview = raw
    .split(/\r?\n/)
    .filter((line) => {
      const l = line.trim();
      
      return (
        !l.startsWith("#") &&
        !l.startsWith("import") &&
        !l.startsWith("export") &&
        !l.startsWith(">") &&
        !l.startsWith("```")
      )
    })

  return preview.join(" ").trim().slice(0, 100).concat("...")
}

export async function getMdFiles() {
  "use cache";

  const mdDir = path.join(process.cwd(), "content")  
  const files = (await fs.readdir(mdDir))
    .filter((file) => file.endsWith('.md'))

  return files
}

export async function readMdFile(file: string): Promise<MdData> {
  const mdDir = path.join(process.cwd(), "content")  
  const mdx = matter(await fs.readFile(path.join(mdDir, file), "utf-8")) 
  
  const {data, content} = mdx;
  return {data: data as PostMetadata, content: content}
}

export async function getPostIndexes(): Promise<PostIndexEntry[]> {
  "use cache";

  const files = await getMdFiles()
  
  const posts: PostIndexEntry[] = await Promise.all(
    // map files to into multiple promises
    files.map(
      async (file) => {
        const {data, content} = await readMdFile(file);
        
        return {
          slug: file.slice(0, -3),
          title: data.title,
          date: new Date(data.date),
          preview: generatePreview(content)
        }
      }
    )
  )

  return posts.sort((a, b) => { return b.date.getTime() - a.date.getTime() })
}

export function getToc(content: string, maxDepth: number) {
  const tocs: Toc[] = []
  visit(fromMarkdown(content), "heading", (node) => {
    if (node.depth <= maxDepth) {
      const slugger = new GithubSlugger();
      const text = toString(node);
      const id = slugger.slug(text);
      tocs.push({
        depth: node.depth,
        text: text,
        id: id
      }) 
    }
  } ) 

  return tocs;
}
