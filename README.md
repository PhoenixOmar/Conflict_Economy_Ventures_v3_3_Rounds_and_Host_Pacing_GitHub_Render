# Conflict Economy Ventures 3.3 — Round Length & Host Pacing Upgrade

This is a **complete replacement** for Version 3.2, including the 3D host map, AI/NPA rivals, mobile QR-code rooms, resource simulation, private backdeals and the post-game Reality Check. You do not need files from previous ZIPs.

## New in Version 3.3

### Game length (choose before team assignment)

| Lobby setting | Exact sequence (scenario IDs) | Backdeals? |
|---|---|---|
| **Quick · 3 rounds** | Seed & Recruitment (`seed`) → Black Swan & Civil Unrest (`shock`) → 2040 Peace Summit (`summit`) | No |
| **Standard · 4 rounds** | Seed & Recruitment → Black Swan & Civil Unrest → **Backchannel Diplomacy & Poaching** (`diplomacy`) → 2040 Peace Summit | **Yes** |
| **Full · 5 rounds** | Seed & Recruitment → Supply Chain & Labor Policy (`labor`) → Black Swan & Civil Unrest → **Backchannel Diplomacy & Poaching** → 2040 Peace Summit | **Yes** |

The host lobby calls these rounds *Seed & Investment Pitch*, *Market Shock & Unrest*, *Backchannel Diplomacy & Backdeals* and *Final Peace Summit*. The underlying resource-specific decision cards are unchanged. The final round always leads to the **2040 Investment Award**, with **Begin Reality Check** immediately afterward.

### Manual or Auto pacing (persistent top host bar)

- **Manual (default)**: All team and participant responses can be locked, but answers **never automatically reveal**. The host must click **Reveal all choices**, **Next round**, or **Reveal anonymous reflections / mediation decisions**. Even when the clock reaches zero the host decides whether to reveal or extend.
- **Auto / Reveal only**: As soon as **all currently connected human teams** have submitted, server-controlled AIs finish any pending decisions, and a **three-second synchronized banner** begins. The server reveals all choices at zero, then **waits for the host** to click Next Round. In the debrief, it auto-reveals reflections or the dilemma vote once all **connected individual participants** respond, but waits for the host before proceeding to the next stage.
- **Auto / Reveal + next phase**: Same three-second reveal countdown, then a second synchronized **reading-time countdown** (default **12 seconds**, configurable to 5, 8, 12, 15, 20, 30, 45, 60 or 90 seconds) moves to the next round or the next Reality Check stage. The **Investment Award → Begin Reality Check** is always host-controlled, never skipped automatically.
- **Pause / Cancel Auto-Advance** on the host countdown switches the current room back to Manual, cancelling any pending transition without changing scores, resources or submissions. Switch back to Auto at any time to resume, with a new countdown if everyone has already submitted.
- The automatically synced introduction also supports the Ready/Briefing Complete action in Auto mode. No countdown begins if zero human participants are online.

### Dropouts and AI

- Only **teams with at least one connected human player** are required in the main-game submission threshold. AI teams are excluded from the human threshold and are submitted by the server; they never hold the game up.
- For anonymous reflections and the mediation dilemma, the threshold is **every currently connected player**, counted individually. Reconnecting players can cancel a pending reveal if their answer has not yet been submitted; the full count is recalculated.
- If no human team is connected, Auto does not silently complete the match. The main host can still reveal/advance manually.
- The separate internal deadline does not automatically reveal in Manual mode. After expiry, the host can reveal or add 60 seconds; late phone submissions require an extension.

## Upload to GitHub Desktop and deploy to Render

1. Extract the ZIP **without keeping an additional project-folder layer**. The ZIP root already contains `server.js`, `package.json`, `game-data.js`, `ai-engine.js`, `reality-content.js`, `render.yaml`, `public/`, `tests/` and docs.
2. Open your GitHub Desktop cloned repository. Paste the *contents* of this ZIP into the exact repository folder where your existing `server.js` is located, replacing old files. If Render already uses a subfolder via **Root Directory**, preserve that location; do not change Root Directory unless you deliberately moved the files.
3. Commit and **Push origin**. On Render, verify: Web Service / Node / `npm install` / `npm start`; health check `/api/health`. When deployed, the health endpoint reports **version `3.3.0`**.
4. Create a new room after deployment (old in-memory room codes are not guaranteed to survive a restart). Confirm game length and pacing in the lobby. Try **Standard / 4 rounds** with at least two humans, then Auto (Reveal only) and Reality Check before using with a class.

