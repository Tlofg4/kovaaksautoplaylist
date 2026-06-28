---
name: playlist-finder
description: >
  Find the playlist(s) with the highest transfer to a player's Voltaic benchmark
  weaknesses. Use this whenever a player asks what playlist to train, what
  routine to run, how to improve a specific benchmark scenario, or which playlist
  targets their weakness. Always trigger when benchmark JSON data is provided or
  when the player mentions weak categories like Static, Dynamic, Linear, Precise,
  Reactive, Control, Speed, Evasive, or Stability.
---

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

## Repository Map — Read This Before Any Step

The repository has **5 source folders**, each with its own `.md` index and its own `playlists_descargadas/` directory containing the actual playlist `.json` files.

| Folder | What the `.md` contains | Playlist JSON location |
|--------|------------------------|----------------------|
| `4rK_Benchmark_Focus_Routines_S5/` | Category → benchmark scenarios → sharecode table by tier (cleanest mapping) | `4rK_Benchmark_Focus_Routines_S5/playlists_descargadas/` |
| `Benchmark_Daily_Improvement_Method_BDIM/` | Day-based structure (Day 1 Static, Day 2 Dynamic, …); has a "Category Reference" table at the bottom mapping days to VT scenarios | `Benchmark_Daily_Improvement_Method_BDIM/playlists_descargadas/` |
| `Voltaic Daily Improvement Method for Kovaaks S5 by Lowgravity56 & 4rk/` | Week-day structure (Monday = Clicking I, Tuesday = Clicking II, Wednesday = Tracking I, …); sharecodes are inline in table cells per tier | `Voltaic Daily Improvement Method for Kovaaks S5 by Lowgravity56 & 4rk/playlists_descargadas/` |
| `Voltaic x KovaaKs - Weakness-specific aim training routines 2.0/` | Long guide-style doc with sections: Smoothness & Precision, Static, Speed, Reactivity, Strafe Tracking; sharecodes are inline in section headers, not in tier tables | `Voltaic x KovaaKs - Weakness-specific aim training routines 2.0/playlists_descargadas/` |
| `kovaaks-playlist-compendium/` | Community playlist list (README.md) organized by level (Beginners, Intermediate, etc.); no direct benchmark mapping — use as secondary source only | `kovaaks-playlist-compendium/playlists_descargadas/` |

**Important about formats**: These `.md` files are structurally different from each other. Do not assume they all have tier tables. Read each one as described in the table above.

### What the `.md` files give you

Each `.md` is a curated index. Open them to find:
- Which training category trains which benchmark scenarios (especially in `4rK_Benchmark_Focus_Routines_S5.md` and `BDIM.md`)
- The sharecode for the correct tier

### What the playlist `.json` files give you

Each `.json` in any `playlists_descargadas/` folder represents one playlist and contains:
- `playlistName` — display name
- `playlistCode` — the sharecode
- `description` — author's stated purpose
- `aimType` — broad aim type
- `scenarioList` — array of entries, each with:
  - `scenarioName` — exact name
  - `aimType` — broad aim type
  - `playCount` — repetitions
  - `author`

**These files do not contain individual scenario parameters.** There is no data about hitbox size, movement speed, arc shape, or direction change frequency. That information does not exist in the repository.

---

## Step 1 — Identify the Problem

From the benchmark JSON, extract:

- Current `overall_rank`
- The rank name: look up `overall_rank` as an index into the `ranks` array — the `name` field at that index is the player's rank name
- The benchmark tier: look at the scenario names across all categories. They contain a tier label in their name (e.g., "Easier", "Intermediate", "Hard"). Identify which tier label appears consistently — that is the tier this player's benchmark uses
- Every scenario name, its `score`, its `scenario_rank`, and its `rank_maxes`
- Every category's `category_rank`

**Ranking direction:** A higher `scenario_rank` or `category_rank` number means a higher rank tier — it is not a worse position. A category with `category_rank` 9 is stronger than one with `category_rank` 5. Weakness means the rank number is **lower** than `overall_rank`, not higher.

Identify:
- Which scenarios have the lowest `scenario_rank` relative to `overall_rank`
- Which scenarios have the largest point gap to the next threshold in `rank_maxes`
- Which categories have a `category_rank` that is **below** `overall_rank`

List the weak scenarios by their exact names as they appear in the benchmark JSON.

---

## Step 2 — Match Weak Scenarios to Training Categories

Open the `.md` files in the repository and use the correct reading strategy for each:

