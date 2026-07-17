import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './cover.css';

interface Mote {
  tx: number; // target
  ty: number;
  sx: number; // start
  sy: number;
  delay: number;
  dur: number;
  color: 'ink' | 'moss';
  shade: number;
  // pointer-spring state
  ox: number; // current offset from target
  oy: number;
  vx: number;
  vy: number;
}

const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

/** Sample "bbit" set in Pixelify Sans into a grid of motes. */
function sampleWordmark(width: number): {
  motes: Mote[];
  w: number;
  h: number;
  cell: number;
} {
  const word = 'bbit';
  const fontSize = Math.min(320, Math.max(120, width * 0.24));
  const off = document.createElement('canvas');
  const octx = off.getContext('2d', { willReadFrequently: true })!;
  octx.font = `700 ${fontSize}px "Pixelify Sans"`;
  const metrics = octx.measureText(word);
  const dotGap = fontSize * 0.1;
  const dotSize = fontSize * 0.16;
  const w = Math.ceil(metrics.width + dotGap + dotSize) + 8;
  const h = Math.ceil(fontSize * 1.1);
  off.width = w;
  off.height = h;
  octx.font = `700 ${fontSize}px "Pixelify Sans"`;
  octx.textBaseline = 'alphabetic';
  const baseline = Math.round(fontSize * 0.92);
  octx.fillStyle = '#000';
  octx.fillText(word, 0, baseline);
  // the seed-dot after the word
  octx.fillRect(metrics.width + dotGap, baseline - dotSize, dotSize, dotSize);

  const cell = Math.max(5, Math.round(fontSize / 26));
  const half = Math.floor(cell / 2);
  const data = octx.getImageData(0, 0, w, h).data;
  const motes: Mote[] = [];
  for (let y = 0; y < h; y += cell) {
    for (let x = 0; x < w; x += cell) {
      // sample the cell centre so glyph edges don't leave holes
      const sy = Math.min(h - 1, y + half);
      const sx = Math.min(w - 1, x + half);
      const i = (sy * w + sx) * 4 + 3;
      if (data[i] > 60) {
        const isDot = x > metrics.width + dotGap * 0.5;
        const r = Math.random;
        motes.push({
          tx: x,
          ty: y,
          sx: x + (r() - 0.5) * width * 0.9,
          sy: y - (200 + r() * 500),
          delay: (x / w) * 650 + r() * 350,
          dur: 900 + r() * 700,
          color: isDot ? 'moss' : 'ink',
          shade: 1,
          ox: 0,
          oy: 0,
          vx: 0,
          vy: 0,
        });
      }
    }
  }
  return { motes, w, h, cell };
}

