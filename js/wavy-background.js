/**
 * Wavy Background Animation Module
 * Creates an animated wavy background effect using HTML5 Canvas and Simplex Noise
 * Optimized for performance with Page Visibility API and debounced resize handling
 */

(function() {
    'use strict';

    /**
     * Simplex Noise Implementation
     * Generates smooth, organic-looking noise patterns for wave animation
     * Based on Ken Perlin's Simplex Noise algorithm
     */
    class SimplexNoise {
        /**
         * Initialize the Simplex Noise generator
         * @param {Function} random - Random number generator function (default: Math.random)
         */
        constructor(random = Math.random) {
            // Permutation array for noise generation
            this.p = new Uint8Array(256);
            // Extended permutation array (doubled for wrapping)
            this.perm = new Uint8Array(512);
            // Modulo 12 lookup table for performance
            this.permMod12 = new Uint8Array(512);
            
            // Initialize permutation array with values 0-255
            for (let i = 0; i < 256; i++) {
                this.p[i] = i;
            }
            
            // Fisher-Yates shuffle for random permutation
            for (let i = 255; i > 0; i--) {
                const r = Math.floor(random() * (i + 1));
                const tmp = this.p[i];
                this.p[i] = this.p[r];
                this.p[r] = tmp;
            }
            
            // Create extended permutation arrays
            for (let i = 0; i < 512; i++) {
                this.perm[i] = this.p[i & 255];
                this.permMod12[i] = this.perm[i] % 12;
            }
        }

        /**
         * Generate 3D Simplex Noise value
         * @param {number} x - X coordinate
         * @param {number} y - Y coordinate
         * @param {number} z - Z coordinate (time component for animation)
         * @returns {number} Noise value between -1 and 1
         */
        noise3D(x, y, z) {
            const F3 = 1 / 3;
            const G3 = 1 / 6;
            
            // Skew input space to determine which simplex cell we're in
            const s = (x + y + z) * F3;
            const i = Math.floor(x + s);
            const j = Math.floor(y + s);
            const k = Math.floor(z + s);
            
            // Unskew back to get distance from cell origin
            const t = (i + j + k) * G3;
            const X0 = i - t;
            const Y0 = j - t;
            const Z0 = k - t;
            const x0 = x - X0;
            const y0 = y - Y0;
            const z0 = z - Z0;

            // Determine which simplex we're in
            let i1, j1, k1, i2, j2, k2;

            if (x0 >= y0) {
                if (y0 >= z0) { 
                    i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; 
                }
                else if (x0 >= z0) { 
                    i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; 
                }
                else { 
                    i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; 
                }
            } else {
                if (y0 < z0) { 
                    i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; 
                }
                else if (x0 < z0) { 
                    i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; 
                }
                else { 
                    i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; 
                }
            }

            // Offsets for second corner of simplex
            const x1 = x0 - i1 + G3;
            const y1 = y0 - j1 + G3;
            const z1 = z0 - k1 + G3;
            // Offsets for last corner of simplex
            const x2 = x0 - i2 + 2 * G3;
            const y2 = y0 - j2 + 2 * G3;
            const z2 = z0 - k2 + 2 * G3;
            // Offsets for cell origin
            const x3 = x0 - 1 + 3 * G3;
            const y3 = y0 - 1 + 3 * G3;
            const z3 = z0 - 1 + 3 * G3;

            // Wrap integer coordinates to reduce table lookup
            const ii = i & 255;
            const jj = j & 255;
            const kk = k & 255;

            // Gradient vectors (12 directions in 3D)
            const grad3 = [
                [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
                [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
                [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
            ];

            // Dot product helper function
            const dot3 = (g, x, y, z) => g[0] * x + g[1] * y + g[2] * z;

            // Calculate contribution from each of the four corners
            let n0, n1, n2, n3;

            // Corner 0
            let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
            if (t0 < 0) n0 = 0;
            else {
                const gi0 = this.permMod12[ii + this.perm[jj + this.perm[kk]]];
                t0 *= t0;
                n0 = t0 * t0 * dot3(grad3[gi0], x0, y0, z0);
            }

            // Corner 1
            let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
            if (t1 < 0) n1 = 0;
            else {
                const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]];
                t1 *= t1;
                n1 = t1 * t1 * dot3(grad3[gi1], x1, y1, z1);
            }

            // Corner 2
            let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
            if (t2 < 0) n2 = 0;
            else {
                const gi2 = this.permMod12[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]];
                t2 *= t2;
                n2 = t2 * t2 * dot3(grad3[gi2], x2, y2, z2);
            }

            // Corner 3
            let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
            if (t3 < 0) n3 = 0;
            else {
                const gi3 = this.permMod12[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]];
                t3 *= t3;
                n3 = t3 * t3 * dot3(grad3[gi3], x3, y3, z3);
            }

            // Sum up and scale the result
            return 32 * (n0 + n1 + n2 + n3);
        }
    }

    /**
     * Initialize Wavy Background Animation
     * Sets up canvas, noise generator, and animation loop
     */
    function initWavyBackground() {
        // Get canvas element and context
        const canvas = document.getElementById('wavyCanvas');
        if (!canvas) {
            console.warn('Wavy background canvas not found');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.warn('Canvas 2D context not available');
            return;
        }

        // Initialize Simplex Noise generator
        const simplex = new SimplexNoise();
        
        // Animation configuration
        const waveColors = ['#38bdf8', '#818cf8', '#c084fc', '#e879f9', '#22d3ee'];
        const waveWidth = 80;
        const blur = 12;
        const speed = 0.0015;
        const waveOpacity = 0.6;
        const backgroundFill = '#F3F3F3';
        const numWaves = 5;

        // Animation state variables
        let w = 0; // Canvas width
        let h = 0; // Canvas height
        let nt = 0; // Time variable for animation
        let animationId = null; // RequestAnimationFrame ID for cleanup
        let isAnimating = false; // Animation state flag
        let resizeTimeout = null; // Debounce timer for resize events

        /**
         * Resize canvas to match window dimensions
         * Called on initial load and window resize (debounced)
         */
        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            // Apply blur filter for smoother wave appearance
            ctx.filter = `blur(${blur}px)`;
        }

        /**
         * Draw animated waves on canvas
         * Uses Simplex Noise to generate organic wave patterns
         * @param {number} n - Number of waves to draw
         */
        function drawWave(n) {
            nt += speed; // Increment time for animation
            
            // Draw each wave with different color and offset
            for (let i = 0; i < n; i++) {
                ctx.beginPath();
                ctx.lineWidth = waveWidth;
                ctx.strokeStyle = waveColors[i % waveColors.length];
                
                // Generate wave path using noise
                for (let x = 0; x < w; x += 5) {
                    // Use noise3D: x position, wave offset, time
                    const y = simplex.noise3D(x / 800, 0.3 * i, nt) * 100;
                    ctx.lineTo(x, y + h * 0.5); // Center vertically
                }
                
                ctx.stroke();
                ctx.closePath();
            }
        }

        /**
         * Main render function - animation loop
         * Only renders if page is visible and animation is active
         */
        function render() {
            // Check if page is visible and animation should continue
            if (!isAnimating || document.hidden) {
                return;
            }

            // Clear and draw waves
            ctx.fillStyle = backgroundFill;
            ctx.globalAlpha = waveOpacity;
            ctx.fillRect(0, 0, w, h);
            drawWave(numWaves);
            
            // Schedule next frame
            animationId = requestAnimationFrame(render);
        }

        /**
         * Start animation loop
         * Called when page becomes visible or theme switches to light
         */
        function startAnimation() {
            if (!isAnimating) {
                isAnimating = true;
                animationId = requestAnimationFrame(render);
            }
        }

        /**
         * Stop animation loop
         * Called when page becomes hidden or theme switches to dark
         */
        function stopAnimation() {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            isAnimating = false;
        }

        /**
         * Handle window resize with debouncing
         * Prevents excessive resize calls for better performance
         */
        function handleResize() {
            // Clear existing timeout
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            
            // Debounce resize handler (wait 300ms after last resize)
            resizeTimeout = setTimeout(() => {
                resize();
            }, 300);
        }

        /**
         * Handle page visibility changes
         * Pauses animation when tab is inactive to save resources
         */
        function handleVisibilityChange() {
            if (document.hidden) {
                stopAnimation();
            } else {
                // Check if we're in light theme before restarting
                const isLightTheme = document.documentElement.getAttribute('data-theme') !== 'dark';
                if (isLightTheme) {
                    startAnimation();
                }
            }
        }

        /**
         * Handle theme changes
         * Stops animation in dark theme, starts in light theme
         */
        function handleThemeChange() {
            const isLightTheme = document.documentElement.getAttribute('data-theme') !== 'dark';
            
            if (isLightTheme && !document.hidden) {
                startAnimation();
            } else {
                stopAnimation();
                // Clear canvas in dark theme
                if (!isLightTheme) {
                    ctx.clearRect(0, 0, w, h);
                }
            }
        }

        // Initialize canvas size
        resize();

        // Set up event listeners
        window.addEventListener('resize', handleResize, { passive: true });
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Listen for theme changes (custom event from main.js)
        window.addEventListener('themechange', handleThemeChange);

        // Start animation if page is visible and in light theme
        const isLightTheme = document.documentElement.getAttribute('data-theme') !== 'dark';
        if (isLightTheme && !document.hidden) {
            startAnimation();
        }

        // Cleanup function for when page unloads
        window.addEventListener('beforeunload', () => {
            stopAnimation();
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('themechange', handleThemeChange);
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWavyBackground);
    } else {
        // DOM already loaded
        initWavyBackground();
    }
})();