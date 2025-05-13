class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 2;
        this.baseX = x;
        this.baseY = y;
        this.density = (Math.random() * 30) + 1;
        this.angle = Math.random() * 360;
        this.radius = Math.random() * 300 + 100;
        // Reduced speed range for slower rotation
        this.speed = (Math.random() * 0.008 + 0.004) * (Math.random() < 0.5 ? 1 : -1);
        // Reduced oscillation speed for smoother movement
        this.oscillationSpeed = Math.random() * 0.01;
        this.oscillationAmplitude = Math.random() * 30;
        this.oscillationAngle = Math.random() * Math.PI * 2;
    }

    draw(ctx) {
        // Add glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#f3f4f6';
        
        ctx.fillStyle = '#f3f4f6';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        
        // Reset shadow effect to prevent affecting other drawings
        ctx.shadowBlur = 0;
    }

    update(centerX, centerY, mouseX, mouseY, transitionFactor) {
        // Update particle position in circular motion with individual speed
        this.angle += this.speed;
        
        // Update oscillation
        this.oscillationAngle += this.oscillationSpeed;
        
        // Calculate base orbital position
        let orbitX = centerX + Math.cos(this.angle) * this.radius;
        let orbitY = centerY + Math.sin(this.angle) * this.radius;
        
        // Add oscillation effect
        let baseX = orbitX + Math.cos(this.oscillationAngle) * this.oscillationAmplitude;
        let baseY = orbitY + Math.sin(this.oscillationAngle) * this.oscillationAmplitude;

        // Add parallax effect based on mouse position with smooth transition
        if (mouseX !== undefined && mouseY !== undefined) {
            const dx = mouseX - centerX;
            const dy = mouseY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
            const parallaxStrength = 0.15;

            const parallaxX = (dx / maxDistance) * this.radius * parallaxStrength;
            const parallaxY = (dy / maxDistance) * this.radius * parallaxStrength;

            // Apply transition factor for smooth movement
            this.x = baseX + (parallaxX * transitionFactor);
            this.y = baseY + (parallaxY * transitionFactor);
        } else {
            // Smoothly transition back to base position
            this.x = baseX + (this.x - baseX) * transitionFactor;
            this.y = baseY + (this.y - baseY) * transitionFactor;
        }
    }
}

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('heroCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.numberOfParticles = 150;
        this.mouseX = undefined;
        this.mouseY = undefined;
        this.transitionFactor = 0;
        this.targetTransitionFactor = 0;
        
        this.resize();
        this.init();
        this.setupMouseTracking();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    setupMouseTracking() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
            this.targetTransitionFactor = 1;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouseX = undefined;
            this.mouseY = undefined;
            this.targetTransitionFactor = 0;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }

    init() {
        this.particles = [];
        for(let i = 0; i < this.numberOfParticles; i++) {
            const x = this.centerX + (Math.random() - 0.5) * 200;
            const y = this.centerY + (Math.random() - 0.5) * 200;
            this.particles.push(new Particle(x, y));
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update transition factor with easing
        this.transitionFactor += (this.targetTransitionFactor - this.transitionFactor) * 0.05;
        
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connecting lines
        this.ctx.strokeStyle = 'rgba(243, 244, 246, 0.1)';
        this.ctx.lineWidth = 0.5;
        
        for(let i = 0; i < this.particles.length; i++) {
            for(let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if(distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }

        // Update and draw particles with mouse position and transition factor
        this.particles.forEach(particle => {
            particle.update(this.centerX, this.centerY, this.mouseX, this.mouseY, this.transitionFactor);
            particle.draw(this.ctx);
        });

        // Draw center point
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = '#f3f4f6';
        this.ctx.fillStyle = '#f3f4f6';
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }
}

// Initialize only the particle system
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
});