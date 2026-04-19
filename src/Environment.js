export class Environment {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.groundY = height - 100;
        
        this.groundElements = [];
        this.clouds = [];
        this.stars = [];
        
        for(let i=0; i<20; i++) {
            this.addGroundElement(i * 100);
        }
        for(let i=0; i<3; i++) {
            this.clouds.push({
                x: Math.random() * width,
                y: Math.random() * (height/3),
                speed: Math.random() * 0.2 + 0.1,
                scale: Math.random() * 0.5 + 0.5
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
            width: Math.random() * 5 + 3,
            yOffset: Math.random() * 4 - 2
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
        
        // Move ground
        for (let idx = this.groundElements.length - 1; idx >= 0; idx--) {
            this.groundElements[idx].x -= speed * dt;
            if (this.groundElements[idx].x < -50) {
                this.groundElements.splice(idx, 1);
                this.addGroundElement(this.width + Math.random() * 50);
            }
        }
        
        // Move clouds
        for (let c of this.clouds) {
            c.x -= speed * dt * c.speed * 0.1; // Parallax
            if (c.x < -100) {
                c.x = this.width + 100;
                c.y = Math.random() * (this.height/3);
            }
        }
    }
    
    draw(ctx) {
        ctx.save();
        
        const isNight = document.body.classList.contains('night-mode');
        const primaryColor = getComputedStyle(document.body).getPropertyValue('--primary-color').trim();
        
        if (this.isFlashing) {
            // Flash brightness inversion
            ctx.fillStyle = primaryColor;
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg-color').trim();
        } else {
            ctx.fillStyle = primaryColor;
        }

        // Draw Sky bodies
        if (isNight) {
            for (let s of this.stars) {
                ctx.fillRect(s.x, s.y, s.size, s.size);
            }
            // Moon
            ctx.beginPath();
            ctx.arc(this.width - 150, 100, 30, 0, Math.PI * 2);
            ctx.fill();
            // Crater
            ctx.save();
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg-color').trim();
            ctx.beginPath();
            ctx.arc(this.width - 140, 90, 25, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else {
            // simple clouds
            for (let c of this.clouds) {
                ctx.fillRect(c.x, c.y, 40 * c.scale, 15 * c.scale);
                ctx.fillRect(c.x + 10 * c.scale, c.y - 10 * c.scale, 20 * c.scale, 10 * c.scale);
            }
        }
        
        // Draw Ground Line
        ctx.fillRect(0, this.groundY, this.width, 2);
        
        // Draw Ground details
        for (let g of this.groundElements) {
            ctx.fillRect(g.x, this.groundY + 10 + g.yOffset, g.width, 2);
        }
        
        ctx.restore();
    }
}