export function Cover() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let raf = 0;
    let disposed = false;
    let motes: Mote[] = [];
    let word = { w: 0, h: 0, cell: 6 };
    let originX = 0;
    let originY = 0;
    let startAt = 0;
    let settled = false;
    let pointer: { x: number; y: number } | null = null;
    let needsFrame = true;

    const ctx0 = canvas.getContext('2d');
    if (!ctx0) return;

    const styles = () => {
      const s = getComputedStyle(canvas);
      return {
        ink: s.getPropertyValue('--ink').trim(),
        moss: s.getPropertyValue('--moss').trim(),
      };
    };

    function layout() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas!.parentElement!.getBoundingClientRect();
      canvas!.width = Math.round(rect.width * dpr);
      canvas!.height = Math.round(rect.height * dpr);
      canvas!.style.width = `${rect.width}px`;
      canvas!.style.height = `${rect.height}px`;
      ctx0!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const sample = sampleWordmark(rect.width * 0.92);
      motes = sample.motes;
      word = { w: sample.w, h: sample.h, cell: sample.cell };
      originX = Math.round((rect.width - sample.w) / 2);
      originY = Math.round((rect.height - sample.h) / 2);
      startAt = performance.now();
      settled = reduced;
      needsFrame = true;
    }

    function frame(now: number) {
      if (disposed) return;
      raf = requestAnimationFrame(frame);
      const { ink, moss } = styles();
      const rect = canvas!.getBoundingClientRect();

      let anyActive = false;
      const t = now - startAt;

      // pointer spring physics on settled motes
      if (settled && pointer && !reduced) {
        const R = 70;
        for (const m of motes) {
          const mx = originX + m.tx + m.ox;
          const my = originY + m.ty + m.oy;
          const dx = mx - pointer.x;
          const dy = my - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R * R && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const push = ((R - d) / R) * 2.4;
            m.vx += (dx / d) * push;
            m.vy += (dy / d) * push;
          }
        }
      }
      if (settled && !reduced) {
        for (const m of motes) {
          // spring back to target
          m.vx += -m.ox * 0.06;
          m.vy += -m.oy * 0.06;
          m.vx *= 0.86;
          m.vy *= 0.86;
          m.ox += m.vx;
          m.oy += m.vy;
          if (
            Math.abs(m.vx) > 0.01 ||
            Math.abs(m.vy) > 0.01 ||
            Math.abs(m.ox) > 0.1 ||
            Math.abs(m.oy) > 0.1
          ) {
            anyActive = true;
          }
        }
      }

      if (!needsFrame && settled && !anyActive) {
        // idle: nothing moving — skip drawing until something changes
        return;
      }

      ctx0!.clearRect(0, 0, rect.width, rect.height);
      const cell = word.cell;
      let allSettled = true;

      for (const m of motes) {
        let x: number;
        let y: number;
        let a = m.shade;
        if (reduced || settled) {
          x = originX + m.tx + m.ox;
          y = originY + m.ty + m.oy;
        } else {
          const p = Math.max(0, Math.min(1, (t - m.delay) / m.dur));
          if (p < 1) allSettled = false;
          if (p <= 0) continue;
          const e = easeOutQuint(p);
          x = originX + m.sx + (m.tx - m.sx) * e;
          y = originY + m.sy + (m.ty - m.sy) * e;
          a = m.shade * Math.min(1, p * 3);
        }
        ctx0!.globalAlpha = a;
        ctx0!.fillStyle = m.color === 'moss' ? moss : ink;
        // slight overlap keeps the settled mark seamless
        ctx0!.fillRect(Math.round(x), Math.round(y), cell + 0.6, cell + 0.6);
      }
      ctx0!.globalAlpha = 1;

      if (!settled && allSettled) {
        settled = true;
      }
      if (settled && !anyActive) needsFrame = false;
    }

    const onPointer = (e: PointerEvent) => {
      const rect = canvas!.getBoundingClientRect();
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      needsFrame = true;
    };
    const onLeave = () => {
      pointer = null;
    };
    const onResize = () => layout();

    // Wait for the pixel font before sampling, or the mark renders in serif.
    let cancelled = false;
    document.fonts.load('700 100px "Pixelify Sans"').then(() => {
      if (cancelled) return;
      layout();
      raf = requestAnimationFrame(frame);
    });

    const parent = canvas.parentElement!;
    parent.addEventListener('pointermove', onPointer);
    parent.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', onResize);
    return () => {
      cancelled = true;
      disposed = true;
      cancelAnimationFrame(raf);
      parent.removeEventListener('pointermove', onPointer);
      parent.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, [reduced]);

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 5 ? 'the garden sleeps' : hour < 12 ? 'good morning' : hour < 18 ? 'good afternoon' : 'good evening';
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000,
  );

  return (
    <header className="cover" id="top">
      <p className="label cover-meta" aria-hidden="true">
        {greeting} · day {dayOfYear} of {now.getFullYear()}
      </p>
      <h1 className="visually-hidden">
        bbit — a quiet digital garden by Fery. UX design and photography.
      </h1>
      <div className="cover-stage" aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>
      <p className="cover-line">
        <em>Plant</em> the seeds, <em>tend</em> the soil,{' '}
        <em>harvest</em> the future.
      </p>
      <a className="cover-cue" href="#about">
        <span className="label">begin</span>
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </a>
    </header>
  );
}
