import { useEffect, useRef, useState } from 'react';
import { generatePlant } from '../garden/plants';
import {
  drawPlant,
  drawSoil,
  fitCanvas,
  readPalette,
} from '../garden/engine';
import type { PlantInstance } from '../garden/engine';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useReveal } from '../hooks/useReveal';
import './garden.css';

const STORE_KEY = 'bbit-garden-v1';
const MAX_SEEDS = 48;

interface StoredSeed {
  s: number; // seed
  x: number; // 0..1 across the bed
  t: number; // planted at (epoch ms)
}

function loadSeeds(): StoredSeed[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredSeed[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_SEEDS) : [];
  } catch {
    return [];
  }
}

function saveSeeds(seeds: StoredSeed[]) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(seeds));
  } catch {
    /* storage unavailable — the garden just won't remember */
  }
}

/** deterministic wild plants so the bed is never bare */
const WILD: StoredSeed[] = [
  { s: 11, x: 0.05, t: 0 },
  { s: 47, x: 0.18, t: 0 },
  { s: 103, x: 0.34, t: 0 },
  { s: 83, x: 0.52, t: 0 },
  { s: 29, x: 0.71, t: 0 },
  { s: 57, x: 0.84, t: 0 },
  { s: 65, x: 0.95, t: 0 },
];

const SOIL_DEPTH = 26;

export function Garden() {
  const head = useReveal<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();
  const [seeds, setSeeds] = useState<StoredSeed[]>(() => loadSeeds());
  const seedsRef = useRef(seeds);
  seedsRef.current = seeds;

  // stats copy
  const first = seeds.length ? Math.min(...seeds.map((s) => s.t)) : null;
  const days = first ? Math.max(0, Math.floor((Date.now() - first) / 86400000)) : 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let raf = 0;
    let disposed = false;
    let visible = false;
    let pointerX: number | null = null;
    let instances: PlantInstance[] = [];
    let lastSeedCount = -1;

    const rebuild = () => {
      const rect = canvas.getBoundingClientRect();
      const soilY = rect.height - SOIL_DEPTH;
      const all = [...WILD, ...seedsRef.current];
      instances = all.map((s) => {
        const isNew =
          s.t > 0 && Date.now() - s.t < 400 && !reduced ? 0 : 1;
        return {
          plant: generatePlant(s.s),
          baseX: 8 + s.x * (rect.width - 16),
          baseY: soilY + 4,
          cell: 7,
          grow: isNew,
          breeze: 0,
          plantedAt: s.t,
        };
      });
      lastSeedCount = all.length;
    };

    const draw = (now: number) => {
      const ctx = fitCanvas(canvas);
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      if (lastSeedCount !== WILD.length + seedsRef.current.length) rebuild();
      const pal = readPalette(canvas);
      ctx.clearRect(0, 0, rect.width, rect.height);
      drawSoil(ctx, rect.width, rect.height - SOIL_DEPTH, SOIL_DEPTH, canvas);
      const t = now / 1000;
      for (const inst of instances) {
        if (inst.grow < 1) {
          inst.grow = Math.min(1, inst.grow + 0.011);
        }
        // pointer breeze
        if (pointerX !== null && !reduced) {
          const d = Math.abs(inst.baseX - pointerX);
          if (d < 90) inst.breeze += ((90 - d) / 90) * 0.09;
        }
        inst.breeze *= 0.93;
        inst.breeze = Math.min(inst.breeze, 1.6);
        drawPlant(ctx, inst, pal, t, reduced ? 0 : 1);
      }
    };

    const loop = (now: number) => {
      if (disposed) return;
      draw(now);
      if (visible && !reduced) {
        raf = requestAnimationFrame(loop);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible = e.isIntersecting;
          cancelAnimationFrame(raf);
          if (visible) raf = requestAnimationFrame(loop);
        }
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
    };
    const onPointerLeave = () => {
      pointerX = null;
    };
    const onResize = () => {
      rebuild();
      draw(performance.now());
    };
    const themeObserver = new MutationObserver(() => draw(performance.now()));
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('resize', onResize);
    rebuild();
    draw(performance.now());

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      themeObserver.disconnect();
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', onResize);
    };
  }, [reduced]);

  const plantAt = (frac: number) => {
    const seed = Math.floor(Math.random() * 2 ** 31);
    const next = [
      ...seedsRef.current,
      { s: seed, x: Math.min(0.98, Math.max(0.02, frac)), t: Date.now() },
    ];
    while (next.length > MAX_SEEDS) next.shift();
    setSeeds(next);
    saveSeeds(next);
  };

  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    plantAt((e.clientX - rect.left) / rect.width);
  };
  const onCanvasKey = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      plantAt(0.08 + Math.random() * 0.84);
    }
  };

  const compost = () => {
    setSeeds([]);
    saveSeeds([]);
  };

  return (
    <section className="section" id="garden" aria-labelledby="garden-title">
      <div className="reveal" ref={head}>
        <h2 className="section-title" id="garden-title">
          Plant <em>something.</em>
        </h2>
        <p className="prose garden-sub">
          Click the soil to plant a seed. It will grow on its own, and it will
          still be here when you come back — this garden remembers you.
        </p>
      </div>

      <div className="garden-bed-wrap">
        <canvas
          ref={canvasRef}
          className="garden-bed"
          role="button"
          tabIndex={0}
          aria-label="Garden bed. Press Enter to plant a seed."
          onClick={onCanvasClick}
          onKeyDown={onCanvasKey}
        />
        <div className="garden-meta">
          <p className="label" aria-live="polite">
            {seeds.length === 0
              ? 'no seeds planted yet — the wild ones came on the wind'
              : `${seeds.length} seed${seeds.length === 1 ? '' : 's'} planted${
                  days > 0
                    ? ` · first planted ${days} day${days === 1 ? '' : 's'} ago`
                    : ' · today'
                }`}
          </p>
          {seeds.length > 0 && (
            <button type="button" className="garden-compost" onClick={compost}>
              compost &amp; start over
            </button>
          )}
        </div>
      </div>

      <div className="contact" id="contact">
        <h3 className="contact-title">
          Let&rsquo;s grow something <em>together.</em>
        </h3>
        <div className="contact-links">
          <a className="contact-link" href="mailto:thebibit.lab@gmail.com">
            <span className="label label--moss">email</span>
            thebibit.lab@gmail.com
          </a>
          <a
            className="contact-link"
            href="https://www.instagram.com/blancc.canvas"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="label label--moss">instagram</span>
            @blancc.canvas
          </a>
        </div>
      </div>
    </section>
  );
}