To test locally: `npm install`, `npm test`, `npm start`; visit `http://localhost:3000/host.html` and join from a mobile browser using the QR code (phones need a routable address, not `localhost`). No external AI service/API key is needed. The **Three.js 3D board uses a CDN**, so it requires internet to load 3D; the static city artwork remains available as fallback.

**Operational limitation:** Rooms normally live only in server memory. Deploys, restarts and Render free-instance sleep may reset live room state. Do not redeploy during an active session. A local save-file option exists, but Render free filesystems are ephemeral, not a durable database.

---

## Original game documentation (Version 3.2 reference)

# Conflict Economy Ventures 2040 — 3D Tycoon + AI Rival Teams

**Version 3.2 — AI/NPA Edition + Reality Check debrief** — An educational, satirical, host-controlled multiplayer game for conflict-economy and mediation discussions.

This is a complete Node.js + Express + Socket.IO web application with a Three.js holographic tabletop on the host screen and a lightweight optional 3D emblem on phones. It preserves the QR-code lobby, player reconnection, custom team counts and private moderator access.


## NEW in Version 3.2: The Reality Check — Mediation Debrief

After the final investment awards, the **main host** sees a new **Begin Reality Check** button. It opens a separate educational phase without altering any score, resource balance, AI behavior, or earlier round.

This feature works in **Quick (3-round), Standard (4-round), and Full (5-round)** games, whether there are zero AI rivals or four AI rivals.

### Live post-game flow (recommended 4–5 minutes)

1. **Individual reflection on every phone.** Each human participant sees three short questions connecting profit and cohesion, resource leverage and dependency, and the prospect of negotiating with a faction. They submit their own answers, rather than one team captain answering for everyone. The host sees a live count, **not the text**, until revealing.
2. **Anonymous reflection reveal.** The host displays submitted responses in three columns. Names and team identifiers are not displayed. Responses appear as written, so participants should avoid identifying themselves in the text if they wish to remain anonymous.
3. **Resource-to-mediation comparison.** The host and every phone receive the same matrix connecting diamonds, oil pipelines, industrial copper/cobalt and checkpoint taxation to process-design questions. The slide explicitly cautions that political context and institutions also matter.
4. **The Peace Nobody Wants.** Each participant chooses one of four mediation entry points from their own phone, optionally gives a short rationale, and submits privately. The host sees participation counts only until pressing **Reveal mediation decisions**.
5. **Discussion and final takeaways.** All devices show the poll distribution and anonymous arguments, followed by three lessons: map who controls revenue, negotiate incentives, and consider meaningful inclusion.

**Main host controls:** Begin Reality Check → Reveal reflections → Resource comparison → Launch mediation dilemma → Reveal poll → Conclude. Host controls may advance even when not everybody submits, keeping the workshop on time. Moderators can observe but cannot advance stages. A browser-supported **Read aloud** button narrates each stage. Human answers are never auto-generated for AI teams.

**Important:** Once the investment awards are announced, VC ratings are closed, and no Reality Check event changes the game's final leaderboard. A reset clears the debrief answers. With Render Free's in-memory rooms, a server restart can still reset the room; an optional `SAVE_FILE` can write local snapshots, but an ephemeral free-service filesystem is not persistent storage.

## Included since Version 3.1: AI / Non-Player Team (NPA) mode

**No external AI subscription, API key, Python, or additional service is required.** The opponents are driven by a transparent, server-side strategic decision engine (`ai-engine.js`) rather than a generative LLM. Each AI faction participates in the **same 3-, 4-, or 5-round resource simulation** as human teams.

### Play alone or with a small group

1. In the host **Investor Lobby**, choose **Total teams (human + AI)** and **AI rival teams (0–4)**, plus an AI personality.
2. You can click **Add AI Rival Team (NPA) +** repeatedly; the host automatically increases the total teams if required. Alternatively choose an exact count in the selector and click **Save settings**.
3. Example for one player: **Total teams = 4, AI rivals = 3**. That yields one human team and three AI competitors. For a human against four AIs, set **Total teams = 5, AI rivals = 4**.
4. At least one human player and one human team are required. AI rivals **do not need phones, QR codes or ready buttons**. Human players still join by scanning the normal QR code. Multiple humans are randomly distributed across the **human-only** slots.
5. Click **Randomly assign humans + activate AI rivals**. Players receive their original private faction cards and team briefing. On the host screen and Three.js tabletop, AI teams have visibly distinct `[AI]` labels and an AI beacon.
6. Play normally: real people use their phones, while the server submits AI decisions, calculates all resources and updates the same host dashboard/leaderboard.

