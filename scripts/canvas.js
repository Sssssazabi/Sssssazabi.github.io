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
        ctx.fillStyle = '#f3f4f6';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update(centerX, centerY) {
        // Update particle position in circular motion with individual speed
        this.angle += this.speed;
        
        // Update oscillation
        this.oscillationAngle += this.oscillationSpeed;
        
        // Calculate base orbital position
        let orbitX = centerX + Math.cos(this.angle) * this.radius;
        let orbitY = centerY + Math.sin(this.angle) * this.radius;
        
        // Add oscillation effect
        this.x = orbitX + Math.cos(this.oscillationAngle) * this.oscillationAmplitude;
        this.y = orbitY + Math.sin(this.oscillationAngle) * this.oscillationAmplitude;
    }
}

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('heroCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.numberOfParticles = 150; // Increased number of particles
        
        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
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
        
        this.ctx.fillStyle = '#282741';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connecting lines with increased distance threshold
        this.ctx.strokeStyle = 'rgba(243, 244, 246, 0.1)';
        this.ctx.lineWidth = 0.5;
        
        for(let i = 0; i < this.particles.length; i++) {
            for(let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if(distance < 150) { // Increased connection distance
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }

        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update(this.centerX, this.centerY);
            particle.draw(this.ctx);
        });

        // Draw center point
        this.ctx.fillStyle = '#f3f4f6';
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 4, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

// Initialize only the particle system
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
});

// Remove this duplicate initialization
// document.addEventListener('DOMContentLoaded', () => {
//     new CanvasAnimation();
// });