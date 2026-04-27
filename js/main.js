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
        'Fame/fame_01.jpeg',
        'Fame/fame_02.jpeg',
        'Fame/fame_03.jpeg',
        'Fame/fame_04.jpeg',
        'Fame/fame_05.jpeg',
        'Fame/fame_06.jpeg',
        'Fame/fame_07.jpeg',
        'Fame/fame_08.jpeg',
        'Fame/fame_09.jpeg',
        'Fame/fame_10.jpeg',
        'Fame/fame_11.jpeg',
        'Fame/fame_12.jpeg',
        'Fame/fame_13.jpeg',
        'Fame/fame_14.jpeg',
        'Fame/fame_15.jpeg',
        'Fame/fame_16.jpeg',
        'Fame/fame_17.jpeg',
        'Fame/fame_18.jpeg',
        'Fame/fame_19.jpeg',
        'Fame/fame_20.jpeg',
        'Fame/fame_21.jpeg',
        'Fame/fame_22.jpeg',
        'Fame/fame_23.jpeg',
        'Fame/fame_24.jpeg',
        'Fame/fame_25.jpeg',
        'Fame/fame_26.jpeg',
        'Fame/fame_27.jpeg',
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
        'IMG_5338_2.jpeg',
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
            div.className = 'gallery-item fade-in visible';
            const img = document.createElement('img');
            img.src = new URL('../assets/photos/' + allPhotos[i], import.meta.url).href;
            img.alt = 'Portfolio ' + (i + 1);
            img.loading = 'lazy';
            div.appendChild(img);
            grid.appendChild(div);
        }
        currentIndex = end;

        // Update show-more button visibility
        showMoreWrap.style.display = currentIndex >= allPhotos.length ? 'none' : '';

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

