// ==========================================
// CHERRY BLOSSOM PARTICLES
// شکوفه‌های گیلاسی در حال بارش 🌸
// ==========================================

class CherryBlossom {
    constructor() {
        this.canvas = document.getElementById('cherryCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.petals = [];
        this.petalCount = 85;
        this.wind = 0;
        this.init();
    }

    init() {
        this.resize();
        this.createPetals();
        this.animate();
        this.setupEvents();
        console.log('🌸 Cherry Blossom started!');
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width || window.innerWidth;
        this.canvas.height = rect.height || window.innerHeight;
    }

    createPetals() {
        for (let i = 0; i < this.petalCount; i++) {
            this.petals.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height - this.canvas.height,
                size: 8 + Math.random() * 16,
                speed: 0.4 + Math.random() * 1.0,
                rotation: Math.random() * 360,
                rotationSpeed: 0.4 + Math.random() * 1.2,
                sway: Math.random() * 25,
                swaySpeed: 0.3 + Math.random() * 0.7,
                opacity: 0.6 + Math.random() * 0.4,
                color: this.getColor(),
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    getColor() {
        const colors = [
            'rgba(255, 182, 193, ',
            'rgba(255, 192, 203, ',
            'rgba(255, 205, 210, ',
            'rgba(255, 218, 220, ',
            'rgba(255, 228, 225, ',
            'rgba(255, 240, 235, ',
            'rgba(255, 200, 200, '
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    drawPetal(petal) {
        const ctx = this.ctx;
        const x = petal.x;
        const y = petal.y;
        const size = petal.size;
        const rotation = petal.rotation;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.globalAlpha = petal.opacity;

        // شکل شکوفه گیلاس
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(size * 0.6, -size * 0.7, size * 0.9, -size * 0.2, 0, size * 0.25);
        ctx.bezierCurveTo(-size * 0.9, -size * 0.2, -size * 0.6, -size * 0.7, 0, 0);
        ctx.closePath();

        // رنگ شکوفه با گرادیان
        const gradient = ctx.createRadialGradient(-2, -4, 0, 0, 0, size);
        gradient.addColorStop(0, petal.color + '1)');
        gradient.addColorStop(0.5, petal.color + '0.9)');
        gradient.addColorStop(1, petal.color + '0.5)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // خطوط ظریف روی گلبرگ
        ctx.globalAlpha = petal.opacity * 0.2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 0.5;
        for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.moveTo(i * 2, -size * 0.1);
            ctx.lineTo(i * 4, size * 0.15);
            ctx.stroke();
        }

        ctx.restore();
    }

    updatePetal(petal) {
        // حرکت به پایین
        petal.y += petal.speed;

        // نوسان افقی (باد)
        const swayAmount = Math.sin(petal.y * 0.02 + petal.phase + this.wind) * 0.3;
        petal.x += swayAmount;
        petal.x += Math.sin(petal.y * 0.01 + petal.swaySpeed + petal.phase) * 0.4;

        // چرخش
        petal.rotation += petal.rotationSpeed * 0.4;

        // بازگشت به بالا
        if (petal.y > this.canvas.height + 50) {
            petal.y = -50;
            petal.x = Math.random() * this.canvas.width;
            petal.size = 8 + Math.random() * 16;
            petal.speed = 0.4 + Math.random() * 1.0;
            petal.opacity = 0.6 + Math.random() * 0.4;
            petal.phase = Math.random() * Math.PI * 2;
        }

        // محدود کردن x
        if (petal.x > this.canvas.width + 20) petal.x = -20;
        if (petal.x < -20) petal.x = this.canvas.width + 20;
    }

    animate() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // باد ملایم
        this.wind += 0.004;

        // مرتب‌سازی گلبرگ‌ها بر اساس اندازه (کوچک‌ترها جلوتر)
        this.petals.sort((a, b) => a.size - b.size);

        // رسم گلبرگ‌ها
        for (const petal of this.petals) {
            this.updatePetal(petal);
            this.drawPetal(petal);
        }

        requestAnimationFrame(() => this.animate());
    }

    setupEvents() {
        window.addEventListener('resize', () => {
            this.resize();
        });
    }
}

// ==========================================
// INIT
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cherryCanvas')) {
        setTimeout(() => {
            window.cherryBlossom = new CherryBlossom();
        }, 300);
    }
});