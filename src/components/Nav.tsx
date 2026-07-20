import { useEffect, useState } from 'react';
import { currentTheme, toggleTheme, watchTheme } from '../lib/theme';
import type { Theme } from '../lib/theme';
import './nav.css';

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#specimens', label: 'Work' },
  { href: '#photographs', label: 'Photos' },
  { href: '#garden', label: 'Garden' },
];

export function Nav() {
  const [shown, setShown] = useState(false);
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document === 'undefined' ? 'day' : currentTheme(),
  );

  useEffect(() => {
    const onScroll = () => {
      setShown(window.scrollY > window.innerHeight * 0.55);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // stay in sync with the cover's seed-dot switch (and any future one)
  useEffect(() => watchTheme(setTheme), []);

  return (
    <nav className={`nav ${shown ? 'nav--shown' : ''}`} aria-label="Primary">
      <a className="nav-brand" href="#top" aria-label="bbit — back to top">
        bbit<span className="nav-dot" aria-hidden="true" />
      </a>
      <div className="nav-links">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </div>
      <button
        type="button"
        className="nav-theme"
        onClick={toggleTheme}
        aria-label={theme === 'dusk' ? 'Switch to day' : 'Switch to dusk'}
        title={theme === 'dusk' ? 'Day' : 'Dusk'}
      >
        {theme === 'dusk' ? (
          /* pixel sun */
          <svg viewBox="0 0 16 16" width="17" height="17" aria-hidden="true">
            <g fill="currentColor">
              <rect x="6" y="5" width="4" height="6" />
              <rect x="5" y="6" width="6" height="4" />
              <rect x="7" y="1" width="2" height="2" />
              <rect x="7" y="13" width="2" height="2" />
              <rect x="1" y="7" width="2" height="2" />
              <rect x="13" y="7" width="2" height="2" />
              <rect x="3" y="3" width="2" height="2" />
              <rect x="11" y="3" width="2" height="2" />
              <rect x="3" y="11" width="2" height="2" />
              <rect x="11" y="11" width="2" height="2" />
            </g>
          </svg>
        ) : (
          /* pixel moon */
          <svg viewBox="0 0 16 16" width="17" height="17" aria-hidden="true">
            <g fill="currentColor">
              <rect x="5" y="2" width="4" height="2" />
              <rect x="3" y="4" width="4" height="2" />
              <rect x="2" y="6" width="4" height="4" />
              <rect x="3" y="10" width="4" height="2" />
              <rect x="5" y="12" width="5" height="2" />
              <rect x="9" y="11" width="3" height="2" />
              <rect x="11" y="9" width="2" height="2" />
            </g>
          </svg>
        )}
      </button>
    </nav>
  );
}
