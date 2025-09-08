const fs = require("fs");

// Decode a string number in given base into BigInt
function decodeBigInt(value, base) {
  let result = 0n;
  const bigBase = BigInt(base);

  for (const ch of value) {
    const digit = parseInt(ch, base);
    if (isNaN(digit)) {
      throw new Error(`Invalid digit '${ch}' for base ${base}`);
    }
    result = result * bigBase + BigInt(digit);
  }
  return result;
}

// Lagrange interpolation at x = 0 to recover the secret
function lagrangeInterpolation(shares, k) {
  let secret = 0n;

  for (let i = 0; i < k; i++) {
    const [xi, yi] = shares[i];
    let num = 1n;
    let den = 1n;

    for (let j = 0; j < k; j++) {
      if (i === j) continue;
      const [xj] = shares[j];
      num *= -xj;
      den *= xi - xj;
    }

    const term = yi * num / den; // division is exact in SSS
    secret += term;
  }

  return secret;
}

function main() {
  const content = fs.readFileSync("input.json", "utf-8");
  const data = JSON.parse(content);

  const n = data.keys.n;
  const k = data.keys.k;

  // Collect all shares (i, value)
  const shares = [];
  for (let i = 1; i <= n; i++) {
    const base = parseInt(data[i.toString()].base);
    const value = data[i.toString()].value;
    const yi = decodeBigInt(value, base);
    shares.push([BigInt(i), yi]);
  }

  // Use first k shares
  const chosenShares = shares.slice(0, k);

  const secret = lagrangeInterpolation(chosenShares, k);
  console.log("✅ Reconstructed secret (constant term):", secret.toString());
}

main();