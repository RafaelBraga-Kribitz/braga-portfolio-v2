---
title: Complex numbers
date: '2026-04-16'
wordCount: 799
slug: complex_numbers
permalink: /notes/01_foundations/number_sets_and_logic/sets_of_numbers/complex_numbers/index.html
share_status: draft
publish_target: note
boundary: public
---
# $\mathbb{C} = \{ a + bi \mid a,b \in \mathbb{R} \}$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The **complex numbers** $\mathbb{C}$ extend $\mathbb{R}$ by introducing $i = \sqrt{-1}$, the imaginary unit. Every complex number $z = a + bi$ has a real part $a \in \mathbb{R}$ and an imaginary part $b \in \mathbb{R}$. When $b = 0$, $z$ reduces to a real number — so $\mathbb{R} \subset \mathbb{C}$. The key algebraic property is that $\mathbb{C}$ is **algebraically closed**: every polynomial with complex coefficients has all its roots in $\mathbb{C}$ (the Fundamental Theorem of Algebra). In DA/DS, complex numbers are used in: Fast Fourier Transform (FFT) for time-series seasonality detection, eigenvalue analysis of non-symmetric matrices, signal processing, and stability analysis of dynamical systems.
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["ℝ: all real numbers"] --> B["Problem: x² = -1 has no real solution"] B --> C["Introduce i where i² = -1"] C --> D["ℂ = {a + bi | a, b ∈ ℝ}"] D --> E["Real part: Re(z) = a"] D --> F["Imaginary part: Im(z) = b"] D --> G["When b=0: z = a ∈ ℝ (real number)"] D --> H["Algebraically closed: all polynomials have roots in ℂ"] H --> I["DA/DS: FFT, eigenvalues, signal processing"]
```
### Real-World use:
#### Situation it is used
FFT for detecting cyclical patterns in time series: `np.fft.fft(signal)` returns complex numbers representing amplitude and phase of each frequency component. Eigenvalue decomposition of non-symmetric matrices (covariance-like matrices of non-symmetric systems have complex eigenvalues). Stability analysis of AR models (eigenvalues of the companion matrix). Control systems modeling. Quantum computing simulation.
#### Problem it solves
$\mathbb{R}$ is not algebraically closed: $x^2 + 1 = 0$ has no real solution. Many important computations — DFT/FFT, characteristic polynomials of non-symmetric matrices, transfer functions in signal processing — produce complex-valued intermediate or final results. $\mathbb{C}$ provides the complete algebraic structure needed.
#### How it solves the problem
By defining $i^2 = -1$, every polynomial of degree $n$ has exactly $n$ roots in $\mathbb{C}$ (counting multiplicity). The complex plane (2D representation of $\mathbb{C}$) provides geometric intuition: multiplication by $e^{i\theta}$ is rotation by $\theta$. The FFT decomposes any signal into complex exponentials $e^{i\omega t}$, revealing frequency content.
#### Example of it used in the Working Context as DA/DS for a Business
Monthly sales seasonality detection: `fft_output = np.fft.fft(monthly_sales)`. The output is a complex array where `np.abs(fft_output)` gives the amplitude spectrum (which frequencies are strong) and `np.angle(fft_output)` gives the phase. The dominant non-zero frequency reveals the seasonal period (e.g., a peak at frequency $\frac{1}{12}$ confirms annual seasonality in monthly data).
### The Formula (Fragment-First)
Breaking the notation: - $\mathbb{C}$: blackboard-bold C, for "complex numbers."
- $a + bi$: the standard form. $a$ = real part, $b$ = imaginary part, $i = \sqrt{-1}$.
- $a, b \in \mathbb{R}$: both components are real numbers — complex numbers are pairs of reals.
- The set is uncountably infinite, like $\mathbb{R}$, but 2-dimensional. Arithmetic in $\mathbb{C}$:
- **Addition**: $(a + bi) + (c + di) = (a+c) + (b+d)i$
- **Multiplication**: $(a + bi)(c + di) = (ac - bd) + (ad + bc)i$ (using $i^2 = -1$)
- **Division**: $\frac{a + bi}{c + di} = \frac{(a+bi)(c-di)}{c^2 + d^2}$ (multiply by conjugate)
- **Modulus**: $|a + bi| = \sqrt{a^2 + b^2}$ (distance from origin in complex plane)
- **Conjugate**: $\overline{a + bi} = a - bi$ Python notation: `z = 3 + 4j` (`j` instead of `i` to avoid confusion with current variable name in engineering).
### Formula-to-English Translation
"$\mathbb{C}$ is the set of all numbers of the form $a + bi$ where $a$ and $b$ are real and $i$ is the square root of $-1$. Every real number is a complex number with $b = 0$. Complex numbers live on a 2D plane — real axis horizontally, imaginary axis vertically. Multiplication rotates and scales." ### Critical Concepts
1. **Python uses `j` for $i$**: `1j` is the imaginary unit in Python. `(2 + 3j) * (1 - 2j)` computes complex multiplication. Do not name a variable `j` when working with complex numbers.
2. **FFT output is complex**: `np.fft.fft(x)` always returns a complex array. You typically want `np.abs(fft_output)` (amplitude) and `np.angle(fft_output)` (phase). The real part alone is not meaningful without the imaginary part.
3. **Complex eigenvalues indicate oscillation**: if a matrix has complex eigenvalues $\lambda = a \pm bi$, the associated dynamics oscillate. If $|λ| < 1$, the oscillation decays (stable). If $|λ| > 1$, it grows (unstable). This is critical for AR model stability.
4. **numpy dtype**: `np.complex128` (two `float64` values) is the standard complex type. Memory usage is double that of `float64`.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Task: multiply $z_1 = 2 + 3i$ and $z_2 = 1 - 2i$, then find modulus. *Step 1: Multiply using FOIL*
$(2 + 3i)(1 - 2i) = 2 \cdot 1 + 2 \cdot (-2i) + 3i \cdot 1 + 3i \cdot (-2i)$ *Step 2: Expand*
$= 2 - 4i + 3i - 6i^2$ *Step 3: Substitute $i^2 = -1$*
$= 2 - 4i + 3i - 6(-1) = 2 - i + 6 = 8 - i$ *Step 4: Modulus of result*
$|8 - i| = \sqrt{8^2 + (-1)^2} = \sqrt{64 + 1} = \sqrt{65} \approx 8.062$ Python check: `(2 + 3j) * (1 - 2j)` returns `(8-1j)`. `abs(8 - 1j)` returns `8.06226...`.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
# Complex numbers ℂ = {a + bi | a, b ∈ ℝ}
# Python uses j for i # Basic complex arithmetic
z1 = 2 + 3j
z2 = 1 - 2j print("Complex number arithmetic:")
print(f" z1 = {z1}")
print(f" z2 = {z2}")
print(f" z1 + z2 = {z1 + z2}")
print(f" z1 × z2 = {z1 * z2}")
print(f" z1 / z2 = {z1 / z2:.4f}")
print(f" |z1| = {abs(z1):.4f} (modulus = √(2²+3²))")
print(f" Re(z1) = {z1.real}, Im(z1) = {z1.imag}")
print(f" conj(z1) = {z1.conjugate()}") # FFT: complex numbers in practice
import numpy as np np.random.seed(42)
n_samples = 128
sample_rate = 128 # Hz
t = np.linspace(0, 1, n_samples, endpoint=False) # Signal: 5 Hz + 12 Hz sine waves + noise
signal = (np.sin(2 * np.pi * 5 * t) + 0.5 * np.sin(2 * np.pi * 12 * t) + 0.1 * np.random.randn(n_samples)) fft_output = np.fft.fft(signal) # complex array
frequencies = np.fft.fftfreq(n_samples, d=1/sample_rate)
amplitude = np.abs(fft_output) # magnitudes (real)
phase = np.angle(fft_output) # phases (real) print(f"\nFFT output (complex array):")
print(f" dtype: {fft_output.dtype} ← complex128")
print(f" shape: {fft_output.shape}")
print(f" [0]: {fft_output[0]:.2f} ← DC component (real ≈ sum of signal)") # Find dominant frequencies
positive_freq_mask = frequencies > 0
peak_idxs = amplitude[positive_freq_mask].argsort()[-3:][::-1]
top_freqs = frequencies[positive_freq_mask][peak_idxs]
top_amps = amplitude[positive_freq_mask][peak_idxs]
print(f"\nTop-3 detected frequencies:")
for f, a in zip(top_freqs, top_amps): print(f" {f:.1f} Hz amplitude = {a:.2f}")
```
#### Beginner friendly Example [R])
``` r
# Complex numbers in R z1 <- 2 + 3i
z2 <- 1 - 2i cat("Complex arithmetic:\n")
cat(sprintf(" z1 = %s\n", as.character(z1)))
cat(sprintf(" z2 = %s\n", as.character(z2)))
cat(sprintf(" z1 + z2 = %s\n", as.character(z1 + z2)))
cat(sprintf(" z1 × z2 = %s\n", as.character(z1 * z2)))
cat(sprintf(" |z1| = %.4f\n", Mod(z1)))
cat(sprintf(" Re(z1) = %.1f, Im(z1) = %.1f\n", Re(z1), Im(z1)))
cat(sprintf(" Conj(z1)= %s\n", as.character(Conj(z1)))) # FFT in R
set.seed(42)
n_samples <- 128
t <- seq(0, 1, length.out = n_samples, by = FALSE)[1:n_samples]
signal <- sin(2 * pi * 5 * t) + 0.5 * sin(2 * pi * 12 * t) + 0.1 * rnorm(n_samples) fft_output <- fft(signal) # complex vector
amplitude <- Mod(fft_output) # magnitudes
frequencies <- (0:(n_samples - 1)) * (n_samples / n_samples) # freq indices cat("\nFFT output:\n")
cat(sprintf(" Length: %d\n", length(fft_output)))
cat(sprintf(" Class: %s\n", class(fft_output)))
cat(sprintf(" [1]: %.2f + %.2fi (DC component)\n", Re(fft_output[1]), Im(fft_output[1]))) top_3 <- order(amplitude[1:(n_samples/2)], decreasing = TRUE)[2:4] # skip DC
cat("\nTop-3 frequencies (by amplitude):\n")
for (idx in top_3) { cat(sprintf(" freq_idx=%3d amplitude=%.2f\n", idx - 1L, amplitude[idx]))
}
```
#### Final Professional Example [Python])
``` python
import numpy as np
import pandas as pd # Scenario: FFT-based seasonality detection in monthly sales data
# Complex numbers are the mathematical engine behind the FFT np.random.seed(42)
N_MONTHS = 48 # 4 years of monthly data # Simulate sales with annual (12-month) seasonality + trend + noise
months = np.arange(N_MONTHS)
trend = 1000 + 5 * months
seasonal = 200 * np.sin(2 * np.pi * months / 12) + 100 * np.sin(2 * np.pi * months / 6)
noise = np.random.normal(0, 50, N_MONTHS)
sales = trend + seasonal + noise df = pd.DataFrame({ "month": pd.date_range("2020-01-01", periods=N_MONTHS, freq="MS"), "sales": sales.round(2),
}) def detect_seasonality( signal: np.ndarray, sample_rate: float = 1.0, top_n: int = 5,
) -> pd.DataFrame: """ Detect dominant seasonal periods via FFT. Args: signal: 1D time series array. sample_rate: Observations per unit time (default 1 = monthly). top_n: Number of top frequency components to return. Returns: DataFrame with frequency, period, and amplitude columns. """ n = len(signal) detrended = signal - np.polyval(np.polyfit(np.arange(n), signal, deg=1), np.arange(n)) fft_vals = np.fft.rfft(detrended) # complex array frequencies = np.fft.rfftfreq(n, d=1 / sample_rate) amplitudes = np.abs(fft_vals) # magnitude of complex values # Exclude DC component (freq = 0) nonzero_mask = frequencies > 0 freqs_nz = frequencies[nonzero_mask] amps_nz = amplitudes[nonzero_mask] top_idx = amps_nz.argsort()[-top_n:][::-1] return pd.DataFrame({ "frequency": freqs_nz[top_idx].round(4), "period_months": (1 / freqs_nz[top_idx]).round(1), "amplitude": amps_nz[top_idx].round(2), }) seasonality_report = detect_seasonality(df["sales"].values, sample_rate=1.0) print("FFT Seasonality Detection (ℂ-based FFT)")
print("=" * 44)
print(f" Signal length: {N_MONTHS} months")
print(f" FFT output type: np.complex128 (pairs of float64)")
print()
print("Top seasonal components:")
print(seasonality_report.to_string(index=False)) print("\nKey periods to investigate:")
for _, row in seasonality_report.iterrows(): print(f" Period = {row['period_months']:.1f} months (amplitude = {row['amplitude']:.1f})")
```
#### Final Professional Example [R]
``` r
# FFT returns complex (ℂ); extract period and amplitude for seasonality set.seed(42)
N_MONTHS <- 60
t <- 0:(N_MONTHS - 1)
sales <- 10000 + 2000 * sin(2 * pi * t / 12) + 500 * sin(2 * pi * t / 3) + rnorm(N_MONTHS, 0, 100)
fft_out <- fft(sales)
amplitudes <- Mod(fft_out[1:(N_MONTHS/2)])
freqs <- (0:(N_MONTHS/2 - 1)) / N_MONTHS
periods <- 1 / freqs
seasonality_report <- data.frame( period_months = round(periods[order(-amplitudes)[1:5]], 1), amplitude = round(amplitudes[order(-amplitudes)[1:5]], 1)
)
cat("FFT output type: complex\n")
cat("Top seasonal components:\n")
print(seasonality_report)
cat("Key periods:", paste(round(seasonality_report$period_months, 1), "months"), "\n")
```
---
1300 pag 15