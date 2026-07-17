import { useReveal } from '../hooks/useReveal';
import { PROJECTS } from '../data/projects';
import { SpecimenCanvas } from './SpecimenCanvas';
import './projects.css';

export function Projects() {
  const head = useReveal<HTMLDivElement>();

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
          <Specimen key={p.id} project={p} />
        ))}
      </ol>
    </section>
  );
}

function Specimen({ project: p }: { project: (typeof PROJECTS)[number] }) {
  const ref = useReveal<HTMLLIElement>();
  return (
    <li className="specimen reveal" ref={ref}>
      <figure className="specimen-fig">
        <SpecimenCanvas seed={p.seed} species={p.species} />
        <figcaption className="label">
          specimen no. {p.no} — {p.species}
        </figcaption>
      </figure>
      <div className="specimen-body">
        <p className="label label--moss">{p.kind}</p>
        <h3>{p.title}</h3>
        <p className="specimen-desc">{p.description}</p>
        <p className="specimen-soon">
          <span aria-hidden="true">◌ </span>case study — still growing
        </p>
      </div>
    </li>
  );
}
