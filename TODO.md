# Nebula Dash — TODO

## Gameplay
- [ ] Moving obstacles — pylons that slide up/down, bouncing off walls
- [ ] Power-ups — slow-motion field, speed boost, spawning in corridors
- [ ] Per-run passive upgrades — choose 1-of-3 at every 10th parsec (wider invincibility window, faster thrust recharge, etc.)
- [ ] Bonus score gates — optional tight gaps worth extra parsecs
- [ ] Boss corridors — moving obstacles that slide up/down in coordinated patterns

## Weapons
- [ ] Basic cannon — fires a single projectile forward on a separate key/button, cooldown-limited
- [ ] Turret enemies — mounted on pylon faces, fire slow projectiles across the corridor at intervals
- [ ] Patrol drone enemies — sine-wave flight path through corridor, drop a shield star on destruction
- [ ] Mine enemies — stationary in corridor, arm after 1s, highly visible blinking red
- [ ] Homing seeker — spawns every 30 parsecs, slowly tracks player Y; must be shot or outlasted
- [ ] Weapon pickups — collect to switch weapon type (cannon, spread shot, laser beam)
- [ ] Spread shot — fires 3 projectiles in a fan, shorter range
- [ ] Laser beam — hold to sustain a continuous beam forward, drains a charge meter
- [ ] Bomb — lobs a slow arcing projectile that detonates in a radius, clears multiple enemies

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
- [ ] Weapon rogue-like upgrades — per-run picks: increased projectile speed, piercing shots (pass through enemies), double-fire (two projectiles per shot), reduced cooldown, auto-fire on thrust
- [ ] Weapon mutations — sector-specific weapon mods that activate for a sector and then expire (homing projectiles, explosive rounds, shield-drain beam)
- [ ] Cursed weapons — powerful weapons with a drawback (e.g. laser beam that also damages your own shields if held too long)

## Meta / UI
- [ ] Leaderboard — localStorage top-10 with initials entry on game over
- [ ] Endless run score graph
- [ ] PWA manifest — installs to home screen on mobile

## Done

### Gameplay
- [x] HP system — 5 shield cells to start, cap at 10, 90-frame invincibility on hit
- [x] Star-shaped shield pickups — spawn in corridor gaps, never inside pylons, spinning 3-pointed star
- [x] Difficulty scaling every 5 parsecs

### Visuals & Polish
- [x] Fullscreen TypeScript canvas game
- [x] Parallax starfield + nebula background (3 depth layers)
- [x] Mid-ground parallax asteroid layer
- [x] Spaceship with engine glow, cockpit, swept wings, thrust particles
- [x] Space station pylon obstacles with circuit patterns + hazard lights (width = half ship width)
- [x] HUD shield stars top-left

### Audio
- [x] Web Audio API sounds — thrust, score chime, explosion, ambient drone, hit, pickup

### Meta / UI
- [x] High score via localStorage
