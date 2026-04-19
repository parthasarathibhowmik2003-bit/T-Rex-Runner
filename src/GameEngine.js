import { Player } from './Player.js';
import { Environment } from './Environment.js';
import { ObstacleManager } from './ObstacleManager.js';
import { InputHandler } from './InputHandler.js';
import { SoundManager } from './SoundManager.js';

export class GameEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        this.state = 'START'; // START, PLAYING, PAUSED, GAME_OVER
        
        this.input = new InputHandler();
        
        // Let canvas also trigger jump on tap
        this.canvas.addEventListener('touchstart', (e) => {
            if (this.state === 'PLAYING') {
                e.preventDefault(); // prevented to stop double firing
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
        
        // Base speeds and difficulty scaling
        this.baseSpeed = 800; // pixels per second
        this.speedMultiplier = 1.0;
        
        this.lastTime = 0;
        
        // Engine Callbacks
        this.onGameOver = null;
        this.onScoreUpdate = null;
        
        this.resize();
        this.initEntities();
        
        // Start the idle loop
        requestAnimationFrame((t) => this.loop(t));
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
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
        
        // Increase difficulty
        this.speedMultiplier += dt * 0.005; // 0.05 speed increase per 10 seconds approx? Let's tune this
        
        // Score based on time/speed
        const oldScore = Math.floor(this.score);
        this.score += (this.baseSpeed * this.speedMultiplier * dt) * 0.01;
        
        if (Math.floor(this.score) % 100 === 0 && Math.floor(this.score) > oldScore) {
            SoundManager.playScore();
            this.environment.flash(); // visual feedback
        }

        if (this.onScoreUpdate) {
            this.onScoreUpdate(this.score, this.highScore);
        }

        // Update entities
        this.environment.update(dt, this.speedMultiplier);
        this.player.update(dt, this.input);
        this.obstacleManager.update(dt, this.speedMultiplier);
        
        this.checkCollisions();
        
        // Check Day / Night toggle
        this.checkDayNightCycle();
    }
    
    checkCollisions() {
        const pBox = this.player.getHitbox();
        
        for (const obs of this.obstacleManager.obstacles) {
            const oBox = obs.getHitbox();
            
            // Allow a small margin of error (e.g. 5px grace period)
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

    checkDayNightCycle() {
        // Every 500 score, toggle day/night
        const currentPhase = Math.floor(this.score / 500);
        if (currentPhase % 2 !== 0) {
            if (!document.body.classList.contains('night-mode')) {
                document.body.classList.add('night-mode');
            }
        } else {
            if (document.body.classList.contains('night-mode')) {
                document.body.classList.remove('night-mode');
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
        const dt = (timestamp - this.lastTime) / 1000; // delta time in seconds
        this.lastTime = timestamp;

        // Cap dt to prevent huge jumps if tab was inactive
        const safeDt = Math.min(dt, 0.1);
        
        if (this.state === 'PLAYING') {
            this.update(safeDt);
        }
        
        // We always draw to ensure Start/Pause/Game Over screens show over the game state
        this.draw();
        
        requestAnimationFrame((t) => this.loop(t));
    }
}
