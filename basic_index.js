const fs = require('fs');

// Read and parse JSON
const rawData = fs.readFileSync('input.json');
const input = JSON.parse(rawData);

const k = input.keys.k;
if (k !== 3) {
  console.error("This version only supports k = 3 (quadratic).");
  process.exit(1);
}

// Extract first 3 roots
const roots = [];
for (let key in input) {
  if (key === "keys") continue;
  const base = parseInt(input[key].base);
  const value = input[key].value;
  const decimal = parseInt(value, base);
  roots.push(decimal);
  if (roots.length === 3) break;
}

// Solve system: ax² + bx + c = 0 for each root
const [x1, x2, x3] = roots;

// Build matrix
const A = [
  [x1 * x1, x1, 1],
  [x2 * x2, x2, 1],
  [x3 * x3, x3, 1]
];
const B = [0, 0, 0];

// Gaussian Elimination
function solveLinear(A, B) {
  const n = A.length;
  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(A[j][i]) > Math.abs(A[maxRow][i])) maxRow = j;
    }
    [A[i], A[maxRow]] = [A[maxRow], A[i]];
    [B[i], B[maxRow]] = [B[maxRow], B[i]];

    for (let j = i + 1; j < n; j++) {
      const factor = A[j][i] / A[i][i];
      for (let k = i; k < n; k++) {
        A[j][k] -= factor * A[i][k];
      }
      B[j] -= factor * B[i];
    }
  }

  const x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = B[i];
    for (let j = i + 1; j < n; j++) {
      sum -= A[i][j] * x[j];
    }
    x[i] = sum / A[i][i];
  }
  return x;
}

const [a, b, c] = solveLinear(A, B);
console.log("✅ Constant term c:", c);