# Validation record

## Automated

- All authored JS/MJS modules pass `node --check` via `npm run check`.
- 12 regression tests pass via `npm test`.
- Production build succeeds with 14 allowlisted files, approximately 0.94 MB before transport compression.
- Local ES-module, stylesheet and artwork references resolve.

## Browser exercised

- Eight portfolio routes render and navigate; external repository links resolve to verified public repositories.
- Operator/equipment canvases initialize. Rotate buttons work; gear and finish selections persist after reload.
- Settings dialog opens/closes, stores preferences and restores defaults.
- Reduced-motion preference chooses simplified drop.
- Simplified drop: deploy, steer, collect a chip, pause, resume, canopy and completed landing into Operator.
- 3D drop: aircraft approach, freefall, safety canopy and completed landing into Missions.
- Mobile viewport (390×844): no horizontal overflow on any of the eight portfolio pages; HUD text spacing fixed after visual inspection.
- Touch controls move the player to all three portfolio terminals; collecting all three produces MISSION COMPLETE.
- Manual 3D jump and parachute deployment work; pause and resume work. Training fire/reload/pause controls were exercised.
- No browser console errors during the exercised updated navigation, exploration and drop flows.
- Hosted owner preview deployment succeeded.

## Further validation

Actual iOS/Android device performance, gamepad support (not implemented), cross-browser pointer-lock behavior and broad GPU compatibility have not been certified. The reduced-motion/non-WebGL mode provides an independent playable fallback. Real-world device testing remains appropriate before a wide public launch.
