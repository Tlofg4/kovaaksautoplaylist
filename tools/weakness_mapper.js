const fs = require('fs');
const path = require('path');

function parseMarkdownCategories(mdPath) {
    if (!fs.existsSync(mdPath)) return [];
    const lines = fs.readFileSync(mdPath, 'utf-8').split('\n');
    let currentCategory = null;
    const categories = {};
    
    for (const line of lines) {
        // e.g. "## 🔵 Dynamic" or "### **> Static**" or "## > [Purely Tracking]"
        const catMatch = line.match(/^#{2,3}\s+(?:(?:>|\[|\*\*|>)\s*)*([A-Za-z0-9 ]+)/);
        if (catMatch && catMatch[1]) {
            let catName = catMatch[1].trim().replace(/\]|\*|:/g, '').trim();
            if (catName.toLowerCase() !== 'tier' && catName.length > 2) {
                currentCategory = catName;
                categories[currentCategory] = { scenarios: [], rawLines: [] };
            }
        } else if (currentCategory) {
            categories[currentCategory].rawLines.push(line);
            const scMatch = line.match(/\*\*(.*?)\*\*/g);
            if (scMatch) {
                scMatch.forEach(m => categories[currentCategory].scenarios.push(m.replace(/\*/g, '')));
            }
        }
    }
    return categories;
}

function mapWeaknesses(weaknessesFile, outputFile = null) {
    const rawData = fs.readFileSync(weaknessesFile, 'utf-8');
    const input = JSON.parse(rawData);
    
    const compendiumPath = path.join(__dirname, '..', 'kovaaks-playlist-compendium', 'README.md');
    const frkPath = path.join(__dirname, '..', '4rK_Benchmark_Focus_Routines_S5', '4rK_Benchmark_Focus_Routines_S5.md');
    
    const compendium = parseMarkdownCategories(compendiumPath);
    const frkRoutines = parseMarkdownCategories(frkPath);
    
    // Fallback dictionary
    const categoryMapping = {
        'Arm': ['Smoothness', 'Tracking'],
        'Wrist': ['Reactive', 'Tracking'],
        'Fingertip': ['Micro', 'Clicking'],
        'Blending': ['Smoothness'],
        'Control': ['Control', 'Smoothness', 'Tracking'],
        'Speed': ['Speed', 'TargetSwitching', 'Flicking'],
        'Reading': ['Reactive', 'Tracking'],
        'Precision': ['Precise', 'Static', 'Clicking'],
        'Stability': ['Stability', 'TargetSwitching'],
        'Micro': ['Micro', 'Static'],
        'Post-Flick': ['TargetSwitching', 'Static']
    };

    const enrichedWeaknesses = input.weaknesses.map(w => {
        let mappedCategories = categoryMapping[w.subCategory] || [w.subCategory];
        
        let compendiumMatches = [];
        let frkMatches = [];
        
        // Search compendium by mapped categories and subcategories
        for (const [catName, catData] of Object.entries(compendium)) {
            const catNameUpper = catName.toUpperCase();
            if (mappedCategories.some(mc => catNameUpper.includes(mc.toUpperCase()))) {
                compendiumMatches.push(catName);
            }
            // Fallback scenario name match
            if (catData.rawLines.join('\n').toLowerCase().includes(w.scenarioName.toLowerCase().split(' ')[0])) {
                compendiumMatches.push(catName);
            }
        }
        
        // Search 4rK by mapped categories
        for (const [catName, catData] of Object.entries(frkRoutines)) {
            const catNameUpper = catName.toUpperCase();
            if (mappedCategories.some(mc => catNameUpper.includes(mc.toUpperCase()))) {
                frkMatches.push(catName);
            }
        }
        
        return {
            ...w,
            mappedParentCategories: mappedCategories,
            compendiumSections: [...new Set(compendiumMatches)],
            frkSections: [...new Set(frkMatches)]
        };
    });

    const jsonOut = JSON.stringify({
        playerProfile: input.playerProfile,
        enrichedWeaknesses: enrichedWeaknesses
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
  console.error('Usage: node weakness_mapper.js <parsed_benchmark.json> [output.json]');
  process.exit(1);
}
mapWeaknesses(targetFile, outputFile);
