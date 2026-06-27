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

## 🔍 Scenario Name Parsing Reference

Scenario names in KovaaK's follow a **compositional convention**: `[Base Name] + [Modifiers] + [Community Tag]`. Each component encodes specific training intent. Use this reference during Steps 2, 5, and 6 to decode scenario names into skills, weakness targets, and transfer potential — without needing to open the JSON first.

---

### Base Scenario Dictionary

The base name defines the **movement pattern and primary skill family**.

| Base Name | Primary Skill | Secondary Skill | Movement Pattern |
|---|---|---|---|
| **Pasu** | Dynamic Clicking | Timing · Reactivity | Bouncing spherical targets |
| **Popcorn** | Dynamic Clicking | Vertical Flicking · Reading | Parabolic arcs (vertical + horizontal) |
| **Air / Air NUNS** | Smooth Tracking | Reading · Verticality · Depth perception | 3D aerial movement |
| **1w4t / 1W4TS** | Static Clicking | Precision · Micro-corrections | Stationary targets on a front wall |
| **B180 / Bounce 180** | Dynamic Clicking / Tracking | Smoothness · Direction change | Bouncing 180° arc patterns |
| **FloatingHeads** | Smooth / Precise Tracking | Centering · Stability | Smooth floating silhouettes (head-shaped) |
| **Smoothbot** | Smooth Tracking | Mouse Control · Wrist/arm isolation | Smooth, curved paths |
| **Ground Plaza** | Precise / Smooth Tracking | Reading · Mouse Control | Ground-level curves and sweeps |
| **WW / Wide Wall** | Static Clicking | Wide flicks · Arm aiming | Stationary targets on a wide horizontal wall |
| **Long Strafes** | Smooth Tracking | Smoothness · Stability · Speed matching | Long lateral lines before direction change |
| **Frogtagon** | Dynamic Clicking | Reading · Reactivity | Complex 3D movement (introduced S5) |
| **PsalmTS** | Target Switching | Transition speed · Reactivity | Multi-target evasive switching |
| **evaTS** | Evasive Target Switching | Reading · Reactivity · Anticipation | Fast erratic evasive multi-target |
| **Thin Strafes** | Precise Tracking | Precision · Clean mouse paths | Lateral movement with extremely thin hitbox |
| **Reactive Strafes** | Reactive Tracking | Reactivity · Direction change control | Instant unpredictable direction reversals |
| **Smoothsphere** | Smooth / Precise Tracking | Centering · Stability · Wrist control | Smooth spherical targets — often associated with Viscose routines |

---

### Modifier Dictionary

Modifiers shift **which aspect of the base skill** is being isolated or amplified.

| Modifier | Training Focus Shift |
|---|---|
| **Goated** | Optimized community version — generally the highest-transfer version for that skill |
| **TI / Invincible** | Target cannot die → forces **pure continuous tracking** without click interruptions |
| **Small / Extra Small / 30%** | Reduced hitbox → demands **higher precision** and cleaner mouse paths |
| **Larger / Fat / Big / 70%** | Enlarged hitbox → allows focus on **raw speed or smoothness** without penalizing minor deviations |
| **Thin** | Extremely thin hitbox → requires **perfect linear mouse paths** (no jitter tolerated) |
| **Timescale 0.5 / 0.75** | Slows simulation speed → isolates **smoothness** without speed pressure; progressively increase back to 1x |
| **Angelic** | Reduced size AND reduced speed → easier entry point for building **base precision** before scaling |
| **Reload** | Limited ammo, penalizes misses → rewards **click timing and efficiency** over spray |
| **Air Far** | Aerial targets at greater depth → trains **long-range reading and depth perception** |
| **NUNS** | No UFO No Skybots → removes the hardest edge cases from aerial scenarios |
| **Dodge** | Involves player movement → adds **strafe aiming** component on top of base skill |
| **Nevermiss** | Run ends on miss → maximum **precision enforcement** |
| **Evasive / Eva** | Evasive movement patterns → rewards **reading over pure reactivity** |
| **Easier / Easy** | Reduced difficulty on a base scenario → entry point for motor pattern acquisition |
| **Viscose** | Scenarios designed or associated with Viscose → specialized focus on **smoothness and precise tracking** |