**`4rK_Benchmark_Focus_Routines_S5/4rK_Benchmark_Focus_Routines_S5.md`** — The primary source. Each heading is a training category (e.g., `## 🔵 Dynamic`) followed by a `> Scenarios:` line that lists the benchmark scenario names it trains (e.g., `Pasu + Popcorn`). Match your weak scenario names here first.

**`Benchmark_Daily_Improvement_Method_BDIM/Benchmark_Daily_Improvement_Method_BDIM.md`** — Look at the `## 🗺️ Category Reference` table at the bottom. It maps each Day to a category and lists "VT Scenario Options" — use this to confirm which day covers a given weak scenario.

**`Voltaic x KovaaKs - Weakness-specific aim training routines 2.0/Voltaic x KovaaKs - Weakness-specific aim training routines 2.0.md`** — Skim section headings (Smoothness & Precision, Static, Speed, Reactivity, Strafe Tracking). If a weak category aligns with one of these sections, note the sharecode from the section header.

**`kovaaks-playlist-compendium/README.md`** — Use as a secondary source only. It does not map to benchmark scenarios directly; treat any candidate from here as weak evidence unless the playlist JSON confirms relevance.

For each weak scenario from Step 1, find which category in the `.md` files lists that scenario by name. That is the confirmed training category for that weakness.

If a weak scenario name does not appear in any category mapping in any `.md` file, mark it as unmapped and do not assign it to a category.

---

## Step 3 — Find Candidate Playlists

### How to select the correct Tier

To select the correct tier for playlists (Entry, Novice, Intermediate, Advanced, Elite), use the player's **rank name** from Step 1, NOT the `scenario_rank` index or the benchmark's tier (e.g., "Easier"). A high `scenario_rank` (e.g. 9) in an "Easier" benchmark does **not** mean the player is Elite; it just means they maxed the easy benchmark. 

Always use this mapping based on the player's actual rank:

**If the player has Voltaic (VT) ranks:**
- **Entry**: Iron (or unranked)
- **Novice**: Bronze, Silver, Gold
- **Intermediate**: Platinum, Diamond, Jade, Master
- **Advanced**: Grandmaster, Nova, Astra, Celestial
- **Elite**: Stellaris, Lunara, Solara (Note: Nova, Astra, Celestial can also use Elite routines if they want an extra challenge)

**If the player has Viscose ranks:**
- **Entry**: Lemming, Hare, Ermine, Puffin (Easier)
- **Novice**: Penguin, Fox, Mammoth, Orca, Seal (Easier)
- **Intermediate**: Cinnabar, Vermillion, Saffron, Celadon, Viridian, Cerulean, Lavender, Indigo, Fuchsia (Medium)
- **Advanced**: Wool, Rayon, Linen, Velvet, Chiffon, Tricot, Satin, Silk (Hard)
- **Elite**: Interloper, Attuned, Heroic, Mythic, Ascension, Eclipse (Expert)

(Note: Never assume a player is "Elite" or "Advanced" just because they have a high score in an "Easier" benchmark. Use the rank mappings above).

### Primary sources (curated, strongest evidence)

For each confirmed category from Step 2, look in `4rK_Benchmark_Focus_Routines_S5.md` for the sharecode that corresponds to the player's tier using the mapping above.

Also check `BDIM.md` for the day that covers the same category — that day's sharecode is a second candidate.

Also check the other `.md` files for playlists that explicitly list the same category or the same benchmark scenarios.

Collect only sharecodes that are explicitly listed under the relevant category. Label their source.

### Secondary sources (community, weaker evidence)

If no primary-source candidates are found, or if you want to broaden the pool, check `kovaaks-playlist-compendium/README.md` for playlists that appear relevant by name or description. Mark these as community-sourced candidates and treat them as lower priority unless the playlist JSON confirms a match.

---

## Step 4 — Open Every Candidate Playlist JSON

**This is a hard gate. You may not evaluate, compare, or rank any playlist you have not opened from a `playlists_descargadas/` folder.**

For each candidate sharecode, search for the matching `.json` file across all five `playlists_descargadas/` directories:

1. `4rK_Benchmark_Focus_Routines_S5/playlists_descargadas/`
2. `Benchmark_Daily_Improvement_Method_BDIM/playlists_descargadas/`
3. `Voltaic Daily Improvement Method for Kovaaks S5 by Lowgravity56 & 4rk/playlists_descargadas/`
4. `Voltaic x KovaaKs - Weakness-specific aim training routines 2.0/playlists_descargadas/`
5. `kovaaks-playlist-compendium/playlists_descargadas/`

The filename contains the sharecode as a substring. If the file does not exist in any folder, remove that playlist from the pool and note it as unverifiable.

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
