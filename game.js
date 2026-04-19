const SoundManager = {
    enabled: true,
    ctx: null,

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    toggle() {
        this.enabled = !this.enabled;
    },

    playJump() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    },

    playHit() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.3);
        
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    },

    playScore() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.setValueAtTime(1200, this.ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.2);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    }
};

const DINO_RUN_1 = [
"..................######........",
".................##...##........",
".................#######........",
".................#######........",
".................#######........",
"..................######........",
"..................####..........",
"..................####..........",
"..................####..........",
"..................####..........",
"..................#####.........",
".........#######..#####.........",
".......#########.######.........",
"......#################.........",
".....##################.........",
"....###################.........",
"...####################.........",
"...###################..........",
"..####################..........",
"..###..###......####............",
"..###..###......####............",
"..###..###......####............",
".####..###......####............",
".####..####.....#####..........."];
const DINO_RUN_2 = [
"..................######........",
".................##...##........",
".................#######........",
".................#######........",
".................#######........",
"..................######........",
"..................####..........",
"..................####..........",
"..................####..........",
"..................####..........",
"..................#####.........",
".........#######..#####.........",
".......#########.######.........",
"......#################.........",
".....##################.........",
"....###################.........",
"...####################.........",
"...###################..........",
"..####################..........",
"..###...........####............",
"..###..###......####............",
".####..###......####............",
".####..###.......####...........",
".####..####......#####.........."];
const DINO_DUCK_1 = [
"................................",
"................................",
"................................",
"................................",
"................................",
"................................",
"........................######..",
".......................##...##..",
".......................#######..",
".........#######.......#######..",
".......#########.......#######..",
"......########################..",
".....##################.####....",
"....###################.........",
"...####################.........",
"...###################..........",
"..####################..........",
"..###..###......####............",
"..###..###......####............",
"..###..###......####............",
".####..###......####............",
".####..####.....#####...........",
"................................",
"................................"];
const DINO_DUCK_2 = [
"................................",
"................................",
"................................",
"................................",
"................................",
"................................",
"........................######..",
".......................##...##..",
".......................#######..",
".........#######.......#######..",
".......#########.......#######..",
"......########################..",
".....##################.####....",
"....###################.........",
"...####################.........",
"...###################..........",
"..####################..........",
"..###...........####............",
"..###..###......####............",
".####..###......####............",
".####..###.......####...........",
".####..####......#####..........",
"................................",
"................................"];
const CACTUS_S = [
".......####.......",
".......####.......",
".......####.......",
".......####.......",
".......####..####.",
".####..####..####.",
".####..####..####.",
".####..####..####.",
".####..####..####.",
".####..#########..",
".#########.#####..",
"..########.####...",
"...#######.####...",
".......####.......",
".......####.......",
".......####.......",
".......####.......",
".......####.......",
".......####.......",
".......####......."];
const CACTUS_L = [
"........########........",
"........########........",
"........########........",
"........########........",
"........########........",
"........########..####..",
"..####..########..####..",
"..####..########..####..",
"..####..########..####..",
"..####..########..####..",
"..####..########..####..",
"..####..##############..",
"..##############.#####..",
"...#############.####...",
"........########........",
"........########........",
"........########........",
"........########........",
"........########........",
"........########........",
"........########........",
"........########........",
"........########........",
"........########........"];
const BIRD_1 = [
"...........##...........",
"..........###...........",
".........####...........",
"........#####...........",
".......######...........",
"......#######...........",
".....########....#......",
"....#########...###.....",
"...##########..#####....",
".###########..#######...",
"############..########..",
"###########....######...",
"..########......###.....",
"....#####..............."];
const BIRD_2 = [
"........................",
"........................",
"........................",
"........................",
"........................",
".................#......",
"................###.....",
".....##........#####....",
"...######.....#######...",
".##########..#########..",
"############..#######...",
"############....###.....",
"..########..............",
"....#####..............."];
const CLOUD = [
".......######.......",
".....##########.....",
"...##############...",
"..################..",
".##################.",
"####################",
"####################",
".##################.",
"..################.."];

