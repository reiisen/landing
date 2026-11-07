import Image from "next/image";
import type { Components } from "react-markdown";

function resolveSrc(src: string, slug: string) {
  if (src.startsWith("/") || /^https?:\/\//.test(src)) return src;
  return `/blog/${slug}/${src.replace(/^\.\//, "")}`;
}

export function getMdComponents(slug: string): Components {
  return {
    blockquote: ({ children }) => (
      <blockquote className="whitespace-pre-line">{children}</blockquote>
    ),
    img: ({ src, alt }) =>
      typeof src === "string" ? (
        <Image
          src={resolveSrc(src, slug)}
          alt={alt ?? ""}
          width={0}
          height={0}
          sizes="(min-width: 36rem) 36rem, 100vw"
          style={{ width: "100%", height: "auto" }}
        />
      ) : null,
  };
}
