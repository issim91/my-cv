// Mobile scroll highlight effect
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth < 768) {
        let activeCard = null;

        const observerOptions = {
            root: null,
            rootMargin: '-45% 0px -45% 0px', // Target center of the screen
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (activeCard) {
                        activeCard.classList.remove('mobile-active');
                    }
                    activeCard = entry.target;
                    activeCard.classList.add('mobile-active');
                }
            });
        }, observerOptions);

        const selectors = [
            '#responsibilities .group',
            '#skills .group',
            '#projects .project-card',
            '#personal-projects .project-card',
            '#soft-skills .group'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(card => {
                observer.observe(card);
            });
        });
    }
});

// Matrix code trail effect for desktop
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on desktop
    if (window.innerWidth >= 768) {
        const canvas = document.createElement('canvas');
        canvas.id = 'matrix-trail';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;

        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1;

        function resizeCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        }

        resizeCanvas();

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                canvas.style.display = 'block';
                resizeCanvas();
            } else {
                canvas.style.display = 'none';
            }
        });

        const particles = [];
        // Matrix-like characters
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';

        let lastMouseX = 0;
        let lastMouseY = 0;
        let distAccumulator = 0;

        document.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return;

            // Calculate distance
            const dx = e.clientX - lastMouseX;
            const dy = e.clientY - lastMouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (lastMouseX !== 0 && lastMouseY !== 0) {
                distAccumulator += distance;
            }

            // Emit a particle every 30 pixels to reduce density
            if (distAccumulator >= 30 || (lastMouseX === 0 && lastMouseY === 0)) {
                distAccumulator = 0;

                // Interpolate coordinates for very fast mouse movements to prevent huge gaps
                if (distance > 40 && lastMouseX !== 0 && lastMouseY !== 0) {
                    const steps = Math.floor(distance / 30);
                    for (let i = 1; i <= steps; i++) {
                        particles.push({
                            x: lastMouseX + dx * (i / steps),
                            y: lastMouseY + dy * (i / steps),
                            char: chars[Math.floor(Math.random() * chars.length)],
                            life: 1,
                            size: Math.random() * 6 + 10,
                            speedY: Math.random() * 1.5 + 0.5,
                            lastUpdate: Date.now(),
                            updateInterval: Math.random() * 100 + 50
                        });
                    }
                }

                // Emit main particle
                particles.push({
                    x: e.clientX,
                    y: e.clientY,
                    char: chars[Math.floor(Math.random() * chars.length)],
                    life: 1,
                    size: Math.random() * 6 + 10, // 10-16px text size
                    speedY: Math.random() * 1.5 + 0.5, // 0.5-2px fall speed per frame
                    lastUpdate: Date.now(),
                    updateInterval: Math.random() * 100 + 50 // Update character occasionally
                });
            }

            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        });

        document.addEventListener('click', (e) => {
            if (window.innerWidth < 768) return;

            // Emit a burst of particles in a circular explosion pattern
            const numParticles = 30; // Number of particles in the explosion
            for (let i = 0; i < numParticles; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4 + 2; // Random speed outwards
                particles.push({
                    x: e.clientX,
                    y: e.clientY,
                    char: chars[Math.floor(Math.random() * chars.length)],
                    life: 1,
                    size: Math.random() * 8 + 12, // 12-20px text size (slightly larger for the blast)
                    speedX: Math.cos(angle) * speed,
                    speedY: Math.sin(angle) * speed,
                    isBlast: true,
                    lastUpdate: Date.now(),
                    updateInterval: Math.random() * 80 + 30 // Update character a bit faster
                });
            }
        });

        function animate() {
            // Clear trail cleanly
            ctx.clearRect(0, 0, width, height);

            const now = Date.now();
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                p.life -= p.isBlast ? 0.02 : 0.035; // Blast particles fade slightly slower
                p.x += p.speedX || 0;
                p.y += p.speedY; // Fall down or expand outward

                // Optional: For blast particles add slight gravity over time
                if (p.isBlast) {
                    p.speedY += 0.05; // gravity pulls blast particles down
                }

                // Random character glitched effect over time
                if (now - p.lastUpdate > p.updateInterval) {
                    p.char = chars[Math.floor(Math.random() * chars.length)];
                    p.lastUpdate = now;
                }

                if (p.life <= 0) {
                    particles.splice(i, 1);
                    i--;
                    continue;
                }

                ctx.font = `bold ${p.size}px monospace`;
                // Add a text shadow for the glow effect
                ctx.shadowColor = '#195de6';
                ctx.shadowBlur = Math.max(0, p.life * 8);
                // Draw with primary color opacity linked to life span
                ctx.fillStyle = `rgba(25, 93, 230, ${p.life})`;
                ctx.fillText(p.char, p.x - p.size / 2, p.y + p.size / 2);
                ctx.shadowBlur = 0; // Reset for performance
            }

            requestAnimationFrame(animate);
        }
        animate();
    }
});