### AI personalities

| Personality | Behavior |
|---|---|
| **Cautious Diplomat** | Prioritizes stability, worker morale, settlement and alliances; uses influence during a stability collapse |
| **Aggressive Profiteer** | Favors cash growth, market power and competitive talent recruitment, but still responds to serious labor threats |
| **Adaptive Opportunist** | Changes priorities with the human teams' economic strength, labor conditions and geopolitical shocks |

The same baseline personality applies to all NPA teams in a room, but decisions still differ by resource type, workforce sentiment, economic strength, and their current conditions. Decision scoring considers **Capital, Workforce, Influence, Stability, Intel and Morale**. Adaptive opponents compete harder when humans lead and become more cautious/cooperative when human teams struggle; it does not secretly change human scores.

### AI timing and diplomacy

- NPC factions normally display **Thinking** for a random **3–6 seconds**, then silently lock their choices. Actual choice text stays hidden until reveal.
- **If all human teams submit earlier**, the server completes the remaining AI submissions immediately, without waiting for a fake countdown.
- The host may always **Reveal** early or wait for the round timer. No AI players need to press Ready/Submit.
- In the **Full** five-round game, AI factions can initiate **private trade, alliance or talent recruitment bids**. Human recipients see offers on their phones and can accept/decline trade and alliances, or fund a **$0.18B staff-retention response** to a poaching attempt. AI recipients assess and answer human offers based on resources and personality.
- AI wage settlements and stabilization measures affect resources and the news ticker. Strikes, defections, protest crowds, asset towers, rankings and final archetypes work for NPC teams too.
- In **Quick** three-round mode, the backchannel round is intentionally skipped; play Standard or Full mode to use AI diplomacy.

### Safeguards and constraints

- All AI logic and balances are authoritative on the **server**, not fabricated by a player phone.
- AI choice previews are not distributed to competing human teams before Reveal. Rival offers are only visible to their sender and recipient until resolved.
- The ability to select **0 AI teams** preserves the original human-only multiplayer experience.
- AI opponents are **rule-based strategic agents** rather than ChatGPT API-powered natural-language agents.
- Game progress remains in server memory on Render Free by default; a restart or spin-down resets active rooms. Do not redeploy during an active session.

## Quick start (locally)

Requirements: Node.js **20 or newer**, an internet connection for the first `npm install`, and (for the optional 3D layer) access to the pinned Three.js CDN.

```bash
npm install
npm start
```

Visit **http://localhost:3000/host.html**. Click **Create multiplayer room**. A six-character code and QR appear. Players use **http://localhost:3000/player.html?room=ABC123** (replace with the actual code). Phones on the same Wi-Fi cannot connect to *your own computer's* `localhost`; use your computer's LAN IP, e.g. `http://192.168.1.20:3000/host.html`, or deploy to Render for internet play. Your firewall must allow the port.

## Deploy to GitHub + Render

**This downloadable ZIP has `server.js`, `package.json`, `public/`, etc. directly at its root, not inside an extra wrapper folder.** This avoids the `ENOENT package.json` error that appeared in a previous deployment.

