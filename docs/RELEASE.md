# Design Freeze release evidence

Contract: 2026-11-08, AICP 2.1.1 / UGDS 2.0.0 pinned at 61c24205f437826f1fc901f1741c49b677502f66. $0; no external runtime service, telemetry or CDN. Exact original PNGs checked with scripts/verify-art.mjs.

## Verification in progress

- PASS: production build (Vite / Node 24), static repository subpath assets.
- PASS: 21 deterministic rule tests: five skulls at 2s spacing and boss-after-deaths, repeated wave, collision, contact/global immunity, hammer windup/impact/recovery/range, both swords, AoE, swept first-hit lance, distinct chain targets, delayed beam, five-second refreshed Blessing and one-second cast root, serialization/no queue, pause clocks, death/reset and robust best/preferences storage.
- PASS: initial four Chromium groups: bilingual title and active-game switch, fullscreen denial, keyboard movement, all action frames, Game Over/restart/title, local best reload, mobile 844×390 touch/cancel, portrait pause/guidance, reduced motion, storage/audio denial and manual/automatic pause reconciliation. Additional natural-play and axe checks are being run; final receipt will supersede this interim status.
- Visual evidence: docs/evidence includes actual title, skull/king arena, both swords/five spells, shortened wing/halo/feather Blessing, pause, Game Over, mobile and portrait. The combat showcase uses clearly synthetic inspection fixtures (simultaneous boss/skulls and long protection) to inspect actors/effects; those fixtures are not production gameplay rules. Natural-play evidence is recorded separately. A development-only inspection hook is stripped from production.
- NOT VERIFIED: physical devices, human assistive technology, independent first-time player or owner aesthetic review. Canvas does not expose a full nonvisual combat equivalent. These are disclosed limitations, not fabricated approval.

## Release gates

GitHub main ruleset requires a PR (zero approving reviews); force-push/deletion blocked. Branch checkpoint c52d5a9 preserves design and immutable artwork before implementation. No protection change is requested or made.

Pages was not configured at preflight. Creating the site through the provided integration returned HTTP 403 `Resource not accessible by integration`. Requested owner action: repository Settings → Pages → Source: GitHub Actions. No alternate host or destination is used. The workflow validates before publishing main; no branch preview deployment.

Possibility policy inspected at main 6b80fec; actual public build-info observed ce469f863305e428dd45bfc587285a28eeeecd54. Its manual exact-SHA workflow remains unchanged. No published entry, publication date or successful game-link observation may be invented while game Pages is unavailable. Portfolio publication is contingent on verified live game.
