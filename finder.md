# Playlist Finder

> Find the playlist(s) with the highest transfer to a player's benchmark weaknesses.

Use this workflow whenever a player wants to know:
- What playlist to train
- What routine to run
- How to improve a specific benchmark
- Which playlist has the highest transfer
- Which playlist targets a specific weakness
- What training should be prioritized

The goal is **not** to recommend popular playlists.
The goal is to identify the playlist(s) with the **highest expected transfer** to the player's actual weaknesses.

---

## Input Format

The player will provide their benchmark data as a **JSON object** with the following structure:

```json
{
  "benchmark_progress": 389657.78,
  "overall_rank": 8,
  "categories": {
    "Arm": {
      "benchmark_progress": 30000,
      "category_rank": 9,
      "rank_maxes": [3333.33, 6666.67, 10000, ...],
      "scenarios": {
        "Smoothsphere Viscose Easier": {
          "score": 13641,
          "leaderboard_rank": 5951,
          "scenario_rank": 9,
          "rank_maxes": [5500, 6500, 8050, 9200, 10200, 11400, 12300, 13050, 13600],
          "leaderboard_id": 185342
        }
      }
    }
  },
  "ranks": [...]
}
```

Key fields to interpret:
- **`scenario_rank`** — the player's current rank on that scenario (index into `rank_maxes`; the highest index = max tier)
- **`rank_maxes`** — the score required for each rank tier on that scenario
- **`score`** — the player's current score on that scenario
- **`category_rank`** — the player's rank within that category

---

## What the repository files actually contain

Before running any step, understand exactly what each file type gives you and what it does not.

### `.md` files

Each `.md` file in the routine folders is a curated index. When you open one, you will find:
- Named training categories, each with a label stating which benchmark scenarios that category trains
- A table of sharecodes organized by tier

Read these files to find which training category corresponds to a weak benchmark scenario, and to get the sharecode for the correct tier.

### Playlist `.json` files in `playlists_descargadas/`

Each file corresponds to one playlist. When you open one, you will find these fields:

- `playlistName` — display name of the playlist
- `playlistCode` — the sharecode
- `description` — the author's stated purpose
- `aimType` — broad aim type of the playlist
- `scenarioList` — an array where each entry contains:
  - `scenarioName` — exact name of the scenario
  - `aimType` — broad aim type of the scenario
  - `playCount` — number of repetitions
  - `author` — who created the scenario

**These files do not contain individual scenario parameters.** There is no data in these files about hitbox size, movement speed, arc shape, direction change frequency, or any other mechanical detail of how a scenario behaves. That information does not exist in the repository.

---

## Step 1 — Identify the Problem

From the benchmark JSON, extract:

- Current `overall_rank`
- Every scenario name, its `score`, its `scenario_rank`, and its `rank_maxes`
- Every category's `category_rank`

Identify:
- Which scenarios have the lowest `scenario_rank` relative to `overall_rank`
- Which scenarios have the largest point gap to the next threshold in `rank_maxes`
- Which categories have a `category_rank` that lags behind `overall_rank`

List the weak scenarios by their exact names as they appear in the benchmark JSON.

---

## Step 2 — Match Weak Scenarios to Training Categories

Open the `.md` files in the repository. Each one lists training categories with an explicit statement of which benchmark scenarios that category trains.

For each weak scenario from Step 1, find which category in the `.md` files lists that scenario by name. That is the confirmed training category for that weakness.

If a weak scenario name does not appear in any category mapping in any `.md` file, mark it as unmapped and do not assign it to a category.

---

## Step 3 — Find Candidate Playlists

For each confirmed category from Step 2, look in the `.md` file for the sharecode that corresponds to the player's current rank tier. The `.md` files list their tiers explicitly — read what the file says about which tier matches which rank level.

Also check the other `.md` files in the other routine folders for playlists that list the same category or the same benchmark scenarios.

Collect only sharecodes that are explicitly listed under the relevant category. Do not add candidates from other sources.

---

## Step 4 — Open Every Candidate Playlist JSON

**This is a hard gate. You may not evaluate, compare, or rank any playlist you have not opened from `playlists_descargadas/`.**

For each candidate sharecode, find the matching `.json` file and open it. If it does not exist, remove that playlist from the pool and note it as unverifiable.

