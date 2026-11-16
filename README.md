# Stormfront Portfolio

Bhavesh Sharma's original military-inspired portfolio, with a playable parachute insertion, a 3D equipment gallery and an optional single-player airfield mission. Every portfolio section is accessible without playing.

Hosted owner preview: https://bhavesh-stormfront-portfolio.scenicboat64.chatgpt.site

The hosted preview currently has private owner access. The source repository and static build can be used for public hosting.

## Run locally

Requires **Node.js 20+**. No package installation is necessary; Three.js r160 is bundled with its MIT license.

```sh
git clone https://github.com/bhavesh-210/stormfront-portfolio.git
cd stormfront-portfolio
npm run dev
```

Open **http://127.0.0.1:5187**. To use another port: `PORT=5190 npm run dev`.

## Production

```sh
npm run check
npm test
npm run build
npm run preview
```

The allowlisted production output is in `dist/`. Upload that directory to a static host. All asset paths are relative, including support for hosting below a repository path. `npm run preview` serves `dist/` at the same local port; stop the development server first or choose another `PORT`. Open over HTTP(S), not `file://`.

The build has no server-side application, accounts, API keys, database, tracking or contact-form service. Preferences use browser local storage and continue to work in memory if storage is blocked. Google Fonts is optional; system fonts are available as a fallback.

## Included experience

- Cinematic lobby, project briefings, education/bio, interests and contact links.
- Original procedural 3D operator with equipment, fabric pattern, helmet, headset and vest.
- Rotatable armory with a field terminal, archive case, comms radio and fictional training carbine; olive, sand and graphite finishes.
- Equipment selection and finish saved on the device. The carbine is only used in optional training; other equipment is an inspection gallery.
- Moving original transport aircraft, steerable freefall, manually deployed or automatic safety parachute, three collectible flight-intel chips and landing destinations that open portfolio sections.
- Non-combat airfield exploration with three collectible portfolio dossiers and an ending/replay flow.
- Optional drone training with six targets, aiming, firing, reload, health, cover collision and shot occlusion.
- Tactical minimap, keyboard-look controls, mobile steering, drag-to-look, pause, skip and replay.
- Dawn/overcast lighting presets for the same map, quality/sensitivity/audio settings.
- Turn-based simplified drop for reduced motion and devices without WebGL. Also available explicitly from the briefing.
- Original procedural geometry/materials and synthesized sound. No copied game assets, fake awards, currency, purchases or checkout.

## Controls

| Action | Desktop | Touch / alternative |
|---|---|---|
| Move / steer | WASD or arrow keys | Direction buttons |
| Jump from aircraft / deploy chute | Space | Jump / Open parachute |
| Look in airfield | Click scene to capture mouse | Drag the scene |
| Look without mouse capture | J/L left/right, I/K up/down | Look buttons |
| Sprint / ground jump | Left Shift / Space | Ground jump is keyboard-only |
| Collect nearby dossier | E | Collect intel |
| Pause / release mouse | Escape | Pause / Resume |
| Fire (training only) | Left click or F | Fire |
| Aim / reload (training only) | Right click / R | Reload; aiming is desktop-only |
| Inspect model | Drag, or left/right arrows while canvas focused | Drag or rotate buttons |
| Inspector zoom | + / − while canvas focused | Browser zoom remains available |

The simplified drop advances one turn per steering or Descend action. Space deploys; Escape pauses. It ends automatically on landing. Settings always respect the system reduced-motion preference. The normal drop takes roughly 15–22 seconds depending on when the canopy opens.

## Edit content and assets

- **`profile.js`**: personal information, projects, interests, confirmed skills and contribution links. Fill the empty `skills` list only with confirmed skills. Alumini details and any demo URLs still need confirmation; no placeholders are presented as working demos.
- **`main.js`**: page composition, portfolio routing, launch flow and interface handlers.
- **`models.js` / `inspector.js`**: original model factories and on-demand 3D inspection. To add licensed models later, load them here and retain the source/license attribution.
- **`game.js` / `materials.js`**: 3D mission, environment, movement, terrain and game interaction.
- **`drop.js` / `simple-drop.js`**: pure fallback game rules and accessible turn-based UI.
- **`settings.js`**: validated local preferences.
- **`public/lobby.jpg`**: generated cinematic lobby artwork; replace with your own image at the same path.
- **`style.css` / `index.html`**: visual system, responsive layouts, settings dialog and game HUD.
- **`build.mjs` / `server.mjs`**: allowlisted static packaging and local HTTP preview.

## Verified content correction

GitHub reports openSUSE/open-build-service **#20538 as closed, not merged**. The maintainer's closing comment points to #20621 as the separate solution. The portfolio describes the proposed fix and links to #20538 without claiming a merge or an award. Source: https://github.com/openSUSE/open-build-service/pull/20538#issuecomment-6800122585

## Validation

`npm run check` checks every authored JavaScript module. `npm test` runs 12 regression tests for movement collision/speed, reload guards, paused firing, shot occlusion, settings/storage failures, fallback pause/landing/canopy/intel rules, landing destinations, finite model geometry and local asset resolution. CI runs syntax checks, tests and the production build.

Browser checks covered all eight navigation sections, persisted selection, model rotation, settings, the reduced-motion route, fallback intel/pause/resume/landing, aircraft insertion and its portfolio transition, and touch movement/dossier collection. All eight portfolio pages fit a 390px viewport without horizontal overflow. The original mission's completion, failure and reload flows were also exercised during development. See `QA.md` for the final validation record and remaining device checks.

## Visual scope

This is an original **single-level browser portfolio/game**, not Call of Duty or a AAA game. The realistic lobby operator is a **2D generated image**. The playable scene and inspector are actual 3D, with **procedural, stylized models**. Photorealistic character animation, motion capture, multiplayer, a full campaign, vehicles and commercial-game asset fidelity are not implemented or claimed. Achieving that visual target would require a separate licensed/custom asset and animation production effort.

## Attribution

Three.js r160: MIT, license in `public/vendor/LICENSE`. Scene geometry, texture patterns and synthesized audio are generated by this project's code. Lobby artwork was generated for the portfolio. No official Call of Duty logos, character models, maps, skins, audio or menus are included. This independent portfolio is not affiliated with Activision.
