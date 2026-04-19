class Obstacle {
    constructor(x, y, width, height, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type; // 'CACTUS_S', 'CACTUS_L', 'BIRD_H', 'BIRD_M', 'BIRD_L'
        
        this.frame = 0;
        this.frameTimer = 0;
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
        // slightly smaller hitbox than visual size to be forgiving
        return {
            x: this.x + 2,
            y: this.y + 2,
            width: this.width - 4,
            height: this.height - 4
        };
    }
    
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--primary-color').trim();
        
        if (this.type.startsWith('CACTUS')) {
            // Main trunk
            ctx.fillRect(this.x + this.width/2 - 4, this.y, 8, this.height);
            // Left arm
            ctx.fillRect(this.x, this.y + this.height/3, 8, this.height/3);
            ctx.fillRect(this.x, this.y + this.height/3, this.width/2, 6);
            // Right arm
            ctx.fillRect(this.x + this.width - 8, this.y + this.height/4, 8, this.height/3);
            ctx.fillRect(this.x + this.width/2, this.y + this.height/2, this.width/2, 6);
        } 
        else if (this.type.startsWith('BIRD')) {
            // Body
            ctx.fillRect(this.x + 10, this.y + 10, 30, 10);
            ctx.fillRect(this.x, this.y + 15, 10, 5); // beak
            
            // Wings flapping
            if (this.frame === 0) {
                ctx.fillRect(this.x + 20, this.y, 10, 10); // Wing up
            } else {
                ctx.fillRect(this.x + 20, this.y + 20, 10, 10); // Wing down
            }
        }
        
        ctx.restore();
    }
}

export class ObstacleManager {
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
            // Cap minimum spawn interval to avoid impossible clusters
            if (this.currentInterval < 0.6) this.currentInterval = 0.6;
        }
        
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].update(dt, speed);
            
            // Remove off-screen
            if (this.obstacles[i].x < -100) {
                this.obstacles.splice(i, 1);
            }
        }
    }
    
    spawn() {
        const x = this.engine.canvas.width + 50;
        const groundY = this.engine.canvas.height - 100;
        
        // Randomly choose obstacle type
        // Introduce birds only after somewhat high score (> 500)
        let typeRand = Math.random();
        if (this.engine.score < 200) {
            typeRand = Math.random() * 0.7; // Limit to cacti early on
        }
        
        if (typeRand < 0.4) {
            // Small Cactus
            this.obstacles.push(new Obstacle(x, groundY - 35, 20, 35, 'CACTUS_S'));
        } else if (typeRand < 0.7) {
            // Large Cactus or group
            this.obstacles.push(new Obstacle(x, groundY - 50, 30, 50, 'CACTUS_L'));
        } else {
            // Bird
            const birdHeights = [groundY - 35, groundY - 60, groundY - 80]; // Low, Med, High
            const hIdx = Math.floor(Math.random() * birdHeights.length);
            const bTypes = ['BIRD_L', 'BIRD_M', 'BIRD_H'];
            this.obstacles.push(new Obstacle(x, birdHeights[hIdx] - 25, 40, 25, bTypes[hIdx]));
        }
    }
    
    draw(ctx) {
        for (let obs of this.obstacles) {
            obs.draw(ctx);
        }
    }
}
