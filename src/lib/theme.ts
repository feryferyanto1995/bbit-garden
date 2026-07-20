export type Theme = 'day' | 'dusk';

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dusk' ? 'dusk' : 'day';
}

export function toggleTheme(): Theme {
  const next: Theme = currentTheme() === 'dusk' ? 'day' : 'dusk';
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem('bbit-theme', next);
  } catch {
    /* private mode — the sun still sets, it just won't be remembered */
  }
  return next;
}

/** Call `cb` whenever the theme changes anywhere; returns an unsubscribe. */
export function watchTheme(cb: (t: Theme) => void): () => void {
  const mo = new MutationObserver(() => cb(currentTheme()));
  mo.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => mo.disconnect();
}
