export interface Rect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

const LABEL_CHAR_WIDTH = 6.7;
const LABEL_PLATE_PADDING_X = 4;
const LABEL_PLATE_HEIGHT = 20;

export function unionOf(a: Rect, b: Rect): Rect {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  return {
    x,
    y,
    width: Math.max(a.x + a.width, b.x + b.width) - x,
    height: Math.max(a.y + a.height, b.y + b.height) - y,
  };
}

export function distanceBetween(a: Rect, b: Rect): number {
  return Math.hypot(
    a.x + a.width / 2 - (b.x + b.width / 2),
    a.y + a.height / 2 - (b.y + b.height / 2),
  );
}

export function rectsOverlap(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
}

export function edgeLabelPlate(source: Rect, target: Rect, text: string): Rect {
  const width = text.length * LABEL_CHAR_WIDTH + LABEL_PLATE_PADDING_X * 2;
  const centreX = (source.x + source.width + target.x) / 2;
  const centreY = (source.y + source.height / 2 + target.y + target.height / 2) / 2;
  return {
    x: centreX - width / 2,
    y: centreY - LABEL_PLATE_HEIGHT / 2,
    width,
    height: LABEL_PLATE_HEIGHT,
  };
}
