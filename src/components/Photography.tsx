import { useCallback, useEffect, useRef, useState } from 'react';
import { PHOTOS, IG_URL } from '../data/photos';
import { useReveal } from '../hooks/useReveal';
import './photography.css';

export function Photography() {
  const head = useReveal<HTMLDivElement>();
  const stage = useReveal<HTMLDivElement>();

  // one frame, chosen by the wind — different on every visit
  const [featured, setFeatured] = useState(() =>
    Math.floor(Math.random() * PHOTOS.length),
  );
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const shuffle = () => {
    setFeatured((cur) => {
      if (PHOTOS.length < 2) return cur;
      let next = cur;
      while (next === cur) next = Math.floor(Math.random() * PHOTOS.length);
      return next;
    });
  };

  const show = (i: number, trigger: HTMLElement) => {
    lastTrigger.current = trigger;
    setOpen(i);
  };
  const close = useCallback(() => {
    setOpen(null);
    lastTrigger.current?.focus();
  }, []);

  const step = useCallback((d: number) => {
    setOpen((cur) =>
      cur === null ? cur : (cur + d + PHOTOS.length) % PHOTOS.length,
    );
  }, []);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (open !== null && !dlg.open) {
      dlg.showModal();
      document.body.style.overflow = 'hidden';
    } else if (open === null && dlg.open) {
      dlg.close();
      document.body.style.overflow = '';
    }
  }, [open]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, step]);

  const f = PHOTOS[featured];
  const photo = open !== null ? PHOTOS[open] : null;

  return (
    <section
      className="section"
      id="photographs"
      aria-labelledby="photographs-title"
    >
      <div className="reveal" ref={head}>
        <h2 className="section-title" id="photographs-title">
          Frames kept <em>from the walk.</em>
        </h2>
        <p className="prose photos-sub">
          Film photographs, mostly of places being quietly themselves. One
          frame below, chosen by the wind — the rest of the feed lives at{' '}
          <a
            className="tlink"
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            @blancc.canvas
          </a>
          .
        </p>
      </div>

      <div className="photo-stage reveal" ref={stage}>
        <button
          type="button"
          key={f.src}
          className={`photo-feature ${f.w > f.h ? 'is-wide' : 'is-tall'}`}
          onClick={(e) => show(featured, e.currentTarget)}
          aria-haspopup="dialog"
          aria-label={`Open gallery at: ${f.caption}`}
        >
          <span className="photo-mat">
            <img src={f.src} alt={f.alt} width={f.w} height={f.h} />
          </span>
          <span className="photo-feature-meta">
            <span className="label">{f.caption}</span>
            <span className="label label--moss">
              frame {String(featured + 1).padStart(2, '0')} / 0{PHOTOS.length}
            </span>
          </span>
        </button>

        <div className="photo-actions">
          <button type="button" className="quiet-action" onClick={shuffle}>
            let the wind choose again
          </button>
          <span className="photo-actions-sep" aria-hidden="true">
            ·
          </span>
          <button
            type="button"
            className="quiet-action"
            onClick={(e) => show(featured, e.currentTarget)}
          >
            open the gallery
          </button>
        </div>

        <ul className="contact-sheet" aria-label="All frames">
          {PHOTOS.map((p, i) => (
            <li key={p.src}>
              <button
                type="button"
                className={`sheet-thumb ${i === featured ? 'is-current' : ''}`}
                onClick={(e) => show(i, e.currentTarget)}
                aria-label={`Open photo ${i + 1} of ${PHOTOS.length}: ${p.caption}`}
                aria-haspopup="dialog"
              >
                <img
                  src={p.src}
                  alt=""
                  loading="lazy"
                  width={p.w}
                  height={p.h}
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        className="lightbox"
        ref={dialogRef}
        aria-label="Photo viewer"
        onClose={() => setOpen(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
      >
        {photo && (
          <figure className="lightbox-frame">
            <div className="lightbox-bar">
              <span className="label lightbox-count">
                {(open ?? 0) + 1} / {PHOTOS.length}
              </span>
              <button
                type="button"
                className="lightbox-btn"
                onClick={close}
                aria-label="Close photo viewer"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <img key={photo.src} src={photo.src} alt={photo.alt} />
            <figcaption className="lightbox-meta">
              <span className="label">{photo.caption}</span>
              <a
                className="lightbox-ig"
                href={IG_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                view on Instagram
              </a>
            </figcaption>
            <div className="lightbox-nav">
              <button
                type="button"
                className="lightbox-btn"
                onClick={() => step(-1)}
                aria-label="Previous photo"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                className="lightbox-btn"
                onClick={() => step(1)}
                aria-label="Next photo"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </figure>
        )}
      </dialog>
    </section>
  );
}
