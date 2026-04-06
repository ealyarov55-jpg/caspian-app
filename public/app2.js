// ==========================================
// CASPIAN TRAVEL ROUTES — app2.js v14.0
// Vanilla JS + Firebase Realtime Database
// All logic preserved, bugs fixed, i18n unified
// ==========================================

// ── TRANSLATIONS (unified — covers all pages) ──────────────────────
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
        have_account: "Have an account?", blocked_dates_label: "Blocked dates shown in red."
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
        have_account: "Есть аккаунт?", blocked_dates_label: "Закрытые даты выделены красным."
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
        have_account: "Hesabınız var?", blocked_dates_label: "Bağlı tarihlər qırmızıyla göstərilir."
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

const getSafeImage = (item) => {
    if (!item) return '';
    const icon = item.category === 'Transport' ? 'fa-car-side' : 'fa-hotel';
    const fallback = `this.onerror=null;this.outerHTML='<div class="sf-card-img img-fallback"><i class="fas ${icon}"></i></div>'`;
    const src = (item.photos && item.photos[0]) || item.image || item.imageUrl || '';
    if (src && src.length > 10) return `<img src="${src}" class="sf-card-img" loading="lazy" onerror="${fallback}" alt="${item.name || ''}">`;
    return `<div class="sf-card-img img-fallback"><i class="fas ${icon}"></i></div>`;
};

