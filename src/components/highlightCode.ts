import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import graphql from "highlight.js/lib/languages/graphql";
import ini from "highlight.js/lib/languages/ini";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import php from "highlight.js/lib/languages/php";
import plaintext from "highlight.js/lib/languages/plaintext";
import rust from "highlight.js/lib/languages/rust";
import scss from "highlight.js/lib/languages/scss";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";
import { createLowlight } from "lowlight";

export const lowlight = createLowlight({
  bash,
  css,
  graphql,
  ini,
  javascript,
  json,
  markdown,
  php,
  plaintext,
  rust,
  scss,
  sql,
  typescript,
  xml,
  yaml,
});

type HastRoot = ReturnType<typeof lowlight.highlight>;
type HastElement = Extract<HastRoot["children"][number], { type: "element" }>;

const LANGUAGE_CLASS_PREFIX = "language-";

function languageOf(code: HastElement): string | undefined {
  const classNames = code.properties.className;
  if (!Array.isArray(classNames)) {
    return undefined;
  }
  const languageClass = classNames.find(
    (name) => typeof name === "string" && name.startsWith(LANGUAGE_CLASS_PREFIX),
  );
  return typeof languageClass === "string"
    ? languageClass.slice(LANGUAGE_CLASS_PREFIX.length)
    : undefined;
}

function highlightCodeBlocksIn(parent: HastRoot | HastElement): void {
  for (const child of parent.children) {
    if (child.type !== "element") {
      continue;
    }
    const isBlockCode =
      parent.type === "element" && parent.tagName === "pre" && child.tagName === "code";
    const language = isBlockCode ? languageOf(child) : undefined;
    if (language && lowlight.registered(language)) {
      const source = child.children
        .map((node) => (node.type === "text" ? node.value : ""))
        .join("");
      child.children = lowlight.highlight(language, source).children as HastElement["children"];
    } else {
      highlightCodeBlocksIn(child);
    }
  }
}

export function rehypeHighlightCode() {
  return highlightCodeBlocksIn;
}
