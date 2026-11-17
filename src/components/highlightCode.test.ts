import { globSync, readFileSync } from "node:fs";
import { common, createLowlight } from "lowlight";
import { describe, expect, it } from "vitest";
import { lowlight, rehypeHighlightCode } from "./highlightCode";

function fenceLanguagesInContent(): Set<string> {
  const languages = new Set<string>();
  for (const file of globSync("content/**/*.md")) {
    for (const match of readFileSync(file, "utf8").matchAll(/^```([\w+-]+)/gm)) {
      languages.add(match[1] as string);
    }
  }
  return languages;
}

describe("trimmed code highlighter", () => {
  it("still highlights every content language the full common set highlighted", () => {
    const fullCommon = createLowlight(common);
    const lost = [...fenceLanguagesInContent()].filter(
      (language) => fullCommon.registered(language) && !lowlight.registered(language),
    );
    expect(lost).toEqual([]);
  });

  it("replaces the text of a fenced code block with highlighted spans", () => {
    const tree = {
      type: "root" as const,
      children: [
        {
          type: "element" as const,
          tagName: "pre",
          properties: {},
          children: [
            {
              type: "element" as const,
              tagName: "code",
              properties: { className: ["language-ts"] },
              children: [{ type: "text" as const, value: "const answer = 42;" }],
            },
          ],
        },
      ],
    };
    rehypeHighlightCode()(tree);
    expect(JSON.stringify(tree)).toContain("hljs-keyword");
  });
});
