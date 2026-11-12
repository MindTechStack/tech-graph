import { describe, expect, it } from "vitest";
import type { TechNodeData } from "../content/parse";
import { scoreNodeMatch } from "./SearchModal";

function node(name: string, tags: readonly string[]) {
  return {
    id: name.toLowerCase(),
    name,
    map: "backend",
    category: "database",
    what: "",
    tags,
  } as unknown as TechNodeData;
}

describe("scoreNodeMatch", () => {
  it("matches #tag queries against tag prefixes only", () => {
    const drizzle = node("Drizzle ORM", ["orm", "sql"]);
    const hookForm = node("React Hook Form", ["forms"]);

    expect(scoreNodeMatch(drizzle, "#orm", "backend")).toBeGreaterThan(0);
    expect(scoreNodeMatch(hookForm, "#orm", "backend")).toBe(0);
    expect(scoreNodeMatch(hookForm, "orm", "backend")).toBeGreaterThan(0);
  });
});