---

### Category / Suffix Keywords

These abbreviations appear as suffixes or standalone labels in scenario and playlist names.

| Keyword | Full Form | What It Signals |
|---|---|---|
| **TS** | Target Switch | Target switching category |
| **TI** | Tracking Invincible | Continuous tracking, no kills |
| **PGT** | Popcorn Goated Tracking | Tracking on Popcorn movement |
| **PGTI** | Popcorn Goated Tracking Invincible | Pure smooth/precise tracking, no clicks |
| **WW** | Wide Wall | Wide static clicking, arm movement |
| **AIO** | All In One | Gauntlet cycling through multiple dodge profiles |
| **VSS** | Varied Strafe Speed | Targets vary their strafe speed mid-scenario |
| **NUNS** | No UFO No Skybots | Aerial tracking without teleporting or overhead bots |
| **VRT** | Visual Reaction Time | Pure reflex/reaction training |
| **TE** | Tournament Edition | Larger targets, often used for speed focus |
| **ISR** | Issue-Specific Routine | Hyper-targeted weakness fixing |
| **BDIM / VDIM** | Benchmark Daily Improvement Method | Daily category rotation structure |
| **SYA** | Smooth Your Aim | Smoothness-focused general routine |
| **SYW** | Smooth Your Wrist | Wrist-isolation smoothness routine |
| **FAR** | Full Accomplishment Routines | Weekly structured progression routines |
| **FR** | Fundamental Routines | Rank-organized foundational training |

---

### Skill → Scenario Correlation Map

Use this during **Step 3** (building candidates) and **Step 6** (estimating transfer). When the benchmark reveals a weakness in a skill, find which scenario types develop it here.

| Weakness Identified | High-Transfer Scenario Types |
|---|---|
| **Smoothness** | Long Strafes · Smoothbot · PGTI · Air (low speed) · Timescale variants · SYA/SYW routines |
| **Reactive Tracking / Reactivity** | Reactive Strafes · B180 · Pasu · Bounce variants · evaTS · VSS scenarios |
| **Precise Tracking** | Thin Strafes · Smoothsphere Viscose · FloatingHeads (small) · Ground Plaza (small) |
| **Dynamic Clicking** | Pasu · Popcorn · Frogtagon · B180 · Bounce · FloatingHeads (clicking mode) |
| **Static Clicking** | 1w4t · WW / Wide Wall · Nevermiss static variants · Bardpill methodology |
| **Target Switching** | PsalmTS · evaTS · TS variants · AIO maps with multi-target profiles |
| **Reading / Anticipation** | Air NUNS · evaTS · Reactive Strafes · Frogtagon · Long Strafes (direction anticipation) |
| **Arm Aiming / Wide Flicks** | WW (Wide Wall) · Air Far · Wide Angle scenarios · Large movement static maps |
| **Wrist Control / Micro-corrections** | SYW · Thin Strafes · Smoothsphere Viscose · Small static variants · Reload scenarios |
| **Jitter / Stability** | Timescale 0.5 variants · SYA · Long Strafes · Smoothbot · Nevermiss · ISR anti-jitter |
| **Centering** | Precise Smoothbot · FloatingHeads · Tracking scenarios with small targets |
| **Speed Matching** | Long Strafes · Smoothbot · PGTI · Reactive Strafes |
| **Direction Change Control** | B180 · Reactive Strafes · Bounce variants · VSS |
| **Overflicking / Undershoot** | Nevermiss · Reload · Small static variants · Timescale 0.75 static |

---

### Reading Scenario Names in Practice

When you encounter an unknown scenario name during Step 5, parse it left to right:

1. **Identify the base** → look up movement pattern and primary skill in the Base Dictionary
2. **Identify modifiers** → apply training focus shifts from the Modifier Dictionary
3. **Check for category suffixes** → refine the skill label using the Suffix Keywords
4. **Map to benchmark weaknesses** → cross-reference the Skill Correlation Map

> Example: `"Smoothsphere Viscose Easier"`
> - Base = **Smoothsphere** → Smooth/Precise Tracking, Centering, Wrist Control
> - Modifier = **Viscose** → Smoothness and Precise Tracking specialist focus
> - Modifier = **Easier** → Entry-level difficulty, motor pattern acquisition
> - Skill correlation → Smoothness · Precise Tracking · Wrist Control · Centering

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

For every weak scenario, decode its name using the **Scenario Name Parsing Reference** above before assigning skills. Parse: Base → Modifiers → Suffix. Then determine:

### Primary Skill
Examples: Smoothness · Reactive Tracking · Precision Tracking · Dynamic Clicking · Static Clicking · Target Switching

### Secondary Skill
Examples: Reading · Stability · Micro Adjustments · Reactivity · Timing · Speed Matching · Direction Change Control

### Mouse Control Components
Examples: Wrist Control · Fingertip Control · Arm Control · Jitter Reduction · Tension Management · Undertracking · Overtracking · Centering · Thin Tracking

### Scenario Context (from name parsing)
Note the movement pattern, hitbox properties, and simulation conditions implied by the name. These constrain which playlist scenarios can realistically produce transfer.

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

For every scenario inside each candidate playlist, **first parse its name** using the Scenario Name Parsing Reference (Base → Modifiers → Suffix), then identify:

- **Movement pattern** — what the target actually does (from Base Dictionary)
- **Hitbox conditions** — size, shape, and thickness (from Modifier Dictionary)
- **Simulation conditions** — timescale, ammo, invincibility, etc. (from Modifier Dictionary)
- **Main skill trained** — primary skill from name parsing + correlation map
- **Secondary skill trained** — secondary skill from name parsing
- **Weakness targeted** — specific deficit the scenario addresses
- **Intended adaptation** — what the player's motor system should learn from repeated exposure

Ask for each scenario: *Why is this here? What weakness is it solving? What benchmark skills does it develop? Does the movement pattern in this scenario match the movement pattern in the player's weak benchmark scenario?*

> Modifier combinations matter. A `Thin + Timescale 0.75` scenario trains a fundamentally different adaptation than `Thin` alone. Always apply every modifier in the name.

---

## Step 6 — Estimate Transfer

Compare **benchmark scenario requirements** vs **playlist scenario requirements**.

Use the **Skill → Scenario Correlation Map** to verify that the playlist scenarios belong to the same skill family as the benchmark weaknesses. Then measure overlap in:

- **Movement patterns** — does the playlist scenario move the same way as the benchmark scenario? (bounce vs strafe vs aerial vs static)
- **Hitbox conditions** — similar size, shape, and thickness demands?
- **Reading demands** — does the playlist scenario require the same level of anticipation?
- **Tracking style** — reactive / precision / smooth — are they the same?
- **Clicking style** — dynamic / static / switching — match?
- **Reactivity** — similar speed of direction change?
- **Smoothness** — similar emphasis on clean mouse paths?
- **Precision requirements** — similar tolerance for deviation?
- **Mouse control requirements** — same physical component (wrist / arm / fingertip)?
- **Simulation conditions** — timescale, ammo, invincibility — do they change the adaptation significantly?

**Higher overlap in all dimensions = higher expected transfer.**

A playlist with 10 scenarios where 8 match the benchmark's movement pattern and hitbox conditions outperforms a playlist with 20 scenarios where only 3 match, even if the second playlist has a stronger reputation.

Do not use playlist popularity, reputation, or titles as evidence. Use actual scenario contents and name-parsed skill mappings.

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