1. Extract the entire ZIP. **Upload the extracted contents**, including folders (`public`, `tests`, `.github`) to the root of a new GitHub repository. GitHub Desktop is recommended for preserving directories.
2. Confirm the repository's main page shows `server.js`, `ai-engine.js`, `game-data.js`, `reality-content.js`, `package.json`, `render.yaml`, `public/`, `tests/` and `README.md` at the same level.
3. Open [dashboard.render.com](https://dashboard.render.com/), choose **New → Web Service** and connect this repository. Choose **Node**, the `main` branch, and the region you prefer.
4. **Root Directory: leave blank** when these files are in the repository root. If you accidentally uploaded a parent folder, either move its contents to root or set Root Directory to that exact folder name.
5. **Build Command:** `npm install` · **Start Command:** `npm start` · **Health Check Path:** `/api/health` · **Instance:** Free if available.
6. Deploy. Once Render says **Live**, visit `https://YOUR-SERVICE.onrender.com/host.html`. It should open a working host console. `.../api/health` should return `{"ok":true,...}`.
7. Create a new room and have several devices join through the QR. **Never use an old room code after a server restart**, unless using an appropriately configured persistent store.

The included `render.yaml` can also be used with Render Blueprint deployment. Render sets the `PORT` environment variable automatically. The server listens on `0.0.0.0`.

## How to run a game

1. **Lobby:** Main host creates a room. Choose team count **1–32** and **Quick (3 rounds)**, **Standard (4 rounds)** or **Full (5 rounds)**. Players join and select avatars. Main host may copy a **private moderator link** for co-hosts; ordinary room links do not grant host powers.
2. **Assign teams:** Everyone is randomly and approximately evenly allocated. *All player phones immediately receive the shared 2040 story, a private faction card, a secret mandate, and their starting resources.* Every participant presses **Briefing Complete**; the host sees readiness live. The host may force-start when someone cannot mark ready.
3. **Rounds:** Every phone shows the same round title but a **resource-specific scenario**, three choices and the likely trade-offs. Teams discuss; any teammate can lock the team's one decision. Host sees submitted/awaiting indicators without the answers.
4. **Reveal:** The first of (a) all teams submitting, (b) timer expiry, or (c) host clicking Reveal unlocks outcomes together. The server applies consequences, then pays *passive income* if the workforce is not on strike. Result screens and rankings synchronize immediately.
5. **Strike resolution:** When morale drops below **35/100**, the team strikes and earns **zero passive income**. During the next active round, any teammate can make a wage settlement (spend **$0.35B**, +28 morale, +1 stability) or initiate mediation (spend **2 influence stars**, +20 morale, +2 stability). A strike ends once morale is at least **45** at negotiation time or **48** at reveal.
6. **Defections:** If morale falls below **25** at reveal, some employees quit or move to a higher-morale rival. Their headcount is removed from the original team and may be added to the rival.
7. **Diplomacy (Full mode, Round 4):** Each team can send **one private offer**: a trade agreement, an alliance, or a unilateral recruitment bid. Recipient teams may accept/decline trade and alliance invitations; poaching remains private. Deals settle at reveal if the required resources are available.
8. **Summit (Round 5 or Quick Round 3):** Civil society participation, revenue governance and negotiated oversight determine the final portfolio. End titles are satirical archetypes (e.g., People's Champion, Shadow Oligarch, Sweatshop Warlord).
9. **Host/Moderators:** Everyone with a private moderator invitation can rate Profit, Organizational Survival, and Market Power **independently** on a 0–5 scale. The server averages individual ratings. Only the owner controls progression, reveals, resets, or timing.

**Quick mode order:** Seed & Recruitment → Black Swan & Civil Unrest → The 2040 Peace Summit.  
**Full mode order:** Seed & Recruitment → Supply Chain & Labor → Black Swan → Backchannel Diplomacy & Poaching → 2040 Peace Summit.

## Resources and simulated economics

All numerical values are **fictional gameplay units**, not estimates of real armed groups or real mining/oil enterprises.

| Resource | Meaning | How it changes |
| --- | --- | --- |
| Venture Capital ($B) | Available fictional cash | Investment decisions, income, transfers, wages |
| Workforce (people) | Skilled workers and local staff | Recruitment, resignation, poaching, workplace policy |
| Political Influence (★) | Access, bargaining and legitimacy resources | Negotiations, deals, commitments |
| Regional Stability (🛡) | Public trust and operating environment | Social settlement, labor relations, crises |
| Intel / Tech (◈) | Information and advanced capability | Technology investments, training and audits |
| Morale / Legitimacy (0–100) | People's willingness to support operations | Wage policy, grievances, participation, extraction |

At **6+ Intel nodes**, the team receives a private early-warning brief and unlocks an additional advanced action in later rounds. **Stability at 2 or below** triggers a regional crisis and reduces income; noninclusive choices during the Black Swan and final Summit phases can also trigger citizen-coalition sanctions.

The server—not phones—holds and updates all balances. At each reveal it applies decisions, resolves accepted deals, simulates defections and strikes, then credits passive income to active teams. Unsubmitted choices receive a disadvantage so abstention cannot reliably beat a costly substantive choice. A team score combines all resource holdings plus averaged VC ratings.

## Visuals

- The host board is a real Three.js scene assembled from 3D geometry: four distinct regional asset types, animated convoys, infrastructure towers that grow with capital, colored team labels, and protest crowds which appear during strikes. Drag to orbit, use the mouse wheel to zoom, click a team hub to inspect it.
- Supports custom team counts: additional teams are organized on a scaled tabletop grid rather than overlapping the original four hubs.
- Player screens use smaller Three.js emblems without a full map.
- The interactive 3D scene requires WebGL and an internet connection to load `three@0.180.0` from jsDelivr. **If CDN access or WebGL fails, gameplay remains functional** and the included high-quality 2040 city artwork is shown as a static fallback.
- The animation loop targets ~30fps on the host and ~22fps on mobile, caps pixel ratio, respects reduced-motion preferences and suspends rendering in background tabs.

## Tests

```bash
npm test
```

Tests additionally verify AI-only slots, mixed human/AI teams, 3–6-second autonomous submissions, early reveal, personality-based strategy, stabilization and bilateral offers. Tests verify the five-round data, distinct scenarios, room assignments, synchronized briefings, private mandates, authoritative decision processing, compounding income, labor strikes and wage settlement, diplomatic offers, moderator rating, and Quick mode progression. These tests use lightweight test doubles so the core protocol tests can be run in constrained CI. A genuine multi-phone Socket.IO test is still recommended on your deployed service before a live event.

## Operational and privacy notes

- Room state and secrets are held in **server memory** for the default Render configuration. On a free Render service, a restart/spin-down will erase rooms and progress. *“Persistent resources” here means persistent throughout the running game's rounds, not durable cloud storage across restarts.*
- To keep a local snapshot through local server restarts, set `SAVE_FILE=./data/rooms.json` (see `.env.example`). This uses local filesystem writes and is **not durable on Render Free**. For production persistence across restarts, use a managed persistent database or Redis plus appropriate migration and backup planning.
- Main-host access uses a random secret stored in the creating browser's localStorage; moderator access uses a separate private invitation fragment. Keep moderation links private. The room code alone does not authorize host actions.
- Joining after the game starts requires a saved player token (reconnection). Team choices and private faction profiles are never sent to other teams before result reveal; only participants in a diplomatic offer see its terms.
- An ordinary browser reload reconnects when the same browser still has its credentials; using Private Browsing or clearing browser storage discards access.
- Do not enter real classified information, sensitive participant details, or actual organizational plans. This is an educational game.

## Project structure

```
server.js                 Express, Socket.IO, game engine, authoritative state
ai-engine.js              Independent, state-aware AI decision engine
package.json              Build and start commands
render.yaml               Render Blueprint
 game-data.js             Fictional 2040 story, faction briefs, 5-round options
public/
  host.html / host.js       Host dashboard and game controls
  player.html / player.js   Mobile player interface, decisions and negotiations
  common.js / styles.css   Shared UI utilities and responsive styling
  world3d.js               Three.js dynamic CDN loader and 3D simulation
  assets/2040-territory.webp  High-quality static fallback map
 tests/                   Game-data and simulated multiplayer protocol tests
screenshots/              Preview screenshots
```

### Troubleshooting

- **Render `npm ERR! ENOENT /opt/render/project/src/package.json`:** GitHub files are nested in a subfolder while Root Directory is blank. Either set Render Root Directory to the actual folder name or upload the *contents* at repo root.
- **Render reports a 404 for `/host.html`:** Confirm that GitHub contains `public/host.html` and that Root Directory points to the directory with `server.js`.
- **Host page visible but player QR cannot join:** Check `/api/health`, whether the room was recreated after a restart, phone network access, and WebSocket connectivity.
- **3D scene not showing:** Check browser console for the CDN or WebGL. The game remains playable using the background artwork. Test Chrome, Edge, or Firefox with hardware acceleration.
- **Round advances unexpectedly:** The host reveals after the last submission; its timer also reveals when expired. Use the **+60 seconds** button before time is up.
- **Free Render cold start:** Keep the URL open and create a fresh room just before the event. For reliable long events, consider a paid instance and persistent backing store.
