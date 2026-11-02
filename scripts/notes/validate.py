#!/usr/bin/env python3
"""Validate note Python syntax and reviewed numerical examples.

Run: python scripts/notes/validate.py
Syntax scanning uses the standard library. Runtime examples require NumPy.
Only explicitly marked, reviewed examples and the Jacobian note are executed.
This is not a security sandbox for untrusted Markdown.
"""
import ast
import contextlib
import io
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
FENCE = re.compile(r"^```([^\n]*)\n(.*?)^```[ \t]*$", re.M | re.S)
MARKER = "# Reference example with a numerical check."


def check_input_domains(namespace, errors, location):
    """Exercise invalid domains independently of the examples' happy-path assertions."""
    import math
    checked = 0

    def reject(description, function, *arguments):
        nonlocal checked
        checked += 1
        try:
            function(*arguments)
        except ValueError:
            return
        except Exception as error:
            errors.append(f"{location}: {description}: expected ValueError, got {type(error).__name__}")
            return
        errors.append(f"{location}: {description}: invalid input was accepted")

    if "within_cluster_sum_of_squares" in namespace:
        wcss = namespace["within_cluster_sum_of_squares"]
        for label in (0.9, -0.5, math.nan, math.inf, -1, 2, 1e30):
            reject(f"WCSS label {label!r}", wcss, [[0]], [label], [[0], [100]])
        reject("WCSS label shape", wcss, [[0]], [[0]], [[0]])
        reject("WCSS nonfinite observation", wcss, [[math.nan]], [0], [[0]])
        reject("WCSS nonfinite centroid", wcss, [[0]], [0], [[math.inf]])
        assert math.isclose(wcss([[0], [2]], [0.0, 0.0], [[1]]), 2.0)
        assert math.isclose(wcss([[0], [100]], [0, 1], [[0], [100]]), 0.0)
    if "information_gain" in namespace:
        gain = namespace["information_gain"]
        entropy = namespace["entropy"]
        reject("negative zero-total child", gain, [1, 1], [[1, -1], [0, 2]])
        for value in (math.nan, math.inf, -1):
            reject(f"invalid entropy count {value!r}", entropy, [value, 1])
            reject(f"invalid parent count {value!r}", gain, [value, 1], [[value, 1]])
            reject(f"invalid child count {value!r}", gain, [1, 1], [[value, 1], [1, 0]])
        reject("missing children at small scale", gain, [1e-15, 1e-15], [])
        reject("empty parent", gain, [], [[]])
        reject("zero-total parent", gain, [0, 0], [[0, 0]])
        reject("child class mismatch", gain, [1, 1], [[1], [0, 1]])
        reject("child counts do not partition parent", gain, [1, 1], [[1, 0]])
        assert math.isclose(gain([1, 1], [[1, 0], [0, 1], [0, 0]]), 1.0)
        assert math.isclose(gain([1, 1], [[1, 1], [0, 0]]), 0.0)
        # Finite nonnegative weights also define a distribution; tolerate roundoff.
        assert math.isclose(gain([0.3, 0.7], [[0.1, 0.2], [0.2, 0.5]]),
                            entropy([0.3, 0.7]) - 0.3 * entropy([0.1, 0.2]) - 0.7 * entropy([0.2, 0.5]))
    return checked


def validate(root=ROOT):
    errors = []
    syntax_count = runtime_count = domain_rejections = 0
    for path in sorted((root / "vault/Notes").rglob("*.md")):
        source = path.read_text()
        for match in FENCE.finditer(source):
            language, code = match.groups()
            language = language.strip().lower()
            line = source[:match.start()].count("\n") + 1
            location = f"{path.relative_to(root)}:{line}"
            if language not in ("python", "py", "python3"):
                # Do not let a broken Python example pass by relabeling its fence.
                headings = re.findall(r"^#{1,6} .*", source[:match.start()], re.M)
                heading = headings[-1] if headings else ""
                looks_python = re.search(r"^(?:from \w[\w.]* import |import \w|def \w+\(|class \w+[:(])", code, re.M)
                if language in ("", "text", "markdown") and (looks_python or "Python" in heading):
                    errors.append(f"{location}: Python example mislabeled as {language!r}")
                continue
            syntax_count += 1
            try:
                ast.parse(code, filename=location)
                if MARKER in code:
                    with contextlib.redirect_stdout(io.StringIO()):
                        namespace = {"__name__": "__main__"}
                        exec(compile(code, location, "exec"), namespace)
                        domain_rejections += check_input_domains(namespace, errors, location)
                    runtime_count += 1
            except Exception as error:
                errors.append(f"{location}: {type(error).__name__}: {error}")
        if re.search(r"^#{1,6} Structural verification", source, re.M | re.I):
            errors.append(f"{path.relative_to(root)}: authoring self-check remains")
    if runtime_count < 34:
        errors.append(f"Expected at least 34 reviewed runtime examples, found {runtime_count}")
    # Syntax cannot catch a Jacobian assignment accidentally moved outside a loop.
    try:
        import numpy as np
        path = next((root / "vault/Notes").rglob("jacobian_matrix.md"))
        namespaces = []
        for match in FENCE.finditer(path.read_text()):
            if match[1].strip() == "python":
                namespace = {"__name__": "__main__"}
                with contextlib.redirect_stdout(io.StringIO()):
                    exec(compile(match[2], str(path), "exec"), namespace)
                namespaces.append(namespace)
        beginner, professional = namespaces
        for point in ([2., 1.], [-1.5, 0.3], [0., 0.]):
            x = np.array(point)
            # Independent analytic reference for f=[x1*x2, x1^2, x1+3*x2].
            expected = np.array([[x[1], x[0]], [2*x[0], 0], [1, 3]])
            actual = beginner["numerical_jacobian"](beginner["f"], x)
            np.testing.assert_allclose(actual, expected, rtol=1e-7, atol=1e-7)
        for logits in ([0., 0., 0.], [1., -2., .5], [20., 19., 18.]):
            z = np.array(logits)
            p = professional["softmax"](z)
            expected = np.diag(p) - np.outer(p, p)
            actual = professional["numerical_jacobian_softmax"](z)
            np.testing.assert_allclose(actual, expected, rtol=1e-6, atol=1e-8)
    except Exception as error:
        errors.append(f"Jacobian numerical reference: {type(error).__name__}: {error}")
    print(f"Python syntax: {syntax_count} blocks; repaired examples executed: {runtime_count}; Jacobian reference points: 6; domain rejection cases: {domain_rejections}")
    for error in errors:
        print(error, file=sys.stderr)
    if errors:
        print(f"FAILED: {len(errors)} errors", file=sys.stderr)
        return 1
    print("PASS (syntax and selected numerical examples; not a full mathematical audit)")
    return 0


if __name__ == "__main__":
    sys.exit(validate())
