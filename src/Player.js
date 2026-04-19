import { SoundManager } from './SoundManager.js';

export class Player {
    constructor(engine) {
        this.engine = engine;
        
        // Logical constants
        this.groundY = engine.canvas.height - 100; // 100px from bottom
        
        this.width = 44;
        this.height = 47;
        this.duckHeight = 25;
        this.duckWidth = 59;
        
        // Physics
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
        // Handle input mechanics
        if (input.isJumping() && !this.isJumping) {
            this.vy = this.jumpForce;
            this.isJumping = true;
            SoundManager.playJump();
        }
        
        this.isDucking = input.isDucking() && !this.isJumping;
        
        // Fast fall if ducking in mid-air
        if (this.isJumping && input.isDucking()) {
            this.vy += this.fastFallGravity * dt;
        } else {
            this.vy += this.gravity * dt;
        }
        
        this.y += this.vy * dt;
        
        const currentHeight = this.isDucking ? this.duckHeight : this.height;
        
        // Floor collision
        if (this.y > this.groundY - currentHeight) {
            this.y = this.groundY - currentHeight;
            this.vy = 0;
            this.isJumping = false;
        }
        
        // Animation framing
        if (!this.isJumping) {
            this.frameTimer += dt;
            if (this.frameTimer > 0.1 / this.engine.speedMultiplier) { // speed up animation as game speeds up
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
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--primary-color').trim();
        
        const hit = this.getHitbox();
        
        // Rather than simple rect, let's draw a slightly stylized shape (like a simplified T-Rex)
        ctx.beginPath();
        // Base rectangle
        ctx.rect(hit.x, hit.y, hit.width, hit.height);
        
        // If not ducking, add a small snout and tail effect
        if (!this.isDucking) {
            // Snout
            ctx.rect(hit.x + hit.width - 10, hit.y - 15, 25, 20);
            // Tail
            ctx.rect(hit.x - 15, hit.y + hit.height - 20, 20, 15);
        } else {
            // Snout elongated
            ctx.rect(hit.x + hit.width, hit.y + hit.height - 20, 20, 15);
            // Tail
            ctx.rect(hit.x - 20, hit.y + hit.height - 15, 25, 10);
        }
        
        ctx.fill();
        
        // Draw Legs (Animation)
        if (!this.isJumping) {
            ctx.fillRect(hit.x + 5, hit.y + hit.height, 8, this.frame === 0 ? 10 : 5);
            ctx.fillRect(hit.x + hit.width - 15, hit.y + hit.height, 8, this.frame === 1 ? 10 : 5);
        } else {
            // Folded legs while jumping
            ctx.fillRect(hit.x + 5, hit.y + hit.height, 8, 5);
            ctx.fillRect(hit.x + hit.width - 15, hit.y + hit.height, 8, 5);
        }

        ctx.restore();
    }
}
