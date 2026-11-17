# Version 3.3 — Upgrade notes

This package **fully replaces** 3.2 and preserves 3D, AI rivals, the resource economy, private Backdeals and the Reality Check. Do not mix files from different versions.

- Lobby length: **Quick 3**, **Standard 4**, **Full 5**. Standard uses the diplomacy/backdeals scenario (`currentIdx = 3`) before the summit (`currentIdx = 4`).
- Persistent **Manual/Auto** host controls; default Manual; choice to **Reveal only** or **Reveal + next phase** (reading time 5–90 s).
- Auto uses a server-authoritative synchronized **three-second countdown**, cancellable by the main host.
- Human-team readiness is recalculated on disconnect/reconnect; AI rivals are finished immediately when active humans are all ready.
- Individual reflection and mediation-vote responses also auto-reveal after 100% of connected participants respond.
- Automatic transition from Investment Award to Reality Check is deliberately disabled: **Begin Reality Check** remains a host-controlled teaching decision.
- `server.js`, `game-data.js`, `public/host.js`, `public/player.js`, `public/host.html`, `public/player.html`, `public/styles.css` and automated tests updated.
- `npm test` covers game arcs, manual pacing, auto countdowns, AI, disconnect/reconnect, debrief, and previous game features.

## Deployment

Copy the **ZIP contents** into your current application's directory in GitHub Desktop; commit and push. Keep the Render Root Directory consistent with where `package.json` is found. Build: `npm install`; Start: `npm start`; `/api/health` version should be `3.3.0`.
