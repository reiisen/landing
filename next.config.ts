import type { NextConfig } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const version = (name: string) => {
  try {
    const file = join(process.cwd(), "node_modules", name, "package.json");
    return JSON.parse(readFileSync(file, "utf8")).version as string;
  } catch {
    return "";
  }
};

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
    NEXT_PUBLIC_BUILT_WITH: [
      `next ${version("next")}`,
      `react ${version("react")}`,
      `tailwind ${version("tailwindcss")}`,
      `gsap ${version("gsap")}`,
    ]
      .map((s) => s.trim())
      .join(" · "),
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
