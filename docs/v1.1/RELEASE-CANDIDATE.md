# v1.1.0-rc.1 — Character Reuse and Adaptation

Status: locally verified release candidate; **not deployed**. CI/PR validation is pending. Authoritative scope: CHARACTER-REVISION.md. Rollback: released v1.0 `337a7af7ffb4a52a22583547f62aea1a35ed7c7d`.

## Implementation and source lineage

Hero uses original PixelFX `posed()` and `poseAt()`, the actual neutral demonstration body/palette, original action pose tracks, and same IK/depth rendering system for movement. No independent Canvas body construction remains. The exact source/native pixel output is compared against the unmodified original. Uniform 1.5× display scaling preserves native proportions and pixels with nearest-neighbor presentation.

King is a separate project-owned derivative (`src/characters/orc-rig.js`), retaining the original solver, skeleton/bone frames, analytic depth rasterizer, flat lighting, seams/outline and cache. Changes are nonuniform measurements, broad torso/shoulders and larger jaw/head/hands, green skin, projecting tusks, crown tines and jewel, fur mantle, cloth and substantial spiked warhammer, all attached to bone frames and depth-rendered. `orc.js` uses original pose interpolation with the existing .85s wind-up and 2s recovery clocks; no simulation writes or new timers. A 2× native display scale makes him larger than the hero. Original MIT source notices are retained; src/characters/LICENSE accompanies the derivative.

`source-lineage.json` records immutable upstream hashes and the unchanged v1.0 file hashes. `tests/characters.test.js` verifies original source identity, exact native hero pixels across actions, joint articulation, nonuniform king anatomy and distinct parts, original solver/rasterizer lineage, and strict source preservation. The frozen v1.0 renderer is retained in tests/fixtures only, with relative-import adjustment documented, for deterministic browser comparisons. It is not included in the production build.

## Necessary integration outside actor construction

- `src/render.js`: replace only hero/boss methods and import new character modules; existing heroActor mask capture now samples the actual demo rig, with head/chest coordinates aligned to it. Blessing consequently uses the new character silhouette. Its effect source, parameters, duration, palette and animation motif remain unchanged. The scene/portal/skull/spell render block and background body remain byte-identical.
- `package.json`, lock root version, build-info: identify this artifact as `1.1.0-rc.1`, reading package identity rather than claiming v1.0. No dependency/version-resolution changes.
- Provenance/amendment/test/comparison files document and verify the revision. The entire vendored tree, artwork masters, simulation, UI, audio, CSS, localization and CI/deployment workflow remain byte-identical to v1.0. Possibility and shared standards are untouched.

## Current verification

PASS: 29 unit/rules/source-custody checks (21 unchanged gameplay cases plus eight character/lineage/scope/hammer-geometry cases).

PASS: deterministic browser comparison: background, portal/scenery/skull layer and all seven isolated effect layers have **zero changed channels** versus the frozen v1.0 renderer (`evidence/unchanged-visual-layers.json`). For on-body Blessing isolation, both use the same v1.0 actor mask to distinguish unchanged spell artwork from the explicitly authorized replacement silhouette.

PASS: native upstream/v1.0/candidate browser comparison and six-frame acting sequences for both swords, all five spells, and king wind-up/impact/recovery. Images are actual rig/renderer output, not generated illustrations. The top comparison presents upstream/candidate native pixels at 3× and v1.0 actors at comparable body height; full-arena frames preserve real gameplay display scales.

PASS: complete eight-group Chromium suite, including existing bilingual title/HUD accessibility, keyboard play through a full five-skull/king wave, natural defeat/restart, pause reconciliation, mobile real touchStart/hold/touchCancel, portrait guidance/reduced motion, audio/storage/fullscreen-denial fallbacks, plus new character comparisons and unchanged-layer checks. The browser report is `evidence/browser-results.json`; actual new-character encounter/mobile/pause/results images are under `evidence/regression/`.

PASS: local production artifact START/sword/beam/pause/natural defeat/restart/Chinese/mute smoke, without a development mutation hook, broken resources or third-party runtime requests (`evidence/regression/production-smoke.json`).

PASS: original artwork hashes. Production build identifies v1.1.0-rc.1. Native body/posing and full-arena images were visually inspected against the pinned PixelFX source. The 28-second real browser recording `evidence/character-acting.webm` covers the two swords/five spells and a king wind-up/impact/recovery cycle; it uses controlled initial enemies/spawn schedule through the existing development inspector, with ordinary input/clock/action serialization thereafter. The separate natural-wave test does not mutate simulation state.

PASS: public build still identifies unchanged v1.0 rollback source (`evidence/public-v1-unchanged.json`). No merge, publication or Possibility update was performed.

Pending: PR/CI validation and final clean packaged RC; source has been safely checkpointed on the v1.1 branch.

Not Verified: physical devices, independent first-time player, human aesthetic or assistive-technology review. Canvas remains without full nonvisual combat support, as in v1.0. No human approval of the candidate's rendered appearance is claimed.

## Publication boundary

This PR must remain unmerged into main until separate release authorization. The existing main deployment workflow is unchanged. The production site must continue to identify the v1.0 rollback SHA; no v1.1 workflow dispatch or public deployment is performed. Possibility is untouched.
