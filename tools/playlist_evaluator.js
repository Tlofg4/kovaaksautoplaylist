const fs = require('fs');
const path = require('path');

const DIRECTORIES = [
    'kovaaks-playlist-compendium'
];

function findPlaylistJsonPath(sharecode) {
    const rootDir = path.join(__dirname, '..');
    for (const dir of DIRECTORIES) {
        const pdPath = path.join(rootDir, dir, 'playlists_descargadas');
        if (fs.existsSync(pdPath)) {
            const files = fs.readdirSync(pdPath);
            const match = files.find(f => f.includes(sharecode) && f.endsWith('.json'));
            if (match) {
                return path.join(pdPath, match);
            }
        }
    }
    return null;
}

function evaluatePlaylists(candidatesFile, outputFile = null) {
    const rawData = fs.readFileSync(candidatesFile, 'utf-8');
    const input = JSON.parse(rawData);
    
    const results = [];
    
    input.candidates.forEach(candidate => {
        const jsonPath = findPlaylistJsonPath(candidate.sharecode);
        if (!jsonPath) {
            results.push({
                ...candidate,
                status: 'unverifiable',
                reason: 'JSON file not found in playlists_descargadas directories'
            });
            return;
        }
        
        try {
            const playlistData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
            
            // Level 1 Analysis: Verified facts
            const totalScenarios = playlistData.scenarioList ? playlistData.scenarioList.length : 0;
            const totalPlays = playlistData.scenarioList ? playlistData.scenarioList.reduce((acc, s) => acc + (s.playCount || 1), 0) : 0;
            
            // Improved scenarioMatch: use ALL meaningful tokens (>3 chars), not just first word
            const weaknessTokens = candidate.associatedWeakness.toLowerCase()
                .split(' ')
                .filter(t => t.length > 3);

            let matchingScenarios = [];
            
            if (playlistData.scenarioList) {
                playlistData.scenarioList.forEach(s => {
                    const sn = s.scenarioName.toLowerCase();
                    // A scenario matches if ANY weakness token appears in its name
                    if (weaknessTokens.some(token => sn.includes(token))) {
                        matchingScenarios.push(s.scenarioName);
                    }
                });
            }
            
            const scenarioMatch = matchingScenarios.length > 0;
            // weaknessCoverage: what fraction of the playlist's scenarios directly relate to the weakness
            const weaknessCoverage = totalScenarios > 0
                ? parseFloat((matchingScenarios.length / totalScenarios).toFixed(2))
                : 0;
            
            // Grade — curated sources (4rK, BDIM, weakness) are weighted higher than compendium
            const isCuratedSource = ['4rK', 'BDIM', 'weakness'].includes(candidate.mdSource);
            let tier = '🥉 B';
            if (candidate.source === 'similarity_match' && scenarioMatch) {
                tier = '🥇 S';
            } else if (candidate.source === 'similarity_match' && isCuratedSource) {
                tier = '🥈 A'; // curated source similarity match even without direct scenario name overlap
            } else if (candidate.source === 'category_match' && isCuratedSource) {
                tier = '🥈 A';
            }
            
            results.push({
                sharecode: candidate.sharecode,
                playlistName: playlistData.playlistName,
                status: 'evaluated',
                tier: tier,
                confidence: candidate.confidence,
                mdSource: candidate.mdSource || 'unknown',
                matchSignals: {
                    scenarioFamilyMatchConfirmed: scenarioMatch,
                    categoryMatchConfirmed: candidate.source === 'category_match',
                    source: candidate.source,
                    isCuratedSource: isCuratedSource
                },
                // Key LLM discrimination fields
                weaknessCoverage: weaknessCoverage,
                scenarioFamilyList: matchingScenarios,
                level1Stats: {
                    totalScenarios: totalScenarios,
                    totalReps: totalPlays,
                    overallAimType: playlistData.aimType
                },
                scenarios: playlistData.scenarioList ? playlistData.scenarioList.map(s => ({
                    name: s.scenarioName,
                    aimType: s.aimType,
                    reps: s.playCount
                })) : []
            });
        } catch(e) {
             results.push({
                ...candidate,
                status: 'error',
                reason: 'Failed to parse JSON file'
            });
        }
    });

    // Sort: S -> A -> B
    results.sort((a, b) => {
        if (a.tier === b.tier) return 0;
        if (a.tier && a.tier.includes('S')) return -1;
        if (b.tier && b.tier.includes('S')) return 1;
        if (a.tier && a.tier.includes('A')) return -1;
        if (b.tier && b.tier.includes('A')) return 1;
        return 0;
    });

    const jsonOut = JSON.stringify({
        playerProfile: input.playerProfile,
        tierSelected: input.tierSelected,
        rankedPlaylists: results
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
  console.error('Usage: node playlist_evaluator.js <candidate_finder_output.json> [output.json]');
  process.exit(1);
}
evaluatePlaylists(targetFile, outputFile);
