"use strict";
// ─── Constants ───────────────────────────────────────────────────────────────
const GRAVITY = 0.50;
const THRUST = -10.5;
const OBSTACLE_W = 68;
const BASE_SPEED = 2.6;
const BASE_INTERVAL = 100; // frames between spawns
const BASE_GAP = 225;
const MIN_GAP = 155;
const SHIP_X = 130;
const SHIP_RADIUS = 20;
// ─── Audio Engine ─────────────────────────────────────────────────────────────
class AudioEngine {
    constructor() {
        this.ctx = null;
        this.master = null;
        this.droneOscs = [];
        this.droneGain = null;
    }
    boot() {
        if (!this.ctx) {
            this.ctx = new AudioContext();
            this.master = this.ctx.createGain();
            this.master.gain.value = 0.75;
            this.master.connect(this.ctx.destination);
        }
        if (this.ctx.state === 'suspended')
            this.ctx.resume();
        return this.ctx;
    }
    mkNoise(ctx, duration) {
        const n = Math.ceil(ctx.sampleRate * duration);
        const buf = ctx.createBuffer(1, n, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < n; i++)
            d[i] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource();
        src.buffer = buf;
        return src;
    }
    thrust() {
        const ctx = this.boot();
        const now = ctx.currentTime;
        // Noise burst — engine exhaust
        const ns = this.mkNoise(ctx, 0.18);
        const nf = ctx.createBiquadFilter();
        nf.type = 'bandpass';
        nf.frequency.value = 260;
        nf.Q.value = 0.7;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.45, now);
        ng.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        ns.connect(nf);
        nf.connect(ng);
        ng.connect(this.master);
        ns.start(now);
        ns.stop(now + 0.18);
        // Short sawtooth sweep — thrust kick
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.12);
        const og = ctx.createGain();
        og.gain.setValueAtTime(0.2, now);
        og.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(og);
        og.connect(this.master);
        osc.start(now);
        osc.stop(now + 0.12);
    }
    score() {
        const ctx = this.boot();
        const now = ctx.currentTime;
        // Ascending two-note chime: C5 → G5
        [[523.25, 0], [783.99, 0.09]].forEach(([freq, delay]) => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;
            const g = ctx.createGain();
            const t = now + delay;
            g.gain.setValueAtTime(0, t);
            g.gain.linearRampToValueAtTime(0.22, t + 0.008);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
            osc.connect(g);
            g.connect(this.master);
            osc.start(t);
            osc.stop(t + 0.22);
        });
    }
    explode() {
        const ctx = this.boot();
        const now = ctx.currentTime;
        // Low-frequency boom
        const boom = ctx.createOscillator();
        boom.type = 'sine';
        boom.frequency.setValueAtTime(110, now);
        boom.frequency.exponentialRampToValueAtTime(18, now + 0.9);
        const bg = ctx.createGain();
        bg.gain.setValueAtTime(1.0, now);
        bg.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
        boom.connect(bg);
        bg.connect(this.master);
        boom.start(now);
        boom.stop(now + 0.9);
        // Mid-range debris noise
        const ns1 = this.mkNoise(ctx, 0.7);
        const f1 = ctx.createBiquadFilter();
        f1.type = 'lowpass';
        f1.frequency.value = 1000;
        const g1 = ctx.createGain();
        g1.gain.setValueAtTime(0.7, now);
        g1.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        ns1.connect(f1);
        f1.connect(g1);
        g1.connect(this.master);
        ns1.start(now);
        ns1.stop(now + 0.7);
        // High crackle
        const ns2 = this.mkNoise(ctx, 0.25);
        const f2 = ctx.createBiquadFilter();
        f2.type = 'highpass';
        f2.frequency.value = 3500;
        const g2 = ctx.createGain();
        g2.gain.setValueAtTime(0.35, now);
        g2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        ns2.connect(f2);
        f2.connect(g2);
        g2.connect(this.master);
        ns2.start(now);
        ns2.stop(now + 0.25);
    }
    startDrone() {
        if (this.droneOscs.length)
            return;
        const ctx = this.boot();
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 190;
        filter.Q.value = 1.8;
        this.droneGain = ctx.createGain();
        this.droneGain.gain.setValueAtTime(0, ctx.currentTime);
        this.droneGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1.8);
        [[55, 0], [55, 14], [82.4, -6]].forEach(([freq, detune]) => {
            const o = ctx.createOscillator();
            o.type = 'sawtooth';
            o.frequency.value = freq;
            o.detune.value = detune;
            o.connect(filter);
            o.start();
            this.droneOscs.push(o);
        });
        filter.connect(this.droneGain);
        this.droneGain.connect(this.master);
    }
    stopDrone() {
        if (!this.droneGain || !this.ctx)
            return;
        const now = this.ctx.currentTime;
        this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, now);
        this.droneGain.gain.linearRampToValueAtTime(0, now + 0.6);
        const oscs = this.droneOscs;
        this.droneOscs = [];
        this.droneGain = null;
        setTimeout(() => oscs.forEach(o => { try {
            o.stop();
        }
        catch (_) { } }), 700);
    }
}
// ─── Game ────────────────────────────────────────────────────────────────────
class Game {
    constructor() {
        this.W = 0;
        this.H = 0;
        this.state = 'menu';
        this.shipY = 0;
        this.shipVY = 0;
        this.shipAngle = 0;
        this.obstacles = [];
        this.stars = [];
        this.particles = [];
        this.score = 0;
        this.best = 0;
        this.frame = 0;
        this.shake = 0;
        this.deathTimer = 0;
        this.speed = BASE_SPEED;
        this.interval = BASE_INTERVAL;
        this.gap = BASE_GAP;
        this.thrustCD = 0;
        this.audio = new AudioEngine();
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.best = +(localStorage.getItem('nbDash_best') ?? 0);
        window.addEventListener('resize', () => { this.resize(); this.makeStars(); });
        this.resize();
        this.makeStars();
        const onInput = () => this.handleInput();
        window.addEventListener('keydown', e => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                onInput();
            }
        });
        this.canvas.addEventListener('pointerdown', onInput);
        requestAnimationFrame(() => this.loop());
    }
    // ─── Setup ─────────────────────────────────────────────────────────────────
    resize() {
        this.W = this.canvas.width = window.innerWidth;
        this.H = this.canvas.height = window.innerHeight;
    }
    makeStars() {
        this.stars = [];
        const n = Math.ceil(this.W * this.H / 2400);
        const speeds = [0.25, 0.7, 1.7];
        const sizes = [0.7, 1.3, 2.1];
        const alphas = [0.2, 0.4, 0.65];
        for (let i = 0; i < n; i++) {
            const l = Math.floor(Math.random() * 3);
            this.stars.push({
                x: Math.random() * this.W,
                y: Math.random() * this.H,
                speed: speeds[l],
                size: sizes[l],
                alpha: Math.random() * 0.4 + alphas[l],
                phase: Math.random() * Math.PI * 2,
                phaseSpeed: Math.random() * 0.04 + 0.01,
            });
        }
    }
    // ─── State transitions ─────────────────────────────────────────────────────
    handleInput() {
        if (this.state === 'menu')
            this.startGame();
        else if (this.state === 'playing')
            this.thrust();
        else if (this.state === 'over')
            this.state = 'menu';
    }
    startGame() {
        this.state = 'playing';
        this.shipY = this.H / 2;
        this.shipVY = 0;
        this.shipAngle = 0;
        this.obstacles = [];
        this.particles = [];
        this.score = 0;
        this.frame = 0;
        this.speed = BASE_SPEED;
        this.interval = BASE_INTERVAL;
        this.gap = BASE_GAP;
        this.thrustCD = 0;
        this.audio.startDrone();
    }
    // ─── Gameplay helpers ──────────────────────────────────────────────────────
    thrust() {
        if (this.thrustCD > 0)
            return;
        this.shipVY = THRUST;
        this.thrustCD = 10;
        this.audio.thrust();
        for (let i = 0; i < 12; i++) {
            this.particles.push({
                x: SHIP_X - 24,
                y: this.shipY + (Math.random() - 0.5) * 10,
                vx: -(Math.random() * 4 + 1.5),
                vy: (Math.random() - 0.5) * 2.5,
                life: Math.random() * 18 + 8,
                maxLife: 26,
                size: Math.random() * 5 + 2,
                r: 255, g: Math.floor(Math.random() * 120 + 80), b: 20,
                gravity: false,
            });
        }
    }
    spawnObstacle() {
        const minH = 60;
        const topH = Math.random() * (this.H - this.gap - minH * 2) + minH;
        this.obstacles.push({
            x: this.W + OBSTACLE_W,
            topH,
            botY: topH + this.gap,
            passed: false,
            phase: Math.random() * Math.PI * 2,
        });
    }
    collides() {
        const r = SHIP_RADIUS;
        if (this.shipY - r < 0 || this.shipY + r > this.H)
            return true;
        for (const o of this.obstacles) {
            if (SHIP_X + r > o.x && SHIP_X - r < o.x + OBSTACLE_W) {
                if (this.shipY - r < o.topH || this.shipY + r > o.botY)
                    return true;
            }
        }
        return false;
    }
    explode() {
        for (let i = 0; i < 55; i++) {
            const a = Math.random() * Math.PI * 2;
            const s = Math.random() * 8 + 1;
            const blue = Math.random() < 0.5;
            this.particles.push({
                x: SHIP_X, y: this.shipY,
                vx: Math.cos(a) * s,
                vy: Math.sin(a) * s - 1.5,
                life: Math.random() * 50 + 20,
                maxLife: 70,
                size: Math.random() * 6 + 2,
                r: blue ? 20 : 255,
                g: blue ? 170 : 80,
                b: blue ? 255 : 20,
                gravity: true,
            });
        }
    }
    // ─── Update ────────────────────────────────────────────────────────────────
    update() {
        this.frame++;
        const playing = this.state === 'playing';
        const starRate = playing ? 1 : 0.25;
        for (const s of this.stars) {
            s.x -= s.speed * starRate;
            s.phase += s.phaseSpeed;
            if (s.x < 0)
                s.x = this.W;
        }
        if (playing) {
            this.thrustCD = Math.max(0, this.thrustCD - 1);
            this.shipVY = Math.min(this.shipVY + GRAVITY, 14);
            this.shipY += this.shipVY;
            this.shipAngle = Math.max(-0.45, Math.min(0.65, this.shipVY * 0.045));
            if (this.frame % this.interval === 0)
                this.spawnObstacle();
            for (const o of this.obstacles) {
                o.x -= this.speed;
                o.phase += 0.05;
                if (!o.passed && o.x + OBSTACLE_W < SHIP_X) {
                    o.passed = true;
                    this.score++;
                    this.audio.score();
                    if (this.score % 5 === 0) {
                        this.speed = Math.min(BASE_SPEED + this.score * 0.09, 7.5);
                        this.interval = Math.max(62, Math.floor(BASE_INTERVAL - this.score * 1.3));
                        this.gap = Math.max(MIN_GAP, BASE_GAP - this.score * 2);
                    }
                }
            }
            this.obstacles = this.obstacles.filter(o => o.x > -OBSTACLE_W - 5);
            if (this.collides()) {
                this.explode();
                this.audio.explode();
                this.audio.stopDrone();
                this.shake = 24;
                this.deathTimer = 75;
                this.state = 'dying';
                if (this.score > this.best) {
                    this.best = this.score;
                    localStorage.setItem('nbDash_best', String(this.best));
                }
            }
        }
        else if (this.state === 'dying') {
            this.shipVY = Math.min(this.shipVY + GRAVITY, 14);
            this.shipY += this.shipVY;
            this.deathTimer--;
            if (this.deathTimer <= 0)
                this.state = 'over';
        }
        for (const p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.gravity)
                p.vy += 0.18;
            p.life--;
        }
        this.particles = this.particles.filter(p => p.life > 0);
        if (this.shake > 0)
            this.shake--;
    }
    // ─── Drawing ───────────────────────────────────────────────────────────────
    drawBg() {
        const ctx = this.ctx;
        const g = ctx.createLinearGradient(0, 0, this.W, this.H);
        g.addColorStop(0, '#000512');
        g.addColorStop(0.4, '#040018');
        g.addColorStop(1, '#000512');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, this.W, this.H);
        // Nebula clouds
        const clouds = [
            [this.W * 0.12, this.H * 0.22, 190, '70,0,160'],
            [this.W * 0.78, this.H * 0.68, 230, '0,50,170'],
            [this.W * 0.52, this.H * 0.82, 160, '0,100,190'],
            [this.W * 0.88, this.H * 0.18, 145, '80,0,130'],
            [this.W * 0.35, this.H * 0.55, 120, '40,0,100'],
        ];
        for (const [cx, cy, r, c] of clouds) {
            const ng = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
            ng.addColorStop(0, `rgba(${c},0.1)`);
            ng.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = ng;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    drawStars() {
        const ctx = this.ctx;
        for (const s of this.stars) {
            const a = s.alpha * (0.62 + Math.sin(s.phase) * 0.38);
            ctx.fillStyle = `rgba(200,225,255,${a.toFixed(2)})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    drawShip(x, y, angle, alpha = 1) {
        const ctx = this.ctx;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(x, y);
        ctx.rotate(angle);
        // Engine glow
        const eg = ctx.createRadialGradient(-26, 0, 0, -26, 0, 42);
        eg.addColorStop(0, 'rgba(0,190,255,0.6)');
        eg.addColorStop(0.45, 'rgba(0,80,200,0.28)');
        eg.addColorStop(1, 'rgba(0,20,120,0)');
        ctx.fillStyle = eg;
        ctx.beginPath();
        ctx.ellipse(-26, 0, 42, 24, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = '#00bbff';
        ctx.shadowBlur = 20;
        // Top wing
        ctx.fillStyle = '#0a1e38';
        ctx.strokeStyle = '#006fa0';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(4, -10);
        ctx.lineTo(-10, -32);
        ctx.lineTo(-23, -13);
        ctx.lineTo(-18, -8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Bottom wing
        ctx.beginPath();
        ctx.moveTo(4, 10);
        ctx.lineTo(-10, 32);
        ctx.lineTo(-23, 13);
        ctx.lineTo(-18, 8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Hull
        ctx.fillStyle = '#0d2848';
        ctx.strokeStyle = '#00ccff';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(32, 0);
        ctx.lineTo(15, -10);
        ctx.lineTo(-17, -8);
        ctx.lineTo(-30, 0);
        ctx.lineTo(-17, 8);
        ctx.lineTo(15, 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Accent stripe
        ctx.strokeStyle = 'rgba(0,210,255,0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(6, -5);
        ctx.lineTo(-8, -5);
        ctx.moveTo(6, 5);
        ctx.lineTo(-8, 5);
        ctx.stroke();
        // Cockpit
        ctx.shadowBlur = 10;
        ctx.fillStyle = 'rgba(80,215,255,0.22)';
        ctx.strokeStyle = '#00eeff';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(11, -4, 11, 6.5, -0.18, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Engine nozzle
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#061420';
        ctx.strokeStyle = '#00aaff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-17, -6);
        ctx.lineTo(-30, -8);
        ctx.lineTo(-30, 8);
        ctx.lineTo(-17, 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Engine core
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 28;
        ctx.fillStyle = '#90ffff';
        ctx.beginPath();
        ctx.ellipse(-30, 0, 6.5, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    drawPylon(x, y, w, h, phase, face) {
        const ctx = this.ctx;
        const pls = Math.sin(phase) * 0.35 + 0.65;
        // Body gradient
        const bg = ctx.createLinearGradient(x, 0, x + w, 0);
        bg.addColorStop(0, '#030b18');
        bg.addColorStop(0.5, '#060f22');
        bg.addColorStop(1, '#030b18');
        ctx.fillStyle = bg;
        ctx.fillRect(x, y, w, h);
        // Circuit grid
        ctx.strokeStyle = 'rgba(0,70,155,0.38)';
        ctx.lineWidth = 1;
        for (let gy = y + 18; gy < y + h; gy += 18) {
            ctx.beginPath();
            ctx.moveTo(x, gy);
            ctx.lineTo(x + w, gy);
            ctx.stroke();
        }
        for (let gx = x + 14; gx < x + w; gx += 14) {
            ctx.beginPath();
            ctx.moveTo(gx, y);
            ctx.lineTo(gx, y + h);
            ctx.stroke();
        }
        // Warning stripe band near the gap face
        const sH = Math.min(36, h * 0.28);
        const sY = face === 'down' ? y + h - sH : y;
        const sw = sH / 5;
        for (let i = 0; i < 5; i++) {
            ctx.fillStyle = i % 2 === 0 ? 'rgba(255,90,0,0.30)' : 'transparent';
            ctx.fillRect(x, sY + i * sw, w, sw);
        }
        // Outer border
        ctx.strokeStyle = `rgba(0,155,255,${0.45 + pls * 0.3})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);
        // Face cap glow bar
        const capH = 14;
        const capY = face === 'down' ? y + h - capH : y;
        const cg = ctx.createLinearGradient(0, capY, 0, capY + capH);
        if (face === 'down') {
            cg.addColorStop(0, `rgba(0,180,255,${0.2 * pls})`);
            cg.addColorStop(1, `rgba(0,230,255,${0.88 * pls})`);
        }
        else {
            cg.addColorStop(0, `rgba(0,230,255,${0.88 * pls})`);
            cg.addColorStop(1, `rgba(0,180,255,${0.2 * pls})`);
        }
        ctx.fillStyle = cg;
        ctx.fillRect(x - 7, capY, w + 14, capH);
        // Bright edge line
        const ey = face === 'down' ? y + h : y;
        ctx.strokeStyle = `rgba(130,245,255,${pls})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x - 7, ey);
        ctx.lineTo(x + w + 7, ey);
        ctx.stroke();
        // Hazard indicator lights
        const ly = face === 'down' ? y + h - 7 : y + 7;
        const lcol = [
            `rgba(255,30,30,${pls})`,
            `rgba(255,185,0,${pls})`,
            `rgba(0,255,110,${pls})`,
        ];
        for (let i = 0; i < 3; i++) {
            ctx.shadowColor = lcol[i];
            ctx.shadowBlur = 9;
            ctx.fillStyle = lcol[i];
            ctx.beginPath();
            ctx.arc(x + 10 + i * 17, ly, 3.5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.shadowBlur = 0;
    }
    drawObstacles() {
        const ctx = this.ctx;
        for (const o of this.obstacles) {
            this.drawPylon(o.x, 0, OBSTACLE_W, o.topH, o.phase, 'down');
            this.drawPylon(o.x, o.botY, OBSTACLE_W, this.H - o.botY, o.phase + Math.PI, 'up');
            // Gap energy corridor
            const pls = Math.sin(o.phase) * 0.12 + 0.14;
            const fg = ctx.createLinearGradient(o.x, o.topH, o.x, o.botY);
            fg.addColorStop(0, `rgba(0,185,255,${pls})`);
            fg.addColorStop(0.5, `rgba(0,80,210,${pls * 0.35})`);
            fg.addColorStop(1, `rgba(0,185,255,${pls})`);
            ctx.fillStyle = fg;
            ctx.fillRect(o.x, o.topH, OBSTACLE_W, o.botY - o.topH);
        }
    }
    drawParticles() {
        for (const p of this.particles) {
            const a = Math.max(0, p.life / p.maxLife);
            this.ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${a.toFixed(2)})`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * a + 0.5, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    drawHUD() {
        const ctx = this.ctx;
        ctx.save();
        ctx.textAlign = 'center';
        ctx.font = 'bold 30px "Courier New", monospace';
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 14;
        ctx.fillStyle = '#00ffff';
        ctx.fillText(`PARSECS: ${String(this.score).padStart(4, '0')}`, this.W / 2, 50);
        ctx.shadowBlur = 0;
        ctx.font = '14px "Courier New", monospace';
        ctx.fillStyle = 'rgba(0,195,255,0.55)';
        ctx.fillText(`BEST: ${String(this.best).padStart(4, '0')}`, this.W / 2, 72);
        ctx.restore();
    }
    drawScanlines() {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0,0,0,0.025)';
        for (let y = 0; y < this.H; y += 4)
            ctx.fillRect(0, y, this.W, 2);
    }
    drawMenu() {
        const ctx = this.ctx;
        const t = performance.now() / 1000;
        const pls = Math.sin(t * 1.9) * 0.12 + 0.88;
        ctx.save();
        ctx.textAlign = 'center';
        // Title
        ctx.font = `bold ${Math.round(58 * pls + 2)}px "Courier New", monospace`;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 38;
        ctx.fillStyle = '#00ffff';
        ctx.fillText('NEBULA  DASH', this.W / 2, this.H * 0.30);
        ctx.shadowBlur = 0;
        ctx.font = '15px "Courier New", monospace';
        ctx.fillStyle = 'rgba(80,180,255,0.75)';
        ctx.fillText('DEEP SPACE NAVIGATION PROTOCOL v2.4', this.W / 2, this.H * 0.30 + 44);
        // Hovering ship
        const hoverY = Math.sin(t * 1.5) * 10;
        const hoverA = Math.sin(t * 0.9) * 0.09;
        this.drawShip(this.W / 2, this.H * 0.52 + hoverY, hoverA);
        // Prompt
        ctx.font = '20px "Courier New", monospace';
        ctx.fillStyle = `rgba(0,255,200,${0.42 + Math.sin(t * 2.8) * 0.58})`;
        ctx.fillText('[ SPACE / TAP TO INITIATE LAUNCH ]', this.W / 2, this.H * 0.72);
        ctx.font = '13px "Courier New", monospace';
        ctx.fillStyle = 'rgba(80,130,210,0.55)';
        ctx.fillText('Navigate station corridors  --  SPACE / UP ARROW / TAP to thrust', this.W / 2, this.H * 0.78);
        if (this.best > 0) {
            ctx.font = '18px "Courier New", monospace';
            ctx.fillStyle = '#ffcc00';
            ctx.shadowColor = '#ffcc00';
            ctx.shadowBlur = 14;
            ctx.fillText(`RECORD: ${this.best} PARSECS`, this.W / 2, this.H * 0.85);
            ctx.shadowBlur = 0;
        }
        ctx.restore();
    }
    drawOver() {
        const ctx = this.ctx;
        const t = performance.now() / 1000;
        ctx.fillStyle = 'rgba(0,0,10,0.74)';
        ctx.fillRect(0, 0, this.W, this.H);
        ctx.save();
        ctx.textAlign = 'center';
        ctx.font = 'bold 52px "Courier New", monospace';
        ctx.shadowColor = '#ff2200';
        ctx.shadowBlur = 38;
        ctx.fillStyle = '#ff3311';
        ctx.fillText('// SHIP DESTROYED //', this.W / 2, this.H * 0.38);
        ctx.shadowBlur = 0;
        ctx.font = '26px "Courier New", monospace';
        ctx.fillStyle = '#00ccff';
        ctx.fillText(`DISTANCE LOGGED: ${this.score} PARSECS`, this.W / 2, this.H * 0.48);
        if (this.score > 0 && this.score >= this.best) {
            ctx.font = '22px "Courier New", monospace';
            ctx.fillStyle = '#ffcc00';
            ctx.shadowColor = '#ffcc00';
            ctx.shadowBlur = 20;
            ctx.fillText('!! NEW RECORD !!', this.W / 2, this.H * 0.56);
            ctx.shadowBlur = 0;
        }
        else if (this.best > 0) {
            ctx.font = '15px "Courier New", monospace';
            ctx.fillStyle = 'rgba(140,175,225,0.62)';
            ctx.fillText(`RECORD: ${this.best} PARSECS`, this.W / 2, this.H * 0.56);
        }
        ctx.font = '19px "Courier New", monospace';
        ctx.fillStyle = `rgba(0,205,255,${0.42 + Math.sin(t * 2.7) * 0.58})`;
        ctx.fillText('[ SPACE / TAP TO RETRY ]', this.W / 2, this.H * 0.68);
        ctx.restore();
    }
    // ─── Main draw ─────────────────────────────────────────────────────────────
    draw() {
        const ctx = this.ctx;
        ctx.save();
        if (this.shake > 0) {
            const mag = this.shake * 0.85;
            ctx.translate((Math.random() - 0.5) * mag, (Math.random() - 0.5) * mag);
        }
        this.drawBg();
        this.drawStars();
        if (this.state !== 'menu') {
            this.drawObstacles();
            this.drawParticles();
            const showShip = this.state === 'playing'
                || (this.state === 'dying' && this.deathTimer > 58);
            if (showShip)
                this.drawShip(SHIP_X, this.shipY, this.shipAngle);
            this.drawHUD();
        }
        ctx.restore();
        this.drawScanlines();
        if (this.state === 'menu')
            this.drawMenu();
        if (this.state === 'over')
            this.drawOver();
    }
    // ─── Loop ──────────────────────────────────────────────────────────────────
    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}
new Game();
