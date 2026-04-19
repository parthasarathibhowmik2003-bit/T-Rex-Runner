import { GameEngine } from './GameEngine.js';
import { InputHandler } from './InputHandler.js';
import { SoundManager } from './SoundManager.js';

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const engine = new GameEngine(canvas);
    
    // UI Elements
    const screenStart = document.getElementById('screen-start');
    const screenGameOver = document.getElementById('screen-game-over');
    const screenPause = document.getElementById('screen-pause');
    const finalScore = document.getElementById('final-score');
    const scoreDisplay = document.getElementById('score-display');
    
    // Buttons
    const btnStart = document.getElementById('btn-start');
    const btnRestart = document.getElementById('btn-restart');
    const btnResume = document.getElementById('btn-resume');
    const btnPause = document.getElementById('btn-pause');
    const btnSound = document.getElementById('btn-sound');
    
    // Wire up events
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
        btnSound.blur(); // Remove focus so spacebar doesn't trigger it again
    });

    // Provide UI callbacks to engine
    engine.onGameOver = (score) => {
        finalScore.textContent = `Score: ${Math.floor(score)}`;
        screenGameOver.classList.add('active');
    };
    
    engine.onScoreUpdate = (score, highScore) => {
        const s = Math.floor(score).toString().padStart(5, '0');
        const h = Math.floor(highScore).toString().padStart(5, '0');
        scoreDisplay.textContent = `${s} | HI ${h}`;
    };
    
    // Handle Window Resize
    window.addEventListener('resize', () => {
        engine.resize();
    });
});
