// ==========================================
// TOPIK COURSE - INTERACTIVE JAVASCRIPT
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Lesson Cards Interaction
    const lessonCards = document.querySelectorAll('.lesson-card:not(.locked)');
    
    lessonCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Prevent click if clicking on button
            if (e.target.classList.contains('start-btn')) {
                return;
            }
            
            // Get lesson ID
            const lessonId = this.dataset.lesson;
            console.log('Lesson clicked:', lessonId);
            
            // Add visual feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        // Start button handler
        const startBtn = card.querySelector('.start-btn');
        if (startBtn && !startBtn.disabled) {
            startBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const lessonId = card.dataset.lesson;
                console.log('Starting lesson:', lessonId);
                
                // Show loading state
                const originalText = this.textContent;
                this.textContent = 'در حال بارگذاری...';
                this.disabled = true;
                
                // Simulate navigation to lesson (replace with actual URL)
                setTimeout(() => {
                    alert(`شروع درس: ${lessonId}\n\nدر نسخه کامل، به صفحه درس هدایت می‌شوید.`);
                    this.textContent = originalText;
                    this.disabled = false;
                    
                    // Update lesson status
                    updateLessonStatus(card, 'in-progress');
                }, 1000);
            });
        }
    });

    // Locked lessons tooltip enhancement
    const lockedCards = document.querySelectorAll('.lesson-card.locked');
    
    lockedCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Could add sound effect or haptic feedback here
        });
    });

    // Progress bar animation
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });

    // Achievement badges hover effect
    const achievementBadges = document.querySelectorAll('.achievement-badge:not(.locked)');
    
    achievementBadges.forEach(badge => {
        badge.addEventListener('click', function() {
            const name = this.querySelector('.achievement-name').textContent;
            const desc = this.querySelector('.achievement-desc').textContent;
            
            // Show achievement details
            showAchievementModal(name, desc);
        });
    });

    // Section progress calculation (placeholder)
    const sections = document.querySelectorAll('.path-section');
    
    sections.forEach(section => {
        const progressBar = section.querySelector('.progress-bar');
        const progressText = section.querySelector('.progress-text');
        const completedLessons = section.querySelectorAll('.lesson-card.completed').length;
        const totalLessons = section.querySelectorAll('.lesson-card').length;
        
        if (totalLessons > 0 && progressBar && progressText) {
            const percentage = Math.round((completedLessons / totalLessons) * 100);
            progressBar.style.width = percentage + '%';
            progressText.textContent = percentage + '٪ تکمیل شده';
        }
    });

    // Crown system - simulate crown collection
    const crownIndicators = document.querySelectorAll('.crown-indicator');
    
    crownIndicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            const count = this.querySelector('span').textContent;
            console.log('Crown progress:', count);
            
            // Visual feedback
            this.style.transform = 'scale(1.2) rotate(10deg)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
    });

    // XP Badge animation on hover
    const xpBadges = document.querySelectorAll('.xp-badge');
    
    xpBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Smooth scroll for section navigation
    const sectionHeaders = document.querySelectorAll('.section-header');
    
    sectionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Could implement smooth scroll to section details
            const section = this.closest('.path-section');
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Stats counter animation
    animateStats();

    // Lesson card stagger animation on scroll
    setupScrollAnimations();
});

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Update lesson status after completion
 */
function updateLessonStatus(card, status) {
    const statusBadge = card.querySelector('.status-badge');
    const lessonNumber = card.querySelector('.lesson-number');
    const startBtn = card.querySelector('.start-btn');
    
    if (status === 'completed') {
        card.classList.add('completed');
        card.classList.remove('in-progress');
        
        if (statusBadge) {
            statusBadge.textContent = 'تکمیل شده';
            statusBadge.className = 'status-badge completed';
        }
        
        if (lessonNumber) {
            lessonNumber.style.background = 'var(--gradient-success)';
        }
        
        if (startBtn) {
            startBtn.textContent = 'مرور مجدد';
            startBtn.disabled = false;
        }
        
        // Unlock next lesson
        unlockNextLesson(card);
    } else if (status === 'in-progress') {
        card.classList.add('in-progress');
        
        if (statusBadge) {
            statusBadge.textContent = 'در حال انجام';
            statusBadge.className = 'status-badge in-progress';
        }
    }
}

