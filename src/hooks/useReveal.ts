import { useEffect, useRef } from 'react';

/**
 * Adds `is-in` when the element enters the viewport (once).
 * CSS only hides `.reveal` under `html.js`, so content is never
 * gated for no-JS visitors or crawlers.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    // safety: never leave content hidden if IO misbehaves
    const t = window.setTimeout(() => el.classList.add('is-in'), 4000);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return ref;
}
