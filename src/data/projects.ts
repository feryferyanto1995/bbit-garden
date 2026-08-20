/** A screen from the shipped build. */
export interface ProjectPlate {
  src: string;
  alt: string;
  caption: string;
}

export interface ProjectItem {
  id: string;
  no: string;
  title: string;
  kind: string;
  description: string;
  /** seed for the specimen illustration */
  seed: number;
  species: 'sprout' | 'grass' | 'fern' | 'flower' | 'berry';
  /** where the work stands; omitted means the case study is still growing */
  status?: string;
  /** a shipped project shows its own first screen instead of a drawn specimen */
  cover?: { src: string; alt: string };
  /** live App Store listing, if the work has shipped there */
  appStoreUrl?: string;
  /** screens from the build, if there is a build to show */
  plates?: ProjectPlate[];
}

/**
 * Shipped work first, then placeholder case studies — swap those in as they grow.
 */
export const PROJECTS: ProjectItem[] = [
  {
    id: 'orbit',
    no: '01',
    title: 'Orbit',
    kind: 'iOS · Product design & build',
    description:
      'A journal you cannot re-read. Seal a thought into a blind-box capsule and send it six to twenty-four months out; when it comes back you get one reading, one second look, and then it burns.',
    seed: 20260718,
    species: 'sprout',
    status: 'v1.0 — live on the App Store',
    appStoreUrl:
      'https://apps.apple.com/us/app/orbit-thought-capsule/id6792641443',
    cover: {
      src: 'images/orbit/welcome.jpg',
      alt: 'Orbit\'s welcome screen: a small astronaut with a star antenna holding a glowing capsule against a starfield, above the line "I keep what you let go of".',
    },
    plates: [
      {
        src: 'images/orbit/welcome.jpg',
        alt: 'The welcome screen: a small astronaut with a star antenna holds a glowing capsule against a starfield. "hi — I\'m Orbit. I keep what you let go of." A Begin button, and the note that everything stays on this phone.',
        caption: 'hi — I’m Orbit',
      },
      {
        src: 'images/orbit/write.jpg',
        alt: 'The writing screen: "Tell tonight\'s sky a secret", a handwritten note on cream paper, four paper colours to choose from, and orbit lengths of 6, 12, 18 and 24 months above a Send to Orbit button.',
        caption: 'tell tonight’s sky a secret',
      },
      {
        src: 'images/orbit/orbit.jpg',
        alt: 'The orbit screen: four sealed capsule cards in peach, pink, blue and lilac, each locked and counting down 183, 366, 548 and 731 days.',
        caption: 'four capsules, counting down',
      },
      {
        src: 'images/orbit/returned.jpg',
        alt: 'The same orbit screen, but the six-month capsule now glows and reads "1 paper · it came back", offering "Open it".',
        caption: 'one of them comes back',
      },
      {
        src: 'images/orbit/pile.jpg',
        alt: 'The landed screen: "It came back to you", one weightless capsule floating in the dark, with the choice to unfold it one by one or burn the whole pile into a star.',
        caption: 'landed — unfold, or burn the pile',
      },
      {
        src: 'images/orbit/read.jpg',
        alt: 'The reading screen: the handwritten note returned in full, signed "— you, yesterday", under a warning that opened notes must burn and one revisit is left.',
        caption: 'one reading, one revisit',
      },
      {
        src: 'images/orbit/burn.jpg',
        alt: 'The burn screen, dimmed to near-black behind a single tall flame, with the line "the words are becoming warmth".',
        caption: 'the words become warmth',
      },
      {
        src: 'images/orbit/star.jpg',
        alt: 'The closing screen: a soft golden star alone in the dark. "Your sky holds a new star — six months of weight, turned into light."',
        caption: 'your sky holds a new star',
      },
    ],
  },
  {
    id: 'wayfinding',
    no: '02',
    title: 'Campus Wayfinding',
    kind: 'Mobile · UX case study',
    description:
      'Helping new students find rooms without the panic. Research, flows, and a prototype that walks beside you.',
    seed: 20260101,
    species: 'fern',
  },
  {
    id: 'plant-care',
    no: '03',
    title: 'Plant Care Tracker',
    kind: 'Web · Product design',
    description:
      'A gentle reminder app for keeping houseplants — and habits — alive. Watering schedules that forgive.',
    seed: 20260202,
    species: 'flower',
  },
  {
    id: 'cafe',
    no: '04',
    title: 'Local Café Redesign',
    kind: 'Web · Redesign',
    description:
      'Rethinking an ordering flow to cut taps and cut queues, without losing the smell of the place.',
    seed: 20260303,
    species: 'berry',
  },
  {
    id: 'study-buddy',
    no: '05',
    title: 'Study Buddy',
    kind: 'Concept · UX exploration',
    description:
      'An accountability concept exploring focus, streaks, and nudges soft enough to be welcome.',
    seed: 20260404,
    species: 'grass',
  },
];
