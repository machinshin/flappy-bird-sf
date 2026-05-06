# Nebula Dash — TODO

## Weapons `[2026-05-06]`
- [ ] Basic cannon — fires a single projectile forward on a separate key/button, cooldown-limited
- [ ] Turret enemies — mounted on pylon faces, fire slow projectiles across the corridor at intervals
- [ ] Patrol drone enemies — sine-wave flight path through corridor, drop a shield star on destruction
- [ ] Mine enemies — stationary in corridor, arm after 1s, highly visible blinking red
- [ ] Homing seeker — spawns every 30 parsecs, slowly tracks player Y; must be shot or outlasted
- [ ] Weapon pickups — collect to switch weapon type (cannon, spread shot, laser beam)
- [ ] Spread shot — fires 3 projectiles in a fan, shorter range
- [ ] Laser beam — hold to sustain a continuous beam forward, drains a charge meter
- [ ] Bomb — lobs a slow arcing projectile that detonates in a radius, clears multiple enemies

## Rogue-like `[2026-05-06]`
- [ ] Weapon rogue-like upgrades — per-run picks: increased projectile speed, piercing shots, double-fire, reduced cooldown, auto-fire on thrust
- [ ] Weapon mutations — sector-specific weapon mods that activate for a sector then expire (homing projectiles, explosive rounds, shield-drain beam)
- [ ] Cursed weapons — powerful weapons with a drawback (e.g. laser beam that damages own shields if held too long)
- [ ] Per-run passive upgrades — pause every 10 parsecs, pick 1-of-3 random upgrades (larger invincibility window, faster thrust recharge, wider collision forgiveness, shield regen, etc.)
- [ ] Sector mutations — every 20 parsecs the visual theme shifts and a new hazard rule activates (pylons move vertically, double pylon pairs, reversed gravity burst)
- [ ] Random mid-run events — timed curses & boons ("GRAVITY SURGE: doubled gravity for 10s", "WARP FIELD: gap widens for 10s")
- [ ] Meta progression — earn credits per parsec, spend between runs on permanent starting perks (extra starting HP, slower difficulty ramp, wider base gap)

## Gameplay `[2026-05-06]`
- [ ] Moving obstacles — pylons that slide up/down, bouncing off walls
- [ ] Power-ups — slow-motion field, speed boost, spawning in corridors
- [ ] Per-run passive upgrades — choose 1-of-3 at every 10th parsec (wider invincibility window, faster thrust recharge, etc.)
- [ ] Bonus score gates — optional tight gaps worth extra parsecs
- [ ] Boss corridors — moving obstacles that slide up/down in coordinated patterns

## Visuals & Polish `[2026-05-06]`
- [ ] Warp speed trail on the ship (motion blur streaks)
- [ ] Parallax planet/moon in the far background layer
- [ ] Shooting stars / animated star clusters
- [ ] Obstacle variety — rotating rings, angled barriers

## Progression & Content `[2026-05-06]`
- [ ] Multiple sectors — visual theme changes every N parsecs (asteroid field, nebula zone, warp tunnel)
- [ ] Unlockable ships with different sizes/hitboxes
- [ ] Daily challenge seed — same obstacle layout for everyone that day

## Meta / UI `[2026-05-06]`
- [ ] Leaderboard — localStorage top-10 with initials entry on game over
- [ ] Endless run score graph
- [ ] PWA manifest — installs to home screen on mobile

---

## Done

### Visuals & Polish
- [x] Spinning 3-pointed shield pickup stars (0.07 rad/frame, clearly readable spin) `[2026-05-06]`
- [x] Mid-ground parallax asteroid layer (irregular polygons, 0.9–1.3x speed) `[2026-05-06]`
- [x] Pylon width halved to match ship size (68 → 32px) `[2026-05-06]`
- [x] HUD shield stars top-left `[2026-05-06]`
- [x] Space station pylon obstacles with circuit patterns + hazard lights `[2026-05-06]`
- [x] Spaceship with engine glow, cockpit, swept wings, thrust particles `[2026-05-06]`
- [x] Parallax starfield + nebula background (3 depth layers) `[2026-05-06]`
- [x] Fullscreen TypeScript canvas game `[2026-05-06]`

### Gameplay
- [x] Star-shaped shield pickups — spawn in corridor gaps, never inside pylons `[2026-05-06]`
- [x] HP system — 5 shield cells to start, cap at 10, 90-frame invincibility on hit `[2026-05-06]`
- [x] Difficulty scaling every 5 parsecs `[2026-05-06]`

### Audio
- [x] Web Audio API sounds — thrust, score chime, explosion, ambient drone, hit, pickup `[2026-05-06]`

### Meta / UI
- [x] High score via localStorage `[2026-05-06]`
