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
        if (href && currentPath.endsWith(href.replace('./', '').replace('../', ''))) {
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
        { threshold: 0.4, rootMargin: '0px 0px -20% 0px' }
    );

    sections.forEach(section => observer.observe(section));
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
}

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

export { init };
