# Project reproduction execution — 2 November 2026

This extends the [1 November source review](2026-11-01-project-evidence.md) with actual execution. All five public repositories were cloned from GitHub into separate directories under `/workspace/repro-checks/`; the portfolio source and `dist/` were not used for these runs. This report is the only portfolio file written by this audit. No linked project source was fixed, committed or pushed. Generated artifacts and test environments remain in the separate audit checkouts.

This is bounded public-data/fixture verification, **not completion of TODO 11.4**. The displayed historical snapshots are not proven to originate from these current commits. No private inputs, secrets, new job-board collection, Bayesian refits, full warehouse simulation or 10,000-draw cost study were run.

## Checkout and environment provenance

All clones used `git clone --depth 1 https://github.com/RafaelBraga-Kribitz/<repository>.git <directory>`. Warehouse used `GIT_LFS_SKIP_SMUDGE=1` to avoid downloading the large raw datasets and media. Each checkout's `git rev-parse HEAD` was read before execution. These match the commits inspected on 1 November.

| Directory under `/workspace/repro-checks/` | Repository | Commit |
|---|---|---|
| `jobmarket` | austria-data-job-market-intelligence | `b76e357b46ec2a0549ffdbe50d39346c6906c25c` |
| `campaign` | decision-analytics-reconstruction | `6a5d2cef1216f43572d073e8abfab57329daff85` |
| `austrian-mmm-budget-optimizer` | austrian-mmm-budget-optimizer | `c63e16b7f0f0f5e6452216b600c4ed619a9bdf6b` |
| `energy-procurement-risk-analyzer` | energy-procurement-risk-analyzer | `e3e115c74f58745ce8ba4592d7c6b6ec89ef5d5e` |
| `warehouse_humanoid_tco` | warehouse_humanoid_tco | `e3ea9de357e249cc0977edbff2af57895f911998` |

Runtime: Linux, Python **3.12.14**, git **2.52.0**, Git LFS **3.6.1**. Each project has an isolated `.venv`. Campaign's README describes Python 3.11; its package allows `>=3.11,<3.13`, so this run used an allowed but different minor version and must not be represented as the exact README platform. A separate `tooling` environment supplied Poetry. The managed environment reported unrestricted HTTP policy enforced, no secrets or outbound identities configured. No credential values were accessed.

Installs actually completed:

```sh
# jobmarket
uv venv .venv
uv pip install --python .venv/bin/python -r requirements.txt
# campaign, Poetry executable from /workspace/repro-checks/tooling/bin
POETRY_VIRTUALENVS_IN_PROJECT=true poetry install --no-interaction
# MMM
uv sync --frozen
# energy (second command adds its declared optional dev dependencies)
uv sync --frozen
uv sync --frozen --extra dev
# warehouse: README path, resolved floors rather than a frozen lock install
uv venv .venv
uv pip install --python .venv/bin/python -e '.[dev]'
```

Job-market direct dependency pins and the MMM/energy lockfiles were retained. Campaign installed from its Poetry lockfile, including the project. Warehouse followed the README's editable dev install; its resolved environment was not a frozen-lock reproduction. Installation logs are `<directory>-install.log` or project-prefixed logs in `/workspace/repro-checks/`.

## Completed checks

### Job market: public suite, digest and Eurostat subset

Commands from `jobmarket`:

```sh
.venv/bin/python -m pytest -q -ra
.venv/bin/python src/reporting/digest.py
.venv/bin/python run_all.py all --dry-run
.venv/bin/python src/analysis/seasonality.py
```

- Public pytest completed: **496 passed, 18 skipped, 116 warnings, 30.36 seconds**. Skips were reported explicitly for absent processed private postings, private hunter/parser inputs and private/generated supply inputs. Synthetic pipeline fixtures ran as part of the public suite; a green result does not cover skipped private integrity checks.
- The digest regenerated `outputs/reports/digest.txt`, **2,288 lines**, ending `all inputs present; every section complete`. Immediately after digest generation the checkout had no tracked diff. This verifies reconstruction of the digest from the committed aggregate tables, not collection or demand aggregation from raw ads.
- Full dry-run preflight correctly failed before executing pipeline steps: missing five job-board raw directories, `data/raw/jobbarometer`, `data/raw/eures_textsearch` and `data/raw/github_supply`. Optional hunter and Stack Overflow-dependent steps were explicitly skipped. This is expected public-tree incompleteness, not a full pipeline pass.
- `seasonality.py` completed on the committed public Eurostat raw subset. Its output tables, including **`outputs/tables/S06_season_vs_cycle.csv`**, remained identical to the checkout. The only tracked diff was `outputs/seasonality.json`: its private posting-age section was replaced with `processed postings not available (public repository)`. Thus the public official-series table was regenerated; the private posting-age statistics were not.

