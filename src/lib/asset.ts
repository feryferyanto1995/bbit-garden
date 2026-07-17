/**
 * Prefix a public-folder path with Vite's base URL so the site works both
 * at the domain root and under a GitHub Pages project path (/bbit-garden/).
 */
export const asset = (path: string): string =>
  import.meta.env.BASE_URL + path.replace(/^\//, '');
