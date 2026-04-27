// ===================================================
// i18n – Lightweight translation engine
// ===================================================

const translations = {};
let currentLang = localStorage.getItem('gb-lang') || 'it';

/**
 * Load a language JSON file
 */
async function loadLanguage(lang) {
    if (translations[lang]) return translations[lang];
    try {
        const res = await fetch(`./i18n/${lang}.json`);
        translations[lang] = await res.json();
        return translations[lang];
    } catch (e) {
        console.warn(`[i18n] Could not load language: ${lang}`, e);
        return {};
    }
}

/**
 * Get a nested value from an object using dot notation
 */
function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
}

/**
 * Apply translations to all elements with data-i18n attribute
 */
async function applyTranslations(lang) {
    currentLang = lang || currentLang;
    localStorage.setItem('gb-lang', currentLang);

    const dict = await loadLanguage(currentLang);
    if (!dict || Object.keys(dict).length === 0) return;

    // Translate text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = getNestedValue(dict, key);
        if (val) {
            el.textContent = val;
        }
    });

    // Translate HTML content (for elements with rich formatting)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        const val = getNestedValue(dict, key);
        if (val) {
            el.innerHTML = val;
        }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const val = getNestedValue(dict, key);
        if (val) {
            el.placeholder = val;
        }
    });

    // Translate title attribute
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        const val = getNestedValue(dict, key);
        if (val) {
            el.title = val;
        }
    });

    // Translate meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    const pageKey = document.body.getAttribute('data-page');
    if (metaDesc && pageKey) {
        const metaVal = getNestedValue(dict, `meta.${pageKey}.description`);
        if (metaVal) metaDesc.setAttribute('content', metaVal);
        const titleVal = getNestedValue(dict, `meta.${pageKey}.title`);
        if (titleVal) document.title = titleVal;
    }

    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
    });

    // Set html lang attribute
    document.documentElement.lang = currentLang;
}

/**
 * Initialize language switcher buttons
 */
function initLangSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            applyTranslations(lang);
        });
    });
}

/**
 * Get current language
 */
function getCurrentLang() {
    return currentLang;
}

/**
 * Synchronous translation lookup (only works after the dict is cached via loadLanguage/applyTranslations)
 */
function translate(key) {
    const dict = translations[currentLang];
    return dict ? getNestedValue(dict, key) : null;
}

export { applyTranslations, initLangSwitcher, getCurrentLang, loadLanguage, translate };
