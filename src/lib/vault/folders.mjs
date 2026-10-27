// src/lib/vault/folders.mjs — the notes library's folders as tags (owner,
// 26 Oct 2026, Ghost style). vault/Notes/<lang>/<area>/<topic>/<subtopic>/
// stays the owner's filing system in Obsidian; on the site every folder a
// note sits in is a tag of that note (its archive page /<lang>/tags/<tag>/
// lists it), next to the tags it carries itself. Folder names read as
// titles through folderTitle(); the tag is the title, kebab-cased, except
// an area's, which is the short tag the notes already carried
// ("04_calculus_optimization" → calculus). Shared by the vault reader
// (meta.mjs: the tags of a note) and the pages (the tag's display name).
import { slugify } from './meta.mjs';

/** An area's tag: the short one its notes were tagged with on import. */
export const AREA_TAGS = {
  foundations: 'foundations',
  algebra_precalc: 'algebra',
  linear_algebra_geometry: 'linear-algebra',
  calculus_optimization: 'calculus',
  probability_stats: 'probability-statistics',
  ml_math: 'machine-learning',
  econ_business: 'economics-business',
};

/** Area titles: the folder's number is the code, the rest is too terse to show. */
export const AREA_TITLES = {
  foundations: 'Foundations',
  algebra_precalc: 'Algebra and precalculus',
  linear_algebra_geometry: 'Linear algebra and geometry',
  calculus_optimization: 'Calculus and optimisation',
  probability_stats: 'Probability and statistics',
  ml_math: 'Machine learning',
  econ_business: 'Economics and business',
};

/** Words a folder name spells in lower case that read in capitals. */
const UPPER = new Set(['3d', 'blr', 'cdf', 'crvs', 'da', 'drvs', 'ds', 'em', 'gdp', 'gmm', 'gmms', 'ml', 'mle', 'odes', 'pca', 'ppca', 'qr', 'saas', 'svd', 'svm', 'tda']);
const SPECIAL = {
  convergence_tests_for_infinite_series_sum_n_1_infty_a_n: 'Convergence tests for infinite series',
  sufficient_statistics_and_the_fisher_neyman_theorem: 'Sufficient statistics and the Fisher–Neyman theorem',
  total_probability_and_bayes_theorem: 'Total probability and Bayes’ theorem',
  inner_products_and_gram_schmidt_process: 'Inner products and the Gram–Schmidt process',
  graph_foundations_and_the_laplace_matrix: 'Graph foundations and the Laplace matrix',
  decompositions_svd_cholesky_qr: 'Decompositions: SVD, Cholesky, QR',
  taylor_and_maclaurin_series: 'Taylor and Maclaurin series',
  powers_roots_and_inequalities: 'Powers, roots and inequalities',
  spatial_distance_norms_and_analytic_geometry: 'Spatial distance, norms and analytic geometry',
  analytic_geometry_shapes_perimeter_area_volume: 'Analytic geometry: shapes, perimeter, area, volume',
  eigenvalues_eigenvectors_and_characteristic_polynomial: 'Eigenvalues, eigenvectors and the characteristic polynomial',
  markov_processes_in_networks: 'Markov processes in networks',
  differential_operators_gradients_jacobians_hessians: 'Differential operators: gradients, Jacobians, Hessians',
  constrained_optimization_and_lagrange_multipliers: 'Constrained optimisation and Lagrange multipliers',
  advanced_optimizers_stochastic_and_adaptive: 'Advanced optimisers: stochastic and adaptive',
  applications_of_derivative_kinematics_and_extrema: 'Applications of the derivative: kinematics and extrema',
  bias_variance_and_generalization: 'Bias, variance and generalisation',
  density_estimation_gaussian_mixture_models_gmm: 'Density estimation: Gaussian mixture models (GMM)',
  dimensionality_reduction_principal_component_analysis_pca: 'Dimensionality reduction: principal component analysis (PCA)',
  expectation_maximization_em_algorithm_for_gmms: 'Expectation–maximisation (EM) for GMMs',
  improper_integrals_multiple_integrals_and_volumes: 'Improper integrals, multiple integrals and volumes',
  inferential_statistics_hypothesis_testing: 'Inferential statistics: hypothesis testing',
  network_analysis_graph_theory: 'Network analysis: graph theory',
  odes_and_transforms: 'ODEs and transforms',
  rotations_3d: '3D rotations',
  support_vector_machines_svm_and_classification: 'Support vector machines (SVM) and classification',
  tree_based_models_and_ensembles: 'Tree-based models and ensembles',
  unit_economics_and_saas_metrics: 'Unit economics and SaaS metrics',
  model_selection_and_cross_validation: 'Model selection and cross-validation',
  empirical_risk_and_minimization: 'Empirical risk and its minimisation',
  operational_math: 'Operational maths',
  math_symbols: 'Maths symbols',
};

/** "discrete_random_variables_drvs" → "Discrete random variables (DRVs)". */
export function folderTitle(folder) {
  const bare = folder.replace(/^\d+_/, '');
  if (AREA_TITLES[bare] && /^\d+_/.test(folder)) return AREA_TITLES[bare];
  if (SPECIAL[bare]) return SPECIAL[bare];
  const words = bare.split('_');
  const last = words[words.length - 1];
  // a closing acronym repeats the phrase before it: "… analysis pca" → "… analysis (PCA)"
  const tail = UPPER.has(last) && words.length > 2 ? words.pop() : undefined;
  const text = words
    .map((w, i) => (UPPER.has(w) ? w.toUpperCase() : i === 0 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ')
    .replace(/optimization/g, 'optimisation');
  const acr = tail ? tail.toUpperCase().replace(/S$/, 's') : '';
  return tail ? `${text} (${acr})` : text;
}

/** The tag a folder gives its notes. */
export function folderTag(folder) {
  const bare = String(folder).replace(/^\d+_/, '');
  return /^\d+_/.test(folder) && AREA_TAGS[bare] ? AREA_TAGS[bare] : slugify(folderTitle(folder));
}

/** The folders' tags for a vault path under Notes/<lang>/ (area first), else []. */
export function folderTags(rel) {
  const parts = String(rel).split('/');
  if (parts[0] !== 'Notes' || parts.length < 4) return [];
  return parts.slice(2, -1).map(folderTag);
}

/** Display names of the folder tags of a set of vault paths: tag → title. */
export function folderTagNames(rels) {
  const names = new Map();
  for (const rel of rels) {
    const parts = String(rel).split('/');
    if (parts[0] !== 'Notes') continue;
    for (const f of parts.slice(2, -1)) names.set(folderTag(f), folderTitle(f));
  }
  return names;
}
