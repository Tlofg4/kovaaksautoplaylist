const fs = require('fs');
const path = require('path');

function extractSharecodes(text) {
    const regex = /KovaaKs[A-Za-z0-9]+/gi;
    return text.match(regex) || [];
}

function getTierFromRank(rankName) {
    const name = rankName.toLowerCase();
    // Viscose mapping logic from finder.md
    if (['lemming', 'hare', 'ermine', 'puffin'].includes(name)) return 'Entry';
    if (['penguin', 'fox', 'mammoth', 'orca', 'seal'].includes(name)) return 'Novice';
    if (['cinnabar', 'vermillion', 'saffron', 'celadon', 'viridian', 'cerulean', 'lavender', 'indigo', 'fuchsia'].includes(name)) return 'Intermediate';
    if (['wool', 'rayon', 'linen', 'velvet', 'chiffon', 'tricot', 'satin', 'silk'].includes(name)) return 'Advanced';
    if (['interloper', 'attuned', 'heroic', 'mythic', 'ascension', 'eclipse'].includes(name)) return 'Elite';
    // Fallback/VT
    return 'Intermediate';
}

function findCandidates(mapperOutputFile, outputFile = null) {
    const rawData = fs.readFileSync(mapperOutputFile, 'utf-8');
    const input = JSON.parse(rawData);
    
    // All 5 source .md files — previously only 2 were scanned
    const sources = [
        { key: 'compendium',    path: path.join(__dirname, '..', 'kovaaks-playlist-compendium', 'README.md') },
        { key: '4rK',           path: path.join(__dirname, '..', '4rK_Benchmark_Focus_Routines_S5', '4rK_Benchmark_Focus_Routines_S5.md') },
        { key: 'BDIM',          path: path.join(__dirname, '..', 'Benchmark_Daily_Improvement_Method_BDIM', 'Benchmark_Daily_Improvement_Method_BDIM.md') },
        { key: 'weakness',      path: path.join(__dirname, '..', 'Voltaic x KovaaKs - Weakness-specific aim training routines 2.0', 'Voltaic x KovaaKs - Weakness-specific aim training routines 2.0.md') },
        { key: 'voltaic_dim',   path: path.join(__dirname, '..', 'Voltaic Daily Improvement Method for Kovaaks S5 by Lowgravity56 & 4rk', 'Voltaic Daily Improvement Method for Kovaaks S5 by Lowgravity56 & 4rk.md') }
    ];

    // Build tagged lines: each entry knows which source file it came from
    const allLines = [];
    for (const src of sources) {
        if (fs.existsSync(src.path)) {
            const lines = fs.readFileSync(src.path, 'utf-8').split('\n');
            lines.forEach(line => allLines.push({ line, sourceKey: src.key }));
        }
    }
    
    const playerTier = getTierFromRank(input.playerProfile.overallRankName);
    
    const candidates = [];
    
    input.enrichedWeaknesses.forEach(w => {
        // Build a set of scenario name tokens for richer matching (not just first word)
        const scenarioTokens = w.scenarioName.toLowerCase().split(' ').filter(t => t.length > 3);
        
        // Primary Strategy: Similarity matching — line contains any meaningful token of the scenario name
        allLines.forEach(({ line, sourceKey }) => {
            const lineLower = line.toLowerCase();
            if (scenarioTokens.some(token => lineLower.includes(token))) {
                const codes = extractSharecodes(line);
                codes.forEach(c => {
                    candidates.push({
                        sharecode: c,
                        source: 'similarity_match',
                        mdSource: sourceKey,
                        associatedWeakness: w.scenarioName,
                        confidence: 'High'
                    });
                });
            }
        });
        
        // Secondary Strategy: Category/section matching
        w.mappedParentCategories.forEach(cat => {
            allLines.forEach(({ line, sourceKey }) => {
                if (line.toLowerCase().includes(cat.toLowerCase())) {
                    const codes = extractSharecodes(line);
                    codes.forEach(c => {
                        candidates.push({
                            sharecode: c,
                            source: 'category_match',
                            mdSource: sourceKey,
                            associatedWeakness: w.scenarioName,
                            confidence: 'Medium'
                        });
                    });
                }
            });
        });
    });


    // Deduplicate
    const uniqueCandidates = [];
    const seen = new Set();
    for (const c of candidates) {
        if (!seen.has(c.sharecode)) {
            seen.add(c.sharecode);
            uniqueCandidates.push(c);
        }
    }

    const jsonOut = JSON.stringify({
        playerProfile: input.playerProfile,
        tierSelected: playerTier,
        candidates: uniqueCandidates
    }, null, 2);
    if (outputFile) {
        fs.writeFileSync(outputFile, jsonOut, 'utf-8');
    } else {
        console.log(jsonOut);
    }
}

const targetFile = process.argv[2];
const outputFile = process.argv[3] || null;
if (!targetFile) {
  console.error('Usage: node playlist_candidate_finder.js <mapped_weaknesses.json> [output.json]');
  process.exit(1);
}
findCandidates(targetFile, outputFile);
