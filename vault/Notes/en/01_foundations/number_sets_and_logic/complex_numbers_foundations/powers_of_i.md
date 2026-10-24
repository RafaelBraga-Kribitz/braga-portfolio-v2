---
title: Powers of $i$
date: '2026-04-16'
wordCount: 861
slug: powers_of_i
permalink: /notes/01_foundations/number_sets_and_logic/complex_numbers_foundations/powers_of_i/index.html
share_status: draft
publish_target: note
boundary: public
---
# $i^1 = i$, $i^2 = -1$, $i^3 = -i$, $i^4 = 1$, $i^{4n} = 1$, $i^{4n+1} = i$, $i^{4n+2} = -1$, $i^{4n+3} = -i$
## Deep Breakdown
What it tells me *(Situation Awareness)*:
The powers of $i$ cycle with period 4: $\{i, -1, -i, 1, i, -1, -i, 1, \ldots\}$. This is a direct consequence of Euler's formula: $i = e^{i\pi/2}$, so $i^n = e^{in\pi/2}$, which completes a full rotation ($2\pi$) every 4 steps. In DA/DS, the cyclic pattern of $i$-powers is the algebraic foundation for: simplifying complex arithmetic, understanding why the DFT has period $N$, and working with roots of unity. It is also the pattern you use every time you simplify $i^{35}$ (without a calculator).
### Flowchart (Mermaid)
``` mermaid
flowchart TD A["i^1 = i (angle 90°)"] --> B["i^2 = i×i = -1 (angle 180°)"] B --> C["i^3 = i²×i = -1×i = -i (angle 270°)"] C --> D["i^4 = i³×i = -i×i = -i²= 1 (angle 360°=0°)"] D --> E["i^5 = i^4 × i = 1×i = i (back to start)"] E --> F["Cycle of length 4: i, -1, -i, 1, i, -1, -i, 1, ..."] F --> G["i^n: find n mod 4, look up table"]
```
### Real-World use:
#### Situation it is used
Simplifying complex expressions: $i^{43} = i^{4 \times 10 + 3} = (i^4)^{10} \cdot i^3 = 1^{10} \cdot (-i) = -i$. Roots of unity: the 4th roots of unity are $1, i, -1, -i$ (the four powers of $i$). FFT butterfly: $i^k$ for $k = 0, 1, 2, 3$ are the "twiddle factors" of the length-4 DFT. Signal rotation: multiplying by $i$ rotates by 90°, multiplying by $i^2 = -1$ rotates by 180°.
#### Problem it solves
When computing large powers of $i$, the cyclic pattern gives the answer instantly: compute $n \bmod 4$ and read the table. Without the cyclic pattern, you'd need to expand all the multiplications. With it: $i^{1000} = i^{4 \times 250} = (i^4)^{250} = 1$.
#### How it solves the problem
Since $i^4 = 1$, any power $i^n = i^{n \bmod 4}$. The four values are:
- $n \bmod 4 = 0$: $i^n = 1$
- $n \bmod 4 = 1$: $i^n = i$
- $n \bmod 4 = 2$: $i^n = -1$
- $n \bmod 4 = 3$: $i^n = -i$ This is a finite cyclic group $\mathbb{Z}_4 = \{0, 1, 2, 3\}$ under modular arithmetic, and $\{1, i, -1, -i\}$ is the corresponding group of 4th roots of unity.
#### Example of it used in the Working Context as DA/DS for a Business
DFT twiddle factors for $N = 4$: the matrix is built from $W_4^{jk} = e^{-i2\pi jk/4} = e^{-i\pi jk/2} = (-i)^{jk}$. For $j, k \in \{0,1,2,3\}$, the twiddle factors are powers of $-i$, which follows the same 4-cycle. FFT algorithms rely on the fact that these twiddle factors cycle with period 4 (or $N$ generally), enabling the divide-and-conquer recursion.
### The Formula (Fragment-First)
Breaking the notation: - $i^1 = i$: $i$ to the first power is $i$.
- $i^2 = -1$: the defining property ($i^2 = -1$, definition of $i$).
- $i^3 = i^2 \cdot i = -1 \cdot i = -i$.
- $i^4 = i^3 \cdot i = (-i) \cdot i = -i^2 = -(-1) = 1$.
- $i^{4n} = (i^4)^n = 1^n = 1$.
- $i^{4n+1} = i^{4n} \cdot i = 1 \cdot i = i$.
- $i^{4n+2} = i^{4n} \cdot i^2 = 1 \cdot (-1) = -1$.
- $i^{4n+3} = i^{4n} \cdot i^3 = 1 \cdot (-i) = -i$. Compact rule: $i^n = i^{n \bmod 4}$, with the table $\{0 \to 1,\ 1 \to i,\ 2 \to -1,\ 3 \to -i\}$. Negative powers:
- $i^{-1} = 1/i = i/i^2 = i/(-1) = -i = i^3$.
- $i^{-2} = (i^2)^{-1} = (-1)^{-1} = -1 = i^2$.
- In general: $i^{-n} = i^{4-n \bmod 4}$ (just go backwards in the cycle).
### Formula-to-English Translation
"The imaginary unit cycles through four values when you raise it to successive powers: $i$, $-1$, $-i$, $1$, then back to $i$. It's like a clock with four positions. To find any power of $i$: divide the exponent by 4, look at the remainder, and look up the result in the four-entry table." ### Critical Concepts
1. **Quick computation rule**: `n % 4` gives the remainder. Map $0 \to 1$, $1 \to i$, $2 \to -1$, $3 \to -i$.
2. **4th roots of unity**: $\{1, i, -1, -i\}$ are exactly the four 4th roots of unity: each when raised to the 4th power equals 1. These form a cyclic group of order 4.
3. **Unit circle connection**: $i = e^{i\pi/2}$ sits at 90° on the unit circle. Multiplying by $i$ is a 90° counter-clockwise rotation. Four such rotations complete a full circle and return to the original point.
4. **Python**: `(1j)**n` works for integer $n$. Note that Python returns exact complex results for small integer powers of `1j`.
### Step-by-Step Manual Calculation (Tiny/Simplist Example)
Task: find $i^{43}$ and $i^{-7}$. *Step 1: $i^{43}$*
$43 \bmod 4 = 43 - 4 \times 10 = 43 - 40 = 3$.
$i^{43} = i^3 = -i$. *Step 2: Verify by factoring*
$i^{43} = i^{40} \cdot i^3 = (i^4)^{10} \cdot (-i) = 1^{10} \cdot (-i) = -i$. Confirmed. *Step 3: $i^{-7}$*
$-7 \bmod 4$: $-7 = 4 \times (-2) + 1$, so $-7 \equiv 1 \pmod 4$.
$i^{-7} = i^1 = i$.
Alternatively: $i^{-7} = i^{-8} \cdot i = (i^4)^{-2} \cdot i = 1 \cdot i = i$. Confirmed.
### Real Application Examples
#### Beginner friendly Example [Python])
``` python
# Powers of i: cycle of length 4
# i^1=i, i^2=-1, i^3=-i, i^4=1, then repeats import numpy as np # Compute and display first 12 powers of i
print("Powers of i (1j in Python):")
print(f"{'n':>4} {'i^n':>10} {'n mod 4':>8} {'formula':>8}")
for n in range(1, 13): power = (1j)**n remainder = n % 4 formula = {0: "1", 1: "i", 2: "-1", 3: "-i"}[remainder] print(f" {n:>2} {str(power):>10} {remainder:>8} {formula:>8}") # Fast rule: i^n = i^(n mod 4)
def power_of_i(n: int) -> complex: """Fast computation of i^n using cyclic property.""" lookup = {0: 1+0j, 1: 0+1j, 2: -1+0j, 3: 0-1j} return lookup[n % 4] # Test large powers
test_powers = [43, 100, -7, 1001, 0]
print("\nLarge power lookup:")
for n in test_powers: fast = power_of_i(n) direct = (1j)**n print(f" i^{n:>5} = {fast:>7} (direct: {direct:>7}) match: {abs(fast-direct)<1e-10}") # DFT 4-point twiddle factors W = e^(-i*2π/N) for N=4
N = 4
W = np.exp(-1j * 2 * np.pi / N) # = e^(-iπ/2) = -i
print(f"\n4-point DFT twiddle base: W_4 = e^(-iπ/2) = {W:.4f}")
print("Twiddle factors W_4^k:")
for k in range(N): wk = W**k print(f" W_4^{k} = {wk:.4f} = i^{(-k)%4} = {power_of_i(-k):.4f}")
```
#### Beginner friendly Example [R])
``` r
# Powers of i in R power_of_i <- function(n) { lookup <- list("0"=1+0i, "1"=0+1i, "2"=-1+0i, "3"=0-1i) key <- as.character(n %% 4) return(lookupkey)
} cat("Powers of i:\n")
for (n in 1:8) { p <- (1i)^n f <- power_of_i(n) cat(sprintf(" i^%d = %s (n%%4=%d, fast=%s)\n", n, p, n%%4, f))
} cat("\nLarge powers:\n")
for (n in c(43, 100, -7, 1001)) { fast <- power_of_i(n) cat(sprintf(" i^%d = %s\n", n, fast))
}
```
#### Final Professional Example [Python])
``` python
import numpy as np # Scenario: 4-point DFT matrix built from powers of i
# Demonstrates cyclic structure in Fourier analysis N = 4
print("4-Point DFT Matrix (DFT_4) built from powers of i")
print("=" * 50)
print(" DFT_4[j,k] = e^(-i·2π·j·k/4) = (e^(-iπ/2))^(j·k) = (-i)^(j·k)")
print() # Build DFT matrix
W_base = np.exp(-1j * 2 * np.pi / N) # = -i (base twiddle)
DFT_4 = np.array([[W_base**(j*k) for k in range(N)] for j in range(N)]) print(" DFT_4 matrix:")
for row in DFT_4: row_str = " [" + " ".join(f"{v.real:+.0f}{v.imag:+.0f}j" for v in row) + " ]" print(row_str)
print() # Verify: each entry is a power of (-i) = i^3 = i^{4n+3}
print(" Entries as powers of i (via j*k mod 4 lookup):")
lookup = {0: " 1", 1: " i", 2: "-1", 3: "-i"}
for j in range(N): row_strs = [] for k in range(N): exponent = (j * k) % N # power of W = power of (-i) # W_base = e^(-iπ/2) = -i = i^3; so W^(j*k) = (-i)^(j*k) row_strs.append(f"(-i)^{j*k}={lookup[(j*k*3)%4]}") print(f" j={j}: [{', '.join(row_strs)}]") print()
# Apply DFT to a simple signal and verify
signal = np.array([1.0, 0.0, 1.0, 0.0]) # alternating 1, 0, 1, 0
X_matrix = DFT_4 @ signal
X_fft = np.fft.fft(signal) print("DFT of [1, 0, 1, 0] via matrix vs. np.fft.fft:")
for k, (m, f) in enumerate(zip(X_matrix, X_fft)): print(f" X[{k}]: matrix={m:.3f} fft={f:.3f} match: {abs(m-f)<1e-10}")
```
#### Final Professional Example [R]
``` r
# DFT via matrix (powers of i in entries) vs fft() signal <- c(1, 0, 1, 0)
N <- 4
k <- 0:(N - 1)
n <- 0:(N - 1)
W <- outer(k, n, function(k, n) exp(-2i * pi * k * n / N))
X_matrix <- as.vector(W %*% signal)
X_fft <- fft(signal)
cat("DFT of [1,0,1,0] via matrix vs fft():\n")
for (i in seq_along(X_matrix)) { cat(sprintf(" X[%d]: matrix=%.3f fft=%.3f match: %s\n", i-1, X_matrix[i], X_fft[i], abs(X_matrix[i] - X_fft[i]) < 1e-10))
}
```
---
`` Domain knowledge.