Logs: `jobmarket-tests.log`, `jobmarket-digest.log`, `jobmarket-preflight.log`, `jobmarket-seasonality.log` in `/workspace/repro-checks/`. AMS raw JobBarometer pages were absent, so AMS end-to-end reproduction was not performed. September's 720-posting snapshot and current 699-posting aggregate must remain distinct.

### Campaign: contracts and partial Module B suite

The repository's `AGENTS.md` was read; its `make session-start` completed using the isolated Poetry tooling and produced a handout. This changed only generated governance state in the separate checkout. No findings were closed.

```sh
PATH=/workspace/repro-checks/tooling/bin:$PATH make session-start
.venv/bin/python -m pytest module_b_resource_allocation/tests \
  tests/test_contract_core.py tests/test_golden_metrics.py \
  -m 'not slow' -q --tb=short -ra
.venv/bin/python -m pytest tests/test_contract_core.py -q --tb=short -ra
```

The broad Module B command was **interrupted deliberately** to protect the concurrent portfolio verification budget: **27 passed, 1 skipped, 142,398 warnings in 103.25 seconds**, then KeyboardInterrupt. The skip required opt-in `RUN_AB_E2E=1`. The initial baseline solver-contract tests completed, but the entire selection did not. This is not a passing full Module B suite or `make test` result. The separate bounded shared-contract command completed **14 passed in 0.86 seconds**. The unusually high warning count remains visible in the log and was not suppressed or interpreted as proof of correctness.

Logs: `campaign-session.log`, `campaign-tests.log`, `campaign-contract-tests.log`. A redundant confirmation of the small contract selection is in `campaign-contract-confirm.log`. The canonical Module A → B → C pipeline, 50,000-voter model output, 54.77% headline allocation lift and leave-one-wave-out tracking results were **not regenerated**. A solver contract check does not establish that headline.

### MMM: decision-layer headline reproduced from published posterior

The first pytest and decision-layer attempts failed because ArviZ attempted to create `/home/agent/.cache/arviz` on a read-only filesystem. Redirecting only PyTensor's cache did not resolve ArviZ. Final invocations explicitly placed all relevant caches inside the writable audit directory:

```sh
XDG_CACHE_HOME=/workspace/repro-checks/cache \
MPLCONFIGDIR=/workspace/repro-checks/mpl-cache \
PYTENSOR_FLAGS=base_compiledir=/workspace/repro-checks/pytensor-cache \
  .venv/bin/python -m ambo.run layer_d \
  --out /workspace/repro-checks/mmm-layer-d
```

The decision-layer run completed in **11.8 seconds**. It read the committed Layer R posterior and regenerated a new budget-reallocation table, draw gains, decision JSON and chart without refitting PyMC. A comparison using Python `json` and `pandas` found every decision JSON field identical except the elapsed-time field; the table CSV was **byte-identical**:

```text
reallocation_table.csv SHA-256 (committed and regenerated):
a9b2c381a58f19652b663e4033cb7d505d96f9ce684c30254dcb35604b535e17
```

Reproduced same-budget decision: median gain **15.10533676473187%**, 10th-percentile gain **8.799970670407044%**, negative-gain draw share **0.0**, **500** posterior draws, Print and Search held, breakeven ROAS **2.5**. This supports the displayed rounded 15.1% / 8.8% reallocation result **conditional on the published posterior**, not a fresh posterior fit or a loss guarantee.

The writable-cache pytest command `python -m pytest -m 'not slow' -ra` was deliberately interrupted after **49 passed, 1 deselected in 80.26 seconds** while rendering charts; no full-suite pass is claimed. Slow recovery was deselected. No Layer P/R fitting, parameter-recovery, holdout or posterior diagnostics were independently regenerated. Logs: `mmm-tests.log`, `mmm-tests-cache.log`, `mmm-tests-writable-cache.log`, `mmm-layer-d.log`, `mmm-layer-d-cache.log`, `mmm-layer-d-writable-cache.log`. Successful new outputs are in `/workspace/repro-checks/mmm-layer-d/`.

