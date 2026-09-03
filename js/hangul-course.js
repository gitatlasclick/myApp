// ========================================================
// HANGUL COURSE - Main Logic (FIXED)
// ========================================================

const HangulCourse = {

    // ===== DATA =====
    units: [{
        id: 'u1',
        title: 'حروف صدادار',
        subtitle: '단모음',
        icon: '🔊',
        color: '#FF6B8A',
        xp: 10,
        charType: 'duo',
        children: [
            { id: 'u1l', type: 'lesson', label: 'درس', icon: '📖', title: 'آموزش صدادارها', path: 'unit1/lesson.html' },
            { id: 'u1p', type: 'practice', label: 'تمرین', icon: '✏️', title: 'تمرین خواندن', path: 'unit1/practice.html' },
            { id: 'u1q', type: 'quiz', label: 'کوییز', icon: '🧪', title: 'تست صدادارها', path: 'unit1/quiz.html' }
        ]
    }, {
        id: 'u2',
        title: 'حروف بی‌صدا',
        subtitle: '자음',
        icon: '📖',
        color: '#D64B3F',
        xp: 15,
        charType: 'eddie',
        children: [
            { id: 'u2l', type: 'lesson', label: 'درس', icon: '📖', title: 'آموزش بی‌صداها', path: 'unit2/lesson.html' },
            { id: 'u2p', type: 'practice', label: 'تمرین', icon: '✏️', title: 'تمرین خواندن', path: 'unit2/practice.html' },
            { id: 'u2q', type: 'quiz', label: 'کوییز', icon: '🧪', title: 'تست بی‌صداها', path: 'unit2/quiz.html' }
        ]
    }, {
        id: 'u3',
        title: 'حروف ترکیبی',
        subtitle: '이중모음',
        icon: '🔗',
        color: '#4A90D9',
        xp: 15,
        charType: 'lily',
        children: [
            { id: 'u3l', type: 'lesson', label: 'درس', icon: '📖', title: 'آموزش ترکیبی', path: 'unit3/lesson.html' },
            { id: 'u3p', type: 'practice', label: 'تمرین', icon: '✏️', title: 'تمرین خواندن', path: 'unit3/practice.html' },
            { id: 'u3q', type: 'quiz', label: 'کوییز', icon: '🧪', title: 'تست ترکیبی', path: 'unit3/quiz.html' }
        ]
    }, {
        id: 'u4',
        title: 'حروف پایانی',
        subtitle: '받침',
        icon: '🏆',
        color: '#D4A853',
        xp: 20,
        charType: 'zari',
        children: [
            { id: 'u4l', type: 'lesson', label: 'درس', icon: '📖', title: 'آموزش Batchim', path: 'unit4/lesson.html' },
            { id: 'u4p', type: 'practice', label: 'تمرین', icon: '✏️', title: 'تمرین خواندن', path: 'unit4/practice.html' },
            { id: 'u4q', type: 'quiz', label: 'آزمون', icon: '🧪', title: 'آزمون نهایی', path: 'unit4/quiz.html' }
        ]
    }],

    // ===== PROGRESS =====
    loadProgress() {
        const saved = localStorage.getItem('atlas_progress');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                return data.hangul?.lessons || {};
            } catch (e) {}
        }
        return {};
    },

    saveLesson(lessonId, done) {
        const all = JSON.parse(localStorage.getItem('atlas_progress') || '{}');
        if (!all.hangul) all.hangul = { lessons: {} };
        if (!all.hangul.lessons) all.hangul.lessons = {};
        all.hangul.lessons[lessonId] = done;
        localStorage.setItem('atlas_progress', JSON.stringify(all));
    },

    isDone(lessonId) {
        const prog = this.loadProgress();
        return prog[lessonId] || false;
    },

    getUnitProgress(unit) {
        const total = unit.children.length;
        const done = unit.children.filter(c => this.isDone(c.id)).length;
        return { done, total, percent: Math.round((done / total) * 100) };
    },

    getTotalProgress() {
        const all = this.loadProgress();
        const total = this.units.reduce((sum, u) => sum + u.children.length, 0);
        const done = Object.values(all).filter(Boolean).length;
        return { done, total, percent: Math.round((done / total) * 100) };
    },

    // ===== TOAST =====
    showToast(message, type = 'success') {
        const toast = document.getElementById('hangulToast');
        const msg = document.getElementById('toastMessage');
        if (!toast) return;
        msg.textContent = message;
        toast.className = 'hangul-toast';
        if (type) toast.classList.add(type);
        toast.classList.add('show');
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => toast.classList.remove('show'), 3000);
    },

    // ===== RENDER =====
    renderPath() {
        const container = document.getElementById('hangulLearningPath');
        if (!container) return;

        const total = this.units.length;
        const containerWidth = container.offsetWidth || 700;
        const isMobile = window.innerWidth < 640;
        const nodeSize = isMobile ? 76 : 100;
        const spacing = isMobile ? 110 : 140;
        const leftOffset = isMobile ? 30 : 60;
        const rightOffset = isMobile ? 30 : 60;

        const positions = this.units.map((_, i) => {
            const isEven = i % 2 === 0;
            const x = isEven ? leftOffset + nodeSize / 2 : containerWidth - rightOffset - nodeSize / 2;
            const y = 50 + i * spacing;
            return { x, y, isEven };
        });

        // ===== NO SVG PATH - REMOVED =====
        // Just render nodes without connecting lines

        // Render nodes
        this.units.forEach((unit, i) => {
            const pos = positions[i];
            const prog = this.getUnitProgress(unit);
            
            // ===== FIX: Lesson 1 is always available =====
            let status;
            if (i === 0) {
                // First lesson is always available
                status = 'available';
            } else if (prog.done === prog.total) {
                status = 'completed';
            } else {
                // Check if previous unit is completed
                const prevUnit = this.units[i - 1];
                const prevProg = this.getUnitProgress(prevUnit);
                if (prevProg.done === prevProg.total) {
                    status = 'available';
                } else {
                    status = 'locked';
                }
            }
            
            // If current unit is completed, show as completed
            if (prog.done === prog.total && prog.total > 0) {
                status = 'completed';
            }

            const isOpen = status === 'available' || status === 'completed';

            const node = document.createElement('div');
            node.className = `hangul-path-node ${isOpen ? 'open' : ''}`;
            node.style.left = `${pos.x - nodeSize/2}px`;
            node.style.top = `${pos.y - nodeSize/2}px`;
            node.style.width = `${nodeSize}px`;
            node.dataset.unit = unit.id;

            // ---- CHARACTER ----
            const charContainer = document.createElement('div');
            charContainer.className = 'hangul-node-character';

            const charWrapper = document.createElement('div');
            charWrapper.className = 'char-3d-wrapper';
            charWrapper.style.cssText = `
                width: ${isMobile ? 36 : 46}px;
                height: ${isMobile ? 36 : 46}px;
                margin: 0 auto;
                transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            `;

            // Create character
            const char = new Character3D({
                container: charWrapper,
                type: unit.charType || 'duo',
                size: isMobile ? 36 : 46,
                color: unit.color,
                messages: [
                    `${unit.title} رو شروع کن!`,
                    'بیا بریم!',
                    'عالی!',
                    'ادامه بده!'
                ],
                onClick: function() {
                    if (status !== 'locked') {
                        node.classList.toggle('open');
                        // Close others
                        document.querySelectorAll('.hangul-path-node.open').forEach(n => {
                            if (n !== node) n.classList.remove('open');
                        });
                    }
                }
            });

            charContainer.appendChild(charWrapper);

            // ---- BUTTON ----
            const btn = document.createElement('button');
            btn.className = `hangul-btn-3d ${status}`;
            btn.style.width = `${nodeSize}px`;
            btn.style.height = `${nodeSize}px`;

            let content = '';
            if (status === 'completed') {
                content = `
                    <span class="checkmark">✅</span>
                    <span class="icon">${unit.icon}</span>
                    <span class="label">${unit.title}</span>
                    <span class="xp-badge">${unit.xp} XP</span>
                `;
            } else if (status === 'locked') {
                content = `
                    <span class="icon">🔒</span>
                    <span class="label">قفل</span>
                    <span class="lock-icon">🔒</span>
                `;
            } else {
                content = `
                    <span class="icon">${unit.icon}</span>
                    <span class="label">${unit.title}</span>
                    <span class="xp-badge">${unit.xp} XP</span>
                `;
            }
            btn.innerHTML = content;

            if (status !== 'locked') {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    node.classList.toggle('open');
                    document.querySelectorAll('.hangul-path-node.open').forEach(n => {
                        if (n !== node) n.classList.remove('open');
                    });
                    // Show character message on toggle
                    if (char) {
                        const msgs = ['📚 بیا شروع کن!', '✏️ آماده‌ای؟', '🧪 بیا تست بزن!'];
                        char.showMessage(msgs[Math.floor(Math.random() * msgs.length)], '');
                    }
                });
            }

            // ---- CHILDREN ----
            const childrenDiv = document.createElement('div');
            childrenDiv.className = 'hangul-node-children';
            if (!pos.isEven) {
                childrenDiv.style.left = 'auto';
                childrenDiv.style.right = 'calc(100% + 16px)';
                childrenDiv.style.alignItems = 'flex-end';
            }

            unit.children.forEach(child => {
                const done = this.isDone(child.id);
                const childBtn = document.createElement('button');
                childBtn.className = `hangul-btn-child ${child.type}`;
                childBtn.innerHTML = `
                    <span class="child-icon">${child.icon}</span>
                    <span class="child-label">${child.label}</span>
                    ${done ? '<span class="check-small">✅</span>' : ''}
                `;
                childBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (!done) {
                        this.saveLesson(child.id, true);
                        this.showToast(`✅ "${child.title}" تکمیل شد!`, 'success');
                        // Update progress and re-render
                        this.renderAll();
                        // Check if unit complete
                        const unitProg = this.getUnitProgress(unit);
                        if (unitProg.done === unitProg.total && i < this.units.length - 1) {
                            setTimeout(() => {
                                this.showToast(`🎉 "${unit.title}" کامل شد!`, 'success');
                            }, 500);
                        }
                    } else {
                        this.showToast(`📖 "${child.title}" مرور شد`, 'info');
                    }
                    setTimeout(() => {
                        window.location.href = child.path;
                    }, 400);
                });
                childrenDiv.appendChild(childBtn);
            });

            // ---- LABEL ----
            const label = document.createElement('div');
            label.className = 'hangul-node-label';
            label.innerHTML = `
                <div class="title">${unit.title}</div>
                <div class="subtitle">${unit.subtitle} · ${prog.done}/${prog.total}</div>
            `;

            node.appendChild(charContainer);
            node.appendChild(btn);
            node.appendChild(childrenDiv);
            node.appendChild(label);
            container.appendChild(node);

            // Store character reference
            node._character = char;
        });
    },

    renderProgress() {
        const { done, total, percent } = this.getTotalProgress();
        const circ = 2 * Math.PI * 24;
        const offset = circ - (percent / 100) * circ;

        const ring = document.getElementById('progressRing');
        const pct = document.getElementById('progressPercent');
        const text = document.getElementById('progressText');
        const dots = document.querySelectorAll('#unitDots .dot');

        if (ring) ring.style.strokeDashoffset = offset;
        if (pct) pct.textContent = `${percent}%`;
        if (text) text.textContent = `${done} از ${total} جلسه تکمیل شده`;

        dots.forEach((dot, i) => {
            const unit = this.units[i];
            if (!unit) return;
            const prog = this.getUnitProgress(unit);
            dot.className = 'dot';
            if (prog.done === prog.total) {
                dot.classList.add('done');
            } else if (prog.done > 0) {
                dot.classList.add('active');
            }
        });
    },

    renderAll() {
        const container = document.getElementById('hangulLearningPath');
        if (container) container.innerHTML = '';
        this.renderPath();
        this.renderProgress();
    },

    // ===== INIT =====
    init() {
        this.renderAll();

        // Re-render on resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const container = document.getElementById('hangulLearningPath');
                if (container) container.innerHTML = '';
                this.renderPath();
            }, 300);
        });

        // Keyboard shortcut: R to refresh
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' || e.key === 'R') {
                this.renderAll();
                this.showToast('🔄 بروزرسانی شد', 'info');
            }
        });

        console.log('🇰🇷 Hangul Course loaded!');
    }
};

// ===== EXPORT =====
window.HangulCourse = HangulCourse;

// ===== AUTO INIT =====
document.addEventListener('DOMContentLoaded', () => {
    HangulCourse.init();
});