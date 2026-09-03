class ThemeManager {
    constructor() {
        this.body = document.body;
        this.init();
    }
    init() {
        const saved = localStorage.getItem('atlas_theme');
        saved === 'night' ? this.setNight() : this.setDay();
    }
    toggle() {
        this.body.classList.contains('night') ? this.setDay() : this.setNight();
        this.updateIcon();
    }
    setDay() { this.body.classList.remove('night'); localStorage.setItem('atlas_theme', 'day'); }
    setNight() { this.body.classList.add('night'); localStorage.setItem('atlas_theme', 'night'); }
    updateIcon() {
        const icon = document.querySelector('#themeToggle i');
        if (icon) icon.className = this.body.classList.contains('night') ? 'fas fa-sun' : 'fas fa-moon';
    }
}
const themeManager = new ThemeManager();
function toggleTheme() { themeManager.toggle(); }