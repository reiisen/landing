import { getToc } from "@/ts/post";
import { Shell } from "./shell";

export function TocBox({ items }: { items: ReturnType<typeof getToc> }) {
  if (items.length === 0) return null;

  return (
    <Shell>
      <nav aria-label="Table of contents">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id} style={{ paddingLeft: `${(item.depth - 1) * 0.75}rem` }}>
              <a href={`#${item.id}`} className="hover:underline">
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </Shell>
  );
}
