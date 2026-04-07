// ==========================================
// CASPIAN TRAVEL ROUTES — app2.js v15.0
// FIXES: 1) Firebase Storage upload (no more Base64 in DB)
//        2) getSafeImage HTML quote bug fixed
//        3) Mobile burger menu added
// ==========================================

// ── TRANSLATIONS ───────────────────────────────────────────────────
const translations = {
    en: {
        login: "Secure Login", register: "Create Account",
        welcome_buyer: "DISCOVER THE CASPIAN ROUTES",
        subtitle_buyer: "Your DMC Partner for Unforgettable Journeys in Azerbaijan, Kazakhstan, Turkmenistan, Iran & Russia.",
        destinations: "Destinations", explore: "Explore Route", extranet: "Partner Extranet",
        save: "Save Changes", auto_fill: "Auto-fill from Booking.com", my_property: "My Property",
        logout: "Logout", role_hotel: "Hotel / Accommodation", role_driver: "Transport / Driver",
        role_buyer: "B2B Tour Operator", dashboard: "Dashboard", inventory: "Inventory",
        bookings: "Bookings", partners: "Partners", profile: "Profile",
        welcome_boss: "Welcome back, Boss! 👋", platform_overview: "Real-time Business Overview",
        total_revenue: "Total Revenue", active_bookings: "Active Bookings", platform_views: "Live Traffic",
        total_partners: "Active Partners", recent_sales: "Recent Transactions", market_share: "Market Insights",
        partner_col: "Partner", service_col: "Service", date_col: "Date", amount_col: "Amount", status_col: "Status",
        availability: "Availability", media_gallery: "Media Gallery", property_details: "Property Details",
        admin_analytics: "Platform Analytics", total_inventory: "Total Inventory",
        edit_property: "Edit", create_property: "Create New Property", smart_autofill: "Smart API Auto-Fill",
        public_name: "Property / Company Name", b2b_price: "Starting Price (AZN)", region: "Region", category: "Category",
        description: "Detailed Description", rooms_management: "Rooms Management", vehicles_management: "Fleet Management",
        add_room: "+ Add Room", add_vehicle: "+ Add Vehicle", room_name: "Room Name", vehicle_name: "Vehicle Model",
        price_azn: "Net Price (AZN)", qty: "Qty", click_to_upload: "Click to Upload Photos", update_gallery: "Update Gallery",
        block_selected: "Block Selected", unblock_selected: "Unblock Selected",
        calendar_hint: "Select a date range, then click Block or Unblock.",
        autofill_btn: "Fetch API", select_room: "Select Room / Vehicle to manage:",
        delete: "Delete", add_new: "Add New",
        global_inventory: "Global Inventory", confirm_delete: "Are you sure you want to permanently delete this?",
        no_inventory: "No items found.", select_item: "Select Option",
        net_cost: "Net Cost (AZN)", markup: "Markup %", selling_price: "Selling Price (AZN)",
        stars: "Star Rating", location: "Location / City",
        add_partner: "Add Partner", company_name: "Company Name", contact_person: "Contact Person",
        phone: "Phone", verified_partner: "Verified Partner", partners_list: "Partners",
        total_price: "Total Price", confirm_booking: "Confirm Booking",
        empty_cart: "Package is empty!", booking_success: "Booking Confirmed!",
        cancel: "Cancel", capacity: "Capacity", vehicle_type: "Vehicle Type",
        plate: "Plate Number", no_account: "No account?", apply_here: "Apply here",
        have_account: "Have an account?", blocked_dates_label: "Blocked dates shown in red.",
        uploading: "Uploading photos...", upload_error: "Upload failed. Check Storage rules."
    },
    ru: {
        login: "Войти", register: "Регистрация",
        welcome_buyer: "ОТКРОЙТЕ КАСПИЙСКИЕ МАРШРУТЫ",
        subtitle_buyer: "Ваш DMC партнер для незабываемых путешествий по Азербайджану и Каспию.",
        destinations: "Направления", explore: "Посмотреть", extranet: "Экстранет",
        save: "Сохранить", auto_fill: "Заполнить с Booking.com", my_property: "Мой Объект",
        logout: "Выйти", role_hotel: "Отель / Проживание", role_driver: "Транспорт / Водитель",
        role_buyer: "B2B Туроператор", dashboard: "Дашборд", inventory: "Инвентарь",
        bookings: "Бронирования", partners: "Партнеры", profile: "Профиль",
        welcome_boss: "Добро пожаловать, Босс! 👋", platform_overview: "Обзор бизнеса в реальном времени",
        total_revenue: "Общая выручка", active_bookings: "Активные брони", platform_views: "Трафик",
        total_partners: "Активные партнеры", recent_sales: "Последние транзакции", market_share: "Аналитика рынка",
        partner_col: "Партнер", service_col: "Услуга", date_col: "Дата", amount_col: "Сумма", status_col: "Статус",
        availability: "Доступность", media_gallery: "Галерея", property_details: "Данные объекта",
        admin_analytics: "Аналитика платформы", total_inventory: "Всего объектов",
        edit_property: "Редакт.", create_property: "Создать новый объект", smart_autofill: "Smart API Парсинг",
        public_name: "Название объекта", b2b_price: "От (AZN)", region: "Регион", category: "Категория",
        description: "Описание", rooms_management: "Управление номерами", vehicles_management: "Управление автопарком",
        add_room: "+ Добавить номер", add_vehicle: "+ Добавить авто", room_name: "Название номера", vehicle_name: "Модель авто",
        price_azn: "Нетто цена (AZN)", qty: "Кол-во", click_to_upload: "Нажмите для загрузки фото", update_gallery: "Обновить галерею",
        block_selected: "Закрыть выбранные", unblock_selected: "Открыть выбранные",
        calendar_hint: "Выберите диапазон дат, затем нажмите Закрыть или Открыть.",
        autofill_btn: "Запросить API", select_room: "Выберите юнит для управления:",
        delete: "Удалить", add_new: "Добавить",
        global_inventory: "Глобальный Инвентарь", confirm_delete: "Вы уверены, что хотите безвозвратно удалить это?",
        no_inventory: "Объекты не найдены.", select_item: "Выберите опцию",
        net_cost: "Нетто (AZN)", markup: "Наценка %", selling_price: "Цена продажи (AZN)",
        stars: "Звёздность", location: "Город / Регион",
        add_partner: "Добавить партнера", company_name: "Название компании", contact_person: "Контактное лицо",
        phone: "Телефон", verified_partner: "Верифицирован", partners_list: "Партнеры",
        total_price: "Итого", confirm_booking: "Подтвердить заказ",
        empty_cart: "Пакет пуст!", booking_success: "Бронирование подтверждено!",
        cancel: "Отмена", capacity: "Вместимость", vehicle_type: "Тип транспорта",
        plate: "Номер авто", no_account: "Нет аккаунта?", apply_here: "Зарегистрироваться",
        have_account: "Есть аккаунт?", blocked_dates_label: "Закрытые даты выделены красным.",
        uploading: "Загрузка фото...", upload_error: "Ошибка загрузки. Проверьте правила Storage."
    },
    az: {
        login: "Daxil ol", register: "Qeydiyyat",
        welcome_buyer: "XƏZƏR MARŞRUTLARINI KƏŞF EDİN",
        subtitle_buyer: "Azərbaycan və Xəzər regionunda unudulmaz səyahətlər üçün DMC tərəfdaşınız.",
        destinations: "İstiqamətlər", explore: "Bax", extranet: "Ekstranet",
        save: "Yadda Saxla", auto_fill: "Booking.com-dan doldur", my_property: "Obyektim",
        logout: "Çıxış", role_hotel: "Otel / Yerləşdirmə", role_driver: "Nəqliyyat / Sürücü",
        role_buyer: "B2B Tur Operator", dashboard: "İdarə Paneli", inventory: "İnventar",
        bookings: "Sifarişlər", partners: "Tərəfdaşlar", profile: "Profil",
        welcome_boss: "Xoş gəldiniz, Müdir! 👋", platform_overview: "Real vaxt biznes icmalı",
        total_revenue: "Ümumi Gəlir", active_bookings: "Aktiv Sifarişlər", platform_views: "Canlı Trafik",
        total_partners: "Aktiv Tərəfdaşlar", recent_sales: "Son Əməliyyatlar", market_share: "Bazar Analitikası",
        partner_col: "Tərəfdaş", service_col: "Xidmət", date_col: "Tarix", amount_col: "Məbləğ", status_col: "Status",
        availability: "Mövcudluq", media_gallery: "Media Qalereyası", property_details: "Obyekt Məlumatları",
        admin_analytics: "Platforma Analitikası", total_inventory: "Cəmi Obyektlər",
        edit_property: "Redaktə et", create_property: "Yeni Obyekt Yarat", smart_autofill: "Smart API Yükləmə",
        public_name: "Obyektin Adı", b2b_price: "Başlanğıc (AZN)", region: "Region", category: "Kateqoriya",
        description: "Ətraflı Təsvir", rooms_management: "Otaqların İdarəsi", vehicles_management: "Avtoparkın İdarəsi",
        add_room: "+ Otaq Əlavə Et", add_vehicle: "+ Avto Əlavə Et", room_name: "Otaq Adı", vehicle_name: "Avto Modeli",
        price_azn: "Net Qiymət (AZN)", qty: "Say", click_to_upload: "Şəkil yükləmək üçün klikləyin", update_gallery: "Qalereyanı Yenilə",
        block_selected: "Seçilmişləri Bağla", unblock_selected: "Seçilmişləri Aç",
        calendar_hint: "Tarix aralığı seçin, sonra Bağla və ya Aç düyməsinə basın.",
        autofill_btn: "API Yüklə", select_room: "İdarə etmək üçün vahid seçin:",
        delete: "Sil", add_new: "Əlavə et",
        global_inventory: "Qlobal İnventar", confirm_delete: "Bunu həmişəlik silmək istədiyinizə əminsiniz?",
        no_inventory: "Obyekt tapılmadı.", select_item: "Seçim edin",
        net_cost: "Net (AZN)", markup: "Artım %", selling_price: "Satış qiyməti (AZN)",
        stars: "Ulduz dərəcəsi", location: "Şəhər / Region",
        add_partner: "Tərəfdaş əlavə et", company_name: "Şirkətin Adı", contact_person: "Əlaqədar Şəxs",
        phone: "Telefon", verified_partner: "Təsdiqlənmiş", partners_list: "Tərəfdaşlar",
        total_price: "Cəmi", confirm_booking: "Sifarişi Təsdiqlə",
        empty_cart: "Paket boşdur!", booking_success: "Sifariş təsdiqləndi!",
        cancel: "İmtina", capacity: "Tutum", vehicle_type: "Nəqliyyat növü",
        plate: "Dövlət nişanı", no_account: "Hesabınız yoxdur?", apply_here: "Qeydiyyatdan keç",
        have_account: "Hesabınız var?", blocked_dates_label: "Bağlı tarihlər qırmızıyla göstərilir.",
        uploading: "Şəkillər yüklənir...", upload_error: "Yükləmə xətası. Storage qaydalarını yoxlayın."
    }
};

// ── LANGUAGE ENGINE ────────────────────────────────────────────────
let currentLang = localStorage.getItem('caspian_lang') || 'en';
window.t = (key) => (translations[currentLang] && translations[currentLang][key]) ? translations[currentLang][key] : (translations.en[key] || key);

window.setLanguage = (lang) => {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('caspian_lang', lang);
    applyTranslations();
    if (window.render && window.currentPage) window.render(window.currentPage);
};

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = window.t(key);
        if (!val) return;
        if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) el.placeholder = val;
        else el.textContent = val;
    });
}

// ── HELPERS ────────────────────────────────────────────────────────
window.formatDate = (date) => {
    const d = new Date(date);
    return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
};

