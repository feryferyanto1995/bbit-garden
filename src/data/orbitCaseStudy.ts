export const RITUAL = [
  { n: '01', g: '✎', title: 'Write', body: 'A thought, on paper you choose — cream, peach, sky or lilac.' },
  { n: '02', g: '🔒', title: 'Seal', body: 'It drops into a blind-box capsule. Sends are final.' },
  { n: '03', g: '🪐', title: 'Orbit', body: 'It circles the sky for 6, 12, 18 or 24 months.' },
  { n: '04', g: '📩', title: 'It returns', body: 'Months later, it lands — a message from a past you.' },
  { n: '05', g: '👁', title: 'Read once', body: 'One look, one revisit. Nothing is archived.' },
  {
    n: '06',
    g: '⭐',
    title: 'Burn → a star',
    body: 'It turns to light. A star joins your sky for what you let go.',
    final: true,
  },
];

export const SCREENS = [
  {
    src: 'images/orbit/welcome.jpg',
    title: 'Welcome',
    body: 'Orbit greets you before the app asks anything.',
  },
  {
    src: 'images/orbit/write.jpg',
    title: 'Write',
    body: 'Handwritten paper; pick the paper and the orbit.',
  },
  {
    src: 'images/orbit/orbit.jpg',
    title: 'In orbit',
    body: 'Four capsules circling back, each on its own clock.',
  },
  {
    src: 'images/orbit/read.jpg',
    title: 'Read once',
    body: 'The returned note, framed like something precious.',
  },
  {
    src: 'images/orbit/burn.jpg',
    title: 'Burn',
    body: 'A living Skia flame — release as ceremony.',
  },
  {
    src: 'images/orbit/star.jpg',
    title: 'A star',
    body: 'The weight, turned into light in your sky.',
  },
];

export const PALETTE = [
  { name: 'Midnight sky', hex: '#0E0B22', swatch: 'linear-gradient(160deg,#0E0B22,#2E2450)' },
  { name: 'Star amber — accent', hex: '#FFC454', swatch: '#FFC454' },
  { name: 'Cream paper', hex: '#FFF6EF', swatch: '#FFF6EF' },
  { name: 'Petal pink', hex: '#FFC6D9', swatch: '#FFC6D9' },
  { name: 'Lavender', hex: '#B79CE0', swatch: '#B79CE0' },
  { name: 'Capsule papers', hex: '×3', swatch: 'linear-gradient(90deg,#FFD9C9,#C9E3F4,#D9CCF0)' },
];

export const MOTIFS = [
  { g: '⭐', title: 'The star', body: 'Antenna, accent, and the reward for letting go' },
  { g: '🎁', title: 'Blind-box capsule', body: 'A shell coloured to hint the paper inside' },
  { g: '🔥', title: 'The living flame', body: 'A hand-drawn Skia burn — destruction as feature' },
];

export const DECISIONS = [
  {
    g: '🔥',
    title: 'Destruction is the feature',
    body: 'Burned notes are permanently deleted the moment they burn — no undo, no archive. The design leans in: a warm flame, a rising star, and copy that reassures rather than warns. Letting go is the point, so it’s made to feel like a gift, not a delete.',
  },
  {
    g: '🎁',
    title: 'The blind box',
    body: 'Capsules land as sealed shells you crack open — a small moment of not-knowing before the reveal. Shell colours are quietly matched to the paper inside, so the sky itself tells you a little about what’s coming back.',
  },
  {
    g: '🔒',
    title: 'Nothing leaves the phone',
    body: 'Every note is AES-256 encrypted at rest, with the key in the device Keychain. No accounts, no cloud, no servers. The privacy stance isn’t a settings toggle — it’s the premise the whole ritual rests on.',
  },
  {
    g: '🪐',
    title: 'Time you can feel',
    body: 'Four orbits — 6, 12, 18, 24 months — each with its own countdown, glow and returning moment. The wait is part of the experience, so the UI makes distance and time visible rather than hiding them.',
  },
];

export const STATS = [
  { v: '4', l: 'orbit lengths\n6 · 12 · 18 · 24 mo' },
  { v: '1', l: 'read, then\nit’s gone' },
  { v: '0', l: 'accounts,\nservers, cloud' },
  { v: '2', l: 'typefaces\nNunito · Caveat' },
];
