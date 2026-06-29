const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function runPipeline(benchmarkPath) {
    const absPath = path.resolve(benchmarkPath);
    if (!fs.existsSync(absPath)) {
        console.error(`ERROR: Benchmark file not found: ${absPath}`);
        process.exit(1);
    }

    console.log(`\nStarting Playlist Finder Pipeline for: ${absPath}\n`);

    const toolsDir = __dirname;
    const tempDir = path.join(toolsDir, '..', '.temp_pipeline');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    // All steps communicate via files — never via stdout pipes.
    // This means there is no stdout buffer that can silently truncate large datasets.
    const step1Out = path.join(tempDir, 'step1_parsed.json');
    const step2Out = path.join(tempDir, 'step2_mapped.json');
    const step3Out = path.join(tempDir, 'step3_candidates.json');
    const step4Out = path.join(tempDir, 'final_ranked.json');

    // 50MB guard — exists only as a safety net; normal outputs are much smaller.
    const EXEC_OPTS = { maxBuffer: 50 * 1024 * 1024 };

    function runStep(label, script, inputFile, outputFile) {
        console.log(`${label}...`);
        const cmd = `node "${script}" "${inputFile}" "${outputFile}"`;
        try {
            execSync(cmd, EXEC_OPTS);
        } catch (e) {
            const stderr = e.stderr ? e.stderr.toString().trim() : '';
            const stdout = e.stdout ? e.stdout.toString().trim() : '';
            console.error(`\nFATAL: ${label} failed.`);
            if (stderr) console.error('STDERR:', stderr);
            if (stdout) console.error('STDOUT (partial):', stdout.slice(0, 500));
            process.exit(1);
        }

        // Verify the output file was actually written and is valid JSON.
        if (!fs.existsSync(outputFile)) {
            console.error(`\nFATAL: ${label} did not produce an output file.`);
            process.exit(1);
        }
        try {
            JSON.parse(fs.readFileSync(outputFile, 'utf-8'));
        } catch (_) {
            console.error(`\nFATAL: ${label} output is not valid JSON. File may be truncated: ${outputFile}`);
            process.exit(1);
        }
    }

    runStep('1. Parsing Benchmark',         path.join(toolsDir, 'benchmark_parser.js'),          absPath,  step1Out);
    runStep('2. Mapping Weaknesses',         path.join(toolsDir, 'weakness_mapper.js'),           step1Out, step2Out);
    runStep('3. Finding Candidate Playlists',path.join(toolsDir, 'playlist_candidate_finder.js'), step2Out, step3Out);
    runStep('4. Evaluating Playlists',       path.join(toolsDir, 'playlist_evaluator.js'),        step3Out, step4Out);

    // --- Print a clean summary from the verified file --- 
    const finalJson = JSON.parse(fs.readFileSync(step4Out, 'utf-8'));
    const evaluated   = (finalJson.rankedPlaylists || []).filter(p => p.status === 'evaluated');
    const unverifiable = (finalJson.rankedPlaylists || []).filter(p => p.status === 'unverifiable');

    console.log('\n====== PIPELINE COMPLETE ======\n');
    console.log(`Full results written to: ${step4Out}`);
    console.log(`  Player rank    : ${finalJson.playerProfile?.overallRankName} (index ${finalJson.playerProfile?.overallRankIndex})`);
    console.log(`  Tier selected  : ${finalJson.tierSelected}`);
    console.log(`  Evaluated      : ${evaluated.length} playlists`);
    console.log(`  Unverifiable   : ${unverifiable.length} (not downloaded locally)`);

    if (evaluated.length === 0) {
        console.log('\nNo evaluatable playlists found. Run descargar_todo.js to download more playlists.');
        return;
    }

    console.log('\n--- Top Results (S-tier first) ---');
    evaluated.slice(0, 15).forEach((p, i) => {
        const reps = p.level1Stats?.totalReps ?? '?';
        const scenarios = p.level1Stats?.totalScenarios ?? '?';
        console.log(`  ${i + 1}. ${p.tier}  "${p.playlistName}"  [${p.sharecode}]`);
        console.log(`       ${scenarios} scenarios, ${reps} total reps | ${p.level1Stats?.overallAimType ?? 'Unknown'}`);
    });
    console.log(`\nTo see all ${evaluated.length} results: ${step4Out}`);
}

const targetFile = process.argv[2];
if (!targetFile) {
    console.error('Usage: node run_pipeline.js <benchmark.json>');
    process.exit(1);
}
runPipeline(targetFile);