function drawSprite(ctx, sprite, x, y, scale, color) {
    ctx.fillStyle = color;
    for (let r = 0; r < sprite.length; r++) {
        for (let c = 0; c < sprite[r].length; c++) {
            if (sprite[r][c] !== '.') {
                ctx.fillRect(x + c * scale, y + r * scale, Math.ceil(scale), Math.ceil(scale));
            }
        }
    }
}

class InputHandler {
    constructor() {
        this.keys = {};
        this.touchStartY = 0;
        this.touchEndY = 0;
        
        window.addEventListener('keydown', e => {
            this.keys[e.code] = true;
            if (e.code === 'Space' || e.code === 'ArrowDown') {
                e.preventDefault();
            }
        });
        
        window.addEventListener('keyup', e => {
            this.keys[e.code] = false;
        });
        
        window.addEventListener('touchstart', e => {
            this.touchStartY = e.changedTouches[0].screenY;
        }, { passive: false });
        
        window.addEventListener('touchend', e => {
            this.touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe();
        }, { passive: false });
    }
    
    handleSwipe() {
        if (this.touchEndY < this.touchStartY - 50) {
            // Swipe Up
        } else if (this.touchEndY > this.touchStartY + 50) {
            this.keys['ArrowDown'] = true;
            setTimeout(() => { this.keys['ArrowDown'] = false; }, 400);
        }
    }
    
    isJumping() {
        return this.keys['Space'] || this.keys['ArrowUp'] || (this.keys['TouchTap'] === true);
    }
    
    isDucking() {
        return this.keys['ArrowDown'];
    }
    
    triggerTap() {
        this.keys['Space'] = true;
        setTimeout(() => { this.keys['Space'] = false; }, 100);
    }
}

class Player {
    constructor(engine) {
        this.engine = engine;
        this.groundY = engine.canvas.height - 100;
        
        this.width = 64;
        this.height = 48;
        this.duckHeight = 44;
        this.duckWidth = 64;
        
        this.x = Math.max(50, engine.canvas.width * 0.1);
        this.y = this.groundY - this.height;
        this.vy = 0;
        
        this.gravity = 2500;
        this.jumpForce = -900;
        this.fastFallGravity = 6000;
        
        this.isJumping = false;
        this.isDucking = false;
        
        this.frame = 0;
        this.frameTimer = 0;
    }
    
    update(dt, input) {
        if (input.isJumping() && !this.isJumping) {
            this.vy = this.jumpForce;
            this.isJumping = true;
            SoundManager.playJump();
        }
        
        this.isDucking = input.isDucking() && !this.isJumping;
        
        if (this.isJumping && input.isDucking()) {
            this.vy += this.fastFallGravity * dt;
        } else {
            this.vy += this.gravity * dt;
        }
        
        this.y += this.vy * dt;
        
        const currentHeight = this.isDucking ? this.duckHeight : this.height;
        
        if (this.y > this.groundY - currentHeight) {
            this.y = this.groundY - currentHeight;
            this.vy = 0;
            this.isJumping = false;
        }
        
        if (!this.isJumping) {
            this.frameTimer += dt;
            if (this.frameTimer > 0.1 / this.engine.speedMultiplier) {
                this.frame = (this.frame + 1) % 2;
                this.frameTimer = 0;
            }
        }
    }
    
    getHitbox() {
        return {
            x: this.x,
            y: this.y,
            width: this.isDucking ? this.duckWidth : this.width,
            height: this.isDucking ? this.duckHeight : this.height
        };
    }
    
    draw(ctx) {
        ctx.save();
        
        let sprite = null;
        if (this.isDucking) {
            sprite = this.frame === 0 ? DINO_DUCK_1 : DINO_DUCK_2;
        } else {
            if (this.isJumping) {
                sprite = DINO_RUN_1;
            } else {
                sprite = this.frame === 0 ? DINO_RUN_1 : DINO_RUN_2;
            }
        }
        
        drawSprite(ctx, sprite, this.x, this.y, 2, "#4CAF50");
        
        ctx.restore();
    }
}

