import { describe, expect, it } from "vitest";
import type { TechNodeData } from "../content/parse";
import { scoreNodeMatch } from "./SearchModal";

function node(name: string, tags: readonly string[], what = "") {
  return {
    id: name.toLowerCase(),
    name,
    map: "backend",
    category: "database",
    what,
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

  it("ranks word-start matches above mid-word matches", () => {
    const drizzle = node("Drizzle ORM", ["orm", "sql"]);
    const prisma = node("Prisma", ["orm"]);
    const hookForm = node("React Hook Form", ["forms"]);

    const score = (n: TechNodeData) => scoreNodeMatch(n, "orm", "backend");
    expect(score(drizzle)).toBeGreaterThan(score(prisma));
    expect(score(prisma)).toBeGreaterThan(score(hookForm));
  });

  it("ignores mid-word tag hits", () => {
    const fastify = node("Fastify", ["performance"]);
    const multer = node("Multer", ["form-data"]);

    expect(scoreNodeMatch(fastify, "orm", "backend")).toBe(0);
    expect(scoreNodeMatch(multer, "data", "backend")).toBeGreaterThan(0);
  });
});
