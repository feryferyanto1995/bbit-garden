import { useReveal } from '../hooks/useReveal';
import './philosophy.css';

const NOTES = [
  {
    title: 'Atomic simplicity',
    body: 'Begin from the smallest unit of meaning. Every pixel, every line, every structural decision made with deliberate restraint.',
  },
  {
    title: 'Organic adaptation',
    body: 'Interfaces should not be rigid monoliths. They breathe, adapt, and respond to human behaviour and natural rhythm.',
  },
  {
    title: 'Slow engineering',
    body: 'No disposable trends. Things built to age gracefully, keeping their integrity and their usefulness over time.',
  },
];

export function Philosophy() {
  const head = useReveal<HTMLDivElement>();
  const notes = useReveal<HTMLOListElement>();

  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="reveal" ref={head}>
        <h2 className="section-title" id="about-title">
          In Bahasa Indonesia, <em>bibit</em> means seed.
        </h2>
        <div className="prose philosophy-prose">
          <p>
            The world moves at an unreasonable speed. Between the noise and the
            rush, starting something new is often the hardest part — it is easy
            to feel that every good idea has already been taken.
          </p>
          <p>
            <strong>bbit</strong> is a reminder of the quiet courage of
            planting: <strong>just start anyway</strong>. Every impactful
            change begins as a single small thing put in the ground, tended
            patiently, allowed to become what it wants to be.
          </p>
        </div>
      </div>

      <ol className="field-notes reveal" ref={notes} aria-label="Field notes">
        {NOTES.map((n, i) => (
          <li key={n.title} style={{ ['--reveal-delay' as string]: `${i * 90}ms` }}>
            <span className="label label--moss">note {String(i + 1).padStart(2, '0')}</span>
            <h3>{n.title}</h3>
            <p>{n.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
