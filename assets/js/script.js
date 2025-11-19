// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = this.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (this.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = '';
                    span.style.opacity = '';
                }
            });
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = event.target.closest('.navbar');
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Close mobile menu if open
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        mobileMenuToggle.classList.remove('active');
                    }
                }
            }
        });
    });

    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    const isMainPage = document.body.classList.contains('main-page');
    let navbarShown = false; // Track if navbar has been shown
    const heroButtons = document.querySelector('.hero-buttons');
    let heroButtonsAnimated = false;
    
    // Ensure hero buttons start hidden
    if (heroButtons && isMainPage) {
        heroButtons.style.opacity = '0';
        heroButtons.style.transform = 'translateY(20px)';
        // Ensure transition is set for smooth animation
        heroButtons.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    const animateHeroButtons = function() {
        if (!heroButtonsAnimated && heroButtons) {
            heroButtons.style.opacity = '1';
            heroButtons.style.transform = 'translateY(0)';
            heroButtons.classList.add('animate-in');
            heroButtonsAnimated = true;
        }
    };

    const handleScroll = function() {
        const currentScroll = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;

        // Main page: show navbar when scrolling down, then keep it visible
        if (isMainPage) {
            if (currentScroll > 0 && !navbarShown) {
                navbar.classList.add('navbar-visible');
                navbarShown = true; // Once shown, it stays visible
            }
            
            // Animate hero buttons on scroll (immediately when scrolling)
            if (currentScroll > 0 && !heroButtonsAnimated && heroButtons) {
                animateHeroButtons();
            }
        }

        // Update box shadow based on scroll position
        if (currentScroll <= 0) {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        }

        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check initial scroll position - if already scrolled, sync with hero title/subtitle animations
    if (isMainPage && heroButtons) {
        const initialScroll = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
        if (initialScroll > 0) {
            // Page is already scrolled - animate buttons with delay to sync with subtitle (starts at 0.8s)
            // Use 1s delay to match subtitle animation timing
            setTimeout(animateHeroButtons, 1000);
        }
    }

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all sections except hero
    const sections = document.querySelectorAll('section:not(.hero)');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(40px)';
        section.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(section);
    });

    // Ensure about section gets animation even if it's already in view
    setTimeout(() => {
        const aboutSection = document.querySelector('.about-section');
        if (aboutSection && aboutSection.getBoundingClientRect().top < window.innerHeight) {
            aboutSection.style.opacity = '1';
            aboutSection.style.transform = 'translateY(0)';
            aboutSection.classList.add('animate-in');
        }
    }, 100);

    // Observe cards and other elements
    const cards = document.querySelectorAll('.stat-card, .chapter-card, .company-card, .fund-card, .sponsor-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(card);
    });


    // Card hover effects
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // Counter animation for stats
    const stats = document.querySelectorAll('.stat-number');
    const animateCounter = (element) => {
        const target = element.innerText;
        const isKFormat = target.includes('K');
        const isPlus = target.includes('+');
        const numericValue = parseInt(target.replace(/[^0-9]/g, ''));
        
        let current = 0;
        const increment = numericValue / 80;
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(current);
            if (isKFormat) displayValue = '$' + displayValue + 'K';
            if (isPlus && !isKFormat) displayValue = displayValue + '+';
            
            element.innerText = displayValue;
        }, 50);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Add active state to navigation based on scroll position
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // cursor-follow glow removed

    // Contact page topic selector
    const contactSelect = document.getElementById('contact-topic');
    const contactDetails = document.querySelectorAll('.contact-detail');

    if (contactSelect && contactDetails.length > 0) {
        const showDetail = (detail) => {
            detail.style.display = 'block';
            requestAnimationFrame(() => detail.classList.add('active'));
        };

        const hideDetail = (detail) => {
            detail.classList.remove('active');
            detail.style.display = 'none';
        };

        const updateContactDetails = () => {
            const selected = contactSelect.value;
            if (!selected) return;
            contactDetails.forEach(detail => {
                if (detail.dataset.topic === selected) {
                    showDetail(detail);
                } else if (detail.style.display !== 'none') {
                    hideDetail(detail);
                }
            });
        };

        contactDetails.forEach(detail => {
            detail.style.display = 'none';
        });

        contactSelect.addEventListener('change', updateContactDetails);

    }
});

// Parallax effect removed for consistent scrolling

    // Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Board page section animations
document.addEventListener('DOMContentLoaded', function() {
    const boardGroups = document.querySelectorAll('.board-section-group');
    if (boardGroups.length > 0) {
        const boardObserverOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const boardObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('animate-in');
                    boardObserver.unobserve(entry.target);
                }
            });
        }, boardObserverOptions);

        boardGroups.forEach((group, index) => {
            group.style.opacity = '0';
            group.style.transform = 'translateY(40px)';
            group.style.transition = `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.2}s, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.2}s`;
            boardObserver.observe(group);
        });
    }

    // Apply page content animations
    const applyContentItems = document.querySelectorAll('.apply-content-item');
    if (applyContentItems.length > 0) {
        // Set initial state
        applyContentItems.forEach((item) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
        });

        // Trigger animations with staggered delays when section is visible
        const applyHero = document.querySelector('.apply-hero');
        if (applyHero) {
            const triggerAnimations = () => {
                applyContentItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                        item.classList.add('animate-in');
                    }, index * 200); // Stagger by 200ms
                });
            };

            // Use IntersectionObserver to trigger when hero section is visible
            const applyObserverOptions = {
                threshold: 0.1,
                rootMargin: '0px'
            };

            const applyObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        triggerAnimations();
                        applyObserver.unobserve(entry.target);
                    }
                });
            }, applyObserverOptions);

            applyObserver.observe(applyHero);
            
            // Also trigger immediately if section is already visible (for fast page loads)
            if (applyHero.getBoundingClientRect().top < window.innerHeight) {
                setTimeout(triggerAnimations, 300);
            }
        }
    }
});

