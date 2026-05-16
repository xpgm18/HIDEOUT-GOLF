// ==================== HAMBURGER MENU FUNCTIONALITY ====================

document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = navMenu.querySelectorAll('a');

    // Toggle menu on hamburger click
    if (hamburger) {
        hamburger.addEventListener('click', function (e) {
            e.stopPropagation();
            const isActive = navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive);
        });
    }

    // Close menu when a navigation link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', function (event) {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnHamburger = hamburger && hamburger.contains(event.target);

        if (!isClickInsideMenu && !isClickOnHamburger && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (hamburger) {
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (hamburger) {
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // ==================== SMOOTH SCROLL FOR BOOKMARKS ====================

    const bookmarkLinks = document.querySelectorAll('.bookmarks a');

    bookmarkLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Only handle internal anchor links
            if (href.startsWith('#')) {
                e.preventDefault();

                const targetSection = document.querySelector(href);

                if (targetSection) {
                    // Close mobile menu if open
                    navMenu.classList.remove('active');
                    if (hamburger) {
                        hamburger.setAttribute('aria-expanded', 'false');
                    }

                    // Smooth scroll to the target section with offset for sticky header
                    const headerHeight = document.querySelector('.sticky-header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Set focus to the section for accessibility
                    targetSection.setAttribute('tabindex', '-1');
                    targetSection.focus();
                }
            }
        });
    });

    // ==================== LAZY LOADING OBSERVER ====================
    // Enhance native lazy loading with Intersection Observer for better control

    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // Trigger image load if not already loaded
                    if (img.src) {
                        // Image is already set to load natively, just add a loaded class for styling
                        img.classList.add('loaded');

                        // Optional: Handle image load errors
                        img.addEventListener('error', function () {
                            console.warn('Failed to load image:', img.src);
                            img.classList.add('load-error');
                        });

                        // Once image enters viewport, stop observing it to save performance
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            // Start loading slightly before image enters viewport (300px buffer)
            rootMargin: '300px'
        });

        // Observe all lazy-loaded images
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        console.log('IntersectionObserver not supported. Using native lazy loading.');
    }

    // ==================== PERFORMANCE MONITORING ====================
    // Monitor page load performance to ensure it meets 3-second requirement

    window.addEventListener('load', function () {
        if (window.performance && window.performance.timing) {
            const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            console.log('Page load time: ' + loadTime + 'ms');

            // Log a warning if page load exceeds 3 seconds
            if (loadTime > 3000) {
                console.warn('Page load time exceeds 3 seconds. Current: ' + loadTime + 'ms');
            }
        }
    });

    // ==================== RESPONSIVE MENU MANAGEMENT ====================
    // Ensure menu state is correct when resizing from mobile to tablet/desktop

    let lastWindowWidth = window.innerWidth;

    window.addEventListener('resize', function () {
        const currentWindowWidth = window.innerWidth;

        // If window crosses tablet breakpoint (768px), reset menu state
        if ((lastWindowWidth < 768 && currentWindowWidth >= 768) ||
            (lastWindowWidth >= 768 && currentWindowWidth < 768)) {
            navMenu.classList.remove('active');
            if (hamburger) {
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }

        lastWindowWidth = currentWindowWidth;
    });

    // ==================== SECTION FOCUS MANAGEMENT ====================
    // Remove outline when user scrolls to section (for better UX)

    const sections = document.querySelectorAll('[id^="fairway-section"], [id^="green-section"]');

    sections.forEach(section => {
        section.addEventListener('blur', function () {
            this.style.outline = 'none';
        });
    });

});