From the JSON, record exactly:

- `playlistName`
- `playlistCode`
- `description`
- Every `scenarioName` in `scenarioList`, in order
- The `aimType` of each scenario
- The `playCount` of each scenario
- The `author` of each scenario
- Total number of scenarios
- Sum of all `playCount` values

Record only what is in the file. Do not add anything that is not there.

---

## Step 5 — Analyze the Contents of Each Playlist

For every scenario in every candidate playlist, work through two clearly separated levels. Never mix them.

### Level 1 — What the file confirms

State only what the JSON fields say:
- Scenario name (from `scenarioName`)
- Broad aim type (from `aimType`)
- Repetitions (from `playCount`)
- Author (from `author`)
- Position in the playlist (first, middle, last — by its index in `scenarioList`)

### Level 2 — What can be inferred, labeled as such

After documenting the confirmed data, you may reason about what the scenario likely trains. Every inference must be labeled **[inferred]** and must state what it is based on.

Only infer from:
- The training category this playlist belongs to (confirmed in Step 2)
- The scenario name and its `aimType`

Do not infer hitbox size, movement speed, arc shape, or any mechanical parameter. If a question about a scenario cannot be answered from Level 1 data, write "not in file."

### Playlist structure

From the confirmed data, describe:
- How reps are distributed across scenarios
- Whether the playlist concentrates volume on one scenario type or spreads it
- The total rep count

---

## Step 6 — Estimate Transfer

For each candidate playlist, compare what the file confirms against the player's weak scenarios.

### Confirmed match signals

These come from the `.md` files and JSON only:
- The playlist's training category (from `.md`) matches the category of the weak benchmark scenario (from Step 2) → **category match confirmed**
- The playlist contains scenario names that include the same base name as the benchmark scenario → **scenario family match confirmed**
- The playlist `aimType` matches the broad skill type of the weak category → **aim type match confirmed**

### Inferred match signals

Only after confirmed signals are documented:
- Scenario name contains a sub-focus label (e.g., "Precision Focus", "Reactive Focus") that aligns with the specific weakness → **[inferred] sub-skill match**

### What is confirmed to be absent

State explicitly which aspects of the weakness are not addressed by any scenario in the playlist, based only on what the file contains.

**Inferred signals are weaker evidence than confirmed signals. Do not treat them equally.**

---

## Step 7 — Rank Playlists

Only playlists that completed Steps 4 and 5 may be ranked.

### 🥇 S Tier
Confirmed category match + confirmed scenario family match. Minimal inference required.

### 🥈 A Tier
Confirmed category match. Sub-skill alignment is inferred from scenario names.

### 🥉 B Tier
Category match confirmed, but scenario family match is only inferred, or training load has a clear issue visible in the rep data.

For each ranked playlist, state:
- `playlistName` and `playlistCode` — exact from file
- Every scenario with its `playCount` — exact from file
- Which confirmed match signals apply
- Which inferred match signals apply, labeled as such
- What the file confirms is not covered
- Why it received its tier, citing only file data

---

## Step 8 — Find the Root Bottleneck

From the confirmed categories in Step 2, identify which single category is the furthest below `overall_rank` and affects the most scenarios.

State: which category, which scenarios, and what the point gap is to the next threshold.

---

## Step 9 — Build the Recommendation

For each answer, cite the specific file and field that supports it. Label inferences.

1. **Which playlist to train first?**
   Cite: confirmed category match, `playlistCode`, total rep count from file.

2. **Which playlist to add second?**
   Explain what the first playlist's confirmed gaps are, and how the second playlist addresses them — from file data only.

3. **Which playlist addresses the most of the weakness with the least sessions?**
   Based on: confirmed match signals and rep count from file.

4. **What is the root weakness?**
   State: the category name from the `.md` file, the benchmark scenarios it covers, and the score gap from the benchmark JSON.

5. **What should the player observe in session if it is working?**
   Describe one concrete thing the player would notice during play — not a score improvement. Only describe what is plausible given the confirmed scenario names and aim types in the playlist.

6. **What if progress stalls?**
   Based on the confirmed categories in the pool, name which alternative playlist addresses a different aspect of the same weakness.