class Environment {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.groundY = height - 100;
        
        this.groundElements = [];
        this.clouds = [];
        this.stars = [];
        
        for(let i=0; i<150; i++) {
            this.addGroundElement(i * 15);
        }
        for(let i=0; i<4; i++) {
            this.clouds.push({
                x: Math.random() * width,
                y: Math.random() * (height/3),
                speed: Math.random() * 0.2 + 0.1,
                scale: Math.floor(Math.random() * 2) + 2
            });
        }
        for(let i=0; i<20; i++) {
            this.stars.push({
                x: Math.random() * width,
                y: Math.random() * (height/2),
                size: Math.random() * 2 + 1
            });
        }
        
        this.isFlashing = false;
        this.flashTimer = 0;
    }
    
    addGroundElement(x) {
        this.groundElements.push({
            x: x,
            width: Math.random() * 8 + 2,
            yOffset: Math.floor(Math.random() * 5) * 2 - 4
        });
    }
    
    flash() {
        this.isFlashing = true;
        this.flashTimer = 0;
    }
    
    update(dt, speedMultiplier) {
        const speed = 800 * speedMultiplier; 
        
        if (this.isFlashing) {
            this.flashTimer += dt;
            if (this.flashTimer > 0.3) {
                this.isFlashing = false;
            }
        }
        
        for (let idx = this.groundElements.length - 1; idx >= 0; idx--) {
            this.groundElements[idx].x -= speed * dt;
            if (this.groundElements[idx].x < -50) {
                this.groundElements.splice(idx, 1);
                this.addGroundElement(this.width + Math.random() * 15);
            }
        }
        
        for (let c of this.clouds) {
            c.x -= speed * dt * c.speed * 0.1;
            if (c.x < -100) {
                c.x = this.width + 100;
                c.y = Math.random() * (this.height/3);
            }
        }
    }
    
    draw(ctx) {
        ctx.save();
        
        const primaryColor = getComputedStyle(document.body).getPropertyValue('--primary-color').trim();
        
        if (this.isFlashing) {
            ctx.fillStyle = primaryColor;
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg-color').trim();
        } else {
            ctx.fillStyle = primaryColor;
        }

        for (let c of this.clouds) {
            drawSprite(ctx, CLOUD, c.x, c.y, c.scale, "#ADD8E6");
        }
        
        ctx.fillStyle = primaryColor;
        ctx.fillRect(0, this.groundY, this.width, 2);
        
        for (let g of this.groundElements) {
            ctx.fillRect(g.x, this.groundY + g.yOffset, Math.max(2, g.width), 2);
        }
        
        ctx.restore();
    }
}

class Obstacle {
    constructor(x, y, width, height, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        
        this.frame = 0;
        this.frameTimer = 0;

        if (this.type.startsWith('BIRD')) {
            const colors = ['#FF4136', '#0074D9', '#FFDC00'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        } else {
            this.color = '#2ECC40'; // Green cactus
        }
    }
    
    update(dt, speed) {
        this.x -= speed * dt;
        
        if (this.type.startsWith('BIRD')) {
            this.frameTimer += dt;
            if (this.frameTimer > 0.2) {
                this.frame = (this.frame + 1) % 2;
                this.frameTimer = 0;
            }
        }
    }
    
    getHitbox() {
        return {
            x: this.x + 2,
            y: this.y + 2,
            width: this.width - 4,
            height: this.height - 4
        };
    }
    
    draw(ctx) {
        ctx.save();
        let sprite = null;
        let scale = 2;
        
        if (this.type.startsWith('CACTUS_S')) sprite = CACTUS_S;
        else if (this.type.startsWith('CACTUS_L')) sprite = CACTUS_L;
        else if (this.type.startsWith('BIRD')) sprite = this.frame === 0 ? BIRD_1 : BIRD_2;
        
        if (sprite) {
            drawSprite(ctx, sprite, this.x, this.y, scale, this.color);
        }
        
        ctx.restore();
    }
}

class ObstacleManager {
    constructor(engine) {
        this.engine = engine;
        this.obstacles = [];
        this.spawnTimer = 0;
        this.minSpawnInterval = 0.8;
        this.maxSpawnInterval = 2.0;
        this.currentInterval = this.getRandomInterval();
    }
    
