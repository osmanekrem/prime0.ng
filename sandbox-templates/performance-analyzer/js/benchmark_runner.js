const {main: originalFunction} = await import('./original_code.js');
const {main: improvedFunction} = await import('./improved_code.js');

const testSizes = [100, 1000, 5000];
const results = [];

function generateTestData(size) {
    return Array.from({length: size}, () => Math.floor(Math.random() * size));
}

for (const size of testSizes) {
    const testData = generateTestData(size);
    const startOriginal = performance.now();
    originalFunction([...testData]);
    const endOriginal = performance.now();

    const startImproved = performance.now();
    improvedFunction([...testData]);
    const endImproved = performance.now();

    results.push({size: size, original: endOriginal - startOriginal, improved: endImproved - startImproved});
}

console.log(JSON.stringify({results: results, unit: "ms"}));