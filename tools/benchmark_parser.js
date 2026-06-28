const fs = require('fs');

function parseBenchmark(filePath, outputFile = null) {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  // Remove comments (/* ... */ and // ...)
  const cleanData = rawData.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
  const data = JSON.parse(cleanData);

  const overallRankIndex = data.overall_rank;
  const overallRankName = data.ranks && data.ranks[overallRankIndex] ? data.ranks[overallRankIndex].name : "Unknown";

  let allScenarios = [];

  for (const [subCategoryName, subCategoryData] of Object.entries(data.categories)) {
    for (const [scenarioName, scenarioData] of Object.entries(subCategoryData.scenarios)) {
      // Normalize score if scaled by 100
      let score = scenarioData.score;
      const absoluteMax = scenarioData.rank_maxes[scenarioData.rank_maxes.length - 1];
      if (score > absoluteMax * 10) {
          score = score / 100;
      }

      // rank_maxes is 0-indexed corresponding to ranks 1...N
      const currentRankMax = scenarioData.scenario_rank > 0 ? scenarioData.rank_maxes[scenarioData.scenario_rank - 1] : 0;
      const nextRankMax = scenarioData.rank_maxes[scenarioData.scenario_rank] || absoluteMax;
      
      let scoreGap = nextRankMax - score;
      if (scoreGap < 0) scoreGap = 0;

      let percentToNext = 0;
      if (nextRankMax - currentRankMax > 0) {
          percentToNext = (score - currentRankMax) / (nextRankMax - currentRankMax);
      }

      allScenarios.push({
        scenarioName: scenarioName.trim(),
        subCategory: subCategoryName.trim(),
        scenarioRank: scenarioData.scenario_rank,
        score: score,
        rankDelta: overallRankIndex - scenarioData.scenario_rank,
        scoreGap: scoreGap,
        percentToNext: percentToNext
      });
    }
  }

  // Find lowest scenario rank
  let minRank = Math.min(...allScenarios.map(s => s.scenarioRank));
  
  // Weaknesses are either all scenarios strictly below overallRankIndex, 
  // or if none exist, all scenarios at the lowest rank found.
  let weaknesses = allScenarios.filter(s => s.scenarioRank < overallRankIndex);
  if (weaknesses.length === 0) {
      weaknesses = allScenarios.filter(s => s.scenarioRank === minRank);
  }

  // Sort objectively by worst performers:
  // 1. Largest rank delta
  // 2. Lowest percentToNext (furthest from the next threshold)
  weaknesses.sort((a, b) => {
    if (b.rankDelta !== a.rankDelta) {
      return b.rankDelta - a.rankDelta; 
    }
    return a.percentToNext - b.percentToNext;
  });

  // Take top 3 weakest scenarios to avoid overloading the pipeline
  weaknesses = weaknesses.slice(0, 3);

  const output = {
    playerProfile: {
      overallRankIndex: overallRankIndex,
      overallRankName: overallRankName.trim()
    },
    weaknesses: weaknesses
  };

  const jsonOut = JSON.stringify(output, null, 2);
  if (outputFile) {
    fs.writeFileSync(outputFile, jsonOut, 'utf-8');
  } else {
    console.log(jsonOut);
  }
}

const targetFile = process.argv[2];
const outputFile = process.argv[3] || null;
if (!targetFile) {
  console.error('Usage: node benchmark_parser.js <benchmark.json> [output.json]');
  process.exit(1);
}

parseBenchmark(targetFile, outputFile);
