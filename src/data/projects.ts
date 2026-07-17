export interface ProjectItem {
  id: string;
  no: string;
  title: string;
  kind: string;
  description: string;
  /** seed for the specimen illustration */
  seed: number;
  species: 'sprout' | 'grass' | 'fern' | 'flower' | 'berry';
}

/**
 * Placeholder case studies — swap in real work as it grows.
 */
export const PROJECTS: ProjectItem[] = [
  {
    id: 'wayfinding',
    no: '01',
    title: 'Campus Wayfinding',
    kind: 'Mobile · UX case study',
    description:
      'Helping new students find rooms without the panic. Research, flows, and a prototype that walks beside you.',
    seed: 20260101,
    species: 'fern',
  },
  {
    id: 'plant-care',
    no: '02',
    title: 'Plant Care Tracker',
    kind: 'Web · Product design',
    description:
      'A gentle reminder app for keeping houseplants — and habits — alive. Watering schedules that forgive.',
    seed: 20260202,
    species: 'flower',
  },
  {
    id: 'cafe',
    no: '03',
    title: 'Local Café Redesign',
    kind: 'Web · Redesign',
    description:
      'Rethinking an ordering flow to cut taps and cut queues, without losing the smell of the place.',
    seed: 20260303,
    species: 'berry',
  },
  {
    id: 'study-buddy',
    no: '04',
    title: 'Study Buddy',
    kind: 'Concept · UX exploration',
    description:
      'An accountability concept exploring focus, streaks, and nudges soft enough to be welcome.',
    seed: 20260404,
    species: 'grass',
  },
];
