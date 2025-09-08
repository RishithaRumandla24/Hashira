const fs = require("fs");

// Decode Y value from base and value
function decodeY(base, value) {
  return parseInt(value, base);
}

function main() {
  // Load JSON file (assume file named "testcases.json")
  const content = fs.readFileSync("testcases.json", "utf-8");
  const obj = JSON.parse(content);

  if (!obj.test_cases || !Array.isArray(obj.test_cases)) {
    console.error("Error: 'test_cases' array missing in testcases.json");
    return;
  }
  const cases = obj.test_cases;

  cases.forEach((test, i) => {
    const rootsArray = test.roots;
    const x1 = rootsArray[0];
    const x2 = rootsArray[1];

    const yObj = test.y;
    const base = yObj.base;
    const value = yObj.value.toString();
    const y = decodeY(base, value);

    const x = test.x;

    // f(x) = a(x^2 - (x1+x2)x + x1*x2)
    const denom = (x * x) - (x1 + x2) * x + (x1 * x2);

    let a = y / denom;
    let c = a * (x1 * x2);

    console.log(`Test case ${i + 1}: C = ${c}`);
  });
}

main();
