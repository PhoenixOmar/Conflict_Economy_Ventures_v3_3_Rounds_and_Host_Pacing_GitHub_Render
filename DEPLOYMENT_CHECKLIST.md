# Quick deployment checklist — GitHub → Render

- [ ] ZIP is extracted, not uploaded as a ZIP.
- [ ] Repository root shows `package.json`, `server.js`, `game-data.js`, `render.yaml`, `public/`.
- [ ] `public/host.html`, `public/player.html`, `public/world3d.js`, and `public/assets/2040-territory.webp` exist.
- [ ] Render service type: **Web Service**. Runtime: **Node**. Branch: **main**.
- [ ] Render **Root Directory**: blank **if files are at repository root**. If nested, use the precise subfolder.
- [ ] Build Command: `npm install`.
- [ ] Start Command: `npm start`.
- [ ] Health Check Path: `/api/health`.
- [ ] Render deployment says **Live**.
- [ ] `https://YOUR-SERVICE.onrender.com/api/health` returns `ok: true`.
- [ ] Host creates a **fresh** room. Two phones join from the QR.
- [ ] Host assigns teams; each phone sees **2040 story + private faction mandate**.
- [ ] Both phones tap Briefing Complete. Host sees readiness counts.
- [ ] Host starts Round 1; phones see their options; host sees submission ticks.
- [ ] With Manual mode, both teams submit; **no reveal occurs until the host clicks Reveal**. With Auto, a synchronized three-second banner appears on the host and phones before the reveal; balances then change.
- [ ] Try Quick (3), **Standard (4 with Backdeals)**, and Full (5) in *separate fresh games*.

**Important:** Render free instances may restart or sleep. Default room state resides in RAM and can disappear. Keep the old production game as a fallback until your new test session passes.

## AI/NPA deployment smoke test (Version 3.1)

1. Open the new host URL and create a **new** room. Older rooms from a previously running server are not compatible across code deployments.
2. Confirm the **Add AI Rival Team (NPA) +** button, AI count selector and personality selector are present.
3. Join **one phone**. Set **Total teams = 4, AI teams = 3, Personality = Cautious Diplomat**, and save the settings.
4. Start/assign. On the host, confirm **Aegis Syndicate [AI]**, **Helios Reconstruction [AI]**, and **Meridian Commerce [AI]**, plus the one human team.
5. Press **Briefing complete** on the phone and launch Round 1. Observe AI teams' status change from **Thinking** to **Submitted** after 3–6 seconds if you don't answer yet.
6. Press submit on the human phone. The screen should reveal without waiting for any other (non-existent) human players.
7. Select **Standard mode** in a second test room and reach the third round (Backdeals), or use **Full mode** and reach round four; verify private AI offers appear on the recipient's phone and that trade and talent-defense controls work.
8. Confirm the Three.js map displays AI labels/beacons and that the final leaderboard includes AI and human teams.
9. Finally test **AI teams = 0** to ensure the regular human-only classroom game still works.

If Render fails with `ENOENT package.json`, inspect GitHub. When `package.json` is one directory below the repository root, configure **Render → Settings → Root Directory** to that folder name, or move the project's contents into the repository root. Never set Root Directory to `public`—that folder contains only front-end assets.

## Reality Check post-game verification
- [ ] Finish a Quick-mode game. The main host sees **Begin Reality Check** after the award.
- [ ] Both host and participant phones change to the same reflection phase.
- [ ] Submit three answers on a phone; the host count updates but answers stay hidden.
- [ ] Host reveals, then opens the four-resource mediation matrix on all screens.
- [ ] Launch **The Peace Nobody Wants**, submit a phone vote, and reveal the class distribution.
- [ ] Final leaderboard and resources remain identical before and after the debrief.

## Version 3.3 host pacing checks
- [ ] Host top bar shows **Manual** as selected by default, plus **Auto behavior** and **Reading time** selectors.
- [ ] Standard **4 rounds** shows `seed → shock → diplomacy → summit`; in diplomacy, any human team member can send one confidential Backdeal and respond to another team's offer.
- [ ] In Manual, the last team submission does **not** reveal. Even if the round timer expires, Reveal and Extend remain host decisions.
- [ ] In Auto, submit from all currently active human teams: all phones and host display the same **3…2…1** banner before outcomes appear.
- [ ] Click **Pause / Cancel Auto-Advance** while counting down: banner disappears, game stays in the same phase, selected mode becomes Manual.
- [ ] Select **Reveal + next phase** and 12s reading time: results are displayed for 12 seconds, then the next round starts automatically.
- [ ] Disconnect a phone from an unsubmitted human team during Auto: active team count recalculates. Reconnect before countdown ends: pending reveal cancels until that team submits.
- [ ] After the award, host clicks **Begin Reality Check**. In Auto, reflections and mediation votes reveal only once **all currently connected players** submit; the same three-second banner appears.
- [ ] `/api/health` shows version `3.3.0`.