// FIX #2: Correct HTML quoting in img tag — no more broken attribute output
const getSafeImage = (item) => {
    if (!item) return '';
    const icon = item.category === 'Transport' ? 'fa-car-side' : 'fa-hotel';
    const src = (item.photos && Array.isArray(item.photos) && item.photos[0]) || item.image || item.imageUrl || '';
    if (src && src.length > 10) {
        // Safe: name cleaned of quotes to prevent attribute injection
        const safeName = (item.name || '').replace(/"/g, '&quot;');
        return '<img src="' + src + '" class="sf-card-img" loading="lazy" alt="' + safeName + '" onerror="this.onerror=null;this.parentNode.innerHTML=\'<div class=\\\'sf-card-img img-fallback\\\'><i class=\\\'fas ' + icon + '\\\'></i></div>\'">';
    }
    return '<div class="sf-card-img img-fallback"><i class="fas ' + icon + '"></i></div>';
};

// ── MAIN APP ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    const { db, dbFunc, auth, authFunc, storage, storageFunc } = window;
    const { ref, set, onValue, update, remove, push } = dbFunc;
    const { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence } = authFunc;
    // FIX #1: Get Firebase Storage functions
    const { storageRef, uploadBytes, getDownloadURL } = storageFunc;

    // State
    let inventory = [];
    let bookings = [];
    let usersData = {};
    let platformStats = { views: 0 };
    let isAuthReady = false;

    window.currentPage = 'login';
    window.currentCart = [];
    window.currentUserUid = null;
    window.currentUserRole = null;
    window.currentUserProfile = null;
    window.activeExTab = 1;
    // FIX #1: Now stores URL strings (from Storage), not base64
    window.tempPhotoUrls = [];
    window.tempSubItems = [];
    window.activeSubItemId = null;
    window.tempSelectedRange = [];
    window.currentObjectId = null;
    window.tempBlockedDates = [];

    // ── Language switcher wiring ──
    const langSwitch = document.getElementById('lang-switch');
    const langMenu = document.getElementById('lang-menu');
    if (langSwitch && langMenu) {
        langSwitch.addEventListener('click', (e) => { e.stopPropagation(); langMenu.classList.toggle('show-menu'); });
        document.addEventListener('click', () => langMenu.classList.remove('show-menu'));
        langMenu.querySelectorAll('span[data-lang]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                window.setLanguage(e.target.getAttribute('data-lang'));
                langMenu.classList.remove('show-menu');
            });
        });
    }

    // ── FIX #3: Mobile burger menu ──
    const burger = document.getElementById('burger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (burger && mobileMenu) {
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('open');
            burger.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && e.target !== burger) {
                mobileMenu.classList.remove('open');
                burger.classList.remove('active');
            }
        });
    }

    // ── Auth ──────────────────────────────────────────────────────
    window.logout = async () => { await signOut(auth); };

    try {
        await setPersistence(auth, browserLocalPersistence);

        onAuthStateChanged(auth, (user) => {
            window.isAuthenticated = !!user;
            const hideLoader = () => {
                if (!isAuthReady) {
                    isAuthReady = true;
                    window.isAuthReady = true;
                    document.getElementById('auth-loader')?.classList.add('hidden');
                }
            };

            if (user) {
                window.currentUserUid = user.uid;
                document.getElementById('logout-btn').style.display = 'inline-flex';
                update(ref(db, 'stats'), { views: (platformStats.views || 0) + 1 });

                onValue(ref(db, `users/${user.uid}`), (snapshot) => {
                    const profile = snapshot.val();
                    if (!profile) { hideLoader(); return; }
                    window.currentUserRole = profile.role;
                    window.currentUserProfile = profile;
                    window.updateNavigationByRole(profile.role);

                    if (window.currentPage === 'login' || window.currentPage === 'register') {
                        window.currentPage = profile.role === 'admin' ? 'home' : (profile.role === 'buyer' ? 'showcase' : 'inventory');
                    }
                    hideLoader();
                    window.render(window.currentPage);
                });
            } else {
                window.currentUserUid = null;
                window.currentUserRole = null;
                window.currentUserProfile = null;
                document.getElementById('logout-btn').style.display = 'none';
                window.updateNavigationByRole('none');
                hideLoader();
                window.currentPage = 'login';
                window.render('login');
            }
        });

        // ── Firebase listeners ──
        onValue(ref(db, 'inventory'), (snapshot) => {
            const data = snapshot.val();
            inventory = data ? Object.keys(data).map(k => ({ id: k, ...(data[k] || {}) })) : [];
            if (isAuthReady) window.render(window.currentPage);
        });

        onValue(ref(db, 'users'), (snapshot) => {
            usersData = snapshot.val() || {};
            if (isAuthReady && window.currentPage === 'home') window.render('home');
        });

        onValue(ref(db, 'bookings'), (snapshot) => {
            const data = snapshot.val();
            bookings = data ? Object.keys(data).map(k => ({ id: k, ...(data[k] || {}) })) : [];
            if (isAuthReady && window.currentPage === 'home') window.render('home');
        });

        onValue(ref(db, 'stats'), (snapshot) => {
            platformStats = snapshot.val() || { views: 0 };
        });

    } catch (e) { console.error('Firebase error:', e); }

    // ── Navigation by role ────────────────────────────────────────
    window.updateNavigationByRole = (role) => {
        const nav = document.getElementById('main-navigation');
        if (!nav) return;
        const btns = {
            dash: document.getElementById('nav-dashboard'),
            inv:  document.getElementById('nav-inventory'),
            book: document.getElementById('nav-bookings'),
            part: document.getElementById('nav-partners'),
            prof: document.getElementById('nav-profile')
        };
        Object.values(btns).forEach(b => { if (b) b.style.display = 'none'; });

        // Update mobile menu too
        const mobileMenuEl = document.getElementById('mobile-menu');
        if (mobileMenuEl) {
            if (role === 'none' || role === 'buyer') {
                mobileMenuEl.style.display = 'none';
                const burgerEl = document.getElementById('burger-btn');
                if (burgerEl) burgerEl.style.display = 'none';
            } else {
                const burgerEl = document.getElementById('burger-btn');
                if (burgerEl) burgerEl.style.display = 'flex';
            }
        }

        if (role === 'admin') {
            Object.values(btns).forEach(b => { if (b) b.style.display = 'inline-flex'; });
            btns.dash.onclick = () => { window.render('home'); closeMobileMenu(); };
            btns.inv.onclick  = () => { window.render('inventory'); closeMobileMenu(); };
            btns.book.onclick = () => { window.render('bookings'); closeMobileMenu(); };
            btns.part.onclick = () => { window.render('partners'); closeMobileMenu(); };
            btns.prof.onclick = () => { window.render('extranet'); closeMobileMenu(); };
        } else if (['hotel', 'driver', 'partner'].includes(role)) {
            if (btns.inv)  { btns.inv.style.display  = 'inline-flex'; btns.inv.onclick  = () => { window.render('inventory'); closeMobileMenu(); }; }
            if (btns.book) { btns.book.style.display = 'inline-flex'; btns.book.onclick = () => { window.render('bookings'); closeMobileMenu(); }; }
            if (btns.prof) { btns.prof.style.display = 'inline-flex'; btns.prof.onclick = () => { window.currentObjectId = null; window.tempSubItems = []; window.render('extranet'); closeMobileMenu(); }; }
        } else if (role === 'buyer') {
            nav.innerHTML = `
                <button class="buyer-nav-btn active" onclick="window.render('showcase')">${window.t('destinations')} <i class="fas fa-chevron-down"></i></button>
                <button class="buyer-nav-btn" onclick="window.render('showcase')">Experiences</button>
                <button class="buyer-nav-btn" onclick="window.render('showcase')">Routes</button>
                <button class="buyer-nav-btn" onclick="window.render('bookings')">${window.t('bookings')}</button>
                <button class="buyer-nav-btn">About</button>`;
            const headerRight = document.querySelector('.header-right');
            if (headerRight && !document.getElementById('buyer-search-bar')) {
                const searchEl = document.createElement('div');
                searchEl.id = 'buyer-search-bar';
                searchEl.className = 'buyer-search-wrap';
                searchEl.innerHTML = '<input type="text" id="buyer-search-input" class="buyer-search-input" placeholder="Search routes..."><button class="buyer-search-btn"><i class="fas fa-search"></i></button>';
                headerRight.insertBefore(searchEl, headerRight.firstChild);
            }
        }
    };

    function closeMobileMenu() {
        const mobileMenuEl = document.getElementById('mobile-menu');
        const burgerEl = document.getElementById('burger-btn');
        if (mobileMenuEl) mobileMenuEl.classList.remove('open');
        if (burgerEl) burgerEl.classList.remove('active');
    }

    // ══════════════════════════════════════════════════════════════
    // MAIN RENDER
    // ══════════════════════════════════════════════════════════════
    window.render = (page) => {
        if (!isAuthReady) return;
        window.currentPage = page;
        const content = document.getElementById('app-content');
        if (!content) return;
        content.innerHTML = '';

        // 1. LOGIN / REGISTER
        if (page === 'login' || page === 'register') {
            const isLogin = page === 'login';
            content.innerHTML = `
            <div class="login-container">
                <div class="login-card">
                    <div class="login-logo"><i class="fas fa-water"></i> CASPIAN<b>ROUTES</b></div>
                    <p class="login-subtitle">Destination Management Company</p>
                    <form onsubmit="window.handleAuth(event, ${isLogin})">
                        ${!isLogin ? `
                        <input type="text" id="reg-name" placeholder="${window.t('company_name')}" required>
                        <select id="reg-role" required>
                            <option value="hotel">${window.t('role_hotel')}</option>
                            <option value="driver">${window.t('role_driver')}</option>
                            <option value="buyer">${window.t('role_buyer')}</option>
                        </select>` : ''}
                        <input type="email" id="auth-email" placeholder="Email" required>
                        <input type="password" id="auth-pass" placeholder="Password" required minlength="6">
                        <button type="submit" class="btn-primary login-submit-btn">
                            <i class="fas fa-${isLogin ? 'lock-open' : 'user-plus'}"></i>
                            ${isLogin ? window.t('login') : window.t('register')}
                        </button>
                    </form>
                    <p class="login-switch">
                        ${isLogin ? window.t('no_account') : window.t('have_account')}
                        <b onclick="window.render('${isLogin ? 'register' : 'login'}')">${isLogin ? window.t('apply_here') : window.t('login')}</b>
                    </p>
                </div>
            </div>`;
        }

        // 2. ADMIN DASHBOARD
        else if (page === 'home' && window.currentUserRole === 'admin') {
            const realPartners = Object.values(usersData).filter(u => u && (u.role === 'hotel' || u.role === 'driver')).length;
            const totalRevenue = bookings.reduce((acc, b) => acc + (parseFloat(b.totalSellingPrice) || 0), 0).toFixed(2);
            const recentRows = bookings.slice(-5).reverse().map(b => `
                <tr>
                    <td><b>${(b.items && b.items[0] && b.items[0].supplierName) || 'Internal'}</b></td>
                    <td>${(b.items && b.items[0] && b.items[0].name) || 'Package'}</td>
                    <td>${new Date(b.createdAt).toLocaleDateString()}</td>
                    <td>&#8380; ${b.totalSellingPrice || 0}</td>
                    <td><span class="badge badge-confirmed">CONFIRMED</span></td>
                </tr>`).join('');

            content.innerHTML = `
            <div class="admin-page fade-in">
                <div class="admin-page-header">
                    <h1 data-i18n="welcome_boss">${window.t('welcome_boss')}</h1>
                    <p style="color:#64748b; margin-top:8px;" data-i18n="platform_overview">${window.t('platform_overview')}</p>
                </div>
                <div class="stats-grid">
                    <div class="admin-stat-card" style="border-top:4px solid #10b981;">
                        <div class="admin-stat-info">
                            <h4>${window.t('total_revenue')}</h4>
                            <div class="value">&#8380; ${totalRevenue}</div>
                        </div>
                        <div class="stat-icon-wrap" style="background:#d1fae5;"><i class="fas fa-wallet" style="color:#10b981;"></i></div>
                    </div>
                    <div class="admin-stat-card" style="border-top:4px solid #3b82f6;">
                        <div class="admin-stat-info">
                            <h4>${window.t('total_partners')}</h4>
                            <div class="value">${realPartners}</div>
                        </div>
                        <div class="stat-icon-wrap" style="background:#dbeafe;"><i class="fas fa-handshake" style="color:#3b82f6;"></i></div>
                    </div>
                    <div class="admin-stat-card" style="border-top:4px solid #f59e0b;">
                        <div class="admin-stat-info">
                            <h4>${window.t('total_inventory')}</h4>
                            <div class="value">${inventory.length}</div>
                        </div>
                        <div class="stat-icon-wrap" style="background:#fef3c7;"><i class="fas fa-box-open" style="color:#f59e0b;"></i></div>
                    </div>
                    <div class="admin-stat-card" style="border-top:4px solid #6366f1;">
                        <div class="admin-stat-info">
                            <h4>${window.t('platform_views')}</h4>
                            <div class="value">${platformStats.views || 0}</div>
                        </div>
                        <div class="stat-icon-wrap" style="background:#ede9fe;"><i class="fas fa-chart-area" style="color:#6366f1;"></i></div>
                    </div>
                </div>
                <div class="admin-bottom-grid">
                    <div class="card">
                        <h3>${window.t('recent_sales')}</h3>
                        <div style="overflow-x:auto; margin-top:15px;">
                            <table class="b2b-table">
                                <thead><tr>
                                    <th>${window.t('partner_col')}</th><th>${window.t('service_col')}</th>
                                    <th>${window.t('date_col')}</th><th>${window.t('amount_col')}</th><th>${window.t('status_col')}</th>
                                </tr></thead>
                                <tbody>${recentRows || '<tr><td colspan="5" style="text-align:center; color:#94a3b8; padding:30px;">No bookings yet</td></tr>'}</tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card">
                        <h3>${window.t('market_share')}</h3>
                        <div class="admin-quick-actions">
                            <button class="quick-action-btn" onclick="window.render('inventory')"><i class="fas fa-box-open"></i><span>Inventory</span></button>
                            <button class="quick-action-btn" onclick="window.render('partners')"><i class="fas fa-users"></i><span>Partners</span></button>
                            <button class="quick-action-btn" onclick="window.render('bookings')"><i class="fas fa-calendar-check"></i><span>Bookings</span></button>
                            <button class="quick-action-btn" onclick="window.render('extranet')"><i class="fas fa-user-cog"></i><span>Profile</span></button>
                        </div>
                    </div>
                </div>
            </div>`;
        }

        // 3. INVENTORY LIST
        else if (page === 'inventory') {
            const isAdmin = window.currentUserRole === 'admin';
            const visible = isAdmin ? inventory : inventory.filter(i => i && i.supplier_uid === window.currentUserUid);

            const cards = visible.map(item => {
                if (!item) return '';
                const catColor = item.category === 'Transport' ? '#f59e0b' : (item.category === 'Activity' ? '#10b981' : '#3b82f6');
                return `
                <div class="inv-card fade-in">
                    <div class="inv-card-img-wrap">
                        ${getSafeImage(item)}
                        <span class="inv-badge" style="background:${catColor};">${item.category || 'Service'}</span>
                        ${item.stars ? '<span class="inv-stars">' + '&#9733;'.repeat(parseInt(item.stars) || 0) + '</span>' : ''}
                    </div>
                    <div class="inv-card-body">
                        <h3 class="inv-card-title">${item.name || 'Unnamed'}</h3>
                        <p class="inv-card-location"><i class="fas fa-map-marker-alt"></i> ${item.region || item.location || 'Baku'}</p>
                        <div class="inv-card-pricing">
                            <div class="inv-net-price">Net: <b>&#8380; ${item.netCost || 0}</b></div>
                            <div class="inv-sell-price">&#8380; ${item.sellingPrice || 0}</div>
                        </div>
                        <div class="inv-card-actions">
                            <button onclick="window.renderHotelModal('${item.id}')" class="btn-primary btn-sm" style="background:var(--dark);"><i class="fas fa-eye"></i> View</button>
                            ${!isAdmin ? `<button onclick="window.editItem('${item.id}')" class="btn-primary btn-sm"><i class="fas fa-edit"></i> ${window.t('edit_property')}</button>` : ''}
                            <button onclick="window.deleteItem('${item.id}')" class="btn-outline-danger btn-sm"><i class="fas fa-trash"></i> ${window.t('delete')}</button>
                        </div>
                    </div>
                </div>`;
            }).join('');

            content.innerHTML = `
            <div class="admin-page">
                <div class="admin-page-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px;">
                    <div>
                        <h2>${isAdmin ? window.t('global_inventory') : window.t('my_property')}</h2>
                        <p style="color:#64748b; margin-top:5px;">${visible.length} items</p>
                    </div>
                    ${!isAdmin ? `<button class="btn-primary" onclick="window.currentObjectId=null; window.tempSubItems=[]; window.render('extranet')"><i class="fas fa-plus"></i> ${window.t('add_new')}</button>` : ''}
                </div>
                ${visible.length === 0
                    ? `<div class="empty-state"><i class="fas fa-box-open"></i><p>${window.t('no_inventory')}</p></div>`
                    : `<div class="inv-grid">${cards}</div>`}
            </div>`;
        }

        // 4. PARTNER EXTRANET
        else if (page === 'extranet' && (window.currentUserRole === 'admin' || ['hotel', 'driver', 'partner'].includes(window.currentUserRole))) {
// БЛОКИРОВКА: Если это партнер и он еще не выбрал объект — показываем Дашборд
        if (['hotel', 'driver', 'partner'].includes(window.currentUserRole) && !window.currentObjectId) {
            window.renderPartnerDashboard();
            return; // Останавливаем отрисовку пустой формы
        }
            // Admin profile view
            if (window.currentUserRole === 'admin' && !window.currentObjectId) {
                content.innerHTML = `
                <div class="admin-page fade-in">
                    <h2>${window.t('profile')}</h2>
                    <div class="card" style="max-width:600px; margin-top:25px;">
                        <div style="display:flex; align-items:center; gap:20px; margin-bottom:25px;">
                            <div class="admin-avatar">B</div>
                            <div>
                                <h3 style="margin:0;">${window.currentUserProfile?.companyName || 'The Boss'}</h3>
                                <p style="color:#64748b; margin:5px 0;">${window.auth?.currentUser?.email || ''}</p>
                                <span class="badge" style="background:rgba(0,160,160,0.1); color:var(--primary); border:1px solid var(--primary);">MASTER ACCOUNT</span>
                            </div>
                        </div>
                        <label class="input-label">${window.t('company_name')}</label>
                        <input type="text" id="admin-name-input" value="${window.currentUserProfile?.companyName || ''}">
                        <button class="btn-primary" style="width:100%; margin-top:20px; padding:15px;" onclick="alert('Settings saved!')">
                            <i class="fas fa-save"></i> ${window.t('save')}
                        </button>
                    </div>
                </div>`;
                return;
            }

            // Partner property form
            let inv = {};
            if (window.currentObjectId) {
                inv = inventory.find(i => i && i.id === window.currentObjectId) || {};
                // FIX #1: Load existing photo URLs (not base64)
                window.tempPhotoUrls = Array.isArray(inv.photos) ? [...inv.photos] : [];
                window.tempSubItems = Array.isArray(inv.subItems) ? inv.subItems.map(s => ({ ...s })) : [];
            } else {
                window.tempPhotoUrls = [];
                window.tempSubItems = [];
            }

            const objectId = window.currentObjectId || ('NEW_' + Date.now());
            const defaultCat = window.currentUserRole === 'driver' ? 'Transport' : 'Hotel';
            const cat = inv.category || defaultCat;

            content.innerHTML = `
            <div class="extranet-page fade-in">
                <div class="extranet-header">
                    <button class="btn-back" onclick="window.render('inventory')"><i class="fas fa-arrow-left"></i></button>
                    <h2>${inv.name ? window.t('edit_property') + ': ' + inv.name : window.t('create_property')}</h2>
                </div>

                <div class="autofill-card">
                    <div class="autofill-card-inner">
                        <i class="fas fa-bolt" style="color:#f59e0b; font-size:1.4rem;"></i>
                        <div>
                            <h4 style="margin:0 0 4px;">${window.t('smart_autofill')}</h4>
                            <p style="margin:0; color:#64748b; font-size:0.85rem;">Paste a Booking.com or website link to auto-fill property data.</p>
                        </div>
                    </div>
                    <div style="display:flex; gap:10px; margin-top:15px;">
                        <input type="text" id="import-url" placeholder="https://www.booking.com/hotel/...">
                        <button class="btn-primary" onclick="window.autoFillFromUrl()" id="autofill-btn" style="white-space:nowrap;">
                            <i class="fas fa-magic"></i> ${window.t('autofill_btn')}
                        </button>
                    </div>
                </div>

                <div class="profile-tabs">
                    <button class="tab-btn ${window.activeExTab === 1 ? 'active' : ''}" onclick="window.switchExTab(1)">${window.t('property_details')}</button>
                    <button class="tab-btn ${window.activeExTab === 2 ? 'active' : ''}" onclick="window.switchExTab(2)">${window.t('media_gallery')}</button>
                    <button class="tab-btn ${window.activeExTab === 3 ? 'active' : ''}" onclick="window.switchExTab(3)">${window.t('availability')}</button>
                </div>

                <div class="card extranet-card">

                    <div id="ex-tab-1" class="tab-content ${window.activeExTab === 1 ? 'active' : ''}">
                        <div class="form-grid-2">
                            <div>
                                <label class="input-label">${window.t('public_name')}</label>
                                <input type="text" id="ex-name" value="${inv.name || ''}" placeholder="e.g. Four Seasons Hotel Baku">
                            </div>
                            <div>
                                <label class="input-label">${window.t('category')}</label>
                                <select id="ex-category" onchange="window.onCategoryChange(this.value)">
                                    <option value="Hotel" ${cat === 'Hotel' ? 'selected' : ''}>&#127968; Hotel</option>
                                    <option value="Transport" ${cat === 'Transport' ? 'selected' : ''}>&#128663; Transport</option>
                                    <option value="Activity" ${cat === 'Activity' ? 'selected' : ''}>&#127919; Activity</option>
                                </select>
                            </div>
                            <div>
                                <label class="input-label">${window.t('location')}</label>
                                <input type="text" id="ex-region" value="${inv.region || inv.location || ''}" placeholder="Baku, Azerbaijan">
                            </div>
                            <div>
                                <label class="input-label">${window.t('stars')}</label>
                                <select id="ex-stars">
                                    ${[0,1,2,3,4,5].map(n => '<option value="' + n + '"' + ((inv.stars || 0) == n ? ' selected' : '') + '>' + (n === 0 ? 'No rating' : '&#9733;'.repeat(n) + ' (' + n + ' star)') + '</option>').join('')}
                                </select>
                            </div>
                            <div>
                                <label class="input-label">${window.t('net_cost')}</label>
                                <input type="number" id="ex-net" value="${inv.netCost || ''}" placeholder="0" oninput="window.calcSellingPrice()">
                            </div>
                            <div>
                                <label class="input-label">${window.t('markup')}</label>
                                <input type="number" id="ex-markup" value="${inv.markup || 15}" placeholder="15" oninput="window.calcSellingPrice()">
                            </div>
                            <div>
                                <label class="input-label">${window.t('selling_price')}</label>
                                <input type="number" id="ex-price" value="${inv.sellingPrice || ''}" placeholder="Auto-calculated">
                            </div>
                        </div>

                        <div id="subitems-section" style="margin-top:30px; padding-top:25px; border-top:1px solid #e2e8f0;"></div>

                        <label class="input-label" style="margin-top:25px;">${window.t('description')}</label>
                        <textarea id="ex-desc" style="height:120px; margin-top:8px;">${(inv.descriptions && inv.descriptions.en) || inv.description || ''}</textarea>

                        <button class="btn-primary save-btn" onclick="window.saveExtranetData(event, '${objectId}')">
                            <i class="fas fa-save"></i> ${window.t('save')}
                        </button>
                    </div>

                    <!-- TAB 2: Media — FIX #1: uploads to Firebase Storage -->
                    <div id="ex-tab-2" class="tab-content ${window.activeExTab === 2 ? 'active' : ''}">
                        <div id="upload-status" style="display:none; padding:12px 16px; background:#f0fdf4; border:1px solid #86efac; border-radius:10px; color:#16a34a; font-weight:600; margin-bottom:16px;">
                            <i class="fas fa-spinner fa-spin"></i> <span id="upload-status-text">${window.t('uploading')}</span>
                        </div>
                        <div id="ex-gallery-preview" class="gallery-grid" style="margin-bottom:20px;"></div>
                        <div class="dropzone" onclick="document.getElementById('ex-upload').click()">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>${window.t('click_to_upload')}</p>
                            <span>PNG, JPG — uploaded to Firebase Storage</span>
                           <input type="file" id="ex-upload" multiple accept="image/*" style="display:none;" onchange="window.handleStorageUpload(this, '${objectId}')">
                        </div>
                        <button class="btn-primary save-btn" onclick="window.saveExtranetData(event, '${objectId}')">
                            <i class="fas fa-images"></i> ${window.t('update_gallery')}
                        </button>
                    </div>

                    <!-- TAB 3: Availability Calendar -->
                    <div id="ex-tab-3" class="tab-content ${window.activeExTab === 3 ? 'active' : ''}">
                        <div class="calendar-section">
                            <div class="calendar-select-wrap">
                                <label class="input-label">${window.t('select_room')}</label>
                                <select id="ex-room-select" class="calendar-unit-select" onchange="window.changeActiveSubItem(this.value)"></select>
                            </div>
                            <div class="calendar-wrap">
                                <input type="text" id="extranet-calendar" style="display:none;">
                            </div>
                            <div class="calendar-actions">
                                <button class="btn-outline-danger" onclick="window.blockSelectedDates('${objectId}')">
                                    <i class="fas fa-lock"></i> ${window.t('block_selected')}
                                </button>
                                <button class="btn-primary" onclick="window.unblockSelectedDates('${objectId}')" style="background:#10b981; border-color:#10b981;">
                                    <i class="fas fa-unlock"></i> ${window.t('unblock_selected')}
                                </button>
                            </div>
                            <p class="calendar-hint">${window.t('calendar_hint')}</p>
                            <div id="blocked-dates-list" class="blocked-dates-list"></div>
                        </div>
                    </div>
                </div>
            </div>`;

            window.onCategoryChange = (val) => window.renderSubItemsSection();
            window.renderSubItemsSection();
            window.renderPhotoPreview();

            setTimeout(() => {
                const urlInput = document.getElementById('import-url');
                if (urlInput) urlInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); window.autoFillFromUrl(); } });
                if (window.activeExTab === 3) window.renderCalendarTab();
            }, 100);
        }

        // 5. PARTNERS (admin)
        // ─────────────────────────────────────────────────────────
        // 5. PARTNERS (admin)
        // ─────────────────────────────────────────────────────────
        else if (page === 'partners' && window.currentUserRole === 'admin') {

            const roleBadge = (role) => {
                if (role === 'hotel')   return `<span class="badge badge-hotel">🏨 Hotel</span>`;
                if (role === 'driver')  return `<span class="badge badge-transport">🚗 Driver</span>`;
                if (role === 'partner') return `<span class="badge badge-hotel">🤝 Partner</span>`;
                if (role === 'buyer')   return `<span class="badge badge-buyer">🛒 Buyer</span>`;
                if (role === 'admin')   return `<span class="badge" style="background:#ede9fe;color:#7c3aed;">⚡ Admin</span>`;
                return `<span class="badge">${role || 'user'}</span>`;
            };

            const partnerList = Object.entries(usersData)
                .filter(([uid, u]) => u && uid !== window.currentUserUid)
                .map(([uid, u]) => `
                    <tr>
                        <td>
                            <div style="display:flex; align-items:center; gap:12px;">
                                <div class="partner-avatar">${(u.companyName || u.email || 'U').charAt(0).toUpperCase()}</div>
                                <div>
                                    <b>${u.companyName || 'Unnamed'}</b><br>
                                    <small style="color:#64748b;">${u.email || ''}</small>
                                </div>
                            </div>
                        </td>
                        <td>${roleBadge(u.role)}</td>
                        <td>${new Date(u.createdAt || Date.now()).toLocaleDateString()}</td>
                        <td>
                            <div style="display:flex; gap:8px; flex-wrap:wrap;">
                                <select onchange="window.changeUserRole('${uid}', this.value)"
                                        style="padding:6px 10px; border-radius:8px; border:1.5px solid var(--border);
                                               font-size:0.82rem; font-weight:600; cursor:pointer;">
                                    <option value="hotel"   ${u.role === 'hotel'   ? 'selected' : ''}>🏨 Hotel</option>
                                    <option value="driver"  ${u.role === 'driver'  ? 'selected' : ''}>🚗 Driver</option>
                                    <option value="partner" ${u.role === 'partner' ? 'selected' : ''}>🤝 Partner</option>
                                    <option value="buyer"   ${u.role === 'buyer'   ? 'selected' : ''}>🛒 Buyer</option>
                                </select>
                                <button onclick="window.deleteUser('${uid}')"
                                        class="btn-outline-danger btn-sm">
                                    <i class="fas fa-ban"></i> Disable
                                </button>
                            </div>
                        </td>
                    </tr>`).join('');

            content.innerHTML = `
            <div class="admin-page">
                <div class="admin-page-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px;">
                    <div>
                        <h2>${window.t('partners_list')}</h2>
                        <p style="color:#64748b; margin-top:5px;">${Object.keys(usersData).length} registered users</p>
                    </div>
                    <button class="btn-primary" onclick="window.showAddPartnerForm()">
                        <i class="fas fa-user-plus"></i> ${window.t('add_partner')}
                    </button>
                </div>

                <!-- Add Partner Form (hidden by default) -->
                <div id="add-partner-panel" style="display:none;" class="card" style="margin-bottom:24px;">
                    <h4 style="margin:0 0 20px; font-size:1rem;">${window.t('add_partner')}</h4>
                    <div class="form-grid-2">
                        <div>
                            <label class="input-label">${window.t('company_name')}</label>
                            <input type="text" id="new-partner-name" placeholder="e.g. Grand Hotel Baku">
                        </div>
                        <div>
                            <label class="input-label">Email</label>
                            <input type="email" id="new-partner-email" placeholder="partner@hotel.com">
                        </div>
                        <div>
                            <label class="input-label">Password</label>
                            <input type="password" id="new-partner-pass" placeholder="Min 6 characters">
                        </div>
                        <div>
                            <label class="input-label">${window.t('role_hotel')}</label>
                            <select id="new-partner-role"
                                    style="width:100%; padding:12px 15px; border:1.5px solid var(--border); border-radius:10px;">
                                <option value="hotel">🏨 Hotel / Accommodation</option>
                                <option value="driver">🚗 Transport / Driver</option>
                                <option value="partner">🤝 General Partner</option>
                                <option value="buyer">🛒 B2B Buyer / Tour Operator</option>
                            </select>
                        </div>
                    </div>
                    <div style="display:flex; gap:12px; margin-top:20px;">
                        <button class="btn-primary" onclick="window.createPartnerAccount()" style="flex:1; padding:14px;">
                            <i class="fas fa-user-plus"></i> Create Account
                        </button>
                        <button onclick="document.getElementById('add-partner-panel').style.display='none'"
                                style="flex:1; padding:14px; background:none; border:1.5px solid var(--border);
                                       border-radius:10px; font-weight:600; color:var(--text-muted); cursor:pointer;">
                            Cancel
                        </button>
                    </div>
                    <p id="add-partner-status" style="margin-top:12px; font-size:0.88rem;"></p>
                </div>

                <div class="card" style="overflow:hidden; padding:0;">
                    <div style="overflow-x:auto;">
                        <table class="b2b-table">
                            <thead><tr>
                                <th>Partner / Company</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr></thead>
                            <tbody>${partnerList || '<tr><td colspan="4" style="text-align:center; padding:40px; color:#94a3b8;">No partners found</td></tr>'}</tbody>
                        </table>
                    </div>
                </div>
            </div>`;
        }

        // 6. BUYER SHOWCASE
        else if (page === 'showcase' && window.currentUserRole === 'buyer') {
            const searchQuery = (document.getElementById('buyer-search-input')?.value || '').toLowerCase();
            const allInv = inventory.filter(i => i && i.name && i.sellingPrice);
            const filtered = allInv.filter(i => !searchQuery || i.name.toLowerCase().includes(searchQuery) || (i.region || '').toLowerCase().includes(searchQuery));
            const regions = [...new Set(allInv.map(i => i.region || 'Azerbaijan'))].slice(0, 5);
            const categories = [...new Set(allInv.map(i => i.category || 'Hotel'))].slice(0, 4);

            const previewCards = allInv.slice(0, 3).map(item => `
                <div class="filter-route-card" onclick="window.viewItemDetails('${item.id}')">
                    <div class="filter-route-img">${getSafeImage(item)}</div>
                    <div class="filter-route-info">
                        <h4>${item.name}</h4>
                        <p class="filter-route-provider">${item.supplierName || 'Caspian Routes'}</p>
                        <div class="filter-route-meta">
                            <span><i class="fas fa-map-marker-alt"></i> ${item.region || 'Azerbaijan'}</span>
                            <span class="filter-route-price">&#8380;${item.sellingPrice}</span>
                        </div>
                        <button onclick="event.stopPropagation(); window.viewItemDetails('${item.id}')">${window.t('explore')}</button>
                    </div>
                </div>`).join('') || '<p style="padding:20px; color:#94a3b8; text-align:center; font-size:0.9rem;">Add inventory to see routes</p>';

            const curatedCards = filtered.map(item => `
                <div class="curated-card" onclick="window.viewItemDetails('${item.id}')">
                    <div class="curated-card-img">
                        ${getSafeImage(item)}
                        <div class="curated-card-overlay"><h3>${item.name}</h3><p>${(item.descriptions && item.descriptions[currentLang]) || item.region || ''}</p></div>
                    </div>
                    <div class="curated-card-footer">
                        <span class="curated-duration"><i class="fas fa-map-marker-alt"></i> ${item.region || 'Azerbaijan'} &bull; ${item.category || 'Tour'}</span>
                        <div class="curated-price-row">
                            <span class="curated-price">&#8380;${item.sellingPrice}</span>
                            <button class="curated-explore-btn" onclick="event.stopPropagation(); window.viewItemDetails('${item.id}')">${window.t('explore')}</button>
                        </div>
                    </div>
                </div>`).join('') || '<p style="color:#94a3b8; padding:20px;">No experiences found.</p>';

            const featuredHtml = allInv.slice(0, 4).map(item => `
                <div class="featured-item" onclick="window.viewItemDetails('${item.id}')">
                    <div class="featured-item-img">${getSafeImage(item)}</div>
                    <div class="featured-item-info">
                        <h4>${item.name}</h4>
                        <p>${(item.descriptions && item.descriptions[currentLang]) || item.region || 'Azerbaijan'}</p>
                        <span class="featured-rating">&#11088; Top Pick</span>
                    </div>
                </div>`).join('') || '<p style="color:#94a3b8; font-size:0.9rem;">No featured routes yet.</p>';

            content.innerHTML = `
            <div class="showcase-wrapper">
                <section class="new-hero">
                    <div class="hero-left">
                        <div class="hero-images-stack">
                            <div class="hero-img-card" style="background-image:url('https://images.unsplash.com/photo-1542314831-c6a4d1424391?w=600&q=80')"></div>
                            <div class="hero-img-card" style="background-image:url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80')"></div>
                            <div class="hero-img-card" style="background-image:url('https://images.unsplash.com/photo-1539768942893-daf53e448371?w=600&q=80')"></div>
                        </div>
                        <div class="hero-text">
                            <h1>${window.t('welcome_buyer')}</h1>
                            <p>${window.t('subtitle_buyer')}</p>
                            <div class="hero-cta-btns">
                                <button class="btn-hero-primary"><i class="fas fa-compass"></i> Explore Routes</button>
                                <button class="btn-hero-secondary"><i class="fas fa-map"></i> Plan Your Trip</button>
                            </div>
                        </div>
                    </div>
                    <div class="hero-filter-panel">
                        <div class="filter-section">
                            <div class="filter-title-row"><h3>Destinations</h3><i class="fas fa-chevron-up"></i></div>
                            ${(regions.length ? regions : ['Azerbaijan', 'Russia', 'Kazakhstan']).map((r, i) => '<label class="filter-checkbox"><input type="checkbox"' + (i < 2 ? ' checked' : '') + '> ' + r + '</label>').join('')}
                        </div>
                        <div class="filter-section">
                            <div class="filter-title-row"><h3>Travel Style</h3><i class="fas fa-chevron-up"></i></div>
                            <div class="filter-tabs">
                                ${(categories.length ? categories : ['Hotel', 'Transport', 'Activity']).map((c, i) => '<span class="filter-tab' + (i === 0 ? ' active' : '') + '">' + c + '</span>').join('')}
                            </div>
                        </div>
                        <div class="filter-section">
                            <div class="filter-title-row"><h3>Duration</h3><i class="fas fa-chevron-up"></i></div>
                            <input type="range" class="filter-slider" min="1" max="30" value="15">
                        </div>
                        <div class="filter-section">
                            <div class="filter-title-row"><h3>Budget</h3><i class="fas fa-chevron-up"></i></div>
                            <input type="range" class="filter-slider" min="0" max="5000" value="2500">
                        </div>
                        <div class="filter-preview-cards">${previewCards}</div>
                    </div>
                </section>

                <section class="curated-section">
                    <div class="curated-header">
                        <h2>Curated Experiences</h2>
                        <div class="curated-nav">
                            <button class="curated-nav-btn" id="curated-prev"><i class="fas fa-chevron-left"></i></button>
                            <button class="curated-nav-btn" id="curated-next"><i class="fas fa-chevron-right"></i></button>
                        </div>
                    </div>
                    <div class="curated-scroll-wrap">
                        <div class="curated-track" id="curated-track">${curatedCards}</div>
                    </div>
                </section>

                <section class="map-featured-section">
                    <div class="map-side">
                        <div id="leaflet-map" style="height:340px; border-radius:20px; box-shadow:0 10px 30px rgba(0,0,0,0.1);"></div>
                        <div class="map-legend">
                            <span class="legend-dot teal"></span> Baku&#8211;Tbilisi&#8211;Yerevan
                            <span class="legend-dot yellow"></span> Silk Road
                            <span class="legend-dot green"></span> Nature Trail
                        </div>
                    </div>
                    <div class="featured-side">
                        <h3>Featured Routes</h3>
                        <div class="featured-list">${featuredHtml}</div>
                    </div>
                </section>

                <footer class="showcase-footer">
                    <div class="footer-content">
                        <div class="footer-brand">
                            <div class="footer-logo"><i class="fas fa-water"></i> CASPIAN<b>ROUTES</b></div>
                            <p>Caspian Travel Routes DMC<br>Destination Management Company</p>
                            <div class="footer-social">
                                <a href="#"><i class="fab fa-facebook-f"></i></a>
                                <a href="#"><i class="fab fa-instagram"></i></a>
                                <a href="#"><i class="fab fa-linkedin-in"></i></a>
                            </div>
                        </div>
                        <div class="footer-links"><h4>Site Links</h4><ul><li><a href="#">Home</a></li><li><a href="#">About Us</a></li><li><a href="#">Experiences</a></li><li><a href="#">Routes</a></li><li><a href="#">Contact</a></li></ul></div>
                        <div class="footer-contact"><h4>Contact</h4><ul><li><i class="fas fa-phone"></i> +994 50 000 0000</li><li><i class="fas fa-envelope"></i> ceo@caspianroutes.com</li></ul></div>
                    </div>
                    <div class="footer-bottom"><p>&copy; 2025 Caspian Travel Routes DMC</p><a href="#" class="footer-contact-link">Contact Info</a></div>
                </footer>

                <button class="floating-cart-btn" onclick="window.openCartModal()">
                    <i class="fas fa-shopping-bag"></i> My Package
                    <span class="cart-badge">${window.currentCart.length}</span>
                </button>
            </div>`;

            setTimeout(() => {
                if (window.L) {
                    const map = L.map('leaflet-map').setView([40.40, 49.86], 5);
                    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; CartoDB' }).addTo(map);
                    [[40.40,49.86,'Baku'],[41.69,44.83,'Tbilisi'],[40.18,44.51,'Yerevan'],[43.22,76.85,'Almaty']].forEach(([lat,lng,name]) =>
                        L.circleMarker([lat,lng],{color:'#00a0a0',fillColor:'#00a0a0',fillOpacity:1,radius:8,weight:2}).bindPopup('<b>' + name + '</b>').addTo(map));
                    L.polyline([[40.40,49.86],[41.69,44.83],[40.18,44.51]],{color:'#00a0a0',weight:3,dashArray:'8,4'}).addTo(map);
                }
            }, 300);

            let offset = 0;
            const track = document.getElementById('curated-track');
            document.getElementById('curated-prev')?.addEventListener('click', () => { offset = Math.max(0, offset - 1); if (track) track.style.transform = 'translateX(-' + (offset * 302) + 'px)'; });
            document.getElementById('curated-next')?.addEventListener('click', () => { offset = Math.min(Math.max(0, filtered.length - 3), offset + 1); if (track) track.style.transform = 'translateX(-' + (offset * 302) + 'px)'; });

            document.getElementById('buyer-search-input')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') window.render('showcase'); });
            document.querySelector('.buyer-search-btn')?.addEventListener('click', () => window.render('showcase'));
        }

        // 7. BOOKINGS
        else if (page === 'bookings') {
            const list = window.currentUserRole === 'admin' ? bookings : bookings.filter(b => b && b.buyer_uid === window.currentUserUid);
            const html = list.length ? list.map(b => `
                <div class="booking-card">
                    <div class="booking-card-header">
                        <span class="booking-id">Order: ${b.orderId || b.id}</span>
                        <span class="badge badge-confirmed">CONFIRMED</span>
                    </div>
                    <div class="booking-card-body">
                        <div class="booking-meta"><i class="fas fa-calendar-check"></i> ${new Date(b.createdAt).toLocaleString()}</div>
                        <div class="booking-total">&#8380; ${b.totalSellingPrice || 0}</div>
                    </div>
                </div>`).join('') : '<div class="empty-state"><i class="fas fa-calendar-times"></i><p>No bookings found.</p></div>';

            content.innerHTML = `
            <div class="admin-page">
                <div class="admin-page-header"><h2>${window.t('bookings')}</h2></div>
                <div class="bookings-list">${html}</div>
            </div>`;
        }

        applyTranslations();
    };

    // ══════════════════════════════════════════════════════════════
    // EXTRANET HELPERS
    // ══════════════════════════════════════════════════════════════

    window.calcSellingPrice = () => {
        const net = parseFloat(document.getElementById('ex-net')?.value || 0);
        const markup = parseFloat(document.getElementById('ex-markup')?.value || 15);
        const priceEl = document.getElementById('ex-price');
        if (priceEl && net > 0) priceEl.value = (net * (1 + markup / 100)).toFixed(2);
    };
