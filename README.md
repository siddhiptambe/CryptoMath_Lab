# Extended Euclidean Algorithm — Virtual Lab Module

## Integration information
- **Experiment Name:** Extended Euclidean Algorithm for finding GCD and Modular Multiplicative Inverse
- **Suggested Experiment ID:** EXP-EEA
- **Suggested Folder:** `/experiments/EEA/`
- **Entry File:** `index.html`
- **Navigation Title:** Extended Euclidean Algorithm
- **Short Description:** Interactive implementation of the Extended Euclidean Algorithm to find gcd(a,b), Bézout coefficients, and the modular multiplicative inverse when it exists.
- **Required Libraries:** None
- **Input:** Two positive integers `a` and `b` (for inverse, calculate `a⁻¹ mod b`)
- **Output:** Euclidean division trace, GCD, Bézout coefficients `x,y`, multiplicative inverse if `gcd(a,b)=1`, and verification.
- **Expected Navigation Link:** `/experiments/EEA/`

## Files
- `index.html` — self-contained experiment content and UI.
- `style.css` — module styling.
- `script.js` — Extended Euclidean Algorithm, simulation controls and quiz.
- `README.md` — integration, test cases and evaluation questions.

## Functional behavior
1. Validate that both inputs are positive integers.
2. Execute EEA using the Forouzan & Mukhopadhyay formulation ($r_i = r_{i-2} \bmod r_{i-1}$, $x_i = x_{i-2} - q_i x_{i-1}$, $y_i = y_{i-2} - q_i y_{i-1}$).
3. Display the 4-column trace table matching Forouzan & Mukhopadhyay (`Calculate (r,q)` | `Which satisfies` | `Calculate (x,y)` | `Which satisfies`).
4. Allow gradual reveal using Previous / Next / Show All.
5. Display GCD and Bézout coefficients.
6. If `gcd(a,b)=1`, compute `x mod b` as the multiplicative inverse.
7. If `gcd(a,b) != 1`, explicitly report that the inverse does not exist.
8. Verify the Bézout identity and multiplicative inverse.
9. Provide a 5-question assessment.

## Test cases

| # | a | b | Expected GCD | Expected inverse | Notes |
|---|---:|---:|---:|---:|---|
| 1 | 17 | 43 | 1 | 38 | 17×38 = 646 ≡ 1 mod 43 |
| 2 | 7 | 26 | 1 | 15 | 7×15 = 105 ≡ 1 mod 26 |
| 3 | 12 | 18 | 6 | Does not exist | gcd != 1 |
| 4 | 25 | 10 | 5 | Does not exist | gcd != 1 |
| 5 | 3 | 11 | 1 | 4 | 3×4 = 12 ≡ 1 mod 11 |
| 6 | 43 | 17 | 1 | 2 | 43×2 = 86 ≡ 1 mod 17 (Reversed input test) |

## Evaluation / viva questions
1. What is the difference between the Euclidean and Extended Euclidean Algorithm?
2. What are Bézout coefficients?
3. Why does the multiplicative inverse exist only when `gcd(a,m)=1`?
4. How is the inverse obtained from the coefficient of `a`?
5. What does the quotient `q` represent in each division step?
6. Why is the last non-zero remainder the GCD?
7. What happens when the inputs are not coprime?
8. How can the result be verified?
9. Why is a multiplicative inverse useful in cryptography?
10. What changes when the two input numbers are swapped?

## Submission checklist
- Verify all displayed values against hand calculations.
- Test both invertible and non-invertible pairs.
- Test `a < b` and `a > b`.
- Test the Previous / Next / Show All controls.
- Test invalid, blank, zero and decimal input.
- Test the quiz.
- Keep this module independent; do not modify the integration team's main application.
- Submit the complete module through the assigned Git branch / pull request.

## Git suggestion
Create or use the group branch assigned by the integration team. Keep changes limited to the EEA experiment folder unless the integration team explicitly requests a shared change.
