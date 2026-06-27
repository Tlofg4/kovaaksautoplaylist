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

This JSON represents the **benchmark table** visible in the player's profile — one entry per category and scenario, including the player's score, their scenario rank, and the score thresholds for each rank tier.

Key fields to interpret:
- **`scenario_rank`** — the player's current rank on that scenario (index into `rank_maxes`; the highest index = max tier)
- **`rank_maxes`** — the score required for each rank tier on that scenario
- **`score`** — the player's current score on that scenario
- **`category_rank`** — the player's rank within that category

Use this data as the foundation for all analysis. Do not ask the player for scores manually if a JSON has been provided.

---

## Available Resources

To build the recommendation, you have access to the following local resources:

### 📁 Repository Structure

```
Weakness auto routine/
│
├── kovaaks-playlist-compendium/
│   ├── README.md                        ← Full compendium documentation
│   └── playlists_descargadas/           ← Downloaded playlist JSONs (sharecode → full contents)
│
├── Voltaic x KovaaKs - Weakness-specific aim training routines 2.0/
│   └── *.md                             ← Weakness-specific routines with sharecodes
│
├── 4rK_Benchmark_Focus_Routines_S5/
│   └── *.md                             ← Benchmark-focused routines with sharecodes
│
├── Benchmark_Daily_Improvement_Method_BDIM/
│   └── *.md                             ← Daily improvement routines with sharecodes
│
└── Voltaic Daily Improvement Method for Kovaaks S5 by Lowgravity56 & 4rk/
    └── *.md                             ← Full daily method routines with sharecodes
```

### How to use these resources

**To find candidate playlists:**
Read the `.md` files inside each routine folder. They contain curated playlists with sharecodes organized by weakness, category, and skill type.

**To inspect playlist contents:**
Look up the sharecode in `playlists_descargadas/`. Each JSON file contains the full playlist — scenario list, repetitions, and metadata — downloaded directly from the KovaaK's API.

**Reading order:**
1. Start with the `.md` routine files to identify candidates by weakness label.
2. Cross-reference the sharecode in `playlists_descargadas/` to inspect actual scenario contents.
3. Never judge a playlist by its name alone — always open the JSON to verify what scenarios it contains.

> All playlist JSONs in `playlists_descargadas/` were fetched via the KovaaK's API and reflect the real scenario composition of each playlist.

---

## Step 1 — Identify the Problem

From the JSON, extract:

- Benchmark system
- Current overall rank
- Target rank
- Scores per scenario and category

Then identify:

- **Weakest scenarios** — lowest `scenario_rank` relative to `overall_rank`
- **Scenarios preventing progression** — where the score is furthest from the next rank threshold
- **Categories causing stagnation** — categories whose `category_rank` lags behind the overall rank

> Focus on specific bottlenecks, not overall rank.

---

## Step 2 — Convert Scenarios Into Skills

For every weak scenario, determine:

### Primary Skill
Examples: Smoothness · Reactive Tracking · Precision Tracking · Dynamic Clicking · Static Clicking · Target Switching

### Secondary Skill
Examples: Reading · Stability · Micro Adjustments · Reactivity · Timing

### Mouse Control Components
Examples: Wrist Control · Fingertip Control · Arm Control · Jitter Reduction · Tension Management · Undertracking · Overtracking · Direction Change Control · Thin Tracking

Build a **weakness profile** before moving forward. Do not search for playlists yet.

---

## Step 3 — Build a Candidate Pool

Search the repository for every playlist that appears relevant based on:

- Skill categories
- Training categories
- Weakness categories
- Community recommendations
- Repository documentation

> Do not recommend anything yet. The goal is to collect candidates.

---

## Step 4 — Analyze Playlist Contents

For every candidate playlist, open the file and extract:

| Field | Description |
|---|---|
| Playlist name | Display name |
| Sharecode | Code to load in KovaaK's |
| Scenario list | All scenarios included |
| Repetitions | Reps per scenario |
| Playlist length | Total estimated duration |

> Never evaluate a playlist only by its title. The scenarios matter more than the name.

---

## Step 5 — Analyze Individual Scenarios

For every scenario inside each candidate playlist, identify:

- Main skill trained
- Secondary skill trained
- Weakness targeted
- Intended adaptation

Ask for each scenario: *Why is this here? What weakness is it solving? What benchmark skills does it develop?*

---

## Step 6 — Estimate Transfer

Compare **benchmark scenario requirements** vs **playlist scenario requirements**.

Measure overlap in:

- Movement patterns
- Reading demands
- Tracking style (reactive / precision / smooth)
- Clicking style (dynamic / static)
- Reactivity
- Smoothness
- Precision requirements
- Mouse control requirements

**Higher overlap = higher expected transfer.**

Do not use playlist popularity, reputation, or titles as evidence. Use actual scenario contents.

---

## Step 7 — Rank Playlists

### 🥇 S Tier
Highest transfer. Most likely to directly improve benchmark scores.

### 🥈 A Tier
Strong alternatives with slightly lower transfer.

### 🥉 B Tier
Useful but less direct targeting.

For every playlist include:

- **Name**
- **Sharecode**
- **Main skills trained**
- **Benchmark weaknesses addressed**
- **Strengths**
- **Weaknesses**
- **Reason for ranking**

---

## Step 8 — Find the True Bottleneck

Identify which weakness appears **repeatedly across multiple weak scenarios**.

Examples:
- Poor smoothness
- Weak reactivity
- Poor reading
- Inconsistent micro-adjustments
- Stability issues
- Wrist control limitations

> Do not treat every scenario independently. Find the root problem.

---

## Step 9 — Build the Recommendation

Answer the following:

1. **Which playlist should be played first?**
2. **Which playlist should be added second?**
3. **Which playlist has the highest transfer-per-minute?**
4. **What weakness is actually holding the player back?**
5. **What improvement should be expected** if the playlist is followed consistently?

Optimize for **efficiency**. The objective is not general aim improvement — it is solving the specific bottlenecks that limit benchmark progression.
