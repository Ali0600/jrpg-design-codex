# WAYSTONE — Build Prompt **v2** (Three.js)

> Self-contained build brief. Supersedes `GAME_PROMPT.md` on **three axes**: how discovery is designed, how combat works, and how abilities are earned.
> v1 is kept for reference — its world fiction, hub design and anti-goals still apply and are restated here.
> New source: **Clair Obscur: Expedition 33** (`M160`–`M162`). Codex mechanic IDs cited throughout.

---

## 0. What changed from v1, and why

**1. Discovery is a taxonomy, not a gimmick.**
v1 made "Vista Riddles" the flagship. That was a misread. The lesson from Elden Ring is **not** "build a clever painting puzzle" — it's that Elden Ring rewards exploration in *so many different ways* that you can never predict the **shape** of the next reward. The painting was memorable because it was one of a dozen kinds of surprise, not because riddles are special. So v2's spine is a **Discovery Taxonomy** (Section 3) and a hard authoring rule that forces variety.

**2. Defense is the skill expression.**
v1 built combat around offensive timing chains. Clair Obscur (`M161`) shows the better shape: turn-based on your side, **real-time on theirs**. Parrying an enemy's *entire* attack string pays you AP *and* a free counter. The boss's moveset becomes the puzzle, and knowing it converts directly into resources and damage.

**3. Mastery frees the slot.**
v1's Glyph Grid spent finite stones permanently. Clair Obscur's Pictos/Lumina (`M160`) is strictly better and is your own flagged taste in one system: equip a found item, **master it over 4 encounters**, and the ability becomes permanently available **to the whole party** — freeing the physical item. It fuses FF9's "gear is a school" (`M086`), FFT's portable abilities (`M155`), and Materia's scarce slots (`M001`).

---

## 1. The prompt

You are building **Waystone**, a third-person exploration RPG that runs in the browser on **Three.js**. Solo-developer scale: **compact and dense, never vast**. Content volume is the enemy; systems depth and *variety of surprise* are the win conditions. Build the vertical slice in Section 8 first.

The pillar:

> **A world that rewards exploration, where everything has upgrades.**

Applied as acceptance tests to every feature:
1. **The world rewards exploration** — wander off the path, get something.
2. **Everything has upgrades** — tools, shops, the hub, minigames all have their own progress bar.
3. **Discovery breeds discovery** — one secret hints at the next.
4. **Rewards are layered** — one action pays 2+ meters.
5. **Knowledge is a reward** — map understanding and enemy tells are treasure.

---

## 2. Fiction

The world was sung into being and the song stopped partway. Much of it hangs *latent* above a sea of mist — visible, not yet walkable. You are the last **Surveyor**: you carry a lantern that reveals what is latent, and you plant **Waystones** that finish what the song abandoned. You are not defeating a villain; you are **completing** a world. The people you find out there come home with you, and home gets bigger.

Tone: warm, melancholy, hopeful. Low-poly, strong silhouettes, per-region palettes.

---

## 3. ★ The Discovery Taxonomy — the heart of v2

**The rule: the player must never be able to predict the *shape* of the next reward.**

Build these as **15 distinct discovery verbs**. They are cheap individually; the magic is in the rotation.

| # | Discovery type | What the player does | Codex root |
|---|---|---|---|
| 1 | **Visible but unreachable** | You can see it — the route is the puzzle | `M029` |
| 2 | **Latent geometry** | Lantern reveals a path/platform that wasn't there | `M028` |
| 3 | **Guarded** | An elite sits on it | `M016` |
| 4 | **Traded** | An NPC wants something you found elsewhere | `M082` |
| 5 | **The wanderer** | An NPC who *moves between regions*; find them again, hand in your running total, get a tiered prize | `M135` Stardust/Martel |
| 6 | **Challenge gauntlet** | Escalating arena; cash out early or push deeper | `M148`-adjacent, Ancient Arena |
| 7 | **Heard, not seen** | Audio/warmth-led buried caches | `M087` Hot & Cold |
| 8 | **Tool-gated** | Only reachable once you own tool X | `M148` |
| 9 | **Vista sketch** | Recognise a drawn vantage, go stand in it | `M028` |
| 10 | **Inscription deduction** | A mural states a *rule*; you apply it elsewhere | `M039` |
| 11 | **Consequence** | Helping one person changes what appears | `M151` Dreamwalking |
| 12 | **A second layer** | Dive under the mist / ascend above it — a mirrored map | `M069` Depths |
| 13 | **The fleeing rare** | A golden creature that bolts; catch it for something great | `M098` |
| 14 | **Shop stock** | Merchants rotate rare goods — every shop is a slot pull | `M132` Gwent shops |
| 15 | **Mastery reveal** | Level a verb enough and it shows you something new | `M139` |

