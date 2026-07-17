import { useEffect, useRef } from 'react';
import { generatePlant } from '../garden/plants';
import { drawPlant, readPalette, fitCanvas } from '../garden/engine';
import type { PlantInstance } from '../garden/engine';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface Props {
  seed: number;
  species: 'sprout' | 'grass' | 'fern' | 'flower' | 'berry';
}

/**
 * A single plant, drawn large — the "pressed specimen" illustration for a
 * project. Grows once when scrolled into view, then sways very gently.
 */
export function SpecimenCanvas({ seed, species }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let raf = 0;
    let disposed = false;
    let growing = false;
    let growStart = 0;
    const plant = generatePlant(seed, species);
    const inst: PlantInstance = {
      plant,
      baseX: 0,
      baseY: 0,
      cell: 10,
      grow: reduced ? 1 : 0,
      breeze: 0,
      plantedAt: 0,
    };
    // watch theme changes so colors stay current
    const themeObserver = new MutationObserver(() => draw(performance.now()));

    function draw(now: number) {
      const ctx = fitCanvas(canvas!);
      if (!ctx) return;
      const rect = canvas!.getBoundingClientRect();
      const cell = Math.max(
        6,
        Math.floor(
          Math.min(rect.width / 14, rect.height / (plant.height + 4)),
        ),
      );
      inst.cell = cell;
      inst.baseX = rect.width / 2;
      inst.baseY = rect.height - cell;
      if (growing) {
        inst.grow = Math.min(1, (now - growStart) / 1600);
      }
      ctx.clearRect(0, 0, rect.width, rect.height);
      // small soil mound
      const pal = readPalette(canvas!);
      const s = getComputedStyle(canvas!);
      ctx.fillStyle = s.getPropertyValue('--soil').trim();
      ctx.fillRect(
        inst.baseX - cell * 3,
        inst.baseY,
        cell * 6,
        cell * 0.8,
      );
      ctx.fillStyle = s.getPropertyValue('--soil-deep').trim();
      ctx.fillRect(inst.baseX - cell * 2, inst.baseY + cell * 0.8, cell * 4, cell * 0.5);
      drawPlant(ctx, inst, pal, now / 1000, reduced ? 0 : 0.5);
    }

    function loop(now: number) {
      if (disposed) return;
      draw(now);
      if (growing && inst.grow >= 1) growing = false;
      // keep a slow idle sway only while visible & not reduced
      if (!reduced && (growing || visible)) raf = requestAnimationFrame(loop);
    }

    let visible = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible = e.isIntersecting;
          if (e.isIntersecting) {
            if (!reduced && inst.grow === 0) {
              growing = true;
              growStart = performance.now();
            }
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(loop);
          } else {
            cancelAnimationFrame(raf);
          }
        }
      },
      { threshold: 0.25 },
    );
    io.observe(canvas);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    const onResize = () => draw(performance.now());
    window.addEventListener('resize', onResize);
    draw(performance.now());

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      themeObserver.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [seed, species, reduced]);

  return <canvas ref={ref} className="specimen-canvas" aria-hidden="true" />;
}
