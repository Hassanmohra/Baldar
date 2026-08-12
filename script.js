// ========================================
// بلدار | Baldar - Main JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function() {

    // ========================================
    // Navbar Scroll Effect
    // ========================================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ========================================
    // Mobile Navigation
    // ========================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ========================================
    // Active Navigation Link on Scroll
    // ========================================
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // ========================================
    // Counter Animation
    // ========================================
    const counters = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function startCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            };
            updateCounter();
        });
    }

    const heroSection = document.querySelector('.hero');
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                setTimeout(startCounters, 500);
            }
        });
    }, { threshold: 0.5 });
    heroObserver.observe(heroSection);

    // ========================================
    // Load Projects from projects.json
    // ========================================
    async function loadProjects() {
        const grid = document.getElementById('projectsGrid');
        if (!grid) return;

        try {
            // Add cache-buster to avoid caching
            const response = await fetch('projects.json?v=' + Date.now());
            if (!response.ok) throw new Error('Failed to load');
            const data = await response.json();

            if (!data.projects || data.projects.length === 0) {
                grid.innerHTML = '<div style="text-align:center; padding:50px; color:var(--gray);"><i class="fas fa-folder-open" style="font-size:3rem; margin-bottom:15px; display:block; opacity:0.5;"></i><p>لا توجد أعمال معروضة حالياً</p></div>';
                return;
            }

            const categoryIcons = {
                'تطوير ويب': 'fa-globe',
                'إنتاج مرئي': 'fa-newspaper',
                'هوية بصرية': 'fa-building',
                'مونتاج': 'fa-futbol',
                'إدارة مشاريع': 'fa-project-diagram',
                'معالجة صور': 'fa-image',
                'موشن جرافيك': 'fa-magic',
                'سوشيال ميديا': 'fa-share-alt',
                'تصميم داخلي': 'fa-couch',
                'تصوير فوتوغرافي': 'fa-camera'
            };

            let html = '';
            data.projects.forEach(p => {
                const icon = categoryIcons[p.category] || 'fa-star';
                html += `
                <div class="project-card fade-in">
                    <div class="project-image">
                        <div class="project-placeholder">
                            <i class="fas ${icon}"></i>
                        </div>
                        <div class="project-overlay">
                            <span class="project-tag">${p.category}</span>
                        </div>
                    </div>
                    <div class="project-info">
                        <h3>${p.name}</h3>
                        <p>${p.desc}</p>
                    </div>
                </div>`;
            });

            grid.innerHTML = html;

            // Re-observe new elements for fade animation
            document.querySelectorAll('.project-card').forEach(el => {
                el.classList.add('fade-in');
                fadeObserver.observe(el);
            });

        } catch (err) {
            console.error('Error loading projects:', err);
            grid.innerHTML = '<div style="text-align:center; padding:50px; color:var(--gray);"><i class="fas fa-exclamation-circle" style="font-size:2rem; margin-bottom:15px; display:block;"></i><p>حدث خطأ في تحميل الأعمال. يرجى المحاولة لاحقاً.</p></div>';
        }
    }

    loadProjects();

    // ========================================
    // Fade In Animation on Scroll
    // ========================================
    const fadeElements = document.querySelectorAll('.about-card, .service-card, .project-card');
    fadeElements.forEach(el => el.classList.add('fade-in'));

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // ========================================
    // Contact Form - Store in LocalStorage
    // ========================================
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('successModal');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = {
                id: Date.now(),
                name: formData.get('name'),
                email: formData.get('email'),
                service: formData.get('service'),
                message: formData.get('message'),
                date: new Date().toISOString(),
                read: false
            };

            // Save to LocalStorage (will be read by admin.html)
            let messages = JSON.parse(localStorage.getItem('baldar_messages') || '[]');
            messages.push(data);
            localStorage.setItem('baldar_messages', JSON.stringify(messages));

            // Show success modal
            successModal.classList.add('active');
            contactForm.reset();
        });
    }

    // Close modal when clicking outside
    successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
            closeModal();
        }
    });

    // ========================================
    // Smooth Scroll
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ========================================
    // Parallax Effect
    // ========================================
    const shapes = document.querySelectorAll('.shape');
    window.addEventListener('scroll', function() {
        const scrolled = window.scrollY;
        shapes.forEach((shape, index) => {
            const speed = 0.3 + (index * 0.1);
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

});

// ========================================
// Modal Functions
// ========================================
function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) modal.classList.remove('active');
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});