    getRandomInterval() {
        return (Math.random() * (this.maxSpawnInterval - this.minSpawnInterval) + this.minSpawnInterval) / this.engine.speedMultiplier;
    }
    
    update(dt, speedMultiplier) {
        const speed = this.engine.baseSpeed * speedMultiplier;
        
        this.spawnTimer += dt;
        if (this.spawnTimer >= this.currentInterval) {
            this.spawn();
            this.spawnTimer = 0;
            this.currentInterval = this.getRandomInterval();
            if (this.currentInterval < 0.6) this.currentInterval = 0.6;
        }
        
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].update(dt, speed);
            
            if (this.obstacles[i].x < -100) {
                this.obstacles.splice(i, 1);
            }
        }
    }
    
    spawn() {
        const x = this.engine.canvas.width + 50;
        const groundY = this.engine.canvas.height - 100;
        
        let typeRand = Math.random();
        if (this.engine.score < 200) {
            typeRand = Math.random() * 0.7;
        }
        
        if (typeRand < 0.4) {
            let count = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < count; i++) {
                this.obstacles.push(new Obstacle(x + i * 36, groundY - 40, 36, 40, 'CACTUS_S'));
            }
        } else if (typeRand < 0.65) {
            let count = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < count; i++) {
                this.obstacles.push(new Obstacle(x + i * 48, groundY - 48, 48, 48, 'CACTUS_L'));
            }
        } else if (typeRand < 0.75) {
            this.obstacles.push(new Obstacle(x, groundY - 48, 48, 48, 'CACTUS_L'));
            this.obstacles.push(new Obstacle(x + 48, groundY - 40, 36, 40, 'CACTUS_S'));
        } else {
            const birdHeights = [groundY - 40, groundY - 65, groundY - 85];
            const hIdx = Math.floor(Math.random() * birdHeights.length);
            const bTypes = ['BIRD_L', 'BIRD_M', 'BIRD_H'];
            this.obstacles.push(new Obstacle(x, birdHeights[hIdx] - 28, 48, 28, bTypes[hIdx]));
        }
    }
    
    draw(ctx) {
        for (let obs of this.obstacles) {
            obs.draw(ctx);
        }
    }
}

class GameEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.state = 'START';
        this.input = new InputHandler();
        
        this.canvas.addEventListener('touchstart', (e) => {
            if (this.state === 'PLAYING') {
                e.preventDefault();
                this.input.triggerTap();
            }
        });
        this.canvas.addEventListener('mousedown', (e) => {
            if (this.state === 'PLAYING') {
                this.input.triggerTap();
            }
        });

        this.score = 0;
        this.highScore = Number(localStorage.getItem('dinoHighScore')) || 0;
        this.baseSpeed = 800;
        this.speedMultiplier = 1.0;
        this.lastTime = 0;
        
        this.onGameOver = null;
        this.onScoreUpdate = null;
        
        this.resize();
        this.initEntities();
        
        requestAnimationFrame((t) => this.loop(t));
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if(this.environment) {
           this.environment.width = this.canvas.width;
           this.environment.height = this.canvas.height;
           this.environment.groundY = this.canvas.height - 100;
        }
        if(this.player) {
           this.player.groundY = this.canvas.height - 100;
        }
    }
    
    initEntities() {
        this.environment = new Environment(this.canvas.width, this.canvas.height);
        this.player = new Player(this);
        this.obstacleManager = new ObstacleManager(this);
    }
    
    reset() {
        this.score = 0;
        this.speedMultiplier = 1.0;
        this.initEntities();
    }
    
    start() {
        if (this.state === 'START' || this.state === 'GAME_OVER') {
            this.state = 'PLAYING';
            this.lastTime = performance.now();
        }
    }
    
    pause() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
        }
    }
    
    resume() {
        if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            this.lastTime = performance.now();
        }
    }
    
    gameOver() {
        this.state = 'GAME_OVER';
        SoundManager.playHit();
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('dinoHighScore', this.highScore);
        }
        
        if (this.onGameOver) this.onGameOver(this.score);
    }
    
    update(dt) {
        if (this.state !== 'PLAYING') return;
        
        this.speedMultiplier += dt * 0.005;
        
        const oldScore = Math.floor(this.score);
        this.score += (this.baseSpeed * this.speedMultiplier * dt) * 0.01;
        
        if (Math.floor(this.score) % 100 === 0 && Math.floor(this.score) > oldScore && oldScore > 0) {
            SoundManager.playScore();
        }

        if (this.onScoreUpdate) {
            this.onScoreUpdate(this.score, this.highScore);
        }

        this.environment.update(dt, this.speedMultiplier);
        this.player.update(dt, this.input);
        this.obstacleManager.update(dt, this.speedMultiplier);
        
        this.checkCollisions();
    }
    
    checkCollisions() {
        const pBox = this.player.getHitbox();
        
        for (const obs of this.obstacleManager.obstacles) {
            const oBox = obs.getHitbox();
            const margin = 5;
            if (pBox.x < oBox.x + oBox.width - margin &&
                pBox.x + pBox.width > oBox.x + margin &&
                pBox.y < oBox.y + oBox.height - margin &&
                pBox.y + pBox.height > oBox.y + margin) {
                this.gameOver();
                return;
            }
        }
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.environment.draw(this.ctx);
        this.obstacleManager.draw(this.ctx);
        this.player.draw(this.ctx);
    }
    
    loop(timestamp) {
        if (this.lastTime === 0) {
            this.lastTime = timestamp;
        }
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        const safeDt = Math.min(dt, 0.1);
        
        if (this.state === 'PLAYING') {
            this.update(safeDt);
        }
        
        this.draw();
        
        requestAnimationFrame((t) => this.loop(t));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const engine = new GameEngine(canvas);
    
    const screenStart = document.getElementById('screen-start');
    const screenGameOver = document.getElementById('screen-game-over');
    const screenPause = document.getElementById('screen-pause');
    const finalScore = document.getElementById('final-score');
    const scoreDisplay = document.getElementById('score-display');
    
    const btnStart = document.getElementById('btn-start');
    const btnRestart = document.getElementById('btn-restart');
    const btnResume = document.getElementById('btn-resume');
    const btnPause = document.getElementById('btn-pause');
    const btnSound = document.getElementById('btn-sound');
    
    btnStart.addEventListener('click', () => {
        screenStart.classList.remove('active');
        engine.start();
    });
    
    btnRestart.addEventListener('click', () => {
        screenGameOver.classList.remove('active');
        engine.reset();
        engine.start();
    });
    
    btnPause.addEventListener('click', () => {
        if (engine.state === 'PLAYING') {
            engine.pause();
            screenPause.classList.add('active');
        } else if (engine.state === 'PAUSED') {
            engine.resume();
            screenPause.classList.remove('active');
        }
    });

    btnResume.addEventListener('click', () => {
        engine.resume();
        screenPause.classList.remove('active');
    });
    
    btnSound.addEventListener('click', () => {
        SoundManager.toggle();
        btnSound.textContent = SoundManager.enabled ? '🔊' : '🔇';
        btnSound.blur();
    });

    engine.onGameOver = (score) => {
        finalScore.textContent = `Score: ${Math.floor(score)}`;
        screenGameOver.classList.add('active');
    };
    
    engine.onScoreUpdate = (score, highScore) => {
        const s = Math.floor(score).toString().padStart(5, '0');
        const h = Math.floor(highScore).toString().padStart(5, '0');
        scoreDisplay.textContent = `${s} | HI ${h}`;
    };
    
    window.addEventListener('resize', () => {
        engine.resize();
    });
});
