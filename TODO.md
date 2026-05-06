# Nebula Dash — TODO

## Gameplay
- [ ] Moving obstacles — pylons that slide up/down, bouncing off walls
- [ ] Power-ups — slow-motion field, speed boost, spawning in corridors
- [ ] Per-run passive upgrades — choose 1-of-3 at every 10th parsec (wider invincibility window, faster thrust recharge, etc.)
- [ ] Bonus score gates — optional tight gaps worth extra parsecs
- [ ] Boss corridors — moving obstacles that slide up/down in coordinated patterns

## Progression & Content
- [ ] Multiple sectors — visual theme changes every N parsecs (asteroid field, nebula zone, warp tunnel)
- [ ] Unlockable ships with different sizes/hitboxes
- [ ] Daily challenge seed — same obstacle layout for everyone that day

## Visuals & Polish
- [ ] Warp speed trail on the ship (motion blur streaks)
- [ ] Parallax planet/moon in the far background layer
- [ ] Shooting stars / animated star clusters
- [ ] Obstacle variety — rotating rings, angled barriers

## Meta / UI
- [ ] Leaderboard — localStorage top-10 with initials entry on game over
- [ ] Endless run score graph
- [ ] PWA manifest — installs to home screen on mobile

## Done
- [x] Fullscreen TypeScript canvas game
- [x] Parallax starfield + nebula background
- [x] Spaceship with engine glow, thrust particles
- [x] Space station pylon obstacles with circuit patterns + hazard lights
- [x] Difficulty scaling every 5 parsecs
- [x] High score via localStorage
- [x] Web Audio API sounds — thrust, score chime, explosion, ambient drone, hit, pickup
- [x] HP system — 5 shield cells to start, cap at 10, 90-frame invincibility on hit
- [x] Star-shaped shield pickups — spawn in corridor gaps, never inside pylons
- [x] HUD shield stars top-left
