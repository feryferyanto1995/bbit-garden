import { useMemo } from 'react';
import { asset } from '../lib/asset';
import { rng } from '../garden/plants';
import {
  RITUAL,
  SCREENS,
  PALETTE,
  MOTIFS,
  DECISIONS,
  STATS,
} from '../data/orbitCaseStudy';
import './orbit-case-study.css';

/** A handful of twinkling points, seeded so they don't reshuffle on re-render. */
function useStars(count: number) {
  return useMemo(() => {
    const r = rng(20260718);
    return Array.from({ length: count }, () => ({
      left: (r() * 100).toFixed(2),
      top: (r() * 100).toFixed(2),
      size: (0.7 + r() * 1.7).toFixed(2),
      delay: (r() * 4.5).toFixed(2),
    }));
  }, [count]);
}

export function OrbitCaseStudy({ onClose }: { onClose: () => void }) {
  const stars = useStars(54);

  return (
    <div className="oc">
      <div className="oc-stars" aria-hidden="true">
        {stars.map((s, i) => (
          <i
            key={i}
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      <button
        type="button"
        className="oc-close"
        onClick={onClose}
        aria-label="Close the case study"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <div className="oc-scroll">
        <div className="oc-wrap">
          {/* HERO */}
          <header className="oc-hero">
            <div className="oc-deco" aria-hidden="true">
              <div className="oc-ring" />
              <div className="oc-ring oc-ring--2" />
              <div className="oc-dot" />
            </div>
            <div className="oc-hero-inner">
              <p className="oc-eyebrow">Design case study · iOS · 2026</p>
              <h1 className="oc-mark">
                Orbit<span className="oc-star-glyph">.</span>
              </h1>
              <p className="oc-hand">a journal you cannot scroll back through</p>
              <p className="oc-lede">
                Orbit turns journaling into a ritual of letting go: you write
                a thought, seal it into a blind-box capsule, and launch it
                into a 6–24 month orbit. When it circles back, you read it
                once — then it burns. This is the design story of an app
                built around <em>impermanence</em>.
              </p>
              <div className="oc-chips">
                <span className="oc-chip oc-chip--live">Live on the App Store</span>
                <span className="oc-chip">Character-led</span>
                <span className="oc-chip">Local-only · encrypted</span>
                <span className="oc-chip">iPhone &amp; iPad</span>
              </div>
            </div>
          </header>

          <hr className="oc-rule" />

          {/* THE RITUAL */}
          <section className="oc-sec">
            <p className="oc-eyebrow">The premise</p>
            <h2 className="oc-h2">Write it. Seal it. Let it go.</h2>
            <p className="oc-sub">
              Most journals are archives you scroll back through. Orbit is
              the opposite — a one-way ritual, designed so the value is in
              the release, not the record. The whole product is this
              sequence:
            </p>
            <div className="oc-ritual">
              {RITUAL.map((s) => (
                <div className={s.final ? 'oc-step oc-step--final' : 'oc-step'} key={s.n}>
                  <div className="oc-step-n">{s.n}</div>
                  <div className="oc-step-g" aria-hidden="true">{s.g}</div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>
          </section>

          <hr className="oc-rule" />

          {/* THE CHARACTER */}
          <section className="oc-sec">
            <p className="oc-eyebrow">The character</p>
            <h2 className="oc-h2">Orbit keeps what you let go of</h2>
            <div className="oc-charrow">
              <figure className="oc-charcard">
                <img
                  src={asset('images/orbit/logo.jpg')}
                  alt="Orbit, the app's astronaut mascot — a soft clay character with a star antenna and a warm glowing smile"
                  width={960}
                  height={898}
                  loading="lazy"
                />
                <figcaption>
                  <span aria-hidden="true">★</span> Orbit, the companion
                </figcaption>
              </figure>
              <div className="oc-chartext">
                <p>
                  An app about the dark needed a companion who isn’t afraid
                  of it. Orbit is a soft clay astronaut with a star for an
                  antenna and a warm light for a face — he carries your
                  thoughts around the sky, and greets you when they return.
                  The character leads the whole experience: the icon, the
                  launch, the welcome, and the little star you earn each
                  time you let something go.
                </p>
                <p className="oc-note">
                  “hi — I’m Orbit. I keep what you let go of.”
                </p>
              </div>
            </div>
          </section>

          <hr className="oc-rule" />

          {/* SCREENS */}
          <section className="oc-sec">
            <p className="oc-eyebrow">The screens</p>
            <h2 className="oc-h2">A night nursery, end to end</h2>
            <p className="oc-sub">
              Every surface holds the same mood — a deep indigo sky, cream
              paper, and one warm amber light. Real screens from the shipped
              app:
            </p>
            <div className="oc-screens">
              {SCREENS.map((s) => (
                <figure className="oc-shot" key={s.src}>
                  <span className="oc-phone">
                    <img
                      src={asset(s.src)}
                      alt={`${s.title} screen`}
                      width={280}
                      height={608}
                      loading="lazy"
                    />
                  </span>
                  <figcaption>
                    <span className="oc-shot-t">{s.title}</span>
                    <span className="oc-shot-d">{s.body}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <hr className="oc-rule" />

          {/* THE SYSTEM */}
          <section className="oc-sec">
            <p className="oc-eyebrow">The system</p>
            <h2 className="oc-h2">The kit behind the calm</h2>
            <p className="oc-sub">
              A small, deliberate design language — drawn from the app’s own
              world: the night sky, the paper, and the little star on the
              mascot’s head.
            </p>
            <div className="oc-grid3">
              <div className="oc-card">
                <h3>Palette</h3>
                <p className="oc-hint">Midnight ground, one warm accent</p>
                {PALETTE.map((c) => (
                  <div className="oc-sw" key={c.name}>
                    <span className="oc-sw-c" style={{ background: c.swatch }} />
                    <span className="oc-sw-nm">{c.name}</span>
                    <span className="oc-sw-hx">{c.hex}</span>
                  </div>
                ))}
              </div>
              <div className="oc-card">
                <h3>Typography</h3>
                <p className="oc-hint">Rounded voice, handwritten soul</p>
                <div className="oc-spec">
                  <div className="oc-spec-role">Interface</div>
                  <div className="oc-spec-nu">In orbit · 12 months</div>
                  <div className="oc-spec-use">Nunito — every title, button and stat</div>
                </div>
                <div className="oc-spec">
                  <div className="oc-spec-role">Your own words</div>
                  <div className="oc-spec-ca">be gentle with yourself</div>
                  <div className="oc-spec-use">Caveat — the notes, in a human hand</div>
                </div>
              </div>
              <div className="oc-card">
                <h3>Motifs</h3>
                <p className="oc-hint">Signals, not decoration</p>
                {MOTIFS.map((m) => (
                  <div className="oc-motif" key={m.title}>
                    <span className="oc-motif-g" aria-hidden="true">{m.g}</span>
                    <div>
                      <div className="oc-motif-t">{m.title}</div>
                      <div className="oc-motif-d">{m.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <hr className="oc-rule" />

          {/* DECISIONS */}
          <section className="oc-sec">
            <p className="oc-eyebrow">Design decisions</p>
            <h2 className="oc-h2">Why it feels the way it does</h2>
            <div className="oc-dec">
              {DECISIONS.map((d) => (
                <div className="oc-decard" key={d.title}>
                  <div className="oc-decard-k" aria-hidden="true">{d.g}</div>
                  <h3>{d.title}</h3>
                  <p>{d.body}</p>
                </div>
              ))}
            </div>
          </section>

          <hr className="oc-rule" />

          {/* STATS */}
          <section className="oc-sec">
            <p className="oc-eyebrow">At a glance</p>
            <h2 className="oc-h2">The shape of it</h2>
            <div className="oc-stats">
              {STATS.map((s) => (
                <div className="oc-stat" key={s.v + s.l}>
                  <div className="oc-stat-v">{s.v}</div>
                  <div className="oc-stat-l">
                    {s.l.split('\n').map((line, i) => (
                      <span key={i}>
                        {i > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CLOSING */}
          <section className="oc-sec oc-sec--closing">
            <div className="oc-closing">
              <span className="oc-closing-ava">
                <img
                  src={asset('images/orbit/logo.jpg')}
                  alt="Orbit's face"
                  width={72}
                  height={72}
                  loading="lazy"
                />
              </span>
              <div className="oc-closing-tx">
                <h3>Orbit — by thebbit.lab</h3>
                <p>
                  Designed and built as a complete iOS product: brand,
                  mascot, motion, and a monetization loop, shipped to the
                  App Store.
                </p>
                <span className="oc-closing-hand">
                  Some things are meant to be let go of.
                </span>
              </div>
            </div>
          </section>

          <footer className="oc-footer">
            Orbit <span aria-hidden="true">⭐</span> a design case study ·
            thebbit.lab · 2026
          </footer>
        </div>
      </div>
    </div>
  );
}
