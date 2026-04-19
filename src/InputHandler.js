export class InputHandler {
    constructor() {
        this.keys = {};
        this.touchStartY = 0;
        this.touchEndY = 0;
        
        window.addEventListener('keydown', e => {
            this.keys[e.code] = true;
            // Prevent default scrolling for Space and Down Arrow
            if (e.code === 'Space' || e.code === 'ArrowDown') {
                e.preventDefault();
            }
        });
        
        window.addEventListener('keyup', e => {
            this.keys[e.code] = false;
        });
        
        // Touch events
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
            // Swipe Up / Jump (optional, tap is handled below)
        } else if (this.touchEndY > this.touchStartY + 50) {
            // Swipe Down / Duck
            this.keys['ArrowDown'] = true;
            setTimeout(() => { this.keys['ArrowDown'] = false; }, 400); // Duck duration
        }
    }
    
    isJumping() {
        return this.keys['Space'] || this.keys['ArrowUp'] || (this.keys['TouchTap'] === true);
    }
    
    isDucking() {
        return this.keys['ArrowDown'];
    }
    
    // Needs to be hooked to canvas click/tap for jump
    triggerTap() {
        this.keys['Space'] = true;
        setTimeout(() => { this.keys['Space'] = false; }, 100);
    }
}
