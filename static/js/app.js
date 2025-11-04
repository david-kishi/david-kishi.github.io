// ===================================
// Portfolio Data
// ===================================
const portfolioData = {
    opening: '<span class="keyword">const</span> ',
    name: '<span class="name">DavidNguyen</span> 👦',
    equals: ' = {\n',
    properties: [
        {
            key: '  title',
            value: '"Software Developer"'
        },
        {
            key: '  languages',
            value: '[\n    "C++",\n    "Python",\n    "JavaScript",\n    "Assembly"\n  ]'
        },
        {
            key: '  skills',
            value: '[\n    "TensorFlow",\n    "Project Management",\n    "Microsoft Office",\n    "Git"\n  ]'
        },
        {
            key: '  passions',
            value: '[\n    "Space Exploration 🚀",\n    "Esports 🎮",\n    "Machine Learning 🖥"\n  ]'
        },
        {
            key: '  school',
            value: '[\n    "B.S. Computer Science - CSUF",\n    "Data Analytics & Visualization Certificate - UCI"\n  ]'
        },
        {
            key: '  GitHub',
            value: '<a href="https://github.com/david-kishi/" target="_blank" rel="noopener noreferrer"><img src="imgs/GitHub-Mark-32px.png" alt="GitHub Logo" class="social-icon"></a>',
            isHTML: true
        },
        {
            key: '  LinkedIn',
            value: '<a href="https://www.linkedin.com/in/david-kishi/" target="_blank" rel="noopener noreferrer"><img src="imgs/LinkedIn-Bug-32px.png" alt="LinkedIn Logo" class="social-icon"></a>',
            isHTML: true
        }
    ],
    closing: '};\n'
};

// ===================================
// Typing Animation
// ===================================
class TypeWriter {
    constructor(element, speed = 30) {
        this.element = element;
        this.speed = speed;
        this.currentText = '';
        this.isDeleting = false;
        this.cursorVisible = true;
    }

    async type() {
        // Add opening
        await this.typeString(portfolioData.opening + portfolioData.name + portfolioData.equals);

        // Add properties
        for (let i = 0; i < portfolioData.properties.length; i++) {
            const prop = portfolioData.properties[i];

            // Type property key
            await this.typeString(`<span class="property">${prop.key}</span>: `);

            // Type property value
            if (prop.isHTML) {
                this.currentText += prop.value;
                this.updateDisplay();
                await this.wait(100);
            } else {
                await this.typeString(`<span class="string">${prop.value}</span>`);
            }

            // Add comma except for last property
            if (i < portfolioData.properties.length - 1) {
                await this.typeString(',\n');
            } else {
                await this.typeString('\n');
            }
        }

        // Add closing
        await this.typeString(portfolioData.closing);

        // Remove cursor after completion
        setTimeout(() => {
            this.removeCursor();
        }, 1000);
    }

    async typeString(str) {
        // Check if string contains HTML tags
        const hasHTML = /<[^>]*>/g.test(str);

        if (hasHTML) {
            // Split by HTML tags and text
            const parts = str.split(/(<[^>]*>)/g);

            for (const part of parts) {
                if (part.startsWith('<') && part.endsWith('>')) {
                    // It's an HTML tag, add it instantly
                    this.currentText += part;
                    this.updateDisplay();
                } else {
                    // It's text, type it character by character
                    for (const char of part) {
                        this.currentText += char;
                        this.updateDisplay();
                        await this.wait(this.getRandomSpeed());
                    }
                }
            }
        } else {
            // No HTML, type normally
            for (const char of str) {
                this.currentText += char;
                this.updateDisplay();
                await this.wait(this.getRandomSpeed());
            }
        }
    }

    updateDisplay() {
        this.element.innerHTML = this.currentText + '<span class="cursor"></span>';
    }

    removeCursor() {
        this.element.innerHTML = this.currentText;
    }

    getRandomSpeed() {
        // Add slight randomness to typing speed for more natural feel
        return this.speed + Math.random() * 10;
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ===================================
// Dark Mode Toggle
// ===================================
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle.querySelector('.theme-icon');
        this.currentTheme = this.getInitialTheme();

        this.init();
    }

    init() {
        // Set initial theme
        this.applyTheme(this.currentTheme);

        // Add event listener
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    getInitialTheme() {
        // Check localStorage first
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);

        // Add rotation animation to icon
        this.themeIcon.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.themeIcon.style.transform = 'rotate(0deg)';
        }, 300);
    }

    applyTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);

        // Update aria-label for accessibility
        this.themeToggle.setAttribute('aria-label',
            `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`
        );
    }
}

// ===================================
// Intersection Observer for Animations
// ===================================
class AnimationObserver {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            this.observerOptions
        );
    }

    observe(element) {
        this.observer.observe(element);
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// ===================================
// Initialize Application
// ===================================
function init() {
    // Initialize theme manager
    const themeManager = new ThemeManager();

    // Initialize typing animation
    const codeContent = document.getElementById('codeContent');
    const typeWriter = new TypeWriter(codeContent, 10);

    // Start typing after a short delay
    setTimeout(() => {
        typeWriter.type();
    }, 500);

    // Initialize intersection observer for future animations
    const animationObserver = new AnimationObserver();

    // Observe code block for animations (if needed later)
    const codeBlock = document.querySelector('.code-block');
    if (codeBlock) {
        animationObserver.observe(codeBlock);
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Toggle theme with 't' key
        if (e.key === 't' || e.key === 'T') {
            themeManager.toggleTheme();
        }
    });

    // Log welcome message
    console.log('%c👋 Welcome to David Nguyen\'s Portfolio!', 'color: #0066cc; font-size: 20px; font-weight: bold;');
    console.log('%cPress "T" to toggle dark mode', 'color: #666; font-size: 14px;');
}

// ===================================
// Start Application
// ===================================
// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ===================================
// Service Worker Registration (Optional for PWA)
// ===================================
// Uncomment if you want to add PWA support
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered:', registration))
            .catch(error => console.log('SW registration failed:', error));
    });
}
*/
