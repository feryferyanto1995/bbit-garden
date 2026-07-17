/**
 * Canvas renderer for pixel plants.
 *
 * Colours are read from CSS custom properties at draw time so plants
 * follow the day/dusk theme without re-generation.
 */

import type { Plant, CellRole } from './plants';

export interface PlantInstance {
  plant: Plant;
  /** base position in canvas CSS px (x centre, y = soil line) */
  baseX: number;
  baseY: number;
  cell: number; // cell size in CSS px
  /** growth progress 0..1 */
  grow: number;
  /** wind energy added by pointer proximity, decays over time */
  breeze: number;
  plantedAt: number;
}

export interface Palette {
  stem: string;
  leaf: string;
  leafLite: string;
  petal: string;
  petalLite: string;
  core: string;
  berry: string;
}

export function readPalette(el: HTMLElement): Palette {
  const s = getComputedStyle(el);
  const v = (name: string) => s.getPropertyValue(name).trim();
  return {
    stem: v('--moss-deep'),
    leaf: v('--moss'),
    leafLite: v('--moss-bright'),
    petal: v('--clay'),
    petalLite: v('--clay'),
    core: v('--ink'),
    berry: v('--clay'),
  };
}

const roleColor = (p: Palette, role: CellRole): string =>
  role === 'stem'
    ? p.stem
    : role === 'leaf'
      ? p.leaf
      : role === 'leaf-lite'
        ? p.leafLite
        : role === 'petal'
          ? p.petal
          : role === 'petal-lite'
            ? p.petalLite
            : role === 'core'
              ? p.core
              : p.berry;

const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

/** shade a css color by drawing with globalAlpha layering — cheap jitter */
function shadeAlpha(shade: number): number {
  return 1 - Math.abs(shade) * 0.22;
}

/**
 * Draw one plant. `time` in seconds drives sway; `windAmp` 0..1 scales it.
 */
export function drawPlant(
  ctx: CanvasRenderingContext2D,
  inst: PlantInstance,
  palette: Palette,
  time: number,
  windAmp: number,
): void {
  const { plant, baseX, baseY, cell } = inst;
  const grown = easeOutQuint(Math.max(0, Math.min(1, inst.grow)));
  const H = plant.height || 1;
  const swayBase =
    Math.sin(time * 0.9 + plant.swayPhase) * plant.swayAmp * windAmp +
    Math.sin(time * 0.23 + plant.swayPhase * 2) * 0.4 * windAmp;
  const breezePush = inst.breeze;

  for (const c of plant.cells) {
    if (c.order > grown) break;
    // taller cells sway more (shear)
    const f = c.y / H;
    const sway = (swayBase + breezePush) * f * f * cell;
    // cells pop in with a tiny scale-up as they appear
    const local = Math.min(1, (grown - c.order) / 0.12);
    const size = cell * (0.3 + 0.7 * easeOutQuint(local));
    const px = baseX + c.x * cell + sway - size / 2;
    const py = baseY - (c.y + 1) * cell + (cell - size) / 2;
    ctx.globalAlpha = shadeAlpha(c.shade) * Math.min(1, local * 2);
    ctx.fillStyle = roleColor(palette, c.role);
    ctx.fillRect(Math.round(px), Math.round(py), Math.ceil(size), Math.ceil(size));
  }
  ctx.globalAlpha = 1;
}

/** Pixel soil strip with deterministic speckle. */
export function drawSoil(
  ctx: CanvasRenderingContext2D,
  width: number,
  soilY: number,
  depth: number,
  el: HTMLElement,
): void {
  const s = getComputedStyle(el);
  const soil = s.getPropertyValue('--soil').trim();
  const soilDeep = s.getPropertyValue('--soil-deep').trim();
  const u = 6;
  ctx.fillStyle = soil;
  ctx.fillRect(0, soilY, width, depth);
  ctx.fillStyle = soilDeep;
  // top edge crenellation + speckle, deterministic from x
  for (let x = 0; x < width; x += u) {
    const h = Math.sin(x * 12.9898) * 43758.5453;
    const n = h - Math.floor(h);
    if (n < 0.4) ctx.fillRect(x, soilY, u, u * 0.5);
    if (n > 0.82) ctx.fillRect(x, soilY + depth * (0.3 + n * 0.4), u, u * 0.6);
  }
}

/** Resize helper: match canvas buffer to element size × dpr. Returns ctx. */
export function fitCanvas(
  canvas: HTMLCanvasElement,
): CanvasRenderingContext2D | null {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(1, Math.round(rect.width));
  const h = Math.max(1, Math.round(rect.height));
  if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
    canvas.width = w * dpr;
    canvas.height = h * dpr;
  }
  const ctx = canvas.getContext('2d');
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}