### Authoring rules (enforce these)
- **Every region uses at least 6 different types.**
- **No region shares its top-3 mix with an adjacent region.** Formula is the enemy.
- **Every region contains at least 3 things unreachable on first visit**, each auto-pinned on the map as a `?` marker.
- **Every discoverable pays ≥2 meters**: the thing itself + Lumen (global currency) + region completion, and sometimes a rumour pointing at the next.

> **Fix the flaw the codex caught.** Wild ARMs hid Fast Draw techniques so cryptically most players never found them (`M150`). Every secret here gets a *discoverable cue* — a glint, a rumour, a visible tease. "Obscure" must read as **earned**, never **invisible**.

---

## 4. Combat — two-sided timing
`M161` Clair Obscur · `M133` LoD Additions · `M079` Sea of Stars Locks · `M145` Legaia Arts

Do **not** build real-time action combat. Touching an enemy enters a focused duel.

**Your turn — Chains.** Attacks are sequences of timed inputs; hit the beat and the chain continues (`M133`). **Each Chain keeps its own use-counter and levels up** — more hits, more damage. Your basic attack is a growth track.

**Their turn — the real skill test.** Each enemy attack string must be answered *per hit*:

| Response | Window | Payoff |
|---|---|---|
| **Dodge** | forgiving | avoid damage |
| **Parry** | same window, stricter | avoid damage **+ refund 1 AP** |
| **Jump** | for unblockable ground sweeps | avoid damage |
| **Break** | for screen-draining unblockables | the only valid answer; own timing per enemy |

**Parry the entire string → free counter-attack.** Full party parries → **team counter**. This is the design's core: *the boss's moveset is a rhythm you can eventually play perfectly, and perfection pays in the currency your offence needs.*

**Hidden Arts** (`M145`): certain input sequences the game never documents unlock permanent named Arts. Players will teach each other. Do not put them in a tooltip.

**Accessibility as items, not menus** (`M081`): timing assists are *relics* you find and equip — widen-window, auto-parry, slow-tell. Difficulty is a collectible, not a shame setting.

---

## 5. Progression

### A. Marks & Masteries — the flagship
`M160` Pictos/Lumina · `M086` FF9 · `M155` FFT · `M001` Materia

- **Marks** are found equipment (enemy drops, world loot, merchant stock), each granting one passive.
- Equip a Mark and clear **4 encounters** with it → that character **Masters** it.
- A mastered passive becomes permanently available **to the entire party**, and the physical Mark is freed to go learn something else.
- How many masteries you can run at once is capped by **Lumina Points** (one per level, more purchasable at the hub).

Why this is the right engine: mastery is measured in **encounters fought, not grind time**, so it completes on a schedule the player *feels*; and the reward for learning is **permission to learn more**. Collection converts to permanent capability while loadout decisions stay alive forever.

### B. Use-Based Mastery
`M139` Grandia · `M133` LoD

Every verb has its own counter and tiers into new **properties**, not numbers. No XP screen.

| Verb | T1 | T2 | T3 |
|---|---|---|---|
| Grapple | pull yourself | pull objects | mid-air re-grapple |
| Lantern | reveal latent objects | reveal latent *paths* | reveal buried caches |
| Parry | block | reflect projectiles | break unblockables |

### C. Traversal is a *companion*, not a menu
`M162` Esquie · `M021` chocobos · `M148` Tools

Bind world-scale traversal to **one companion character** who carries you. Each recovered token adds a verb and opens a **whole layer** of the map:

- **swim** → the mist sea becomes crossable
- **break** → reefs/barriers in the mist open
- **fly** → the sky layer, and everything you'd only been able to look at

You aren't unlocking swimming; you're befriending the thing that swims. Map progression doubles as relationship progression — a very cheap emotional multiplier.

### D. The Waystation — a hub that visibly grows
`M136`/`M137` Suikoden · `M083` Mirth · `M120` Bincho · `M052` XC3