/**
 * Unlock the next lesson in sequence
 */
function unlockNextLesson(currentCard) {
    const nextCard = currentCard.nextElementSibling;
    
    if (nextCard && nextCard.classList.contains('locked')) {
        nextCard.classList.remove('locked');
        
        const statusBadge = nextCard.querySelector('.status-badge');
        const startBtn = nextCard.querySelector('.start-btn');
        
        if (statusBadge) {
            statusBadge.textContent = 'جدید';
            statusBadge.className = 'status-badge new';
        }
        
        if (startBtn) {
            startBtn.textContent = 'شروع درس';
            startBtn.disabled = false;
        }
        
        // Add celebration animation
        celebrateUnlock(nextCard);
    }
}

/**
 * Celebration animation for unlocking lessons
 */
function celebrateUnlock(element) {
    element.style.animation = 'none';
    element.offsetHeight; // Trigger reflow
    element.style.animation = 'slideIn 0.5s ease forwards';
    
    // Could add confetti or particle effects here
    createConfetti(element);
}

/**
 * Simple confetti effect
 */
function createConfetti(element) {
    const colors = ['#ffc800', '#58cc02', '#1cb0f6', '#ff9600', '#ff4b4b'];
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = (rect.left + rect.width / 2) + 'px';
        confetti.style.top = (rect.top + rect.height / 2) + 'px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        
        document.body.appendChild(confetti);
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 5 + Math.random() * 10;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 5;
        
        let x = 0, y = 0;
        let velX = vx;
        let velY = vy;
        let gravity = 0.5;
        
        const animate = () => {
            x += velX;
            y += velY;
            velY += gravity;
            
            confetti.style.transform = `translate(${x}px, ${y}px) rotate(${x * 5}deg)`;
            confetti.style.opacity = 1 - y / 300;
            
            if (y < 300 && confetti.style.opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
}

/**
 * Show achievement modal
 */
function showAchievementModal(name, description) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('achievement-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'achievement-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div style="
                background: var(--surface);
                padding: 2rem;
                border-radius: 24px;
                text-align: center;
                max-width: 400px;
                transform: scale(0.8);
                transition: transform 0.3s ease;
            ">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🏆</div>
                <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--text-primary);"></h3>
                <p style="color: var(--text-secondary);"></p>
                <button style="
                    margin-top: 1.5rem;
                    padding: 0.75rem 2rem;
                    background: var(--gradient-primary);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                ">بستن</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('button').addEventListener('click', () => {
            modal.style.opacity = '0';
            modal.querySelector('div').style.transform = 'scale(0.8)';
            setTimeout(() => modal.remove(), 300);
        });
        
        document.body.appendChild(modal);
    }
    
    modal.querySelector('h3').textContent = name;
    modal.querySelector('p').textContent = description;
    
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('div').style.transform = 'scale(1)';
    }, 10);
}

/**
 * Animate stats counters
 */
function animateStats() {
    const statBadges = document.querySelectorAll('.stat-badge span');
    
    statBadges.forEach(badge => {
        const text = badge.textContent;
        // Could implement number counting animation here
        badge.style.opacity = '0';
        
        setTimeout(() => {
            badge.style.transition = 'opacity 0.5s ease';
            badge.style.opacity = '1';
        }, 200);
    });
}

/**
 * Setup scroll-triggered animations
 */
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    const lessonCards = document.querySelectorAll('.lesson-card');
    
    lessonCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        
        observer.observe(card);
    });
}

// Export functions for external use
window.TopikCourse = {
    updateLessonStatus,
    unlockNextLesson,
    showAchievementModal
};
