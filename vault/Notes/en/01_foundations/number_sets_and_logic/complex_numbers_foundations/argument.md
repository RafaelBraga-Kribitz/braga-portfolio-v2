---
publish: true
date: '2026-04-16'
tags:
- foundations
---

# Argument

$$
\phi = \arctan(\frac{b}{a})
$$

## Deep Breakdown

What it tells me *(Situation Awareness)*:
The **argument** (or phase angle) of a complex number $z = a + bi$ is the angle $\phi$ that the line from the origin to $z$ makes with the positive real axis. The formula $\phi = \arctan(b/a)$ gives the basic angle, but in practice you should use $\phi = \text{atan2}(b, a)$ to handle all four quadrants correctly (atan2 considers the signs of both $a$ and $b$). In DA/DS and signal processing, the argument is the phase of a frequency component: how far a sinusoidal cycle is "shifted" in time relative to a reference.

## Flowchart

```mermaid
flowchart TD
    A["Complex number z = a + bi"] --> B["Plot as point (a, b) in complex plane"]
    B --> C["Draw line from origin to point"]
    C --> D["Measure angle φ from positive real axis"]
    D --> E{["Which quadrant?"]} E -- "a>0: basic formula works" --> F["φ = arctan(b/a)"] E -- "a<0 or a=0: use atan2" --> G["φ = atan2(b, a)"]
    F --> H["φ ∈ (-π/2, π/2)"]
    G --> I["φ ∈ (-π, π] ← full range"]
```

## Real-world use

### Where it is used

Phase of FFT components: `np.angle(fft_output)` gives the phase of each frequency component in radians. Phase shift detection in signals (e.g., lag between two time series). Polar form of complex numbers: $z = r e^{i\phi}$ where $\phi = \text{arg}(z)$. Waveform reconstruction: knowing amplitude and phase allows reconstructing the original signal via inverse FFT.

### Problem it solves

After computing the FFT, each coefficient $X[k] = a + bi$ has both an amplitude $|X[k]|$ and a phase $\text{arg}(X[k])$. The phase tells you when each frequency component reaches its peak. A pure sine wave has a phase of $-\pi/2$; a pure cosine has a phase of 0. Phase differences between two time series reveal lead/lag relationships.

### How it solves the problem

$\phi = \arctan(b/a)$ converts from Cartesian $(a, b)$ to polar $(r, \phi)$ form. In polar form, $z = r(\cos\phi + i\sin\phi) = r e^{i\phi}$. The argument $\phi$ is the angle in this polar representation. Combined with the modulus $r$, the argument fully describes any complex number.

### Example in a business

Cross-correlation of two time series via FFT: multiply the FFT of series A by the conjugate of the FFT of series B, then inverse FFT. The phase of the cross-spectrum at a frequency $f$ gives the phase lag between A and B at that frequency. If the argument is $\phi = -0.5$ radians at the dominant frequency, series A lags behind B by $0.5 / (2\pi f)$ time units.

## The formula, piece by piece

Breaking the notation:

- $\phi$: the argument (phase angle). Measured in radians.
- $\arctan$: inverse tangent function. Returns values in $(-\pi/2, \pi/2)$.
- $b$: imaginary part of $z = a + bi$.
- $a$: real part.
- $b/a$: the slope of the line to $z$ in the complex plane.

