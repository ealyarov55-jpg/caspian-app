// i18n.js - Отказоустойчивый модуль локализации
const fallbackDict = { welcome: "Welcome, Boss! 🤝", dashboard: "Dashboard", inventory: "Inventory", total_volume: "TOTAL VOLUME (NET)", saved_commissions: "SAVED B2B COMMISSIONS", total_inventory: "TOTAL INVENTORY", logout: "Logout", nav_dashboard: "Dashboard", nav_inventory: "Inventory", nav_bookings: "Bookings", nav_partners: "Partners", nav_profile: "Profile", nav_login: "Login", search_placeholder: "Search...", under_construction: "Section under construction", add_service: "Add Service", net_label: "Net", margin_label: "Margin", hotel: "Hotel", transport: "Transport", activity: "Activity" };
let currentDict = { ...fallbackDict };

export async function loadLanguage(lang) {
    try {
        // ШАГ 4: ИСПРАВЛЕН ПУТЬ НА АБСОЛЮТНЫЙ
        const response = await fetch(`/locales/${lang}.json`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const text = await response.text();
        if (!text.trim()) throw new Error("JSON file is empty");
        
        currentDict = JSON.parse(text);
        localStorage.setItem('caspian_lang', lang);
        document.documentElement.lang = lang;
    } catch (error) {
        console.error(`i18n Error [${lang}]:`, error.message, "- Falling back to English.");
        currentDict = { ...fallbackDict };
        localStorage.setItem('caspian_lang', 'en');
        document.documentElement.lang = 'en';
    } finally {
        applyTranslations();
    }
}

export function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (currentDict[key]) {
            if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                el.setAttribute('placeholder', currentDict[key]);
            } else {
                const icon = el.querySelector('i');
                if (icon) {
                    el.innerHTML = '';
                    el.appendChild(icon);
                    el.appendChild(document.createTextNode(' ' + currentDict[key]));
                } else {
                    el.innerText = currentDict[key];
                }
            }
        }
    });
}

// ЭКСПОРТ ДЛЯ ДИНАМИЧЕСКОГО РЕНДЕРА В JS
export function t(key) {
    return currentDict[key] || fallbackDict[key] || key;
}

export function getCurrentLang() {
    return localStorage.getItem('caspian_lang') || 'en';
}