### Energy: offline fixture warehouse and dbt tests

```sh
.venv/bin/python -m pytest -m 'not live' -ra
.venv/bin/python scripts/bootstrap_fixture_warehouse.py --force
UV_CACHE_DIR=/workspace/repro-checks/uv-cache \
MPLCONFIGDIR=/workspace/repro-checks/mpl-cache \
XDG_CACHE_HOME=/workspace/repro-checks/cache make transform
```

The fixture bootstrap completed for **2019-01-01 through 2026-09-30** and reported that `data/manual` was untouched. These are deliberately synthetic market inputs with fixture provenance, not independently downloaded ENTSO-E observations. `--force` was used only in this disposable fresh checkout, where no private real-data collection existed.

The first `make transform` failed because uv's default cache was read-only. With the writable cache override above it completed **64/64 operations: 1 seed, 7 table models, 8 view models and 48 data tests; PASS=64, WARN=0, ERROR=0, SKIP=0**. The exact Makefile target runs `dbt build --exclude fct_procurement_cost_monthly+`; it does not cover the excluded procurement-cost mart or full strategy engine.

The broader offline pytest run was deliberately interrupted after **48 passed, 2 skipped, 1 deselected in 106.34 seconds**. Skips were date-keyed GeoSphere raw-contract checks with no timestamp/zone columns; the live marker was deselected. No full pytest/coverage result is claimed. Logs: `energy-tests.log`, `energy-fixture.log`, `energy-dbt.log`, `energy-dbt-writable-cache.log`. No token was requested or used, no real-data monetary headline was reproduced, and `make all`, simulator, reporting, Power BI Desktop and Azure were not run.

### Warehouse: deterministic financial calculation and bounded unit tests

```sh
.venv/bin/python -m pytest --no-cov -q -ra \
  tests/test_taxonomy.py tests/test_tco.py tests/test_simulation.py tests/test_paths.py
.venv/bin/python -m pytest --no-cov -q -ra tests/test_reproducibility.py
```

These completed **42 passed in 4.80 seconds**, then **2 passed in 0.59 seconds**. `--no-cov` is explicit: this targeted selection does not claim the repository's full-suite 90% coverage gate. The seed tests check a short one-hour simulation, not the published 105-run study.

A separate direct Python calculation loaded `config/tco_assumptions.yaml` and `config/autostore_baseline.yaml`, called `build_financial_params`, `_composition_from_config` and `compute_tco_scenario` for every scenario, and supplied each **committed** `throughput_mean_orders_per_shift` from `reports/module_03_tco_report.json`. Every computed NPV and cost-per-order matched its committed row, with zero numerical delta and an asserted NPV tolerance below €0.01. Lean Human + AMR Team: **€452,706.1806407064**, **€0.3741571295016483/order**. All seven financial table rows were recalculated, not merely read back; their throughput inputs were read back. The calculation used five years and 8% as declared.

Logs: `warehouse-tests.log`, `warehouse-seed-tests.log`, `warehouse-headline-recompute.log`. Raw LFS files remain pointers (`git lfs ls-files -s` shows missing local objects, e.g. raw parquet sizes 51–104 MB each). No LFS download, Hugging Face acquisition, 2,359-episode extraction, 105-run simulation, new throughput measurements, 10,000-draw uncertainty run or 99.8% win-frequency reproduction is claimed. This financial-table check does not remove the site's independent full-reproduction limitation.

## What remains before TODO 11.4 can close

The available public paths now have concrete execution evidence. Completion still requires provenance for each displayed snapshot and, where relevant, its declared environment and a full meaningful test selection. Job-market private demand-source results cannot be reconstructed from public aggregates alone; the public subset and synthetic fixtures are the supported alternative evidence. Campaign still needs a bounded headline regeneration with the canonical handoff inputs. MMM still needs a completed non-slow suite and explicit separation of posterior-conditioned decision reproduction from model refitting. Energy still needs its real-data access or an appropriately scoped public frozen input before published monetary results can be checked. Warehouse still needs LFS data and fresh throughput/extraction before full result reproduction; the expensive Monte Carlo remains outside this bounded audit.

Interrupted suites were stopped for resource sharing, not because they had failed an assertion. They remain incomplete. Environment-specific cache failures were resolved without project source changes. No independent validation of real-world outcomes, data-source completeness, legal publication rights or owner contribution follows from these checks.