The correct quadrant-aware formula:
$\phi = \text{atan2}(b, a)$ — returns angle in $(-\pi, \pi]$, handles all quadrants:
- $a > 0$: $\phi = \arctan(b/a)$
- $a < 0, b \geq 0$: $\phi = \arctan(b/a) + \pi$
- $a < 0, b < 0$: $\phi = \arctan(b/a) - \pi$
- $a = 0, b > 0$: $\phi = \pi/2$
- $a = 0, b < 0$: $\phi = -\pi/2$
- $a = 0, b = 0$: undefined (argument of zero is undefined) Key properties:
- $\text{arg}(z_1 z_2) = \text{arg}(z_1) + \text{arg}(z_2)$ (modulo $2\pi$).
- $\text{arg}(\bar{z}) = -\text{arg}(z)$.
- $\text{arg}(z^n) = n \cdot \text{arg}(z)$ (De Moivre's formula).

## The formula in words

"The argument is the angle of a complex number in polar coordinates. Imagine the complex plane as a unit circle: every complex number sits at some angle from the positive horizontal axis. Arctan gives a first approximation of that angle, but you need atan2 to correctly handle numbers in the left half-plane."

## Critical Concepts

1. **Always use atan2, not arctan**: `np.arctan(b/a)` gives the wrong answer when $a < 0$ (wrong quadrant) and crashes when $a = 0$ (division by zero). Use `np.arctan2(b, a)` or `np.angle(z)` for complex arrays.
2. **Radians vs. degrees**: `np.angle(z)` returns radians. Convert with `np.degrees(np.angle(z))`.
3. **Phase wrapping**: the argument is defined modulo $2\pi$, so $\phi$ and $\phi + 2\pi$ represent the same angle. `np.angle()` always returns the principal value in $(-\pi, \pi]$.
4. **Phase of zero**: the argument of $z = 0$ is undefined (no direction).

Always check for zero before computing argument.

## Step-by-step calculation (tiny example)

Task: find the argument of $z = -1 + i$ using both arctan and atan2.

*Step 1: Identify components*
$a = -1$, $b = 1$. Point is in the second quadrant ($a < 0, b > 0$).

*Step 2: Basic arctan (gives wrong quadrant)*
$\arctan(b/a) = \arctan(1/(-1)) = \arctan(-1) = -\pi/4 \approx -0.785$ rad.
This is in the fourth quadrant — wrong.

*Step 3: Correct with atan2*
Since $a < 0$ and $b \geq 0$: $\phi = \arctan(b/a) + \pi = -\pi/4 + \pi = 3\pi/4 \approx 2.356$ rad ($= 135°$).
This is correctly in the second quadrant.

## Code examples

### Beginner example (Python)

```python
# Argument (phase angle) of complex numbers
# Use np.angle() or np.arctan2() — NOT np.arctan()
import numpy as np

z_values = [1 + 0j, 0 + 1j, -1 + 0j, 0 - 1j, 1 + 1j, -1 + 1j, -1 - 1j, 1 - 1j]
labels = ["right", "up", "left", "down", "1st Q", "2nd Q", "3rd Q", "4th Q"]
print("Argument (phase angle) in radians and degrees:")
print(f"{'z':>10} {'label':>6} {'angle_rad':>10} {'angle_deg':>10}")
for z, label in zip(z_values, labels):
    angle_rad = np.angle(z)  # atan2-based: correct all quadrants
    angle_deg = np.degrees(angle_rad)
    print(f" {str(z):>8} {label:>6} {angle_rad:>10.4f} {angle_deg:>10.2f}°")

# Danger: arctan alone fails for left half-plane
print("\nDangerous: np.arctan(b/a) fails for a < 0:")
z = -1 + 1j
wrong = np.arctan(z.imag / z.real)   # wrong quadrant
right = np.angle(z)
print(f" z = {z}: arctan(b/a) = {wrong:.4f} rad | angle(z) = {right:.4f} rad ← correct")
```

### Beginner example (R)

```r
# Argument (phase) of complex numbers in R: Arg()
z_values <- c(1+0i, 0+1i, -1+0i, 0-1i, 1+1i, -1+1i, -1-1i, 1-1i)
labels <- c("right","up","left","down","Q1","Q2","Q3","Q4")
cat("Argument (phase) in radians and degrees:\n")
for (i in seq_along(z_values)) {
  z <- z_values[i]
  phase_rad <- Arg(z)
  phase_deg <- phase_rad * 180 / pi
  cat(sprintf(" %s (%s): %.4f rad = %.2f°\n", z, labels[i], phase_rad, phase_deg))
}
```

### Professional example (Python)

```python
import numpy as np
import pandas as pd

# Scenario: Phase analysis of FFT to detect time-series lag between two signals
np.random.seed(42)
n = 256
t = np.linspace(0, 1, n, endpoint=False)  # 1 second, 256 samples

# Signal A: 3 Hz sine wave (reference)
# Signal B: same but phase-shifted by π/4 radians (= 1/8th period lag)
freq = 3.0               # Hz
phase_shift = np.pi / 4  # true lag to detect
signal_a = np.sin(2 * np.pi * freq * t)
signal_b = np.sin(2 * np.pi * freq * t - phase_shift) + 0.1 * np.random.randn(n)

# FFT
fft_a = np.fft.rfft(signal_a)
fft_b = np.fft.rfft(signal_b)
freqs = np.fft.rfftfreq(n, d=1/n)  # Hz

# Phase of each signal at each frequency
phase_a = np.angle(fft_a)  # atan2-based, radians
phase_b = np.angle(fft_b)

# Phase difference → lag
phase_diff = phase_b - phase_a  # B lags A by this amount (radians)
# Wrap to [-π, π]
phase_diff = (phase_diff + np.pi) % (2 * np.pi) - np.pi

# Find dominant frequency bin
dominant_bin = np.argmax(np.abs(fft_a)[1:]) + 1  # exclude DC
dominant_freq = freqs[dominant_bin]
detected_lag_rad = phase_diff[dominant_bin]
detected_lag_sec = detected_lag_rad / (2 * np.pi * dominant_freq)
print("Phase-Based Lag Detection via FFT Argument")
print("=" * 46)
print(f" Dominant frequency: {dominant_freq:.1f} Hz")
print(f" True phase shift: {phase_shift:.4f} rad ({np.degrees(phase_shift):.1f}°)")
print(f" Detected phase diff: {detected_lag_rad:.4f} rad ({np.degrees(detected_lag_rad):.1f}°)")
print(f" True lag: {phase_shift / (2*np.pi*freq)*1000:.2f} ms")
print(f" Detected lag: {detected_lag_sec*1000:.2f} ms")
print()

# Summary table: phases at top 5 frequencies
df = pd.DataFrame({
    "freq_hz": freqs[:20],
    "amp_a": np.abs(fft_a[:20]).round(2),
    "phase_a_deg": np.degrees(phase_a[:20]).round(1),
    "amp_b": np.abs(fft_b[:20]).round(2),
    "phase_b_deg": np.degrees(phase_b[:20]).round(1),
    "phase_diff_deg": np.degrees(phase_diff[:20]).round(1),
}).sort_values("amp_a", ascending=False).head(5)
print("Top frequency components by amplitude:")
print(df.to_string(index=False))
```

### Professional example (R)

```r
# FFT phase (argument) comparison between two signals
set.seed(42)
t <- 0:99
a <- sin(2 * pi * 0.1 * t) + 0.5 * sin(2 * pi * 0.2 * t)
b <- sin(2 * pi * 0.1 * t + 0.5) + 0.5 * sin(2 * pi * 0.2 * t)
fft_a <- fft(a)
fft_b <- fft(b)
freqs <- (0:99) / 100
phase_a <- Arg(fft_a)
phase_b <- Arg(fft_b)
phase_diff <- Arg(fft_b / fft_a)
df <- data.frame(
  freq_hz = freqs[1:20],
  amp_a = round(Mod(fft_a[1:20]), 2),
  phase_a_deg = round(180 * phase_a[1:20] / pi, 1)
)
df <- df[order(-df$amp_a), ]
cat("Top frequency components by amplitude:\n")
print(head(df, 5))
```

---

*Source: 1300 p. 18*
