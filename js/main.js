/**
 * Portfolio Main JavaScript Module
 * Handles section navigation, theme switching, and UI interactions
 * Uses GSAP (GreenSock Animation Platform) for smooth animations
 */

(function() {
    'use strict';

    /**
     * Initialize GSAP and Observer plugin
     * Checks if GSAP libraries are loaded before proceeding
     */
    function initGSAP() {
        // Check if GSAP is loaded
        if (typeof gsap === 'undefined') {
            console.error('GSAP library is not loaded. Please check CDN connection.');
            return false;
        }

        // Check if Observer plugin is loaded
        if (typeof Observer === 'undefined') {
            console.error('GSAP Observer plugin is not loaded. Please check CDN connection.');
            return false;
        }

        // Register Observer plugin
        try {
            gsap.registerPlugin(Observer);
            return true;
        } catch (error) {
            console.error('Failed to register GSAP Observer plugin:', error);
            return false;
        }
    }

    /**
     * Section Navigation System
     * Handles smooth scrolling between sections using GSAP animations
     */
    function initSectionNavigation() {
        // Wait for GSAP to be ready
        if (!initGSAP()) {
            return;
        }

        // Get all sections and related elements
        const sections = document.querySelectorAll('section');
        const images = document.querySelectorAll('.bg');
        const outerWrappers = gsap.utils.toArray('.outer');
        const innerWrappers = gsap.utils.toArray('.inner');
        const sectionDots = document.querySelectorAll('.section-dot');
        const scrollIndicator = document.querySelector('.scroll-indicator');

        // Navigation state
        let currentIndex = -1;
        let animating = false;
        const wrap = gsap.utils.wrap(0, sections.length);

        // Initialize section positions (off-screen)
        gsap.set(outerWrappers, { yPercent: 100 });
        gsap.set(innerWrappers, { yPercent: -100 });

        /**
         * Navigate to a specific section with smooth animation
         * @param {number} index - Target section index (0-based)
         * @param {number} direction - Scroll direction: 1 (down) or -1 (up)
         */
        function gotoSection(index, direction) {
            index = wrap(index); // Wrap index to handle overflow
            
            // Prevent multiple simultaneous animations
            if (animating) {
                return;
            }

            animating = true;

            // Determine animation direction
            const fromTop = direction === -1;
            const dFactor = fromTop ? -1 : 1;

            // Create GSAP timeline for section transition
            const tl = gsap.timeline({
                defaults: { 
                    duration: 1.25, 
                    ease: 'power1.inOut' 
                },
                onComplete: () => {
                    animating = false;
                    // Hide scroll indicator after first navigation
                    if (scrollIndicator && !scrollIndicator.classList.contains('hidden')) {
                        scrollIndicator.classList.add('hidden');
                    }
                }
            });

            // Animate out current section if one is active
            if (currentIndex >= 0) {
                gsap.set(sections[currentIndex], { zIndex: 0 });
                tl.to(images[currentIndex], { yPercent: -15 * dFactor })
                  .set(sections[currentIndex], { autoAlpha: 0 });
            }

            // Animate in new section
            gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
            
            // Animate wrapper divs for smooth transition effect
            tl.fromTo(
                [outerWrappers[index], innerWrappers[index]], 
                { 
                    yPercent: i => i ? -100 * dFactor : 100 * dFactor 
                }, 
                { 
                    yPercent: 0 
                }, 
                0 // Start immediately
            )
            // Animate section background
            .fromTo(
                images[index], 
                { 
                    yPercent: 15 * dFactor 
                }, 
                { 
                    yPercent: 0 
                }, 
                0 // Start immediately
            );

            // Update section dots to show active section
            sectionDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
                // Update aria-current for accessibility
                dot.setAttribute('aria-current', i === index ? 'true' : 'false');
            });

            // Update current index
            currentIndex = index;
        }

        /**
         * Set up GSAP Observer for scroll/touch/swipe navigation
         * Detects user scroll/touch gestures and navigates between sections
         */
        try {
            Observer.create({
                type: 'wheel,touch,pointer',
                wheelSpeed: -1,
                // Navigate to previous section on scroll down/touch down
                onDown: () => {
                    if (!animating) {
                        gotoSection(currentIndex - 1, -1);
                    }
                },
                // Navigate to next section on scroll up/touch up
                onUp: () => {
                    if (!animating) {
                        gotoSection(currentIndex + 1, 1);
                    }
                },
                tolerance: 10, // Minimum movement to trigger navigation
                preventDefault: true // Prevent default scroll behavior
            });
        } catch (error) {
            console.error('Failed to create GSAP Observer:', error);
        }

        /**
         * Handle navigation via click events
         * Listens for clicks on navigation links and section dots
         */
        document.querySelectorAll('[data-section]').forEach(el => {
            el.addEventListener('click', (e) => {
                // Prevent default link behavior if it's a link
                if (el.tagName === 'A') {
                    e.preventDefault();
                }

                const targetIndex = parseInt(el.getAttribute('data-section'));
                
                // Only navigate if not already on target section
                if (!animating && targetIndex !== currentIndex) {
                    const direction = targetIndex > currentIndex ? 1 : -1;
                    gotoSection(targetIndex, direction);
                }
            });
        });

        // Initialize to first section (hero)
        gotoSection(0, 1);
    }

    /**
     * Theme Toggle System
     * Handles light/dark mode switching with localStorage persistence
     */
    function initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const html = document.documentElement;

        // Check if theme toggle button exists
        if (!themeToggle) {
            console.warn('Theme toggle button not found');
            return;
        }

        /**
         * Load saved theme preference or default to light mode
         * Checks localStorage and system preference
         */
        function loadTheme() {
            // Check localStorage for saved preference
            let savedTheme = localStorage.getItem('theme');
            
            // If no saved preference, check system preference
            if (!savedTheme) {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                savedTheme = prefersDark ? 'dark' : 'light';
            }

            // Apply theme
            html.setAttribute('data-theme', savedTheme);
            
            // Update aria-label for accessibility
            themeToggle.setAttribute('aria-label', `Switch to ${savedTheme === 'light' ? 'dark' : 'light'} mode`);
        }

        /**
         * Toggle between light and dark themes
         */
        function toggleTheme() {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // Apply new theme
            html.setAttribute('data-theme', newTheme);
            
            // Save preference to localStorage
            localStorage.setItem('theme', newTheme);
            
            // Update aria-label
            themeToggle.setAttribute('aria-label', `Switch to ${currentTheme} mode`);
            
            // Dispatch custom event for wavy background to listen
            window.dispatchEvent(new CustomEvent('themechange'));
        }

        // Load theme on page load
        loadTheme();

        // Listen for theme toggle clicks
        themeToggle.addEventListener('click', toggleTheme);

        // Listen for system theme changes (optional enhancement)
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only update if user hasn't set a preference
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                html.setAttribute('data-theme', newTheme);
                window.dispatchEvent(new CustomEvent('themechange'));
            }
        });
    }

    /**
     * Keyboard Navigation Enhancement
     * Adds keyboard shortcuts for better accessibility
     */
    function initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Ignore keyboard events when user is typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            // Arrow down / Page down: Go to next section
            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                e.preventDefault();
                const currentSection = document.querySelector('.section-dot.active');
                if (currentSection) {
                    const currentIndex = parseInt(currentSection.getAttribute('data-section'));
                    const nextIndex = (currentIndex + 1) % 6; // Assuming 6 sections
                    const targetDot = document.querySelector(`[data-section="${nextIndex}"]`);
                    if (targetDot) {
                        targetDot.click();
                    }
                }
            }
            
            // Arrow up / Page up: Go to previous section
            if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                e.preventDefault();
                const currentSection = document.querySelector('.section-dot.active');
                if (currentSection) {
                    const currentIndex = parseInt(currentSection.getAttribute('data-section'));
                    const prevIndex = currentIndex === 0 ? 5 : currentIndex - 1; // Assuming 6 sections
                    const targetDot = document.querySelector(`[data-section="${prevIndex}"]`);
                    if (targetDot) {
                        targetDot.click();
                    }
                }
            }

            // Home: Go to first section
            if (e.key === 'Home') {
                e.preventDefault();
                const firstSection = document.querySelector('[data-section="0"]');
                if (firstSection) {
                    firstSection.click();
                }
            }

            // End: Go to last section
            if (e.key === 'End') {
                e.preventDefault();
                const lastSection = document.querySelector('[data-section="5"]');
                if (lastSection) {
                    lastSection.click();
                }
            }

            // T / t: Toggle theme (common keyboard shortcut)
            if ((e.key === 'T' || e.key === 't') && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                const themeToggle = document.getElementById('themeToggle');
                if (themeToggle) {
                    themeToggle.click();
                }
            }
        });
    }

    /**
     * Initialize all portfolio functionality
     * Called when DOM is fully loaded
     */
    function init() {
        // Initialize section navigation (depends on GSAP)
        initSectionNavigation();
        
        // Initialize theme toggle system
        initThemeToggle();
        
        // Initialize keyboard navigation for accessibility
        initKeyboardNavigation();

        // Add loaded class to body for any post-load animations
        document.body.classList.add('loaded');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded
        init();
    }
})();