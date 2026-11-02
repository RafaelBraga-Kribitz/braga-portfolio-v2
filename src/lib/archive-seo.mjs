// SEO-only alternatives for long library folder names. Visible headings,
// catalogue names and public slugs retain the full source labels.
export const ARCHIVE_SEO_TITLES = {
  'spatial-distance-norms-and-analytic-geometry': 'Spatial distance, norms and geometry',
  'improper-integrals-multiple-integrals-and-volumes': 'Improper and multiple integrals',
  'sufficient-statistics-and-the-fisher-neyman-theorem': 'Sufficient statistics · Fisher–Neyman',
  'analytic-geometry-shapes-perimeter-area-volume': 'Analytic geometry · shapes and measures',
  'applications-of-the-derivative-kinematics-and-extrema': 'Derivatives · motion and extrema',
  'constrained-optimisation-and-lagrange-multipliers': 'Constrained optimisation · Lagrange',
  'differential-operators-gradients-jacobians-hessians': 'Gradients, Jacobians and Hessians',
  'dimensionality-reduction-principal-component-analysis-pca': 'Principal component analysis (PCA)',
  'matrix-calculus-identities-and-automatic-differentiation': 'Matrix calculus and autodiff',
  'support-vector-machines-svm-and-classification': 'Support vector classification (SVM)',
  'linear-regression-and-maximum-likelihood-estimation-mle': 'Linear regression and MLE',
  'density-estimation-gaussian-mixture-models-gmm': 'Gaussian mixture models (GMM)',
  'eigenvalues-eigenvectors-and-the-characteristic-polynomial': 'Eigenvalues and eigenvectors',
};

/** @param {string} tag @param {string} name @param {number} page */
export function archiveSeoTitle(tag, name, page = 1) {
  const title = ARCHIVE_SEO_TITLES[tag] ?? name;
  return `${title}${page > 1 ? ` · ${page}` : ''}`;
}