// ── HOTEL DETAIL MODAL ────────────────────────────────────────
    window.renderHotelModal = (hotelId) => {
        const item = inventory.find(i => i && i.id === hotelId);
        if (!item) return;

        // Remove any existing modal
        document.getElementById('hotel-detail-modal')?.remove();

        // Build rooms HTML
        const rooms = Array.isArray(item.subItems) ? item.subItems : [];

        const roomsHtml = rooms.length === 0
            ? `<p style="color:var(--text-muted); font-size:0.9rem; padding:8px 0;">${window.t('no_rooms_yet')}</p>`
            : rooms.map(r => {
                // Корректная проверка фото — принимаем только реальные URL, не base64-обрывки
                const photoSrc = (r.photo && typeof r.photo === 'string' && r.photo.startsWith('http'))
                    ? r.photo : null;

                return `
                <div class="room-card">
                    <div class="room-card-photo">
                        ${photoSrc
                            ? `<img src="${photoSrc}"
                                   alt="${(r.name || 'Room').replace(/"/g, '&quot;')}"
                                   style="width:100%;height:100%;object-fit:cover;display:block;"
                                   onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
                               ><div style="display:none;width:100%;height:100%;align-items:center;justify-content:center;color:var(--text-faint);font-size:2.5rem;"><i class="fas fa-bed"></i></div>`
                            : `<i class="fas fa-bed"></i>`
                        }
                    </div>
                    <div class="room-card-info">
                        <div>
                            <div class="room-card-name">${r.name || window.t('unnamed_room')}</div>
                            <div class="room-card-details">
                                ${(r.qty || r.capacity) ? `<span><i class="fas fa-users"></i> ${r.qty || r.capacity} ${window.t('guests_label')}</span>` : ''}
                                ${r.plate ? `<span><i class="fas fa-id-card"></i> ${r.plate}</span>` : ''}
                                ${(r.blockedDates && r.blockedDates.length > 0)
                                    ? `<span style="color:var(--danger);"><i class="fas fa-calendar-times"></i> ${r.blockedDates.length} ${window.t('blocked_label')}</span>`
                                    : `<span style="color:var(--success);"><i class="fas fa-calendar-check"></i> ${window.t('available_label')}</span>`
                                }
                            </div>
                        </div>
                        <div class="room-card-price-row">
                            <div class="room-card-price">
                                ₼ ${r.price || 0}<span>/ ${window.t('per_night')}</span>
                            </div>
                            <span class="room-net-badge">${window.t('net_rate')}</span>
                        </div>
                    </div>
                </div>`;
            }).join('');

        // Cover image
        const coverSrc = (item.photos && item.photos[0]) || item.image || item.imageUrl || '';
        const heroHtml = coverSrc
            ? `<img class="hotel-modal-hero" src="${coverSrc}" alt="${item.name || ''}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
            : '';
        const heroFallback = `<div class="hotel-modal-hero no-photo" ${coverSrc ? 'style="display:none"' : ''}><i class="fas fa-hotel"></i></div>`;

        // Stars
        const starsHtml = item.stars
            ? `<span class="hotel-modal-stars">${'★'.repeat(parseInt(item.stars) || 0)}</span>`
            : '';

        // Description
        const desc = (item.descriptions && (item.descriptions[currentLang] || item.descriptions.en)) || item.description || '';

        const modalHtml = `
        <div class="hotel-modal-overlay" id="hotel-detail-modal">
            <div class="hotel-modal">
                <button class="hotel-modal-close" onclick="document.getElementById('hotel-detail-modal').remove()" aria-label="Close">
                    <i class="fas fa-times"></i>
                </button>

                ${heroHtml}
                ${heroFallback}

                <div class="hotel-modal-body">
                    <div class="hotel-modal-title">${item.name || 'Property Details'}</div>
                    ${starsHtml}
                    <div class="hotel-modal-meta">
                        ${item.region || item.location ? `<span><i class="fas fa-map-marker-alt"></i> ${item.region || item.location}</span>` : ''}
                        ${item.category ? `<span><i class="fas fa-tag"></i> ${item.category}</span>` : ''}
                        <span><i class="fas fa-bed"></i> ${rooms.length} room type${rooms.length !== 1 ? 's' : ''}</span>
                        ${item.supplierName ? `<span><i class="fas fa-building"></i> ${item.supplierName}</span>` : ''}
                    </div>

                    ${desc ? `<div class="hotel-modal-desc">${desc}</div>` : ''}

                    <div class="hotel-modal-rooms-title">
                        <i class="fas fa-door-open"></i>
                        Rooms & Rates
                    </div>
                    <div class="hotel-modal-rooms">
                        ${roomsHtml}
                    </div>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Animate in
        requestAnimationFrame(() => {
            document.getElementById('hotel-detail-modal')?.classList.add('active');
        });

        // Close on overlay click (but not modal itself)
        document.getElementById('hotel-detail-modal').addEventListener('click', function(e) {
            if (e.target === this) this.remove();
        });

        // Close on Escape key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                document.getElementById('hotel-detail-modal')?.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    };
    // ── PARTNER DASHBOARD ─────────────────────────────────────────
    window.renderPartnerDashboard = () => {
        const content = document.getElementById('app-content');
        if (!content) return;

        const uid = window.currentUserUid;
        const profile = window.currentUserProfile || {};

        // My properties
        const myProps = inventory.filter(i => i && i.supplier_uid === uid);

        // My bookings (where buyer purchased my items)
        const myBookings = bookings.filter(b => {
            if (!b || !Array.isArray(b.items)) return false;
            return b.items.some(item => item.supplier_uid === uid);
        });

        // Stats
        const totalRevenue = myBookings.reduce((sum, b) => sum + (parseFloat(b.totalSellingPrice) || 0), 0);
        const totalNights  = myBookings.reduce((sum, b) => {
            return sum + (b.items || []).reduce((s, item) => {
                return s + (Array.isArray(item.selectedDatesArray) ? item.selectedDatesArray.length : 0);
            }, 0);
        }, 0);
        const totalRooms = myProps.reduce((sum, p) => sum + (Array.isArray(p.subItems) ? p.subItems.length : 0), 0);

        // Occupancy per property
        const propRows = myProps.map(p => {
            const subCount = Array.isArray(p.subItems) ? p.subItems.length : 0;
            const allBlocked = (p.subItems || []).reduce((sum, r) =>
                sum + (Array.isArray(r.blockedDates) ? r.blockedDates.length : 0), 0);
            const coverSrc = (p.photos && p.photos[0]) || p.image || '';
            const catColor = p.category === 'Transport' ? '#f59e0b' : '#3b82f6';
            return `
            <div class="partner-prop-row">
                <div class="partner-prop-thumb">
                    ${coverSrc
                        ? `<img src="${coverSrc}" alt="${(p.name||'').replace(/"/g,'&quot;')}"
                               style="width:100%;height:100%;object-fit:cover;"
                               onerror="this.style.display='none'">`
                        : `<i class="fas fa-hotel" style="font-size:1.8rem;color:var(--text-faint);"></i>`}
                </div>
                <div class="partner-prop-info">
                    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                        <b style="font-size:1rem;color:var(--dark);">${p.name || window.t('unnamed_property')}</b>
                        <span class="badge" style="background:${catColor}20;color:${catColor};">${p.category || '—'}</span>
                        ${p.stars ? `<span style="color:#f59e0b;">${'★'.repeat(parseInt(p.stars)||0)}</span>` : ''}
                    </div>
                    <div style="display:flex;gap:18px;margin-top:6px;flex-wrap:wrap;font-size:0.82rem;color:var(--text-muted);">
                        <span><i class="fas fa-map-marker-alt" style="color:var(--primary);"></i> ${p.region || '—'}</span>
                        <span><i class="fas fa-bed" style="color:var(--primary);"></i> ${subCount} ${window.t('rooms_label')}</span>
                        <span><i class="fas fa-calendar-times" style="color:var(--danger);"></i> ${allBlocked} ${window.t('blocked_label')}</span>
                    </div>
                </div>
                <div class="partner-prop-actions">
                    <div style="text-align:right;margin-bottom:8px;">
                        <span style="font-family:'Montserrat',sans-serif;font-size:1.3rem;font-weight:800;color:var(--dark);">
                            ₼ ${p.sellingPrice || 0}
                        </span>
                        <span style="font-size:0.75rem;color:var(--text-muted);"> / ${window.t('per_night')}</span>
                    </div>
                    <div style="display:flex;gap:8px;">
                        <button onclick="window.renderHotelModal('${p.id}')"
                                class="btn-primary btn-sm"
                                style="background:var(--dark);">
                            <i class="fas fa-eye"></i> ${window.t('view_btn')}
                        </button>
                        <button onclick="window.editItem('${p.id}')"
                                class="btn-primary btn-sm">
                            <i class="fas fa-edit"></i> ${window.t('edit_property')}
                        </button>
                    </div>
                </div>
            </div>`;
        }).join('');

        // Recent bookings for partner
        const bookingRows = myBookings.slice(-5).reverse().map(b => {
            const nights = (b.items || []).reduce((s, item) =>
                s + (Array.isArray(item.selectedDatesArray) ? item.selectedDatesArray.length : 0), 0);
            const itemName = (b.items && b.items[0] && b.items[0].name) || '—';
            return `
            <tr>
                <td><b>${b.id?.slice(-8) || '—'}</b></td>
                <td>${itemName}</td>
                <td><span style="font-weight:700;">${nights}</span> ${window.t('nights_label')}</td>
                <td><b style="color:var(--primary);">₼ ${b.totalSellingPrice || 0}</b></td>
                <td>${new Date(b.createdAt || Date.now()).toLocaleDateString()}</td>
                <td><span class="badge badge-confirmed">${window.t('confirmed_label')}</span></td>
            </tr>`;
        }).join('');

        content.innerHTML = `
        <div class="admin-page fade-in">

            <!-- Partner Header -->
            <div class="partner-dash-header">
                <div class="partner-dash-avatar">${(profile.companyName || 'P').charAt(0).toUpperCase()}</div>
                <div>
                    <h1 style="font-size:1.8rem;margin:0;">${profile.companyName || window.t('my_property')}</h1>
                    <p style="color:var(--text-muted);margin:4px 0 0;">${window.auth?.currentUser?.email || ''}</p>
                    <span class="badge" style="background:var(--primary-light);color:var(--primary);margin-top:6px;display:inline-block;">
                        ${profile.role === 'hotel' ? window.t('role_hotel') : window.t('role_driver')}
                    </span>
                </div>
                <button class="btn-primary" style="margin-left:auto;"
                        onclick="window.currentObjectId=null;window.tempSubItems=[];window.render('extranet')">
                    <i class="fas fa-plus"></i> ${window.t('add_new')}
                </button>
            </div>

            <!-- KPI Cards -->
            <div class="stats-grid" style="margin:28px 0;">
                <div class="admin-stat-card" style="border-top:4px solid var(--primary);">
                    <div class="admin-stat-info">
                        <h4>${window.t('total_revenue')}</h4>
                        <div class="value" style="color:var(--primary);">₼ ${totalRevenue.toFixed(0)}</div>
                    </div>
                    <div class="stat-icon-wrap" style="background:rgba(0,160,160,0.1);">
                        <i class="fas fa-wallet" style="color:var(--primary);font-size:1.5rem;"></i>
                    </div>
                </div>
                <div class="admin-stat-card" style="border-top:4px solid #3b82f6;">
                    <div class="admin-stat-info">
                        <h4>${window.t('booked_nights')}</h4>
                        <div class="value">${totalNights}</div>
                    </div>
                    <div class="stat-icon-wrap" style="background:#dbeafe;">
                        <i class="fas fa-moon" style="color:#3b82f6;font-size:1.5rem;"></i>
                    </div>
                </div>
                <div class="admin-stat-card" style="border-top:4px solid #f59e0b;">
                    <div class="admin-stat-info">
                        <h4>${window.t('my_properties_count')}</h4>
                        <div class="value">${myProps.length}</div>
                    </div>
                    <div class="stat-icon-wrap" style="background:#fef3c7;">
                        <i class="fas fa-building" style="color:#f59e0b;font-size:1.5rem;"></i>
                    </div>
                </div>
                <div class="admin-stat-card" style="border-top:4px solid #10b981;">
                    <div class="admin-stat-info">
                        <h4>${window.t('total_rooms_label')}</h4>
                        <div class="value">${totalRooms}</div>
                    </div>
                    <div class="stat-icon-wrap" style="background:#d1fae5;">
                        <i class="fas fa-bed" style="color:#10b981;font-size:1.5rem;"></i>
                    </div>
                </div>
            </div>

            <!-- My Properties -->
            <div class="card" style="padding:0;overflow:hidden;margin-bottom:28px;">
                <div style="padding:22px 28px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
                    <h3 style="margin:0;font-size:1.1rem;">${window.t('my_property')}</h3>
                    <span style="font-size:0.85rem;color:var(--text-muted);">${myProps.length} ${window.t('properties_label')}</span>
                </div>
                <div>
                    ${myProps.length === 0
                        ? `<div class="empty-state" style="padding:48px;">
                               <i class="fas fa-hotel"></i>
                               <p>${window.t('no_inventory')}</p>
                               <button class="btn-primary" style="margin-top:12px;"
                                       onclick="window.currentObjectId=null;window.tempSubItems=[];window.render('extranet')">
                                   <i class="fas fa-plus"></i> ${window.t('add_new')}
                               </button>
                           </div>`
                        : propRows}
                </div>
            </div>

            <!-- Recent Bookings -->
            <div class="card" style="padding:0;overflow:hidden;">
                <div style="padding:22px 28px;border-bottom:1px solid var(--border);">
                    <h3 style="margin:0;font-size:1.1rem;">${window.t('recent_sales')}</h3>
                </div>
                <div style="overflow-x:auto;">
                    <table class="b2b-table" style="margin:0;">
                        <thead><tr>
                            <th>${window.t('order_id')}</th>
                            <th>${window.t('service_col')}</th>
                            <th>${window.t('nights_label')}</th>
                            <th>${window.t('amount_col')}</th>
                            <th>${window.t('date_col')}</th>
                            <th>${window.t('status_col')}</th>
                        </tr></thead>
                        <tbody>
                            ${bookingRows || `<tr><td colspan="6" style="text-align:center;padding:36px;color:var(--text-faint);">${window.t('no_bookings_yet')}</td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>`;
    };
    window.addSubItem = () => {
        if (!Array.isArray(window.tempSubItems)) window.tempSubItems = [];
        window.tempSubItems.push({
            id: 'item_' + Date.now(),
            name: '',
            price: 0,
            qty: 1,
            capacity: 1,
            blockedDates: [],
            photo: ''
        });
        window.renderSubItemsSection();
    };

    window.removeSubItem = (i) => {
        if (!Array.isArray(window.tempSubItems)) return;
        if (i < 0 || i >= window.tempSubItems.length) return;
        window.tempSubItems.splice(i, 1);
        // Reset activeSubItemId if it was the deleted item
        const ids = window.tempSubItems.map(r => r.id);
        if (!ids.includes(window.activeSubItemId)) {
            window.activeSubItemId = window.tempSubItems[0]?.id || null;
        }
        window.renderSubItemsSection();
    };

    window.updateSubItem = (i, field, val) => {
        if (!Array.isArray(window.tempSubItems)) return;
        if (window.tempSubItems[i] !== undefined) {
            window.tempSubItems[i][field] = val;
        }
    };
    window.renderSubItemsSection = () => {
        const cat = document.getElementById('ex-category')?.value || 'Hotel';
        const isHotel = cat === 'Hotel';
        const container = document.getElementById('subitems-section');
        if (!container) return;

        const objectId = window.currentObjectId || '';

        const rowsHtml = window.tempSubItems.map((r, i) => {
            const blocked = Array.isArray(r.blockedDates) ? r.blockedDates : [];
            const photoSrc = (r.photo && r.photo.startsWith('http')) ? r.photo : null;

            return `
            <div class="subitem-row" id="subitem-row-${i}">
                <!-- ── Main fields ── -->
                <div class="subitem-row-inner">
                    <div style="flex:2;">
                        <label class="input-label">${isHotel ? window.t('room_name') : window.t('vehicle_name')}</label>
                        <input type="text" value="${r.name || ''}"
                               onchange="window.updateSubItem(${i},'name',this.value)"
                               placeholder="${isHotel ? 'Deluxe Sea View 204' : 'Mercedes V-Class'}">
                    </div>
                    ${!isHotel ? `
                    <div style="flex:1.5;">
                        <label class="input-label">${window.t('plate')}</label>
                        <input type="text" value="${r.plate || ''}"
                               onchange="window.updateSubItem(${i},'plate',this.value)"
                               placeholder="10-AA-123">
                    </div>` : ''}
                    <div style="flex:1;">
                        <label class="input-label">${window.t('price_azn')}</label>
                        <input type="number" value="${r.price || ''}"
                               onchange="window.updateSubItem(${i},'price',parseFloat(this.value)||0)"
                               placeholder="0">
                    </div>
                    <div style="flex:1;">
                        <label class="input-label">${window.t('capacity')}</label>
                        <input type="number" value="${r.qty || r.capacity || 1}"
                               onchange="window.updateSubItem(${i},'qty',parseInt(this.value)||1)"
                               placeholder="1">
                    </div>
                    <button class="btn-outline-danger btn-icon"
                            onclick="window.removeSubItem(${i})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>

                <!-- ── Room photo (hotels only) ── -->
                ${isHotel ? `
                <div style="margin-top:12px; display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
                    ${photoSrc
                        ? `<img src="${photoSrc}" alt="${window.t('room_photo')}"
                               style="width:80px;height:60px;object-fit:cover;border-radius:8px;border:1px solid var(--border);"
                               onerror="this.style.display='none'">`
                        : ''}
                    <label class="room-photo-upload-label">
                        <i class="fas fa-camera"></i>
                        ${photoSrc ? window.t('change_photo') : window.t('add_room_photo')}
                        <input type="file" accept="image/*"
                               onchange="window.handleRoomPhotoUpload(this,${i})">
                    </label>
                    ${photoSrc
                        ? `<button onclick="window.updateSubItem(${i},'photo','');window.renderSubItemsSection();"
                                   style="background:none;border:none;color:var(--danger);font-size:0.8rem;cursor:pointer;font-weight:600;">
                               <i class="fas fa-times"></i> ${window.t('remove_photo')}
                           </button>`
                        : ''}
                    <span id="room-upload-status-${i}" style="font-size:0.8rem;color:var(--primary);font-weight:600;"></span>
                </div>` : ''}

                <!-- ── Per-room mini calendar ── -->
                <div class="room-mini-calendar-wrap" style="margin-top:16px;">
                    <button class="room-cal-toggle"
                            onclick="window.toggleRoomCalendar(${i})"
                            style="background:none;border:1.5px solid var(--border);border-radius:8px;
                                   padding:7px 14px;font-size:0.82rem;font-weight:600;
                                   color:var(--text-muted);cursor:pointer;transition:.2s;
                                   display:flex;align-items:center;gap:7px;">
                        <i class="fas fa-calendar-alt" style="color:var(--primary);"></i>
                        ${window.t('manage_availability')}
                        <span style="background:var(--danger);color:white;border-radius:10px;
                                     padding:1px 8px;font-size:0.72rem;
                                     ${blocked.length === 0 ? 'display:none' : ''}">
                            ${blocked.length} ${window.t('blocked_label')}
                        </span>
                    </button>

                    <div id="room-cal-panel-${i}" style="display:none; margin-top:14px;
                         background:#f8fafc;border:1px solid var(--border);
                         border-radius:12px;padding:20px;">
                        <div style="display:flex;align-items:center;justify-content:center;margin-bottom:14px;">
                            <input type="text" id="room-flatpickr-${i}" style="display:none;">
                        </div>
                        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:12px;">
                            <button class="btn-outline-danger btn-sm"
                                    onclick="window.blockRoomDates(${i},'${objectId}')">
                                <i class="fas fa-lock"></i> ${window.t('block_selected')}
                            </button>
                            <button class="btn-primary btn-sm"
                                    onclick="window.unblockRoomDates(${i},'${objectId}')"
                                    style="background:#10b981;">
                                <i class="fas fa-unlock"></i> ${window.t('unblock_selected')}
                            </button>
                        </div>
                        <p style="font-size:0.78rem;color:var(--text-muted);text-align:center;">
                            ${window.t('calendar_hint')}
                        </p>
                        <div id="room-blocked-list-${i}" style="margin-top:10px;display:flex;flex-wrap:wrap;gap:6px;">
                            ${blocked.map(d => `
                                <span class="blocked-date-tag">
                                    <i class="fas fa-lock"></i> ${d}
                                    <span onclick="window.removeSingleBlock(${i},'${objectId}','${d}')"
                                          style="cursor:pointer;margin-left:4px;opacity:.7;">×</span>
                                </span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');

        container.innerHTML = `
            <h4 class="section-sub-title">
                <i class="fas fa-${isHotel ? 'bed' : 'car'}"></i>
                ${isHotel ? window.t('rooms_management') : window.t('vehicles_management')}
            </h4>
            <div id="subitems-container">${rowsHtml}</div>
            <button class="btn-add-subitem" onclick="window.addSubItem()">
                <i class="fas fa-plus"></i>
                ${isHotel ? window.t('add_room') : window.t('add_vehicle')}
            </button>`;

        // Init flatpickr for rooms that have their calendar open
        window.tempSubItems.forEach((r, i) => {
            const panel = document.getElementById(`room-cal-panel-${i}`);
            if (panel && panel.style.display !== 'none') {
                window.initRoomCalendar(i);
            }
        });

        window.renderSubItemSelect();
    };

    // Toggle room calendar panel
    window.toggleRoomCalendar = (i) => {
        const panel = document.getElementById(`room-cal-panel-${i}`);
        if (!panel) return;
        const isOpen = panel.style.display !== 'none';
        panel.style.display = isOpen ? 'none' : 'block';
        if (!isOpen) window.initRoomCalendar(i);
    };

    // Init flatpickr for a specific room index
    window._roomCalendars = window._roomCalendars || {};
    window._roomSelectedRanges = window._roomSelectedRanges || {};

    window.initRoomCalendar = (i) => {
        if (!window.flatpickr) return;
        const r = window.tempSubItems[i];
        if (!r) return;
        const blocked = Array.isArray(r.blockedDates) ? r.blockedDates : [];

        if (window._roomCalendars[i]) {
            try { window._roomCalendars[i].destroy(); } catch(e) {}
        }

        const inputEl = document.getElementById(`room-flatpickr-${i}`);
        if (!inputEl) return;

        window._roomSelectedRanges[i] = [];

        window._roomCalendars[i] = flatpickr(inputEl, {
            mode: 'range',
            inline: true,
            minDate: 'today',
            onChange: (sel) => {
                window._roomSelectedRanges[i] = [];
                if (sel.length === 2) {
                    let c = new Date(sel[0]);
                    while (c <= sel[1]) {
                        window._roomSelectedRanges[i].push(window.formatDate(c));
                        c.setDate(c.getDate() + 1);
                    }
                } else if (sel.length === 1) {
                    window._roomSelectedRanges[i].push(window.formatDate(sel[0]));
                }
            },
            onDayCreate: (dObj, dStr, fp, dayElem) => {
                if (blocked.includes(window.formatDate(dayElem.dateObj))) {
                    dayElem.style.background = 'var(--danger)';
                    dayElem.style.color = 'white';
                    dayElem.style.borderRadius = '8px';
                    dayElem.title = window.t('blocked_label');
                }
            }
        });
    };

    // Block dates for a specific room
    window.blockRoomDates = async (i, objectId) => {
        const range = window._roomSelectedRanges[i] || [];
        if (range.length === 0) return alert(window.t('select_dates_first'));
        const r = window.tempSubItems[i];
        if (!r) return;
        const existing = Array.isArray(r.blockedDates) ? r.blockedDates : [];
        const merged = [...new Set([...existing, ...range])];
        window.tempSubItems[i].blockedDates = merged;
        if (objectId && !objectId.startsWith('NEW_')) {
            try { await update(ref(db, `inventory/${objectId}/subItems/${i}`), { blockedDates: merged }); }
            catch(e) { alert(e.message); return; }
        }
        window._roomSelectedRanges[i] = [];
        window.renderSubItemsSection();
        // Re-open this room's calendar
        setTimeout(() => {
            const panel = document.getElementById(`room-cal-panel-${i}`);
            if (panel) { panel.style.display = 'block'; window.initRoomCalendar(i); }
        }, 50);
    };

    // Unblock dates for a specific room
    window.unblockRoomDates = async (i, objectId) => {
        const range = window._roomSelectedRanges[i] || [];
        if (range.length === 0) return alert(window.t('select_dates_first'));
        const r = window.tempSubItems[i];
        if (!r) return;
        const existing = Array.isArray(r.blockedDates) ? r.blockedDates : [];
        const filtered = existing.filter(d => !range.includes(d));
        window.tempSubItems[i].blockedDates = filtered;
        if (objectId && !objectId.startsWith('NEW_')) {
            try { await update(ref(db, `inventory/${objectId}/subItems/${i}`), { blockedDates: filtered }); }
            catch(e) { alert(e.message); return; }
        }
        window._roomSelectedRanges[i] = [];
        window.renderSubItemsSection();
        setTimeout(() => {
            const panel = document.getElementById(`room-cal-panel-${i}`);
            if (panel) { panel.style.display = 'block'; window.initRoomCalendar(i); }
        }, 50);
    };

    // Remove a single blocked date with one click
    window.removeSingleBlock = async (i, objectId, date) => {
        const r = window.tempSubItems[i];
        if (!r) return;
        const existing = Array.isArray(r.blockedDates) ? r.blockedDates : [];
        const filtered = existing.filter(d => d !== date);
        window.tempSubItems[i].blockedDates = filtered;
        if (objectId && !objectId.startsWith('NEW_')) {
            try { await update(ref(db, `inventory/${objectId}/subItems/${i}`), { blockedDates: filtered }); }
            catch(e) { alert(e.message); return; }
        }
        window.renderSubItemsSection();
        setTimeout(() => {
            const panel = document.getElementById(`room-cal-panel-${i}`);
            if (panel) { panel.style.display = 'block'; window.initRoomCalendar(i); }
        }, 50);
    };

    window.changeActiveSubItem = (id) => { window.activeSubItemId = id; window.initCalendar(); };

    window.initCalendar = () => {
        if (!window.flatpickr) return;
        const activeItem = window.tempSubItems.find(r => r.id === window.activeSubItemId);
        window.tempBlockedDates = activeItem ? (Array.isArray(activeItem.blockedDates) ? activeItem.blockedDates : []) : [];
        if (window.extCalendar) { try { window.extCalendar.destroy(); } catch(e){} }
        const calEl = document.getElementById('extranet-calendar');
        if (!calEl) return;
        window.extCalendar = flatpickr('#extranet-calendar', {
            mode: 'range', inline: true, minDate: 'today',
            onChange: (sel) => {
                window.tempSelectedRange = [];
                if (sel.length === 2) { let c = new Date(sel[0]); while (c <= sel[1]) { window.tempSelectedRange.push(window.formatDate(c)); c.setDate(c.getDate() + 1); } }
                else if (sel.length === 1) { window.tempSelectedRange.push(window.formatDate(sel[0])); }
            },
            onDayCreate: (dObj, dStr, fp, dayElem) => {
                if (window.tempBlockedDates.includes(window.formatDate(dayElem.dateObj))) {
                    dayElem.style.background = 'var(--danger)'; dayElem.style.color = 'white'; dayElem.style.borderRadius = '8px'; dayElem.title = 'Blocked';
                }
            }
        });
        window.renderBlockedDatesList();
    };

    window.renderBlockedDatesList = () => {
        const container = document.getElementById('blocked-dates-list');
        if (!container) return;
        if (!window.tempBlockedDates || window.tempBlockedDates.length === 0) { container.innerHTML = ''; return; }
        container.innerHTML = '<h4 style="margin:20px 0 10px; font-size:0.85rem; color:#64748b; text-transform:uppercase; letter-spacing:1px;">Blocked Dates</h4><div class="blocked-dates-tags">' +
            window.tempBlockedDates.map(d => '<span class="blocked-date-tag"><i class="fas fa-lock"></i> ' + d + '</span>').join('') + '</div>';
    };

    // FIX #1: Photo preview now shows URLs from Storage
    // ── PHOTOS (Firebase Storage) ──────────────────────────────────

    // Рендер превью — работает и с base64 (старые данные) и с Storage URL
    window.renderPhotoPreview = () => {
        const container = document.getElementById('ex-gallery-preview');
        if (!container) return;
        if (!window.tempBase64Photos || window.tempBase64Photos.length === 0) {
            container.innerHTML = '';
            return;
        }
        container.innerHTML = window.tempBase64Photos.map((src, idx) => `
            <div class="gallery-thumb">
                <img src="${src}"
                     alt="photo ${idx + 1}"
                     onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&q=60'">
                <button class="gallery-thumb-del"
                        onclick="window.removePhoto(${idx})"
                        title="Remove">×</button>
            </div>`).join('');
    };

    // Загрузка в Firebase Storage → получаем URL → добавляем в массив
    window.handleStorageUpload = async (input, objectId) => {
        if (!window.storage || !window.storageFunc) {
            alert('Firebase Storage not initialized. Check index.html.');
            return;
        }
        const { storageRef, uploadBytes, getDownloadURL } = window.storageFunc;
        const files = Array.from(input.files);
        if (files.length === 0) return;

        // Show uploading indicator
        const dropzone = input.closest('.dropzone') || input.parentElement;
        const origText = dropzone ? dropzone.innerHTML : '';
        if (dropzone) dropzone.innerHTML = '<i class="fas fa-spinner fa-spin" style="font-size:2rem;color:var(--primary);"></i><p>Uploading...</p>';

        try {
            for (const file of files) {
                // Sanitize filename
                const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
                const path = `property_photos/${window.currentUserUid}/${objectId}/${Date.now()}_${safeName}`;
                const fileRef = storageRef(window.storage, path);
                const snapshot = await uploadBytes(fileRef, file);
                const downloadURL = await getDownloadURL(snapshot.ref);

                // Add URL (not base64!) to the photos array
                if (!Array.isArray(window.tempBase64Photos)) window.tempBase64Photos = [];
                window.tempBase64Photos.push(downloadURL);
                window.renderPhotoPreview();
            }
        } catch (err) {
            console.error('Upload error:', err);
            alert('Upload failed: ' + err.message);
        } finally {
            if (dropzone) dropzone.innerHTML = origText;
            input.value = ''; // reset so same file can be re-selected
        }
    };

    window.removePhoto = (idx) => {
        if (!Array.isArray(window.tempBase64Photos)) return;
        window.tempBase64Photos.splice(idx, 1);
        window.renderPhotoPreview();
    };

    // FIX #1: Upload to Firebase Storage, save download URL
    window.handleStorageUpload = async (input, objectId) => {
        const files = Array.from(input.files);
        if (!files.length) return;

        const statusEl = document.getElementById('upload-status');
        const statusText = document.getElementById('upload-status-text');
        if (statusEl) statusEl.style.display = 'block';

        let uploaded = 0;
        for (const file of files) {
            try {
                if (statusText) statusText.textContent = window.t('uploading') + ' (' + (uploaded + 1) + '/' + files.length + ')';
                // Create a unique path in Storage
                const path = 'inventory/' + (objectId || 'temp') + '/' + Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
                const fileRef = storageRef(storage, path);
                const snapshot = await uploadBytes(fileRef, file);
                const downloadURL = await getDownloadURL(snapshot.ref);
                window.tempPhotoUrls.push(downloadURL);
                uploaded++;
            } catch (err) {
                console.error('Storage upload error:', err);
                alert(window.t('upload_error') + '\n' + err.message);
            }
        }

        if (statusEl) statusEl.style.display = 'none';
        window.renderPhotoPreview();
        // Clear input so same file can be re-selected if needed
        input.value = '';
    };

    window.removePhoto = (idx) => { window.tempPhotoUrls.splice(idx, 1); window.renderPhotoPreview(); };

    // ══════════════════════════════════════════════════════════════
    // SAVE / DELETE
    // ══════════════════════════════════════════════════════════════

    window.saveExtranetData = async (event, objectId) => {
        const btn = event.currentTarget;
        const orig = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        try {
            const name         = document.getElementById('ex-name')?.value?.trim() || '';
            const sellingPrice = parseFloat(document.getElementById('ex-price')?.value || 0);
            const netCost      = parseFloat(document.getElementById('ex-net')?.value || 0);
            const markup       = parseFloat(document.getElementById('ex-markup')?.value || 15);
            const category     = document.getElementById('ex-category')?.value || 'Hotel';
            const region       = document.getElementById('ex-region')?.value?.trim() || '';
            const stars        = document.getElementById('ex-stars')?.value || '0';
            const descText     = document.getElementById('ex-desc')?.value?.trim() || '';

            if (!name) { alert('Property name is required.'); btn.innerHTML = orig; btn.disabled = false; return; }

            // FIX #1: Save only URL strings (from Storage), never base64
            const payload = {
                supplier_uid: window.currentUserUid,
                supplierName: window.currentUserProfile?.companyName || '',
                name, sellingPrice, netCost, markup,
                category, region,
                stars: parseInt(stars),
                descriptions: { en: descText, ru: descText, az: descText },
                description: descText,
                photos: window.tempPhotoUrls || [],          // short URLs only
                image:  window.tempPhotoUrls[0] || '',       // short URL only
                subItems: window.tempSubItems || [],
                updatedAt: Date.now()
            };

            await set(ref(db, 'inventory/' + objectId), payload);

            btn.style.background = '#10b981';
            btn.innerHTML = '<i class="fas fa-check"></i> Saved!';
            setTimeout(() => { btn.style.background = ''; btn.innerHTML = orig; btn.disabled = false; window.render('inventory'); }, 1500);
        } catch (e) {
            console.error(e);
            alert('Save failed: ' + e.message);
            btn.innerHTML = orig;
            btn.disabled = false;
        }
    };

    window.editItem = (id) => { window.currentObjectId = id; window.activeExTab = 1; window.render('extranet'); };

    window.deleteItem = async (id) => {
        if (!confirm(window.t('confirm_delete'))) return;
        try { await remove(ref(db, 'inventory/' + id)); } catch (e) { alert('Failed: ' + e.message); }
    };

    window.deleteUser = async (uid) => {
        if (!confirm('Disable this user?')) return;
        try { await remove(ref(db, 'users/' + uid)); } catch (e) { alert(e.message); }
    };
// Show/hide add partner form
    window.showAddPartnerForm = () => {
        const panel = document.getElementById('add-partner-panel');
        if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    };

    // Change a user's role directly from the Partners table
    window.changeUserRole = async (uid, newRole) => {
        try {
            await update(ref(db, `users/${uid}`), { role: newRole });
        } catch (e) {
            alert('Failed to update role: ' + e.message);
        }
    };

    // Create a new partner account (admin action)
    window.createPartnerAccount = async () => {
        const name  = document.getElementById('new-partner-name')?.value?.trim();
        const email = document.getElementById('new-partner-email')?.value?.trim();
        const pass  = document.getElementById('new-partner-pass')?.value;
        const role  = document.getElementById('new-partner-role')?.value || 'hotel';
        const status = document.getElementById('add-partner-status');

        if (!name || !email || !pass || pass.length < 6) {
            if (status) { status.style.color = 'var(--danger)'; status.textContent = 'Fill in all fields. Password min 6 characters.'; }
            return;
        }

        if (status) { status.style.color = 'var(--primary)'; status.textContent = 'Creating account...'; }

        try {
            // Use Firebase REST API to create user without logging out current admin
            const apiKey = window.auth.app.options.apiKey;
            const res = await fetch(
                `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password: pass, returnSecureToken: true })
                }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message || 'Account creation failed');

            // Save user profile in Realtime Database
            await set(ref(db, `users/${data.localId}`), {
                email,
                companyName: name,
                role,
                createdAt: Date.now(),
                is_verified: false
            });

            if (status) { status.style.color = 'var(--success)'; status.textContent = `✓ Account created for ${email}`; }
            // Clear form
            ['new-partner-name', 'new-partner-email', 'new-partner-pass'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
        } catch (e) {
            if (status) { status.style.color = 'var(--danger)'; status.textContent = 'Error: ' + e.message; }
        }
    };
    window.switchExTab = (id) => {
        window.activeExTab = id;
        document.querySelectorAll('.tab-btn').forEach((b, i) => b.classList.toggle('active', i === id - 1));
        document.querySelectorAll('.tab-content').forEach((c, i) => c.classList.toggle('active', i === id - 1));
        if (id === 3) setTimeout(() => window.renderCalendarTab(), 100);
    };

    // ══════════════════════════════════════════════════════════════
    // CALENDAR BLOCKING
    // ══════════════════════════════════════════════════════════════

    window.blockSelectedDates = async (objectId) => {
        if (!window.activeSubItemId) return alert(window.t('select_room'));
        if (!window.tempSelectedRange || window.tempSelectedRange.length === 0) return alert('Select dates first!');
        const btn = event.currentTarget; const orig = btn.innerHTML;
        btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        try {
            const idx = window.tempSubItems.findIndex(r => r.id === window.activeSubItemId);
            if (idx === -1) throw new Error('Unit not found');
            const existing = Array.isArray(window.tempSubItems[idx].blockedDates) ? window.tempSubItems[idx].blockedDates : [];
            const merged = [...new Set([...existing, ...window.tempSelectedRange])];
            window.tempSubItems[idx].blockedDates = merged;
            if (objectId && !objectId.startsWith('NEW_')) {
                await update(ref(db, 'inventory/' + objectId + '/subItems/' + idx), { blockedDates: merged });
            }
            window.tempSelectedRange = []; window.initCalendar();
        } catch (e) { alert(e.message); }
        btn.disabled = false; btn.innerHTML = orig;
    };

    window.unblockSelectedDates = async (objectId) => {
        if (!window.activeSubItemId) return alert(window.t('select_room'));
        if (!window.tempSelectedRange || window.tempSelectedRange.length === 0) return alert('Select dates first!');
        const btn = event.currentTarget; const orig = btn.innerHTML;
        btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        try {
            const idx = window.tempSubItems.findIndex(r => r.id === window.activeSubItemId);
            if (idx === -1) throw new Error('Unit not found');
            const existing = Array.isArray(window.tempSubItems[idx].blockedDates) ? window.tempSubItems[idx].blockedDates : [];
            const filtered = existing.filter(d => !window.tempSelectedRange.includes(d));
            window.tempSubItems[idx].blockedDates = filtered;
            if (objectId && !objectId.startsWith('NEW_')) {
                await update(ref(db, 'inventory/' + objectId + '/subItems/' + idx), { blockedDates: filtered });
            }
            window.tempSelectedRange = []; window.initCalendar();
        } catch (e) { alert(e.message); }
        btn.disabled = false; btn.innerHTML = orig;
    };

    // ══════════════════════════════════════════════════════════════
    // AUTOFILL
    // ══════════════════════════════════════════════════════════════

    window.autoFillFromUrl = async () => {
        const urlInput = document.getElementById('import-url');
        if (!urlInput?.value?.trim()) return alert('Paste a URL first.');
        const targetUrl = urlInput.value.trim();
        const btn = document.getElementById('autofill-btn');
        const orig = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching...';
        try {
            const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(targetUrl);
            const resp = await fetch(proxyUrl);
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            const data = await resp.json();
            const html = data.contents || '';
            const titleMatch = html.match(/<title>(.*?)<\/title>/i);
            const name = titleMatch ? titleMatch[1].split(/[-|–]/)[0].trim() : 'Property';
            if (document.getElementById('ex-name')) document.getElementById('ex-name').value = name;
            if (document.getElementById('ex-desc')) document.getElementById('ex-desc').value = 'Auto-fetched via API. Please review and complete the details.';
            btn.style.background = '#10b981';
            btn.innerHTML = '<i class="fas fa-check"></i> Done!';
            setTimeout(() => { btn.style.background = ''; btn.innerHTML = orig; btn.disabled = false; }, 2000);
        } catch (e) {
            alert('Fetch failed: ' + e.message);
            btn.innerHTML = orig; btn.disabled = false;
        }
    };

    // ══════════════════════════════════════════════════════════════
    // BUYER — ITEM DETAILS MODAL + CART
    // ══════════════════════════════════════════════════════════════

    window.viewItemDetails = (id) => {
        const item = inventory.find(i => i && i.id === id);
        if (!item) return;
        const subItems = (item.subItems && item.subItems.length) ? item.subItems : [{ id: 'default', name: 'Standard Option', price: item.sellingPrice || 0, blockedDates: [] }];

        document.getElementById('details-modal')?.remove();
        // FIX #2: getSafeImage is already fixed so the modal image renders correctly
        document.body.insertAdjacentHTML('beforeend', `
            <div class="modal-overlay active" id="details-modal">
                <div class="modal-content" style="position:relative;">
                    <button class="modal-close-btn" onclick="document.getElementById('details-modal').remove()">&#215;</button>
                    <div class="modal-body-inner">
                        <div class="modal-img-wrap">${getSafeImage(item)}</div>
                        <h2>${item.name}</h2>
                        <p style="color:#64748b;">${(item.descriptions && item.descriptions[currentLang]) || item.description || item.region || ''}</p>
                        <label class="input-label" style="margin-top:20px;">${window.t('select_item')}</label>
                        <select id="buyer-subitem-select" style="width:100%; padding:12px; margin-top:5px; border-radius:10px; border:1px solid #e2e8f0;">
                            ${subItems.map(r => '<option value="' + r.id + '">' + r.name + ' &#8212; &#8380;' + r.price + '</option>').join('')}
                        </select>
                        <label class="input-label" style="margin-top:20px;">Select Dates</label>
                        <input type="text" id="buyer-flat" style="width:100%; padding:15px; margin-top:8px; border:1px solid #e2e8f0; border-radius:12px;">
                        <div id="price-calc" class="modal-price-calc">Total: &#8380; 0.00</div>
                        <button id="add-btn" class="btn-primary" style="width:100%; margin-top:15px; padding:15px;" disabled>Add to Package</button>
                    </div>
                </div>
            </div>`);

        setTimeout(() => {
            const select = document.getElementById('buyer-subitem-select');
            let currentBasePrice = parseFloat(subItems[0]?.price || item.sellingPrice || 0);

            const initBuyerCal = (blocked) => {
                if (window.buyerFlatpickr) { try { window.buyerFlatpickr.destroy(); } catch(e){} }
                window.buyerFlatpickr = flatpickr('#buyer-flat', {
                    mode: 'range', minDate: 'today',
                    disable: (blocked || []).map(d => new Date(d)),
                    onChange: (sel) => {
                        window.selectedDates = [];
                        if (sel.length === 2) { let c = new Date(sel[0]); while (c <= sel[1]) { window.selectedDates.push(window.formatDate(c)); c.setDate(c.getDate() + 1); } }
                        const price = (currentBasePrice * window.selectedDates.length).toFixed(2);
                        document.getElementById('price-calc').textContent = 'Total: ₼ ' + price;
                        const addBtn = document.getElementById('add-btn');
                        addBtn.disabled = window.selectedDates.length === 0;
                        addBtn.onclick = () => {
                            window.currentCart.push({ ...item, selectedSubItemId: select?.value, selectedDatesArray: window.selectedDates, totalSellingPrice: price, cartId: Date.now() });
                            document.getElementById('details-modal').remove();
                            window.render('showcase');
                        };
                    }
                });
            };

            if (select) {
                select.onchange = (e) => {
                    const s = subItems.find(r => r.id === e.target.value);
                    if (s) { currentBasePrice = parseFloat(s.price); initBuyerCal(s.blockedDates); }
                };
            }
            initBuyerCal(subItems[0]?.blockedDates || []);
        }, 100);
    };

    window.openCartModal = () => {
        const total = window.currentCart.reduce((s, i) => s + parseFloat(i.totalSellingPrice || 0), 0).toFixed(2);
        document.getElementById('cart-modal')?.remove();
        document.body.insertAdjacentHTML('beforeend', `
            <div class="modal-overlay active" id="cart-modal">
                <div class="modal-content">
                    <h2 style="margin-bottom:20px;">Your Package</h2>
                    ${window.currentCart.length === 0
                        ? '<p style="color:#94a3b8; text-align:center; padding:30px;">' + window.t('empty_cart') + '</p>'
                        : window.currentCart.map(i => '<div class="cart-item"><span>' + i.name + '</span><b>&#8380; ' + i.totalSellingPrice + '</b></div>').join('')}
                    <hr style="margin:20px 0;">
                    <div style="display:flex; justify-content:space-between; font-size:1.2rem; font-weight:800;"><span>${window.t('total_price')}:</span><span>&#8380; ${total}</span></div>
                    ${window.currentCart.length > 0 ? '<button class="btn-primary" onclick="window.processBooking(\'' + total + '\')" style="width:100%; margin-top:20px; padding:15px;">' + window.t('confirm_booking') + '</button>' : ''}
                    <button onclick="document.getElementById('cart-modal').remove()" style="width:100%; margin-top:10px; background:none; border:none; color:#666; cursor:pointer;">${window.t('cancel')}</button>
                </div>
            </div>`);
    };

    window.processBooking = async (total) => {
        const orderId = 'ORD-' + Date.now();
        const upd = {};
        upd['bookings/' + orderId] = { id: orderId, buyer_uid: window.currentUserUid, totalSellingPrice: total, items: window.currentCart, createdAt: Date.now() };
        window.currentCart.forEach(item => {
            if (item.selectedDatesArray && item.subItems && item.selectedSubItemId) {
                const idx = item.subItems.findIndex(r => r.id === item.selectedSubItemId);
                if (idx !== -1) {
                    const merged = [...new Set([...(item.subItems[idx].blockedDates || []), ...item.selectedDatesArray])];
                    upd['inventory/' + item.id + '/subItems/' + idx + '/blockedDates'] = merged;
                }
            }
        });
        await update(ref(db), upd);
        window.currentCart = [];
        document.getElementById('cart-modal')?.remove();
        window.render('showcase');
        alert(window.t('booking_success'));
    };

    // ── AUTH ──────────────────────────────────────────────────────
    window.handleAuth = async (e, isLogin) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        if (btn) btn.disabled = true;
        const email = document.getElementById('auth-email').value.trim();
        const pass  = document.getElementById('auth-pass').value;
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, pass);
            } else {
                const cred = await createUserWithEmailAndPassword(auth, email, pass);
                await set(ref(db, 'users/' + cred.user.uid), {
                    email,
                    companyName: document.getElementById('reg-name')?.value?.trim() || '',
                    role: document.getElementById('reg-role')?.value || 'buyer',
                    createdAt: Date.now()
                });
            }
        } catch (err) {
            alert(err.message);
            if (btn) btn.disabled = false;
        }
    };

    // Fade-in animation
    const styleEl = document.createElement('style');
    styleEl.textContent = '.fade-in { animation: fadeInPage 0.35s ease both; } @keyframes fadeInPage { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }';
    document.head.appendChild(styleEl);
});