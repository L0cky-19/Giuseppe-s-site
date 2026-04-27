// ===================================================
// Main JS – Shared logic (nav, animations, init)
// ===================================================

import { applyTranslations, initLangSwitcher } from './i18n.js';

/**
 * Header scroll effect
 */
function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/**
 * Mobile hamburger menu
 */
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileNav.classList.toggle('open');
        document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileNav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

/**
 * Scroll-triggered fade-in animations
 */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(el => observer.observe(el));
}

/**
 * Hero parallax background on scroll
 */
function initHeroParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    hero.classList.add('visible');

    const bg = hero.querySelector('.hero-bg');
    if (!bg) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            bg.style.transform = `scale(1) translateY(${scrolled * 0.3}px)`;
        }
    }, { passive: true });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/**
 * Set active nav link based on current page
 */
function setActiveNav() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-links a, .mobile-nav a, .nav-dropdown-menu a').forEach(link => {
        const href = link.getAttribute('href');
        const normalized = href ? href.replace('./', '').replace('../', '') : '';
        if (normalized && !normalized.startsWith('#') && currentPath.endsWith(normalized)) {
            link.classList.add('active');
        }
    });
}

/**
 * Scroll-spy: update active nav link as user scrolls through sections
 */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    // All top-level nav links (home + anchor links)
    const allNavLinks = document.querySelectorAll('.nav-links > a, .mobile-nav > a');
    if (!allNavLinks.length) return;

    const homeLink = document.querySelector('.nav-links a[href="/"], .nav-links a[href="./"], .nav-links a[href="./index.html"]');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const id = entry.target.getAttribute('id');

                // Remove active from all top-level nav links
                allNavLinks.forEach(link => link.classList.remove('active'));

                if (id === 'hero' || id === 'services') {
                    // Home sections → activate home link
                    if (homeLink) homeLink.classList.add('active');
                } else {
                    // Anchor section → activate matching link
                    allNavLinks.forEach(link => {
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -25% 0px' }
    );

    sections.forEach(section => observer.observe(section));
}

/**
 * Dynamic portfolio gallery – Fame photos first, then general
 */
function initPortfolioGallery() {
    const grid = document.getElementById('portfolio-grid');
    const showMoreWrap = document.getElementById('portfolio-show-more');
    const showMoreBtn = document.getElementById('portfolio-more-btn');
    if (!grid || !showMoreWrap || !showMoreBtn) return;

    // Fame photos (celebrity photos – displayed first)
    const famePhotos = [
        'Fame/WhatsApp Image 2026-04-19 at 19.49.26.jpeg',
        'Fame/WhatsApp Image 2026-04-19 at 19.49.26 (1).jpeg',
        'Fame/WhatsApp Image 2026-04-19 at 19.49.26 (2).jpeg',
        'Fame/WhatsApp Image 2026-04-19 at 19.49.26 (3).jpeg',
        'Fame/WhatsApp Image 2026-04-19 at 19.49.26 (4).jpeg',
        'Fame/WhatsApp Image 2026-04-19 at 19.49.26 (5).jpeg',
        'Fame/WhatsApp Image 2026-04-19 at 19.49.26 (6).jpeg',
        'Fame/WhatsApp Image 2026-04-19 at 19.49.27.jpeg',
        'Fame/WhatsApp Image 2026-04-19 at 19.49.27 (1).jpeg',
        'Fame/WhatsApp Image 2026-04-19 at 19.49.27 (2).jpeg',
        'Fame/WhatsApp Image 2026-04-19 at 19.49.27 (3).jpeg',
        'Fame/WhatsApp Image 2026-04-19 at 19.49.27 (4).jpeg',
        'Fame/WhatsApp Image 2026-04-19 at 19.49.27 (5).jpeg',
        'Fame/WhatsApp Image 2026-04-19 at 19.49.27 (6).jpeg',
        'Fame/WhatsApp Image 2026-04-19 at 19.49.28.jpeg',
        'Fame/WhatsApp Image 2026-04-19 at 19.56.07.jpeg',
        'Fame/WhatsApp Image 2026-04-19 at 19.56.07 (1).jpeg',
        'Fame/WhatsApp Image 2026-04-19 at 19.56.08.jpeg',
        'Fame/WhatsApp Image 2026-04-19 at 19.56.08 (1).jpeg',
        'Fame/WhatsApp Image 2026-04-19 at 19.56.09.jpeg',
        'Fame/WhatsApp Image 2026-04-19 at 19.56.09 (1).jpeg',
        'Fame/WhatsApp Image 2026-04-19 at 19.56.09 (2).jpeg',
        'Fame/WhatsApp Image 2026-04-19 at 19.56.09 (3).jpeg',
        'Fame/WhatsApp Image 2026-04-19 at 19.56.09 (4).jpeg',
        'Fame/WhatsApp Image 2026-04-19 at 20.00.16.jpeg',
        'Fame/WhatsApp Image 2026-04-19 at 20.00.16 (1).jpeg',
        'Fame/WhatsApp Image 2026-04-19 at 20.00.16 (2).jpeg',
    ];

    // General portfolio photos
    const generalPhotos = [
        'DSC00309.JPG',
        'DSC00374.JPG',
        'DSC00464.JPG',
        'DSC00847.JPG',
        'IMG_0067.jpeg',
        'IMG_0077.jpeg',
        'IMG_0126.jpeg',
        'IMG_3831.jpeg',
        'IMG_3834.jpeg',
        'IMG_3903.jpeg',
        'IMG_3904.jpeg',
        'IMG_4541.jpg',
        'IMG_5024.jpeg',
        'IMG_5338 2.jpeg',
        'IMG_5444.jpeg',
        'A11D1152-A6A9-4500-9005-2B8BE13C9D2C.JPG',
        'AF39D633-50B7-4F05-8C0F-93DB768FAD52.JPG',
        '47a3f173-4f25-4e33-89a5-82b81a0d6fa6.JPG',
        '83fa0ed7-6209-4f9b-b0f9-10415b2ea98e.jpg',
        '9d570667-4888-460b-b02f-21e0165675e9.jpg',
        'IMG_0038.jpeg',
        'IMG_3478.jpeg',
        'IMG_0090.JPG',
        'IMG_3902.jpeg',
        'IMG_4245.jpeg',
    ];

    // Combine: Fame first, then general
    const allPhotos = [...famePhotos, ...generalPhotos];
    const BATCH_SIZE = 9;
    let currentIndex = 0;

    function loadBatch() {
        const end = Math.min(currentIndex + BATCH_SIZE, allPhotos.length);
        for (let i = currentIndex; i < end; i++) {
            const div = document.createElement('div');
            div.className = 'gallery-item fade-in';
            const img = document.createElement('img');
            img.src = (import.meta.env?.BASE_URL ?? '/') + 'assets/photos/' + allPhotos[i];
            img.alt = 'Portfolio ' + (i + 1);
            img.loading = 'lazy';
            div.appendChild(img);
            grid.appendChild(div);
        }
        currentIndex = end;

        // Update show-more button visibility
        showMoreWrap.style.display = currentIndex >= allPhotos.length ? 'none' : '';

        // Re-apply scroll animations to new items
        const newItems = grid.querySelectorAll('.fade-in:not(.visible)');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );
        newItems.forEach(el => observer.observe(el));
    }

    // Initial load
    loadBatch();

    // Show more button
    showMoreBtn.addEventListener('click', () => {
        loadBatch();
    });

}

/**
 * Initialize everything
 */
function init() {
    initHeader();
    initMobileNav();
    initScrollAnimations();
    initHeroParallax();
    initSmoothScroll();
    initLangSwitcher();
    setActiveNav();
    initScrollSpy();
    applyTranslations();
    initPortfolioGallery();
}

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

export { init };

