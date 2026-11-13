import { describe, expect, it } from "vitest";
import { edgeLabelPlate, rectsOverlap, unionOf } from "./rect";

const node = (x: number, y: number) => ({ x, y, width: 224, height: 64 });

describe("edge label plates", () => {
  it("centres the plate in the gap between the two handles", () => {
    const plate = edgeLabelPlate(node(0, 0), node(320, 0), "built on");
    expect(plate.x + plate.width / 2).toBe(272);
    expect(plate.y + plate.height / 2).toBe(32);
  });

  it("fits a short label in a 96px gutter but not a long one", () => {
    const source = node(0, 0);
    const target = node(320, 0);
    const short = edgeLabelPlate(source, target, "ORM for");
    const long = edgeLabelPlate(source, target, "issued after credential check with");
    expect(rectsOverlap(short, source) || rectsOverlap(short, target)).toBe(false);
    expect(rectsOverlap(long, source) || rectsOverlap(long, target)).toBe(true);
  });

  it("detects a third node lying under the plate", () => {
    const plate = edgeLabelPlate(node(0, 0), node(640, 0), "built on");
    expect(rectsOverlap(plate, node(208, 16))).toBe(true);
    expect(rectsOverlap(plate, node(208, 160))).toBe(false);
  });

  it("treats touching edges as clear and unions boxes", () => {
    expect(rectsOverlap(node(0, 0), node(224, 0))).toBe(false);
    expect(unionOf(node(0, 0), node(320, 80))).toEqual({ x: 0, y: 0, width: 544, height: 144 });
  });
});
