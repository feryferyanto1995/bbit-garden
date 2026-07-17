/**
 * Procedural pixel plants.
 *
 * A plant is a list of cells on a small integer grid, each with a colour
 * role and a growth order. The engine draws cells in order as growth
 * progresses, so every plant "grows" the way it was generated:
 * stem first, then leaves, then whatever blooms at the top.
 */

export type CellRole =
  | 'stem'
  | 'leaf'
  | 'leaf-lite'
  | 'petal'
  | 'petal-lite'
  | 'core'
  | 'berry';

export interface PlantCell {
  x: number; // grid column, 0 = stem base
  y: number; // grid rows above soil (positive = up)
  role: CellRole;
  order: number; // 0..1 fraction of growth at which the cell appears
  shade: number; // -1..1 luminance jitter, fixed at generation time
}

export interface Plant {
  cells: PlantCell[];
  height: number; // in grid rows
  swayPhase: number;
  swayAmp: number; // cells of horizontal sway at the tip
}

/** Deterministic PRNG (mulberry32) so a seed always grows the same plant. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Species = 'sprout' | 'grass' | 'fern' | 'flower' | 'berry';

const pick = <T,>(r: () => number, arr: T[]): T =>
  arr[Math.floor(r() * arr.length)];

/**
 * Generate a plant from a numeric seed.
 * `mood` biases species choice (projects use fixed moods for variety).
 */
export function generatePlant(seed: number, mood?: Species): Plant {
  const r = rng(seed);
  const species: Species =
    mood ??
    pick(r, [
      'sprout',
      'grass',
      'grass',
      'fern',
      'flower',
      'flower',
      'berry',
    ]);

  const cells: PlantCell[] = [];
  const jit = () => r() * 2 - 1;

  /** Push a cell; growth order is filled in later from y-position. */
  const add = (x: number, y: number, role: CellRole) =>
    cells.push({ x, y, role, order: 0, shade: jit() * 0.5 });

  let height = 0;

  if (species === 'sprout') {
    height = 3 + Math.floor(r() * 3);
    for (let y = 0; y < height; y++) add(0, y, 'stem');
    // two leaves near the top, like the bbit mark
    add(-1, height - 1, 'leaf');
    add(-2, height, 'leaf');
    add(1, height, 'leaf-lite');
    add(2, height + 1, 'leaf-lite');
    add(0, height, 'leaf');
  } else if (species === 'grass') {
    const blades = 3 + Math.floor(r() * 3);
    height = 4 + Math.floor(r() * 5);
    for (let b = 0; b < blades; b++) {
      const bx = Math.round((b - (blades - 1) / 2) * 1.6);
      const bh = Math.max(2, Math.round(height * (0.45 + r() * 0.55)));
      const lean = r() < 0.5 ? -1 : 1;
      for (let y = 0; y < bh; y++) {
        const x = bx + (y > bh * 0.6 ? lean : 0);
        add(x, y, y > bh - 2 ? 'leaf-lite' : 'leaf');
      }
    }
  } else if (species === 'fern') {
    height = 7 + Math.floor(r() * 5);
    let drift = 0;
    for (let y = 0; y < height; y++) {
      if (y > 2 && r() < 0.3) drift += r() < 0.5 ? -1 : 1;
      drift = Math.max(-2, Math.min(2, drift));
      add(drift, y, 'stem');
      // paired leaflets every other row
      if (y >= 2 && y % 2 === 0 && y < height - 1) {
        const span = Math.max(1, Math.round((height - y) / 3));
        for (let s = 1; s <= span; s++) {
          add(drift - s, y + (s > 1 ? 1 : 0), s === span ? 'leaf-lite' : 'leaf');
          add(drift + s, y + (s > 1 ? 1 : 0), s === span ? 'leaf-lite' : 'leaf');
        }
      }
    }
    add(drift, height, 'leaf');
  } else if (species === 'flower') {
    height = 6 + Math.floor(r() * 6);
    let drift = 0;
    for (let y = 0; y < height; y++) {
      if (y > 3 && r() < 0.25) drift += r() < 0.5 ? -1 : 1;
      drift = Math.max(-1, Math.min(1, drift));
      add(drift, y, 'stem');
      if (y === Math.floor(height * 0.45)) {
        add(drift - 1, y, 'leaf');
        add(drift - 2, y + 1, 'leaf-lite');
      }
      if (y === Math.floor(height * 0.6)) {
        add(drift + 1, y, 'leaf');
        add(drift + 2, y + 1, 'leaf-lite');
      }
    }
    // bloom
    const cx = drift;
    const cy = height + 1;
    add(cx, cy, 'core');
    add(cx - 1, cy, 'petal');
    add(cx + 1, cy, 'petal');
    add(cx, cy - 1, 'petal');
    add(cx, cy + 1, 'petal');
    if (r() < 0.6) {
      add(cx - 1, cy - 1, 'petal-lite');
      add(cx + 1, cy + 1, 'petal-lite');
      add(cx - 1, cy + 1, 'petal-lite');
      add(cx + 1, cy - 1, 'petal-lite');
    }
  } else {
    // berry
    height = 5 + Math.floor(r() * 5);
    let drift = 0;
    for (let y = 0; y < height; y++) {
      if (y > 2 && r() < 0.3) drift += r() < 0.5 ? -1 : 1;
      drift = Math.max(-2, Math.min(2, drift));
      add(drift, y, 'stem');
      if (y >= 2 && r() < 0.55) {
        const side = r() < 0.5 ? -1 : 1;
        add(drift + side, y, 'leaf');
        if (r() < 0.5) add(drift + side, y + 1, 'berry');
      }
    }
    add(drift, height, 'berry');
    add(drift === 0 ? 1 : 0, height - 1, 'berry');
  }

  // growth order: soil upward, with a whisper of jitter
  const maxY = Math.max(...cells.map((c) => c.y), 1);
  for (const c of cells) {
    c.order = Math.min(1, c.y / (maxY + 1) + r() * 0.08);
  }
  cells.sort((a, b) => a.order - b.order);

  return {
    cells,
    height: maxY,
    swayPhase: r() * Math.PI * 2,
    swayAmp: 0.5 + r() * 0.7,
  };
}