Starts as **one ruined arch**. Every person you find walks home and **physically builds their thing** — Scribe, Smith, Cartographer, Cook, Cardplayer, Archivist, Merchant. Each arrival toggles new geometry, lights, ambient NPC life. Cheap in Three.js, enormous emotionally. Target **~24 recruits** (Suikoden's 108 is explicitly out of scope).

---

## 6. Minigames — one hard rule
`M143` BoF IV Game Points · `M152` Alundra's pub games

> **No minigame pays only currency.** Every minigame pays into a permanent track.

- **Sounding** (`M087`) — audio/warmth-led dig. Pays **Marks and Sketches**, feeding the two best systems.
- **Mist-angling** — consumables, and cumulative points unlock a **teacher** granting a permanent technique (`M142` Masters model).
- **The deck game** (Section 7).

---

## 7. The Deck Game (Phase 2 — design the data model in Phase 1)
`M132` Gwent · deliberately fixing `M131` Tetra Master

All four ingredients, because three of four is what made Tetra Master hollow:

1. **Ubiquitous opponents** — most hub residents and world NPCs will play you.
2. **Shops are booster packs** — every merchant stocks 2–3 rotating cards.
3. **Collection converts to power** — cards depict creatures, people and places **you actually encountered**; the deck is a record of your exploration.
4. **Ranked ladder with a storyline** — named rivals, escalating stakes.

**Critical:** winning pays **Lumen and rare Marks**, so the deck game feeds main progression.

---

## 8. Scope — build in this order

### MVP vertical slice (proves all five pillars)
- 1 hub (ruined; 6 recruitable people)
- 2 regions + 1 plantable Waystone
- Tools: Lantern + Grapple; companion **swim** unlock
- **At least 8 of the 15 discovery types in use**
- Marks & Masteries with 8 Marks
- Use-based mastery on 4 verbs
- Combat: Chains + dodge/parry/jump, 3 enemy types, 1 unblockable
- 1 minigame (Sounding)
- localStorage save + JSON export/import

### Phase 2
+3 regions · remaining tools · companion break/fly · deck game · Reward Board (`M072`) · recruits to ~24

### Stretch
Endless post-game descent (`M159`) · NG+ · more relics

---

## 9. Technical direction (Three.js)

- **Stack**: vanilla **Three.js** (install the current release) + **Vite**. No heavy engine wrapper.
- **Renderer**: **WebGL renderer** as default (compatibility-safe). Three.js also ships a **WebGPU renderer with TSL** and a node-based `ToonLightingModel` — an optional later upgrade, not a starting dependency.
- **Art**: low-poly, toon-shaded via **`MeshToonMaterial`**. Strong fog, per-region palettes, hemisphere + directional light. Avoid PBR/realism.
  - ⚠️ **Gotcha**: with `MeshToonMaterial.gradientMap` you **must** set the texture's `minFilter` **and** `magFilter` to `THREE.NearestFilter` and leave `colorSpace = NoColorSpace`. Miss it and the toon bands silently smear into a smooth gradient.
- **Batching is mandatory** — keep draw calls in the low hundreds:
  - **`InstancedMesh`** — many copies of the *same* geometry + material.
  - **`BatchedMesh`** — many *different* geometries sharing **one** material, in a single multi-draw call. This is the right tool for mixed scenery. Constructor `(maxInstanceCount, maxVertexCount, maxIndexCount, material)`; `addGeometry()` per shape, then `addInstance()` + `setMatrixAt()` per placement.
- **Collision**: no physics engine. Use **three-mesh-bvh** for fast raycast/capsule collision against level meshes.
- **Animation**: 5–6 states max. A hovering/cloaked silhouette hides a lot of rig complexity.
- **UI in DOM**: menus, the Mastery loadout and cards as **HTML/CSS over the canvas** — far faster to iterate, and it matches the stack the codex itself is written in.
- **Save**: `localStorage` + Export/Import JSON — same pattern as the codex.
- **Audio**: Web Audio API; Sounding needs real-time pitch feedback. Parry windows need a **distinct audio tell**, not just a visual one.

**Cheap authoring trick for Vista Sketches (type 9):** fly a debug camera to a good vantage, screenshot the scene, run it through a posterise/sketch post-shader, save as the sketch image. Detection is `player.position.distanceTo(target) < r` plus a dot product on the camera forward vector. The riddle art *is* the game world — near-zero cost per riddle.

---

## 10. Anti-goals — each is a failure mode the codex identified

- ❌ **An open world.** Density beats size.
- ❌ **A single discovery formula.** If a player can predict the shape of the next secret, you have failed Section 3.
- ❌ **Permanent missables** (Alundra). Everything re-obtainable or "come back later" gated.
- ❌ **Unhinted secrets** (Wild ARMs Fast Draw). Every secret gets a cue.
- ❌ **Endurance as difficulty** (FFX lightning dodging, FF9's 1000 jumps). Checkpoint everything.
- ❌ **Collection without conversion** (Tetra Master). If they collect it, it must become capability.
- ❌ Realism · voice acting · multiplayer · procedural infinite terrain · 108 recruits · real-time action combat.

---

## 11. The two tests

Before shipping any feature:

> *"If a curious player pokes at this, do they get something — and does that something point at the next thing?"*

Before shipping any **region**:

> *"Name the six different KINDS of discovery in this region. If you can't reach six, it isn't finished."*
