# Nebula Dash

A fullscreen sci-fi Flappy Bird clone built with TypeScript and the Web Audio API. No external dependencies — all visuals and sounds are generated procedurally on the canvas.

## Play

```bash
npm install
npm run build
# Open index.html in your browser
```

Or with a local dev server:

```bash
npm run serve
# http://localhost:3000
```

## Controls

| Input | Action |
|---|---|
| `Space` | Thrust |
| `↑` Up Arrow | Thrust |
| Tap / Click | Thrust |

## Features

- Parallax starfield with three depth layers and twinkle
- Nebula gradient background with soft radial clouds
- Detailed spaceship with engine glow, cockpit, swept wings, and thrust particles
- Space station pylon obstacles with circuit grid patterns, warning stripes, and pulsing hazard lights
- Energy corridor field between obstacles
- Screen shake on death with particle explosion
- Difficulty scaling every 5 parsecs (speed ↑, spawn interval ↓, gap ↓)
- High score persisted in `localStorage`
- Scanline overlay for retro CRT feel

## Audio (Web Audio API — no files)

| Event | Sound |
|---|---|
| Thrust | Sawtooth sweep + bandpass noise burst |
| Corridor cleared | Ascending two-note chime (C5 → G5) |
| Death | Low-frequency boom + debris noise + high crackle |
| Gameplay | Detuned sawtooth drone, fades in/out with game state |

## Development

```bash
npm run dev   # tsc --watch (recompiles on save)
```

Source: `src/game.ts` → compiled to `dist/game.js`
