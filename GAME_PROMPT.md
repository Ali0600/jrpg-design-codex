# WAYSTONE — Build Prompt (Three.js)

> A build brief for a browser 3D exploration-RPG, derived from the JRPG Design Codex.
> Working title: **Waystone**. Rename freely.
> Every system below cites the codex mechanic it descends from (e.g. `M136`) so the lineage is traceable.

---

## 0. The prompt (hand this to a dev or coding agent)

You are building **Waystone**, a third-person exploration RPG that runs in the browser on **Three.js**. It is a solo-developer-scale game: **compact and dense, never vast**. Content volume is the enemy; systems depth is the win condition. Build the vertical slice in Section 9 first.

The entire game answers one design pillar:

> **A world that rewards exploration, where everything has upgrades.**

Five sub-pillars, applied as acceptance tests to *every* feature you build:
1. **The world rewards exploration** — if a player wanders off the path, they get something. No empty vistas.
2. **Everything has upgrades** — weapons, tools, shops, mounts, the hub, even minigames have their own progress bar.
3. **Discovery breeds discovery** — finding one secret hints at, unlocks, or reveals the next.
4. **Rewards are layered** — one action pays out on 2+ meters at once.
5. **Knowledge is a reward** — riddle answers, map understanding and enemy tells are treasure.

If a feature fails these tests, cut it.

---

## 1. Pitch & fiction

The world was being *sung into being* and the song stopped partway. Most of it never finished manifesting — it hangs latent above a sea of mist, real enough to see, not real enough to walk on.

You are the last **Surveyor**. You carry a lantern that reveals what is latent, and you plant **Waystones** that finish what the song abandoned. You are not saving the world from a villain; you are **completing** it. The people you find out there come home with you, and home gets bigger.

Tone: warm, melancholy, hopeful. Not grimdark. Think *Sea of Stars* meets *Outer Wilds*' curiosity, at PS1-cult-classic scale.

---

## 2. Core loop

```
Explore a region
  → find secrets (each pays 2+ meters)
    → secrets yield Waystones · Glyph Stones · People · Sketches
      → plant a Waystone to manifest a NEW region
      → bring a Person home; the hub physically grows and gains a service
      → spend Glyph Stones to author a permanent ability
        → new Tools/abilities reopen regions you already walked
          → repeat, denser each time
```

Everything you *do* levels itself. There is no XP screen.

---

## 3. World structure — small, dense, layered

- **5–7 hand-built regions**, each ~2–4 minutes to cross. **Not** an open world. Not procedural.
- Each region is authored to a **density budget**: ~12 discoverables, of which at least 3 are unreachable on first visit (they become the reason to return).
- Regions are unlocked by **planting Waystones** — and the player chooses *which* region to grow next from the Waystones they hold. `M109` Land Make, `M122` DQ7 shard hunting.
- Per-region colour palette + fog + skybox does the heavy lifting visually. Silhouette over detail.
- **The mist sea** below is the connective tissue and later becomes traversable.

**Guaranteed-payout rule** (`M152` Alundra): every explorable space contains at least **one Glyph Stone and one Sketch**. Players learn that searching *always* pays.

---

## 4. Progression systems

### A. Use-Based Mastery — the spine
`M139` Grandia · `M133` LoD Additions · `M002` FF7R weapon levels · `M104` Xenogears

Every verb has its own hidden counter and tier: **Strike, Parry, Dash, Grapple, Lantern**, and each authored Glyph. Using it levels it. Tiers grant new *properties*, not just numbers:

| Verb | T1 | T2 | T3 |
|---|---|---|---|
| Grapple | pull yourself | pull objects | mid-air re-grapple |
| Lantern | reveal latent objects | reveal latent *paths* | reveal buried caches |
| Parry | block | reflect projectiles | break enemy Locks |

No menus. The world is the trainer. Trivial to implement, enormous perceived depth.

### B. The Glyph Grid — the build you author
`M149` Wild ARMs Crest Sorcery · `M001` Materia · `M155` FFT cross-job