// ── MAIN APP ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    const { db, dbFunc, auth, authFunc } = window;
    const { ref, set, onValue, update, remove, push } = dbFunc;
    const { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence } = authFunc;

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
    window.tempBase64Photos = [];
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

        if (role === 'admin') {
            Object.values(btns).forEach(b => { if (b) b.style.display = 'inline-flex'; });
            btns.dash.onclick = () => window.render('home');
            btns.inv.onclick  = () => window.render('inventory');
            btns.book.onclick = () => window.render('bookings');
            btns.part.onclick = () => window.render('partners');
            btns.prof.onclick = () => window.render('extranet');
        } else if (['hotel', 'driver', 'partner'].includes(role)) {
            if (btns.inv)  { btns.inv.style.display  = 'inline-flex'; btns.inv.onclick  = () => window.render('inventory'); }
            if (btns.book) { btns.book.style.display = 'inline-flex'; btns.book.onclick = () => window.render('bookings'); }
            if (btns.prof) { btns.prof.style.display = 'inline-flex'; btns.prof.onclick = () => { window.currentObjectId = null; window.tempSubItems = []; window.render('extranet'); }; }
        } else if (role === 'buyer') {
            nav.innerHTML = `
                <button class="buyer-nav-btn active" onclick="window.render('showcase')">${window.t('destinations')} <i class="fas fa-chevron-down"></i></button>
                <button class="buyer-nav-btn" onclick="window.render('showcase')">Experiences</button>
                <button class="buyer-nav-btn" onclick="window.render('showcase')">Routes</button>
                <button class="buyer-nav-btn" onclick="window.render('bookings')">${window.t('bookings')}</button>
                <button class="buyer-nav-btn">About</button>`;
            // Search bar
            const headerRight = document.querySelector('.header-right');
            if (headerRight && !document.getElementById('buyer-search-bar')) {
                const searchEl = document.createElement('div');
                searchEl.id = 'buyer-search-bar';
                searchEl.className = 'buyer-search-wrap';
                searchEl.innerHTML = `<input type="text" id="buyer-search-input" class="buyer-search-input" placeholder="${window.t('destinations')}..."><button class="buyer-search-btn"><i class="fas fa-search"></i></button>`;
                headerRight.insertBefore(searchEl, headerRight.firstChild);
            }
        }
    };

    // ══════════════════════════════════════════════════════════════
    // MAIN RENDER
    // ══════════════════════════════════════════════════════════════
    window.render = (page) => {
        if (!isAuthReady) return;
        window.currentPage = page;
        const content = document.getElementById('app-content');
        if (!content) return;
        content.innerHTML = '';

        // ─────────────────────────────────────────────────────────
        // 1. LOGIN / REGISTER
        // ─────────────────────────────────────────────────────────
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

        // ─────────────────────────────────────────────────────────
        // 2. ADMIN DASHBOARD
        // ─────────────────────────────────────────────────────────
        else if (page === 'home' && window.currentUserRole === 'admin') {
            const realPartners = Object.values(usersData).filter(u => u && (u.role === 'hotel' || u.role === 'driver')).length;
            const totalRevenue = bookings.reduce((acc, b) => acc + (parseFloat(b.totalSellingPrice) || 0), 0).toFixed(2);
            const recentRows = bookings.slice(-5).reverse().map(b => `
                <tr>
                    <td><b>${(b.items && b.items[0] && b.items[0].supplierName) || 'Internal'}</b></td>
                    <td>${(b.items && b.items[0] && b.items[0].name) || 'Package'}</td>
                    <td>${new Date(b.createdAt).toLocaleDateString()}</td>
                    <td>₼ ${b.totalSellingPrice || 0}</td>
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
                            <h4 data-i18n="total_revenue">${window.t('total_revenue')}</h4>
                            <div class="value">₼ ${totalRevenue}</div>
                        </div>
                        <div class="stat-icon-wrap" style="background:#d1fae5;"><i class="fas fa-wallet" style="color:#10b981;"></i></div>
                    </div>
                    <div class="admin-stat-card" style="border-top:4px solid #3b82f6;">
                        <div class="admin-stat-info">
                            <h4 data-i18n="total_partners">${window.t('total_partners')}</h4>
                            <div class="value">${realPartners}</div>
                        </div>
                        <div class="stat-icon-wrap" style="background:#dbeafe;"><i class="fas fa-handshake" style="color:#3b82f6;"></i></div>
                    </div>
                    <div class="admin-stat-card" style="border-top:4px solid #f59e0b;">
                        <div class="admin-stat-info">
                            <h4 data-i18n="total_inventory">${window.t('total_inventory')}</h4>
                            <div class="value">${inventory.length}</div>
                        </div>
                        <div class="stat-icon-wrap" style="background:#fef3c7;"><i class="fas fa-box-open" style="color:#f59e0b;"></i></div>
                    </div>
                    <div class="admin-stat-card" style="border-top:4px solid #6366f1;">
                        <div class="admin-stat-info">
                            <h4 data-i18n="platform_views">${window.t('platform_views')}</h4>
                            <div class="value">${platformStats.views || 0}</div>
                        </div>
                        <div class="stat-icon-wrap" style="background:#ede9fe;"><i class="fas fa-chart-area" style="color:#6366f1;"></i></div>
                    </div>
                </div>
                <div class="admin-bottom-grid">
                    <div class="card">
                        <h3 data-i18n="recent_sales">${window.t('recent_sales')}</h3>
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
                        <h3 data-i18n="market_share">${window.t('market_share')}</h3>
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

        // ─────────────────────────────────────────────────────────
        // 3. INVENTORY LIST
        // ─────────────────────────────────────────────────────────
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
                        ${item.stars ? `<span class="inv-stars">${'★'.repeat(parseInt(item.stars) || 0)}</span>` : ''}
                    </div>
                    <div class="inv-card-body">
                        <h3 class="inv-card-title">${item.name || 'Unnamed'}</h3>
                        <p class="inv-card-location"><i class="fas fa-map-marker-alt"></i> ${item.region || item.location || 'Baku'}</p>
                        <div class="inv-card-pricing">
                            <div class="inv-net-price">Net: <b>₼ ${item.netCost || 0}</b></div>
                            <div class="inv-sell-price">₼ ${item.sellingPrice || 0}</div>
                        </div>
                        <div class="inv-card-actions">
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

        // ─────────────────────────────────────────────────────────
        // 4. PARTNER EXTRANET (property form + calendar)
        // ─────────────────────────────────────────────────────────
        else if (page === 'extranet' && (window.currentUserRole === 'admin' || ['hotel', 'driver', 'partner'].includes(window.currentUserRole))) {
            
            // Admin profile view
            if (window.currentUserRole === 'admin' && !window.currentObjectId) {
                content.innerHTML = `
                <div class="admin-page fade-in">
                    <h2 data-i18n="profile">${window.t('profile')}</h2>
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
                window.tempBase64Photos = Array.isArray(inv.photos) ? [...inv.photos] : [];
                window.tempSubItems = Array.isArray(inv.subItems) ? inv.subItems.map(s => ({ ...s })) : [];
            } else {
                window.tempBase64Photos = [];
                window.tempSubItems = [];
            }

            const objectId = window.currentObjectId || ('NEW_' + Date.now());
            const defaultCat = window.currentUserRole === 'driver' ? 'Transport' : 'Hotel';
            const cat = inv.category || defaultCat;
            const isHotel = cat === 'Hotel';

            content.innerHTML = `
            <div class="extranet-page fade-in">
                <div class="extranet-header">
                    <button class="btn-back" onclick="window.render('inventory')"><i class="fas fa-arrow-left"></i></button>
                    <h2>${inv.name ? window.t('edit_property') + ': ' + inv.name : window.t('create_property')}</h2>
                </div>

                <!-- Smart Autofill -->
                <div class="autofill-card">
                    <div class="autofill-card-inner">
                        <i class="fas fa-bolt" style="color:#f59e0b; font-size:1.4rem;"></i>
                        <div>
                            <h4 style="margin:0 0 4px;" data-i18n="smart_autofill">${window.t('smart_autofill')}</h4>
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

                <!-- Tabs -->
                <div class="profile-tabs">
                    <button class="tab-btn ${window.activeExTab === 1 ? 'active' : ''}" onclick="window.switchExTab(1)">${window.t('property_details')}</button>
                    <button class="tab-btn ${window.activeExTab === 2 ? 'active' : ''}" onclick="window.switchExTab(2)">${window.t('media_gallery')}</button>
                    <button class="tab-btn ${window.activeExTab === 3 ? 'active' : ''}" onclick="window.switchExTab(3)">${window.t('availability')}</button>
                </div>

                <div class="card extranet-card">

                    <!-- TAB 1: Details -->
                    <div id="ex-tab-1" class="tab-content ${window.activeExTab === 1 ? 'active' : ''}">
                        <div class="form-grid-2">
                            <div>
                                <label class="input-label">${window.t('public_name')}</label>
                                <input type="text" id="ex-name" value="${inv.name || ''}" placeholder="e.g. Four Seasons Hotel Baku">
                            </div>
                            <div>
                                <label class="input-label">${window.t('category')}</label>
                                <select id="ex-category" onchange="window.onCategoryChange(this.value)">
                                    <option value="Hotel" ${cat === 'Hotel' ? 'selected' : ''}>🏨 Hotel</option>
                                    <option value="Transport" ${cat === 'Transport' ? 'selected' : ''}>🚗 Transport</option>
                                    <option value="Activity" ${cat === 'Activity' ? 'selected' : ''}>🎯 Activity</option>
                                </select>
                            </div>
                            <div>
                                <label class="input-label">${window.t('location')}</label>
                                <input type="text" id="ex-region" value="${inv.region || inv.location || ''}" placeholder="Baku, Azerbaijan">
                            </div>
                            <div>
                                <label class="input-label">${window.t('stars')}</label>
                                <select id="ex-stars">
                                    ${[0,1,2,3,4,5].map(n => `<option value="${n}" ${(inv.stars || 0) == n ? 'selected' : ''}>${n === 0 ? 'No rating' : '★'.repeat(n) + ' (' + n + ' star)'}</option>`).join('')}
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

                        <!-- Sub-items section (rooms / vehicles) -->
                        <div id="subitems-section" style="margin-top:30px; padding-top:25px; border-top:1px solid #e2e8f0;"></div>

                        <label class="input-label" style="margin-top:25px;">${window.t('description')}</label>
                        <textarea id="ex-desc" style="height:120px; margin-top:8px;">${(inv.descriptions && inv.descriptions.en) || inv.description || ''}</textarea>

                        <button class="btn-primary save-btn" onclick="window.saveExtranetData(event, '${objectId}')">
                            <i class="fas fa-save"></i> ${window.t('save')}
                        </button>
                    </div>

                    <!-- TAB 2: Media -->
                    <div id="ex-tab-2" class="tab-content ${window.activeExTab === 2 ? 'active' : ''}">
                        <div id="ex-gallery-preview" class="gallery-grid" style="margin-bottom:20px;"></div>
                        <div class="dropzone" onclick="document.getElementById('ex-upload').click()">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>${window.t('click_to_upload')}</p>
                            <span>PNG, JPG up to 5MB</span>
                            <input type="file" id="ex-upload" multiple accept="image/*" style="display:none;" onchange="window.handleBase64Upload(this)">
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

            // Init dynamic parts
            window.onCategoryChange = (val) => window.renderSubItemsSection();
            window.renderSubItemsSection();
            window.renderPhotoPreview();

            // Enter key on import URL
            setTimeout(() => {
                const urlInput = document.getElementById('import-url');
                if (urlInput) urlInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); window.autoFillFromUrl(); } });
                if (window.activeExTab === 3) window.renderCalendarTab();
            }, 100);
        }

        // ─────────────────────────────────────────────────────────
        // 5. PARTNERS (admin)
        // ─────────────────────────────────────────────────────────
        else if (page === 'partners' && window.currentUserRole === 'admin') {
            const partnerList = Object.entries(usersData)
                .filter(([uid, u]) => u && uid !== window.currentUserUid)
                .map(([uid, u]) => `
                    <tr>
                        <td>
                            <div style="display:flex; align-items:center; gap:12px;">
                                <div class="partner-avatar">${(u.companyName || u.email || 'U').charAt(0).toUpperCase()}</div>
                                <div><b>${u.companyName || 'Unnamed'}</b><br><small style="color:#64748b;">${u.email || ''}</small></div>
                            </div>
                        </td>
                        <td><span class="badge ${u.role === 'hotel' ? 'badge-hotel' : u.role === 'driver' ? 'badge-transport' : 'badge-buyer'}">${u.role || 'user'}</span></td>
                        <td>${new Date(u.createdAt || Date.now()).toLocaleDateString()}</td>
                        <td><button onclick="window.deleteUser('${uid}')" class="btn-outline-danger btn-sm"><i class="fas fa-ban"></i> Disable</button></td>
                    </tr>`).join('');

            content.innerHTML = `
            <div class="admin-page">
                <div class="admin-page-header">
                    <h2 data-i18n="partners_list">${window.t('partners_list')}</h2>
                    <p style="color:#64748b; margin-top:5px;">${Object.keys(usersData).length} registered users</p>
                </div>
                <div class="card" style="overflow:hidden; padding:0;">
                    <div style="overflow-x:auto;">
                        <table class="b2b-table">
                            <thead><tr><th>Partner</th><th>Role</th><th>Joined</th><th>Action</th></tr></thead>
                            <tbody>${partnerList || '<tr><td colspan="4" style="text-align:center; padding:40px; color:#94a3b8;">No partners found</td></tr>'}</tbody>
                        </table>
                    </div>
                </div>
            </div>`;
        }

        // ─────────────────────────────────────────────────────────
        // 6. BUYER SHOWCASE
        // ─────────────────────────────────────────────────────────
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
                            <span class="filter-route-price">₼${item.sellingPrice}</span>
                        </div>
                        <button onclick="event.stopPropagation(); window.viewItemDetails('${item.id}')">${window.t('explore')}</button>
                    </div>
                </div>`).join('') || `<p style="padding:20px; color:#94a3b8; text-align:center; font-size:0.9rem;">Add inventory to see routes</p>`;

            const curatedCards = filtered.map(item => `
                <div class="curated-card" onclick="window.viewItemDetails('${item.id}')">
                    <div class="curated-card-img">
                        ${getSafeImage(item)}
                        <div class="curated-card-overlay"><h3>${item.name}</h3><p>${(item.descriptions && item.descriptions[currentLang]) || item.region || ''}</p></div>
                    </div>
                    <div class="curated-card-footer">
                        <span class="curated-duration"><i class="fas fa-map-marker-alt"></i> ${item.region || 'Azerbaijan'} &bull; ${item.category || 'Tour'}</span>
                        <div class="curated-price-row">
                            <span class="curated-price">₼${item.sellingPrice}</span>
                            <button class="curated-explore-btn" onclick="event.stopPropagation(); window.viewItemDetails('${item.id}')">${window.t('explore')}</button>
                        </div>
                    </div>
                </div>`).join('') || `<p style="color:#94a3b8; padding:20px;">No experiences found.</p>`;

            const featuredHtml = allInv.slice(0, 4).map(item => `
                <div class="featured-item" onclick="window.viewItemDetails('${item.id}')">
                    <div class="featured-item-img">${getSafeImage(item)}</div>
                    <div class="featured-item-info">
                        <h4>${item.name}</h4>
                        <p>${(item.descriptions && item.descriptions[currentLang]) || item.region || 'Azerbaijan'}</p>
                        <span class="featured-rating">⭐ Top Pick</span>
                    </div>
                </div>`).join('') || `<p style="color:#94a3b8; font-size:0.9rem;">No featured routes yet.</p>`;

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
                            ${(regions.length ? regions : ['Azerbaijan', 'Russia', 'Kazakhstan']).map((r, i) => `<label class="filter-checkbox"><input type="checkbox" ${i < 2 ? 'checked' : ''}> ${r}</label>`).join('')}
                        </div>
                        <div class="filter-section">
                            <div class="filter-title-row"><h3>Travel Style</h3><i class="fas fa-chevron-up"></i></div>
                            <div class="filter-tabs">
                                ${(categories.length ? categories : ['Hotel', 'Transport', 'Activity']).map((c, i) => `<span class="filter-tab ${i === 0 ? 'active' : ''}">${c}</span>`).join('')}
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
                            <span class="legend-dot teal"></span> Baku–Tbilisi–Yerevan
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
                    <div class="footer-bottom"><p>© 2025 Caspian Travel Routes DMC</p><a href="#" class="footer-contact-link">Contact Info</a></div>
                </footer>

                <button class="floating-cart-btn" onclick="window.openCartModal()">
                    <i class="fas fa-shopping-bag"></i> My Package
                    <span class="cart-badge">${window.currentCart.length}</span>
                </button>
            </div>`;

            // Leaflet map
            setTimeout(() => {
                if (window.L) {
                    const map = L.map('leaflet-map').setView([40.40, 49.86], 5);
                    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '© CartoDB' }).addTo(map);
                    [[40.40,49.86,'Baku'],[41.69,44.83,'Tbilisi'],[40.18,44.51,'Yerevan'],[43.22,76.85,'Almaty']].forEach(([lat,lng,name]) =>
                        L.circleMarker([lat,lng],{color:'#00a0a0',fillColor:'#00a0a0',fillOpacity:1,radius:8,weight:2}).bindPopup(`<b>${name}</b>`).addTo(map));
                    L.polyline([[40.40,49.86],[41.69,44.83],[40.18,44.51]],{color:'#00a0a0',weight:3,dashArray:'8,4'}).addTo(map);
                }
            }, 300);

            // Carousel
            let offset = 0;
            const track = document.getElementById('curated-track');
            document.getElementById('curated-prev')?.addEventListener('click', () => { offset = Math.max(0, offset - 1); if (track) track.style.transform = `translateX(-${offset * 302}px)`; });
            document.getElementById('curated-next')?.addEventListener('click', () => { offset = Math.min(Math.max(0, filtered.length - 3), offset + 1); if (track) track.style.transform = `translateX(-${offset * 302}px)`; });

            // Search
            document.getElementById('buyer-search-input')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') window.render('showcase'); });
            document.querySelector('.buyer-search-btn')?.addEventListener('click', () => window.render('showcase'));
        }

        // ─────────────────────────────────────────────────────────
        // 7. BOOKINGS
        // ─────────────────────────────────────────────────────────
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
                        <div class="booking-total">₼ ${b.totalSellingPrice || 0}</div>
                    </div>
                </div>`).join('') : `<div class="empty-state"><i class="fas fa-calendar-times"></i><p>No bookings found.</p></div>`;

            content.innerHTML = `
            <div class="admin-page">
                <div class="admin-page-header"><h2 data-i18n="bookings">${window.t('bookings')}</h2></div>
                <div class="bookings-list">${html}</div>
            </div>`;
        }

        applyTranslations();
    };

    // ══════════════════════════════════════════════════════════════
    // EXTRANET HELPERS
    // ══════════════════════════════════════════════════════════════

    // Selling price auto-calc
    window.calcSellingPrice = () => {
        const net = parseFloat(document.getElementById('ex-net')?.value || 0);
        const markup = parseFloat(document.getElementById('ex-markup')?.value || 15);
        const priceEl = document.getElementById('ex-price');
        if (priceEl && net > 0) priceEl.value = (net * (1 + markup / 100)).toFixed(2);
    };

    // Render sub-items (rooms / vehicles)
    window.renderSubItemsSection = () => {
        const cat = document.getElementById('ex-category')?.value || 'Hotel';
        const isHotel = cat === 'Hotel';
        const container = document.getElementById('subitems-section');
        if (!container) return;

        const rowsHtml = window.tempSubItems.map((r, i) => `
            <div class="subitem-row">
                <div class="subitem-row-inner">
                    <div style="flex:2;">
                        <label class="input-label">${isHotel ? window.t('room_name') : window.t('vehicle_name')}</label>
                        <input type="text" value="${r.name || ''}" onchange="window.updateSubItem(${i},'name',this.value)" placeholder="${isHotel ? 'Deluxe Sea View 204' : 'Mercedes V-Class'}">
                    </div>
                    ${!isHotel ? `<div style="flex:1.5;">
                        <label class="input-label">${window.t('plate')}</label>
                        <input type="text" value="${r.plate || ''}" onchange="window.updateSubItem(${i},'plate',this.value)" placeholder="10-AA-123">
                    </div>` : ''}
                    <div style="flex:1;">
                        <label class="input-label">${window.t('price_azn')}</label>
                        <input type="number" value="${r.price || ''}" onchange="window.updateSubItem(${i},'price',parseFloat(this.value)||0)" placeholder="0">
                    </div>
                    <div style="flex:1;">
                        <label class="input-label">${window.t('capacity')}</label>
                        <input type="number" value="${r.qty || r.capacity || 1}" onchange="window.updateSubItem(${i},'qty',parseInt(this.value)||1)" placeholder="1">
                    </div>
                    <button class="btn-outline-danger btn-icon" onclick="window.removeSubItem(${i})"><i class="fas fa-trash"></i></button>
                </div>
            </div>`).join('');

        container.innerHTML = `
            <h4 class="section-sub-title"><i class="fas fa-${isHotel ? 'bed' : 'car'}"></i> ${isHotel ? window.t('rooms_management') : window.t('vehicles_management')}</h4>
            <div id="subitems-container">${rowsHtml}</div>
            <button class="btn-add-subitem" onclick="window.addSubItem()">
                <i class="fas fa-plus"></i> ${isHotel ? window.t('add_room') : window.t('add_vehicle')}
            </button>`;

        window.renderSubItemSelect();
    };

    window.addSubItem    = () => { window.tempSubItems.push({ id: 'item_' + Date.now(), name: '', price: 0, qty: 1, capacity: 1, blockedDates: [] }); window.renderSubItemsSection(); };
    window.removeSubItem = (i) => { window.tempSubItems.splice(i, 1); window.renderSubItemsSection(); };
    window.updateSubItem = (i, field, val) => { if (window.tempSubItems[i]) window.tempSubItems[i][field] = val; };

    // Calendar tab
    window.renderCalendarTab = () => {
        window.renderSubItemSelect();
        window.initCalendar();
    };

    window.renderSubItemSelect = () => {
        const sel = document.getElementById('ex-room-select');
        if (!sel) return;
        sel.innerHTML = window.tempSubItems.length
            ? window.tempSubItems.map(r => `<option value="${r.id}">${r.name || 'Unnamed'} — ₼${r.price || 0}</option>`).join('')
            : `<option value="">Add units in Details tab first</option>`;
        if (window.tempSubItems.length && (!window.activeSubItemId || !window.tempSubItems.find(r => r.id === window.activeSubItemId))) {
            window.activeSubItemId = window.tempSubItems[0].id;
        }
        sel.value = window.activeSubItemId || '';
        window.initCalendar();
    };

    window.changeActiveSubItem = (id) => {
        window.activeSubItemId = id;
        window.initCalendar();
    };

    window.initCalendar = () => {
        if (!window.flatpickr) return;
        const activeItem = window.tempSubItems.find(r => r.id === window.activeSubItemId);
        window.tempBlockedDates = activeItem ? (Array.isArray(activeItem.blockedDates) ? activeItem.blockedDates : []) : [];

        if (window.extCalendar) { try { window.extCalendar.destroy(); } catch(e){} }

        const calEl = document.getElementById('extranet-calendar');
        if (!calEl) return;

        window.extCalendar = flatpickr('#extranet-calendar', {
            mode: 'range',
            inline: true,
            minDate: 'today',
            onChange: (sel) => {
                window.tempSelectedRange = [];
                if (sel.length === 2) {
                    let c = new Date(sel[0]);
                    while (c <= sel[1]) { window.tempSelectedRange.push(window.formatDate(c)); c.setDate(c.getDate() + 1); }
                } else if (sel.length === 1) {
                    window.tempSelectedRange.push(window.formatDate(sel[0]));
                }
            },
            onDayCreate: (dObj, dStr, fp, dayElem) => {
                if (window.tempBlockedDates.includes(window.formatDate(dayElem.dateObj))) {
                    dayElem.style.background = 'var(--danger)';
                    dayElem.style.color = 'white';
                    dayElem.style.borderRadius = '8px';
                    dayElem.title = 'Blocked';
                }
            }
        });

        window.renderBlockedDatesList();
    };

    window.renderBlockedDatesList = () => {
        const container = document.getElementById('blocked-dates-list');
        if (!container) return;
        if (!window.tempBlockedDates || window.tempBlockedDates.length === 0) {
            container.innerHTML = '';
            return;
        }
        container.innerHTML = `
            <h4 style="margin:20px 0 10px; font-size:0.85rem; color:#64748b; text-transform:uppercase; letter-spacing:1px;">Blocked Dates</h4>
            <div class="blocked-dates-tags">
                ${window.tempBlockedDates.map(d => `<span class="blocked-date-tag"><i class="fas fa-lock"></i> ${d}</span>`).join('')}
            </div>`;
    };

    // Photos
    window.renderPhotoPreview = () => {
        const container = document.getElementById('ex-gallery-preview');
        if (!container) return;
        container.innerHTML = window.tempBase64Photos.map((src, idx) => `
            <div class="gallery-thumb">
                <img src="${src}" alt="photo ${idx + 1}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&q=60'">
                <button class="gallery-thumb-del" onclick="window.removePhoto(${idx})" title="Remove">×</button>
            </div>`).join('');
    };

    window.handleBase64Upload = (input) => {
        Array.from(input.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => { window.tempBase64Photos.push(e.target.result); window.renderPhotoPreview(); };
            reader.readAsDataURL(file);
        });
    };

    window.removePhoto = (idx) => { window.tempBase64Photos.splice(idx, 1); window.renderPhotoPreview(); };

    // ══════════════════════════════════════════════════════════════
    // SAVE / DELETE
    // ══════════════════════════════════════════════════════════════

    window.saveExtranetData = async (event, objectId) => {
        const btn = event.currentTarget;
        const orig = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        try {
            const name        = document.getElementById('ex-name')?.value?.trim() || '';
            const sellingPrice = parseFloat(document.getElementById('ex-price')?.value || 0);
            const netCost      = parseFloat(document.getElementById('ex-net')?.value || 0);
            const markup       = parseFloat(document.getElementById('ex-markup')?.value || 15);
            const category     = document.getElementById('ex-category')?.value || 'Hotel';
            const region       = document.getElementById('ex-region')?.value?.trim() || '';
            const stars        = document.getElementById('ex-stars')?.value || '0';
            const descText     = document.getElementById('ex-desc')?.value?.trim() || '';

            if (!name) { alert('Property name is required.'); btn.innerHTML = orig; btn.disabled = false; return; }

            const payload = {
                supplier_uid: window.currentUserUid,
                supplierName: window.currentUserProfile?.companyName || '',
                name, sellingPrice, netCost, markup,
                category, region,
                stars: parseInt(stars),
                descriptions: { en: descText, ru: descText, az: descText },
                description: descText,
                photos: window.tempBase64Photos || [],
                image: window.tempBase64Photos[0] || '',
                subItems: window.tempSubItems || [],
                updatedAt: Date.now()
            };

            await set(ref(db, `inventory/${objectId}`), payload);

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

    window.editItem = (id) => {
        window.currentObjectId = id;
        window.activeExTab = 1;
        window.render('extranet');
    };

    window.deleteItem = async (id) => {
        if (!confirm(window.t('confirm_delete'))) return;
        try {
            await remove(ref(db, `inventory/${id}`));
        } catch (e) { alert('Failed: ' + e.message); }
    };

    window.deleteUser = async (uid) => {
        if (!confirm('Disable this user?')) return;
        try { await remove(ref(db, `users/${uid}`)); } catch (e) { alert(e.message); }
    };

    // Tab switcher
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
        const btn = event.currentTarget;
        const orig = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        try {
            const idx = window.tempSubItems.findIndex(r => r.id === window.activeSubItemId);
            if (idx === -1) throw new Error('Unit not found');
            const existing = Array.isArray(window.tempSubItems[idx].blockedDates) ? window.tempSubItems[idx].blockedDates : [];
            const merged = [...new Set([...existing, ...window.tempSelectedRange])];
            window.tempSubItems[idx].blockedDates = merged;

            if (objectId && !objectId.startsWith('NEW_')) {
                await update(ref(db, `inventory/${objectId}/subItems/${idx}`), { blockedDates: merged });
            }
            window.tempSelectedRange = [];
            window.initCalendar();
        } catch (e) { alert(e.message); }
        btn.disabled = false;
        btn.innerHTML = orig;
    };

    window.unblockSelectedDates = async (objectId) => {
        if (!window.activeSubItemId) return alert(window.t('select_room'));
        if (!window.tempSelectedRange || window.tempSelectedRange.length === 0) return alert('Select dates first!');
        const btn = event.currentTarget;
        const orig = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        try {
            const idx = window.tempSubItems.findIndex(r => r.id === window.activeSubItemId);
            if (idx === -1) throw new Error('Unit not found');
            const existing = Array.isArray(window.tempSubItems[idx].blockedDates) ? window.tempSubItems[idx].blockedDates : [];
            const filtered = existing.filter(d => !window.tempSelectedRange.includes(d));
            window.tempSubItems[idx].blockedDates = filtered;

            if (objectId && !objectId.startsWith('NEW_')) {
                await update(ref(db, `inventory/${objectId}/subItems/${idx}`), { blockedDates: filtered });
            }
            window.tempSelectedRange = [];
            window.initCalendar();
        } catch (e) { alert(e.message); }
        btn.disabled = false;
        btn.innerHTML = orig;
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
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
            const resp = await fetch(proxyUrl);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
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
            btn.innerHTML = orig;
            btn.disabled = false;
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
        document.body.insertAdjacentHTML('beforeend', `
            <div class="modal-overlay active" id="details-modal">
                <div class="modal-content" style="position:relative;">
                    <button class="modal-close-btn" onclick="document.getElementById('details-modal').remove()">×</button>
                    <div class="modal-body-inner">
                        <div class="modal-img-wrap">${getSafeImage(item)}</div>
                        <h2>${item.name}</h2>
                        <p style="color:#64748b;">${(item.descriptions && item.descriptions[currentLang]) || item.description || item.region || ''}</p>
                        <label class="input-label" style="margin-top:20px;">${window.t('select_item')}</label>
                        <select id="buyer-subitem-select" style="width:100%; padding:12px; margin-top:5px; border-radius:10px; border:1px solid #e2e8f0;">
                            ${subItems.map(r => `<option value="${r.id}">${r.name} — ₼${r.price}</option>`).join('')}
                        </select>
                        <label class="input-label" style="margin-top:20px;">Select Dates</label>
                        <input type="text" id="buyer-flat" style="width:100%; padding:15px; margin-top:8px; border:1px solid #e2e8f0; border-radius:12px;">
                        <div id="price-calc" class="modal-price-calc">Total: ₼ 0.00</div>
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
                        document.getElementById('price-calc').textContent = `Total: ₼ ${price}`;
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
                    <h2 style="margin-bottom:20px;">${window.t('current_package') || 'Your Package'}</h2>
                    ${window.currentCart.length === 0
                        ? `<p style="color:#94a3b8; text-align:center; padding:30px;">${window.t('empty_cart')}</p>`
                        : window.currentCart.map(i => `<div class="cart-item"><span>${i.name}</span><b>₼ ${i.totalSellingPrice}</b></div>`).join('')}
                    <hr style="margin:20px 0;">
                    <div style="display:flex; justify-content:space-between; font-size:1.2rem; font-weight:800;"><span>${window.t('total_price')}:</span><span>₼ ${total}</span></div>
                    ${window.currentCart.length > 0 ? `<button class="btn-primary" onclick="window.processBooking('${total}')" style="width:100%; margin-top:20px; padding:15px;">${window.t('confirm_booking')}</button>` : ''}
                    <button onclick="document.getElementById('cart-modal').remove()" style="width:100%; margin-top:10px; background:none; border:none; color:#666; cursor:pointer;">${window.t('cancel')}</button>
                </div>
            </div>`);
    };

    window.processBooking = async (total) => {
        const orderId = 'ORD-' + Date.now();
        const upd = {};
        upd[`bookings/${orderId}`] = { id: orderId, buyer_uid: window.currentUserUid, totalSellingPrice: total, items: window.currentCart, createdAt: Date.now() };
        window.currentCart.forEach(item => {
            if (item.selectedDatesArray && item.subItems && item.selectedSubItemId) {
                const idx = item.subItems.findIndex(r => r.id === item.selectedSubItemId);
                if (idx !== -1) {
                    const merged = [...new Set([...(item.subItems[idx].blockedDates || []), ...item.selectedDatesArray])];
                    upd[`inventory/${item.id}/subItems/${idx}/blockedDates`] = merged;
                }
            }
        });
        await update(ref(db), upd);
        window.currentCart = [];
        document.getElementById('cart-modal')?.remove();
        window.render('showcase');
        alert(window.t('booking_success'));
    };

    // ── AUTH FORM HANDLER ──────────────────────────────────────────
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
                await set(ref(db, `users/${cred.user.uid}`), {
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

    // ── FADE IN ANIMATION ──────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `.fade-in { animation: fadeInPage 0.35s ease both; } @keyframes fadeInPage { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`;
    document.head.appendChild(style);
});