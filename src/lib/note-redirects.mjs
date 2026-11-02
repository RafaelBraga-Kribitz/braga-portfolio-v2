/** Former public note slugs, retained after consolidating duplicate notes. */
export const NOTE_REDIRECTS = {
  'arithmetic-n-th-term-2': 'arithmetic-n-th-term',
  'arithmetic-hmtbcth-term': 'arithmetic-n-th-term',
  'jacobian-matrix-f': 'jacobian-matrix',
  'unemployment-rate-delta-ue': 'unemployment-rate',
};

/** Root-relative old routes and base-aware destinations for static hosting. */
export function noteRedirects(base = '/') {
  const prefix = `/${base.replace(/^\/+|\/+$/g, '')}`.replace(/\/$/, '');
  return Object.fromEntries(Object.entries(NOTE_REDIRECTS).map(([oldSlug, slug]) => [`/en/notes/${oldSlug}/`, `${prefix}/en/notes/${slug}/`]));
}
