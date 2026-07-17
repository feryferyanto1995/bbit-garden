import { asset } from '../lib/asset';

export interface Photo {
  src: string;
  alt: string;
  caption: string;
  /** effective display aspect (w/h) after EXIF rotation */
  w: number;
  h: number;
}

export const IG_URL = 'https://www.instagram.com/blancc.canvas';

export const PHOTOS: Photo[] = [
  {
    src: asset('/images/photo-7.jpg'),
    alt: 'The Great Buddha of Kamakura in bronze, seated in meditation against a clear sky and green hills.',
    caption: 'the patience of bronze — Kamakura',
    w: 1600,
    h: 1060,
  },
  {
    src: asset('/images/photo-2.jpg'),
    alt: 'Two white geese in front of the lakeside temple Pura Ulun Danu Batur, mountains behind.',
    caption: 'temple keepers — Lake Batur, Bali',
    w: 1066,
    h: 1600,
  },
  {
    src: asset('/images/photo-5.jpg'),
    alt: 'A bed of orange marigolds under a dark tree canopy, a cloud-capped mountain in the distance.',
    caption: 'marigolds waiting for Fuji',
    w: 1600,
    h: 1060,
  },
  {
    src: asset('/images/photo-6.jpg'),
    alt: 'A shopping street in Fujiyoshida strung with lanterns and wires, Mount Fuji filling the sky at its end.',
    caption: 'Honchō 2, and the mountain — Fujiyoshida',
    w: 1060,
    h: 1600,
  },
  {
    src: asset('/images/photo-1.jpg'),
    alt: 'A wild stag standing on a golden mountainside at dusk, close enough to touch.',
    caption: 'an unexpected companion on the ridge',
    w: 1066,
    h: 1600,
  },
  {
    src: asset('/images/photo-3.jpg'),
    alt: 'Three friends sitting on the Trocadéro steps facing the Eiffel Tower in morning haze.',
    caption: 'front-row seats — Paris',
    w: 1128,
    h: 1600,
  },
  {
    src: asset('/images/photo-4.jpg'),
    alt: 'Taipei 101 rising out of the city in warm evening haze.',
    caption: 'a pagoda for the 21st century — Taipei',
    w: 1060,
    h: 1600,
  },
];
