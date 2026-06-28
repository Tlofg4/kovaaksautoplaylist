# Playlist Finder

Find the highest-transfer training playlist(s) for a player's benchmark weaknesses.

Use this workflow whenever a user wants to know:

* what playlist to play
* what routine to run
* how to improve a benchmark
* what playlist has the highest transfer
* what playlist targets a specific weakness
* what training should be prioritized

The goal is not to recommend popular playlists.

The goal is to identify the playlist(s) with the highest expected transfer to the player's actual weaknesses.

---

# Step 1 — Identify the Problem

Collect:

* Benchmark system
* Current rank
* Target rank
* Benchmark scores

If benchmark data is available:

Identify:

* Weakest scenarios
* Scenarios preventing rank progression
* Categories causing rank stagnation

Do not focus on overall rank.

Focus on the specific bottlenecks.

---

# Step 2 — Convert Scenarios Into Skills

For every weak scenario:

Determine:

## Primary Skill

Examples:

* Smoothness
* Reactive Tracking
* Precision Tracking
* Dynamic Clicking
* Static Clicking
* Target Switching

## Secondary Skill

Examples:

* Reading
* Stability
* Micro Adjustments
* Reactivity
* Timing

## Mouse Control Components

Examples:

* Wrist Control
* Fingertip Control
* Arm Control
* Jitter Reduction
* Tension Management
* Undertracking
* Overtracking
* Direction Change Control
* Thin Tracking

Create a weakness profile.

Do not search for playlists yet.

---

# Step 3 — Build a Candidate Pool

Search exclusively inside `kovaaks-playlist-compendium/`.

Do not read or reference any other folder or source.

Collect every playlist that appears relevant based on:

* Skill categories
* Training categories
* Weakness categories

Do not recommend anything yet.

The goal is to build a candidate pool.

---

# Step 4 — Analyze Playlist Contents

For every candidate playlist:

Open the playlist file.

Extract:

* Playlist name
* Sharecode
* Scenario list
* Repetitions
* Playlist length

Never evaluate a playlist only by its title.

The scenarios matter more than the playlist name.

---

# Step 5 — Analyze Individual Scenarios

For every scenario inside the playlist:

Identify:

* Main skill trained
* Secondary skill trained
* Weakness targeted
* Intended adaptation

Ask:

Why is this scenario in the playlist?

What weakness is it trying to solve?

What benchmark skills does it develop?

---

# Step 6 — Estimate Transfer

Compare:

Benchmark Scenario Requirements

vs

Playlist Scenario Requirements

Measure overlap in:

* Movement patterns
* Reading demands
* Tracking style
* Clicking style
* Reactivity
* Smoothness
* Precision requirements
* Mouse control requirements

Higher overlap = higher expected transfer.

Use actual scenario contents.

Do not use playlist popularity.

Do not use playlist reputation.

Do not use playlist titles as evidence.

---

# Step 7 — Rank Playlists

Create:

## S Tier

Highest transfer.

Most likely to improve benchmark scores.

## A Tier

Strong alternatives.

## B Tier

Useful but less direct.

For every playlist include:

* Name
* Sharecode
* Main skills trained
* Benchmark weaknesses addressed
* Strengths
* Weaknesses
* Reason for ranking

---

# Step 8 — Find the True Bottleneck

Determine:

Which weakness appears repeatedly across multiple weak scenarios.

Examples:

* Poor smoothness
* Weak reactivity
* Poor reading
* Poor micro-adjustments
* Stability issues
* Wrist control limitations

Identify the root problem.

Do not simply treat every scenario independently.

---

# Step 9 — Build the Recommendation

Answer:

1. Which playlist should be played first?
2. Which playlist should be added second?
3. Which playlist has the highest transfer-per-minute?
4. What weakness is actually holding the player back?
5. What improvement should be expected if the playlist is followed consistently?

Optimize for efficiency.

The objective is not general aim improvement.

The objective is solving the bottlenecks that limit benchmark progression.
