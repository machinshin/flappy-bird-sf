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

## Rogue-like
- [ ] Per-run passive upgrades — pause every 10 parsecs, pick 1-of-3 random upgrades (larger invincibility window, faster thrust recharge, wider collision forgiveness, shield regen, etc.)
- [ ] Sector mutations — every 20 parsecs the visual theme shifts and a new hazard rule activates (pylons move vertically, double pylon pairs, reversed gravity burst)
- [ ] Random mid-run events — timed curses & boons ("GRAVITY SURGE: doubled gravity for 10s", "WARP FIELD: gap widens for 10s")
- [ ] Meta progression — earn credits per parsec, spend between runs on permanent starting perks (extra starting HP, slower difficulty ramp, wider base gap)

## Meta / UI
- [ ] Leaderboard — localStorage top-10 with initials entry on game over
- [ ] Endless run score graph
- [ ] PWA manifest — installs to home screen on mobile

## Done

### Gameplay
- [x] HP system — 5 shield cells to start, cap at 10, 90-frame invincibility on hit
- [x] Star-shaped shield pickups — spawn in corridor gaps, never inside pylons
- [x] Difficulty scaling every 5 parsecs

### Visuals & Polish
- [x] Fullscreen TypeScript canvas game
- [x] Parallax starfield + nebula background (3 depth layers)
- [x] Mid-ground parallax asteroid layer
- [x] Spaceship with engine glow, cockpit, swept wings, thrust particles
- [x] Space station pylon obstacles with circuit patterns + hazard lights
- [x] HUD shield stars top-left

### Audio
- [x] Web Audio API sounds — thrust, score chime, explosion, ambient drone, hit, pickup

### Meta / UI
- [x] High score via localStorage
