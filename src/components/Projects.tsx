import { useCallback, useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { PROJECTS } from '../data/projects';
import type { ProjectItem } from '../data/projects';
import { SpecimenCanvas } from './SpecimenCanvas';
import { asset } from '../lib/asset';
import './projects.css';

export function Projects() {
  const head = useReveal<HTMLDivElement>();
  const reduced = useReducedMotion();

  const [open, setOpen] = useState<ProjectItem | null>(null);
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const railRef = useRef<HTMLOListElement | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  // While a goTo-triggered smooth scroll is still animating, the rail keeps
  // firing scroll events mid-flight; if onRailScroll read those as a user
  // swipe it could snap `index` back to wherever the rail happened to be
  // that frame, silently eating the click that just advanced it.
  const programmaticScroll = useRef(false);
  const scrollSettleTimer = useRef<number | undefined>(undefined);

  const total = open?.plates?.length ?? 0;

  const show = (project: ProjectItem, trigger: HTMLElement) => {
    lastTrigger.current = trigger;
    setIndex(0);
    setOpen(project);
  };
  const close = useCallback(() => {
    setOpen(null);
    lastTrigger.current?.focus();
  }, []);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    // Esc closes the native dialog before this runs, so the scroll lock must be
    // driven by `open` alone — gating it on `dlg.open` leaves the page locked.
    if (open) {
      if (!dlg.open) dlg.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      if (dlg.open) dlg.close();
      document.body.style.overflow = '';
    }
  }, [open]);

  // never leave the page locked if the component unmounts while open
  useEffect(() => () => {
    document.body.style.overflow = '';
  }, []);

  const goTo = useCallback(
    (next: number) => {
      const rail = railRef.current;
      if (!rail) return;
      const items = Array.from(rail.children) as HTMLElement[];
      const clamped = Math.max(0, Math.min(items.length - 1, next));
      const el = items[clamped];
      if (!el) return;
      programmaticScroll.current = true;
      window.clearTimeout(scrollSettleTimer.current);
      // safety net if 'scrollend' doesn't fire (no-op scroll, older browser)
      scrollSettleTimer.current = window.setTimeout(() => {
        programmaticScroll.current = false;
      }, 700);
      rail.scrollTo({
        left: el.offsetLeft - rail.offsetLeft,
        behavior: reduced ? 'auto' : 'smooth',
      });
      setIndex(clamped);
    },
    [reduced],
  );

  // the readout follows whichever screen is sitting at the rail's leading
  // edge — but only for scrolling the visitor actually drove (touch/trackpad);
  // a goTo-driven scroll already set the index and must not be second-guessed
  // by its own in-flight scroll events.
  const onRailScroll = useCallback(() => {
    if (programmaticScroll.current) return;
    const rail = railRef.current;
    if (!rail) return;
    const items = Array.from(rail.children) as HTMLElement[];
    let nearest = 0;
    let best = Infinity;
    items.forEach((el, i) => {
      const d = Math.abs(el.offsetLeft - rail.offsetLeft - rail.scrollLeft);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setIndex(nearest);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const onSettle = () => {
      programmaticScroll.current = false;
      window.clearTimeout(scrollSettleTimer.current);
    };
    rail.addEventListener('scrollend', onSettle);
    return () => rail.removeEventListener('scrollend', onSettle);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goTo(index - 1);
      else if (e.key === 'ArrowRight') goTo(index + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, index, goTo]);

  return (
    <section
      className="section"
      id="specimens"
      aria-labelledby="specimens-title"
    >
      <div className="reveal" ref={head}>
        <h2 className="section-title" id="specimens-title">
          Specimens, <em>pressed &amp; labelled.</em>
        </h2>
        <p className="prose specimens-sub">
          Selected work from the practice. These pages are still growing —
          each will open into a full case study as it matures.
        </p>
      </div>

      <ol className="specimen-list">
        {PROJECTS.map((p) => (
          <Specimen key={p.id} project={p} onOpenPlates={show} />
        ))}
      </ol>

      <dialog
        className="gallery"
        ref={dialogRef}
        aria-label={open ? `${open.title} — screens from the build` : undefined}
        onClose={() => setOpen(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
      >
        {open?.plates && (
          <>
            <button
              type="button"
              className="gallery-side gallery-side--prev"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              aria-label="Previous screen"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              className="gallery-side gallery-side--next"
              onClick={() => goTo(index + 1)}
              disabled={index >= total - 1}
              aria-label="Next screen"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          <div className="gallery-inner">
            <header className="gallery-bar">
              <div className="gallery-heading">
                <h3 className="gallery-name">{open.title}</h3>
                <p className="gallery-sub">{open.kind}</p>
                {open.appStoreUrl && (
                  <a
                    className="gallery-store"
                    href={open.appStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Available on the App Store
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>

              <div className="gallery-controls">
                <p className="gallery-count" aria-live="polite">
                  <span className="gallery-count-now">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="gallery-count-of">
                    {' '}
                    / {String(total).padStart(2, '0')}
                  </span>
                </p>
                <button
                  type="button"
                  className="gallery-btn gallery-btn--close"
                  onClick={close}
                  aria-label="Close the gallery"
                >
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
            </header>

            <ol className="gallery-rail" ref={railRef} onScroll={onRailScroll}>
              {open.plates.map((plate, i) => (
                <li
                  className="screen"
                  key={plate.src}
                  style={{ '--i': i } as React.CSSProperties}
                >
                  <figure>
                    <img
                      src={asset(plate.src)}
                      alt={plate.alt}
                      width={560}
                      height={1216}
                      loading={i < 3 ? 'eager' : 'lazy'}
                      decoding="async"
                      draggable={false}
                    />
                    <figcaption>{plate.caption}</figcaption>
                  </figure>
                </li>
              ))}
            </ol>
          </div>
          </>
        )}
      </dialog>
    </section>
  );
}

function Specimen({
  project: p,
  onOpenPlates,
}: {
  project: ProjectItem;
  onOpenPlates: (project: ProjectItem, trigger: HTMLElement) => void;
}) {
  const ref = useReveal<HTMLLIElement>();
  const count = p.plates?.length ?? 0;

  return (
    <li className="specimen reveal" ref={ref}>
      <figure className={p.cover ? 'specimen-fig specimen-fig--shipped' : 'specimen-fig'}>
        {p.cover && count > 0 ? (
          <button
            type="button"
            className="specimen-trigger"
            onClick={(e) => onOpenPlates(p, e.currentTarget)}
            aria-haspopup="dialog"
            aria-label={`Open ${count} screens from the ${p.title} build`}
          >
            <span className="specimen-screen">
              <img
                src={asset(p.cover.src)}
                alt={p.cover.alt}
                width={560}
                height={1216}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </span>
            <span className="specimen-open" aria-hidden="true">
              See all {count} screens
            </span>
          </button>
        ) : (
          <>
            <SpecimenCanvas seed={p.seed} species={p.species} />
            <figcaption className="label">
              specimen no. {p.no} — {p.species}
            </figcaption>
          </>
        )}
      </figure>
      <div className="specimen-body">
        <p className="label label--moss">{p.kind}</p>
        <h3>{p.title}</h3>
        <p className="specimen-desc">{p.description}</p>
        <p
          className={
            p.status ? 'specimen-soon specimen-soon--landed' : 'specimen-soon'
          }
        >
          <span aria-hidden="true">{p.status ? '◍ ' : '◌ '}</span>
          {p.status ?? 'case study — still growing'}
        </p>
        {p.appStoreUrl && (
          <a
            className="specimen-store"
            href={p.appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Available on the App Store
            <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </li>
  );
}