- **Blank Glyph Stones are finite** and found only in the world.
- At the hub's Scribe, spend one to permanently inscribe a chosen ability into a slot on a **4×4 grid**.
- **Adjacency combines**: neighbouring glyphs fuse into hybrids (Fire + Wind → Lightning, per `M139`'s combined-element idea). Discovering a good adjacency *is* a reward.
- You can never fill the grid → real, permanent build identity.
- **Anti-frustration**: a later hub upgrade allows re-inscription for a cost. Choices are meaningful, not punishing.

### C. Tools & the Reopening Map
`M148` Wild ARMs Tools · `M021` chocobo traversal · `M054` XC3 traversal skills

4–5 Tools, each a **world verb**: Lantern, Grapple, Chime (resonates sealed stone), Mistwalker (traverse the mist sea), Ferry/mount.

> **Fix the flaw the codex caught.** Wild ARMs mostly used Tools to gate *new* puzzles rather than send you back. Be deliberate: when the player sees something they can't reach, **auto-pin it on the map as a "?" marker**. Backtracking becomes a guided shopping list, never a memory test.

### D. The Waystation — a hub that visibly grows
`M136`/`M137` Suikoden II · `M083` Mirth · `M120` Bincho rescue · `M052` XC3 Heroes

The hub begins as **one ruined arch**. Every person you find out in the world (hidden, usually behind a small puzzle or riddle) walks home with you and **physically builds their thing**:

Scribe (glyph inscription) · Smith (tool upgrades) · Cartographer (marks unreachable spots) · Cook (buffs) · Cardplayer (the deck game) · Archivist (completion tracker) · Merchant (rotating stock)

Each arrival toggles new geometry, lights, and ambient NPC life. **This is the emotional payoff engine and it is cheap in Three.js** — you are enabling prefabs.

Target **~24 findable people** for the full game (Suikoden's 108 is explicitly out of scope — do not attempt it).

---

## 5. Vista Riddles — the highest value-per-effort feature in the game
`M028` Elden Ring paintings · `M087` FF9 Chocographs · `M091` Stellazzio

You find a hand-drawn **Sketch**. It shows a composition: a rock arch framing a distant tower, from a specific vantage. You must **recognise the real place and go stand there**. When position + camera direction match within tolerance, the world "clicks" and a reward manifests.

**Why this is the feature to build first:**
- Implementation is ~30 lines: `player.position.distanceTo(target) < r` and `camera.getWorldDirection() · targetDir > cos(θ)`.
- **Authoring is nearly free**: fly a debug camera to a good vantage, screenshot the scene, run it through a sketch/posterise post-shader, save as the Sketch image. The riddle art *is* the game world. One keystroke per riddle.
- It is pure "knowledge is a reward" — the payoff is having *paid attention*.

Ship 5 in the slice; 20+ in the full game.

---

## 6. Combat — timing encounters, not action combat

Do **not** build real-time action combat; it will eat the whole schedule and feel bad. Instead, touching an enemy enters a focused duel in a small arena.

- **Chains** (`M133` LoD Additions): attacks are sequences of timed inputs. Hit the beat, the chain continues. **Each Chain has its own use-counter and levels up** — more hits, more damage. Your basic attack is a growth track.
- **Locks** (`M079` Sea of Stars): enemies telegraph a row of icons before a big attack; break them with matching glyph types to cancel it. Rewards *knowing the enemy*.
- **Hidden Arts** (`M145` Legaia): certain input sequences the game never tells you about unlock named Arts, permanently. Players will teach each other these. Do not put them in a tooltip.

Three enemy archetypes in the slice. Telegraphs must be readable from silhouette + colour alone.

---

## 7. Minigames — one hard rule

> **No minigame pays only currency.** Every minigame pays into a permanent track.
> `M143` BoF IV Game Points · `M152` Alundra's pub games paying max-HP

- **Sounding** (`M087` Chocobo Hot & Cold): a dig/echo hunt where audio pitch + a warmth shader guide you to buried caches. Pays **Glyph Stones and Sketches** — i.e. it feeds the two best systems.
- **Mist-angling**: pays consumables, and cumulative points unlock a **teacher** who grants a permanent technique (`M142` BoF IV Masters model).
- **The deck game** (Section 8).

All of them also pay **Lumen**, the global upgrade currency.

---

## 8. The Deck Game (Phase 2 — but design the data model in Phase 1)
`M132` Gwent · the four-ingredient formula · deliberately fixing `M131` Tetra Master

A compact lane-based card game. It must have **all four ingredients** — three of four is what made Tetra Master hollow:

1. **Ubiquitous opponents** — nearly every hub resident and most world NPCs will play you.
2. **Shops are booster packs** — every merchant stocks 2–3 rotating cards, so entering any shop is a slot pull.
3. **Collection converts to power** — cards depict creatures, people and places **you have actually encountered**, so the deck is a record of your exploration, and card power feeds real decisions.
4. **Ranked ladder with a storyline** — named rivals, escalating stakes, a narrative arc.

**Critical rule:** winning pays **Lumen and rare Glyph Stones** — the deck game feeds main progression. This is the exact flaw the codex flagged in Tetra Master: a collection with no conversion to power is a dead hobby.

---

## 9. Scope — build in this order

### MVP vertical slice (build this first; it proves all five pillars)
- 1 hub (starts ruined, 6 recruitable people)
- 2 regions + the ability to plant 1 Waystone to open the second
- Tools: Lantern + Grapple
- Use-based mastery on 4 verbs
- Glyph Grid with 6 glyphs and 2 adjacency combos
- **5 Vista Riddles**
- Timing combat, 3 enemy types
- 1 minigame (Sounding)
- localStorage save + JSON export/import

### Phase 2
+3 regions · Tools 3–5 · the deck game · Reward Board (`M072`) · recruits to ~24 · mist-angling

### Stretch
Endless post-game descent (`M159` Eternal Corridor) · NG+ · difficulty relics (`M081`)

---

## 10. Technical direction (Three.js)

- **Stack**: vanilla **Three.js** (install the current release) + **Vite**. No heavy engine wrapper. (React Three Fiber only if already fluent in React.)
- **Renderer**: use the **WebGL renderer** as the default — it is the compatibility-safe choice for a browser game. Three.js also ships a **WebGPU renderer with TSL** (Three.js Shading Language) and a node-based `ToonLightingModel`; treat that as an optional later upgrade, not a starting dependency.
- **Art**: low-poly, flat/toon shaded via **`MeshToonMaterial`**. Strong fog, per-region palettes, hemisphere + directional light. **Avoid PBR/realism** — it costs asset time you do not have.
  - ⚠️ **Gotcha**: when using `MeshToonMaterial.gradientMap`, you **must** set the texture's `minFilter` **and** `magFilter` to `THREE.NearestFilter`, and leave `colorSpace = NoColorSpace`. Miss this and the discrete toon bands silently smear into a normal gradient.
- **Batching is mandatory** — keep draw calls in the low hundreds:
  - **`InstancedMesh`** — many copies of the *same* geometry + material (a field of one grass tuft, one rock type).
  - **`BatchedMesh`** — many *different* geometries sharing **one** material, drawn in a single multi-draw call. This is the right tool for mixed world props (varied rocks, trees, ruins, debris) and is what most of your scenery should use. Constructor takes `(maxInstanceCount, maxVertexCount, maxIndexCount, material)`; you `addGeometry()` once per shape, then `addInstance()` + `setMatrixAt()` per placement.
- **Collision**: do *not* add a full physics engine. Use **three-mesh-bvh** for fast raycast/capsule collision against level meshes.
- **Character animation**: budget 5–6 states max (idle, run, jump, fall, strike, interact). Consider a design that minimises rig complexity — a hovering/cloaked silhouette hides a lot.
- **UI in DOM**: build menus, the Glyph Grid, and cards as **HTML/CSS overlaid on the canvas**, not in-3D. Far faster to iterate, and it matches the stack you already write comfortably.
- **Save**: `localStorage` + Export/Import JSON backup — the same pattern as the codex itself.
- **Audio**: Web Audio API. The Sounding minigame needs real-time pitch feedback.
- **Post-processing**: one cheap pass (slight bloom + vignette + the sketch shader used to author Riddles).

---

## 11. Anti-goals — do not build these

Each of these is a failure mode the codex research specifically identified:

- ❌ **An open world.** Density beats size. 5 dense regions > 50 empty km².
- ❌ **Permanent missables** (Alundra's flaw). Everything must be re-obtainable or "come back later" gated. Never punish curiosity with a locked-out reward.
- ❌ **Completely unhinted secrets** (Wild ARMs Fast Draw's flaw). Every secret gets a discoverable cue — a rumour, a glint, a visible-but-unreachable tease. "Obscure" must read as *earned*, never *invisible*.
- ❌ **Endurance as difficulty** (FFX lightning dodging, FF9's 1000 jumps). No long unbroken execution gauntlets. Checkpoint everything.
- ❌ **Collection without conversion** (Tetra Master's flaw). If the player collects it, it must convert into capability.
- ❌ Realistic graphics · full voice acting · multiplayer · procedural infinite terrain · 108 recruits · real-time action combat.

---

## 12. The one-sentence test

Before shipping any feature, answer:

> *"If a curious player pokes at this, do they get something — and does that something point at the next thing?"*

If no, it is not finished.
