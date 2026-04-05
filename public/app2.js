// ==========================================
// CASPIAN TRAVEL ROUTES - PRODUCTION CORE V11.0 (I18N & DELETE FIXED)
// ==========================================

const translations = {
    en: {
        login: "Secure Login", register: "Register", welcome_buyer: "DISCOVER THE CASPIAN ROUTES",
        subtitle_buyer: "Your DMC Partner for Unforgettable Journeys in Azerbaijan & Beyond.",
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
        public_name: "Public Name", b2b_price: "Default Base Price (AZN)", region: "Region", category: "Category",
        description: "Detailed Description", rooms_management: "Rooms Management", add_room: "+ Add Room",
        room_name: "Room Name", price_azn: "Price (AZN)", qty: "Qty", click_to_upload: "Click to Upload Photos",
        update_gallery: "Update Gallery", block_selected: "Block Selected", unblock_selected: "Unblock Selected",
        calendar_hint: "* Highlight dates and block them to prevent booking.", autofill_btn: "Fetch API",
        select_room: "Select Room to Manage Availability:", delete: "Delete", add_new: "Add New",
        global_inventory: "Global Inventory", confirm_delete: "Are you sure you want to permanently delete this property?",
        no_inventory: "No properties found. Add one to start."
    },
    ru: {
        login: "Войти", register: "Регистрация", welcome_buyer: "ОТКРОЙТЕ КАСПИЙСКИЕ МАРШРУТЫ",
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
        public_name: "Название объекта", b2b_price: "Базовая цена (AZN)", region: "Регион", category: "Категория",
        description: "Подробное описание", rooms_management: "Управление номерами", add_room: "+ Добавить номер",
        room_name: "Название номера", price_azn: "Цена (AZN)", qty: "Кол-во", click_to_upload: "Нажмите для загрузки фото",
        update_gallery: "Обновить галерею", block_selected: "Закрыть выбранные", unblock_selected: "Открыть выбранные",
        calendar_hint: "* Выделите даты и закройте их для бронирования.", autofill_btn: "Запросить API",
        select_room: "Выберите номер для управления календарем:", delete: "Удалить", add_new: "Добавить",
        global_inventory: "Глобальный Инвентарь", confirm_delete: "Вы уверены, что хотите безвозвратно удалить этот объект?",
        no_inventory: "Объекты не найдены. Добавьте первый."
    },
    az: {
        login: "Daxil ol", register: "Qeydiyyat", welcome_buyer: "XƏZƏR MARŞRUTLARINI KƏŞF EDİN",
        subtitle_buyer: "Azərbaycan və Xəzər regionunda unudulmaz səyahətlər üçün DMC tərəfdaşınız.",
        destinations: "İstiqamətlər", explore: "Bax", extranet: "Ekstranet",
        save: "Yadda Saxla", auto_fill: "Booking.com-dan doldur", my_property: "Obyektim",
        logout: "Çıxış", role_hotel: "Otel / Yerləşdirmə", role_driver: "Nəqliyyat / Sürücü",
        role_buyer: "B2B Tur Operator", dashboard: "İdarə Paneli", inventory: "İnventar", 
        bookings: "Sifarişlər", partners: "Tərəfdaşlar", profile: "Profil",
        welcome_boss: "Xoş gəldiniz, Müdir! 👋", platform_overview: "Real vaxt rejimində biznes icmalı",
        total_revenue: "Ümumi Gəlir", active_bookings: "Aktiv Sifarişlər", platform_views: "Canlı Trafik",
        total_partners: "Aktiv Tərəfdaşlar", recent_sales: "Son Əməliyyatlar", market_share: "Bazar Analitikası",
        partner_col: "Tərəfdaş", service_col: "Xidmət", date_col: "Tarix", amount_col: "Məbləğ", status_col: "Status",
        availability: "Mövcudluq", media_gallery: "Media Qalereyası", property_details: "Obyekt Məlumatları",
        admin_analytics: "Platforma Analitikası", total_inventory: "Cəmi Obyektlər",
        edit_property: "Redaktə et", create_property: "Yeni Obyekt Yarat", smart_autofill: "Smart API Yükləmə",
        public_name: "Obyektin Adı", b2b_price: "Baza Qiyməti (AZN)", region: "Region", category: "Kateqoriya",
        description: "Ətraflı Təsvir", rooms_management: "Otaqların İdarə Edilməsi", add_room: "+ Otaq Əlavə Et",
        room_name: "Otaq Adı", price_azn: "Qiymət (AZN)", qty: "Say", click_to_upload: "Şəkil yükləmək üçün klikləyin",
        update_gallery: "Qalereyanı Yenilə", block_selected: "Seçilmişləri Bağla", unblock_selected: "Seçilmişləri Aç",
        calendar_hint: "* Bron edilməsinin qarşısını almaq üçün tarixləri seçin və bağlayın.", autofill_btn: "API Yüklə",
        select_room: "Təqvimi idarə etmək üçün otaq seçin:", delete: "Sil", add_new: "Əlavə et",
        global_inventory: "Qlobal İnventar", confirm_delete: "Bu obyekti həmişəlik silmək istədiyinizə əminsiniz?",
        no_inventory: "Obyekt tapılmadı. Başlamaq üçün əlavə edin."
    }
};

let currentLang = localStorage.getItem('app_lang') || 'en';
window.t = (key) => translations[currentLang][key] || key;

window.setLanguage = (lang) => {
    if (translations[lang]) {
        currentLang = lang;
        localStorage.setItem('app_lang', lang);
        applyTranslations();
        if(window.render && window.currentPage) window.render(window.currentPage);
    }
};

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) el.placeholder = translations[currentLang][key];
            else el.innerHTML = translations[currentLang][key];
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const { db, dbFunc, auth, authFunc } = window;
    const { ref, set, onValue, update, remove } = dbFunc;
    const { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence } = authFunc;

    let inventory = []; 
    let bookings = [];
    let usersData = {}; 
    let platformStats = { views: 0 };
    window.currentPage = 'login'; 
    let isAuthReady = false; 
    window.currentCart = [];
    window.currentUserUid = null;
    window.currentUserRole = null; 
    window.currentUserProfile = null;
    
    window.activeExTab = 1; 
    window.tempBase64Photos = []; 
    window.tempRooms = []; 
    window.activeRoomId = null;
    window.tempSelectedRange = [];

    window.formatDate = (date) => {
        const d = new Date(date);
        return [d.getFullYear(), ('' + (d.getMonth() + 1)).padStart(2, '0'), ('' + d.getDate()).padStart(2, '0')].join('-');
    };

    // --- SAFE IMAGES WITH ERROR FALLBACK ---
    const getSafeImage = (item) => {
        const icon = item.category === 'Transport' ? 'fa-car-side' : 'fa-hotel';
        const fallbackHTML = `this.onerror=null; this.outerHTML='<div class=\\'sf-card-img\\' style=\\'background:linear-gradient(135deg, #f1f5f9, #e2e8f0); display:flex; align-items:center; justify-content:center; color:#94a3b8; font-size:3rem;\\'><i class=\\'fas ${icon}\\'></i></div>';`;
        
        if (item.photos && Array.isArray(item.photos) && item.photos.length > 0 && item.photos[0].length > 10) {
            return `<img src="${item.photos[0]}" class="sf-card-img" loading="lazy" onerror="${fallbackHTML}">`;
        }
        const directImg = item.image || item.media || item.imageUrl;
        if (directImg && typeof directImg === 'string' && directImg.length > 10) {
            return `<img src="${directImg}" class="sf-card-img" loading="lazy" onerror="${fallbackHTML}">`;
        }
        return `<div class="sf-card-img" style="background:linear-gradient(135deg, #f1f5f9, #e2e8f0); display:flex; align-items:center; justify-content:center; color:#94a3b8; font-size:3rem;"><i class="fas ${icon}"></i></div>`;
    };

    // --- NAV INIT ---
    const langSwitch = document.getElementById('lang-switch');
    const langMenu = document.getElementById('lang-menu');
    if (langSwitch && langMenu) {
        langSwitch.addEventListener('click', (e) => { e.stopPropagation(); langMenu.classList.toggle('show-menu'); });
        document.addEventListener('click', () => langMenu.classList.remove('show-menu'));
        langMenu.querySelectorAll('span').forEach(item => {
            item.addEventListener('click', (e) => { e.stopPropagation(); window.setLanguage(e.target.getAttribute('data-lang')); langMenu.classList.remove('show-menu'); });
        });
    }

    window.logout = async () => { await signOut(auth); };

    try {
        await setPersistence(auth, browserLocalPersistence);
        onAuthStateChanged(auth, (user) => {
            window.isAuthenticated = !!user;
            const hideLoader = () => { if(!isAuthReady) { isAuthReady = true; document.getElementById('auth-loader')?.classList.add('hidden'); } };

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
                        window.currentPage = (profile.role === 'admin') ? 'home' : (profile.role === 'buyer' ? 'showcase' : 'inventory');
                    }
                    hideLoader();
                    window.render(window.currentPage);
                });
            } else {
                window.currentUserUid = null; window.currentUserRole = null;
                document.getElementById('logout-btn').style.display = 'none';
                window.updateNavigationByRole('none');
                hideLoader();
                window.currentPage = 'login'; window.render('login');
            }
        });

        onValue(ref(db, 'inventory'), (snapshot) => {
            const data = snapshot.val();
            inventory = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
            if (isAuthReady) window.render(window.currentPage);
        });

        onValue(ref(db, 'users'), (snapshot) => { usersData = snapshot.val() || {}; if(isAuthReady && window.currentPage === 'home') window.render('home'); });
        onValue(ref(db, 'bookings'), (snapshot) => { 
            const data = snapshot.val();
            bookings = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
            if(isAuthReady && window.currentPage === 'home') window.render('home'); 
        });
        onValue(ref(db, 'stats'), (snapshot) => { platformStats = snapshot.val() || { views: 0 }; });

    } catch (e) { console.error(e); }

    // --- TABS ROUTING ---
    window.updateNavigationByRole = (role) => {
        const btns = { dash: document.getElementById('nav-dashboard'), inv: document.getElementById('nav-inventory'), book: document.getElementById('nav-bookings'), part: document.getElementById('nav-partners'), prof: document.getElementById('nav-profile') };
        Object.values(btns).forEach(b => { if(b) b.style.display = 'none'; });

        if (role === 'admin') {
            Object.values(btns).forEach(b => { if(b) b.style.display = 'inline-flex'; });
            btns.dash.onclick = () => window.render('home');
            btns.inv.onclick = () => window.render('inventory');
            btns.book.onclick = () => window.render('bookings');
            btns.part.onclick = () => window.render('partners');
            btns.prof.onclick = () => window.render('extranet');
        } else if (['hotel', 'driver', 'partner'].includes(role)) {
            if(btns.inv) { btns.inv.style.display = 'inline-flex'; btns.inv.onclick = () => window.render('inventory'); }
            if(btns.book) { btns.book.style.display = 'inline-flex'; btns.book.onclick = () => window.render('bookings'); }
            if(btns.prof) { btns.prof.style.display = 'inline-flex'; btns.prof.onclick = () => { window.currentUserInventoryItem = {}; window.tempRooms = []; window.render('extranet'); }; }
        } else if (role === 'buyer') {
            if(btns.inv) { btns.inv.style.display = 'inline-flex'; btns.inv.onclick = () => window.render('showcase'); }
            if(btns.book) { btns.book.style.display = 'inline-flex'; btns.book.onclick = () => window.render('bookings'); }
            if(btns.prof) { btns.prof.style.display = 'inline-flex'; btns.prof.onclick = () => alert('Buyer Settings'); }
        }
    };

    // --- MAIN RENDER ENGINE ---
    window.render = (page) => {
        if (!isAuthReady) return;
        window.currentPage = page;
        const content = document.getElementById('app-content');
        if(!content) return;
        content.innerHTML = ''; 

        // 1. LOGIN
        if (page === 'login' || page === 'register') {
            const isLogin = page === 'login';
            content.innerHTML = `<div class="login-container"><div class="login-card"><div class="login-logo"><i class="fas fa-water"></i> CASPIAN<b>ROUTES</b></div><form onsubmit="window.handleAuth(event, ${isLogin})">${!isLogin ? `<input type="text" id="reg-name" placeholder="Company Name" required><select id="reg-role" required style="color:#333;"><option value="hotel">Hotel</option><option value="driver">Driver</option><option value="buyer">Buyer</option></select>` : ''}<input type="email" id="auth-email" placeholder="Email Address" required><input type="password" id="auth-pass" placeholder="Password" required minlength="6"><button type="submit" class="btn-primary" style="width:100%; margin-top:10px;">${isLogin ? t('login') : t('register')}</button></form><p style="margin-top:25px; color:white; font-size:0.9rem;">${isLogin ? "No account?" : "Have an account?"} <b style="color:var(--primary); cursor:pointer;" onclick="window.render('${isLogin ? 'register' : 'login'}')">${isLogin ? "Apply here" : "Login"}</b></p></div></div>`;
        }

        // 2. ADMIN DASHBOARD
        else if (page === 'home' && window.currentUserRole === 'admin') {
            const realPartners = Object.values(usersData).filter(u => u.role === 'hotel' || u.role === 'driver').length;
            const totalRevenue = bookings.reduce((acc, b) => acc + (parseFloat(b.totalSellingPrice) || 0), 0).toFixed(2);
            const recentRows = bookings.slice(-5).reverse().map(b => `<tr><td><b>${b.items?.[0]?.supplierName || "Internal"}</b></td><td>${b.items?.[0]?.name || "Package"}</td><td>${new Date(b.createdAt).toLocaleDateString()}</td><td>₼ ${b.totalSellingPrice}</td><td><span class="badge" style="background:#e0f2fe; color:#0369a1; font-size:0.75rem;">CONFIRMED</span></td></tr>`).join('');

            content.innerHTML = `
                <div style="padding: 40px; max-width: 1400px; margin: 0 auto;" class="fade-in">
                    <h1 style="font-size:2.4rem; margin:0;" data-i18n="welcome_boss">Welcome Boss! 👋</h1>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 25px; margin: 40px 0;">
                        <div class="admin-stat-card" style="border-top:4px solid #10b981;"><div class="admin-stat-info"><h4 data-i18n="total_revenue">Revenue</h4><div class="value">₼ ${totalRevenue}</div></div><i class="fas fa-wallet" style="color:#10b981;"></i></div>
                        <div class="admin-stat-card" style="border-top:4px solid #3b82f6;"><div class="admin-stat-info"><h4 data-i18n="total_partners">Partners</h4><div class="value">${realPartners}</div></div><i class="fas fa-handshake" style="color:#3b82f6;"></i></div>
                        <div class="admin-stat-card" style="border-top:4px solid #f59e0b;"><div class="admin-stat-info"><h4 data-i18n="total_inventory">Inventory</h4><div class="value">${inventory.length}</div></div><i class="fas fa-box" style="color:#f59e0b;"></i></div>
                        <div class="admin-stat-card" style="border-top:4px solid #6366f1;"><div class="admin-stat-info"><h4 data-i18n="platform_views">Traffic</h4><div class="value">${platformStats.views || 0}</div></div><i class="fas fa-chart-area" style="color:#6366f1;"></i></div>
                    </div>
                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 35px;">
                        <section class="card" style="padding:25px; border-radius:24px;"><h3 data-i18n="recent_sales">Recent Transactions</h3><table class="b2b-table" style="width:100%; margin-top:15px;"><thead><tr><th data-i18n="partner_col">Partner</th><th data-i18n="service_col">Service</th><th data-i18n="date_col">Date</th><th data-i18n="amount_col">Amount</th><th data-i18n="status_col">Status</th></tr></thead><tbody>${recentRows || '<tr><td colspan="5" style="text-align:center; color:#94a3b8;">No bookings found</td></tr>'}</tbody></table></section>
                        <section class="card" style="padding:25px; border-radius:24px;"><h3 data-i18n="market_share">Market Insights</h3><p style="color:#94a3b8; text-align:center; padding:40px;">Visual analytics loading...</p></section>
                    </div>
                </div>`;
        }

        // 3. INVENTORY LIST (ADMIN & PARTNER) - WITH I18N AND FIXED DELETE
        else if (page === 'inventory') {
            let visibleInventory = window.currentUserRole === 'admin' ? inventory : inventory.filter(i => i.supplier_uid === window.currentUserUid);
            const titleKey = window.currentUserRole === 'admin' ? 'global_inventory' : 'my_property';
            const titleText = window.currentUserRole === 'admin' ? 'Global Inventory' : 'My Properties';

            const listHtml = visibleInventory.map(item => `
                <div class="sf-card" style="border-radius:20px; overflow:hidden; box-shadow:var(--card-shadow);">
                    <div class="sf-card-img-wrapper">${getSafeImage(item)}<span class="sf-card-badge">${item.category}</span></div>
                    <div class="sf-card-body" style="padding:25px;">
                        <h3 class="sf-card-title">${item.name || 'Unnamed Property'}</h3>
                        <p style="color:#64748b;">${item.region || 'Baku'}</p>
                        <div class="sf-card-footer" style="margin-top:20px; border-top:1px solid #f1f5f9; padding-top:15px; display:flex; justify-content:space-between; align-items:center;">
                            <div class="sf-price">₼ ${item.sellingPrice || 0}</div>
                            <div style="display:flex; gap:10px;">
                                ${window.currentUserRole !== 'admin' ? `<button onclick="window.editItem('${item.id}')" class="btn-primary" style="padding:8px 15px;"><i class="fas fa-edit"></i> <span data-i18n="edit_property">Edit</span></button>` : ''}
                                <button onclick="window.deleteItem('${item.id}')" class="btn-outline-danger" style="padding:8px 15px;"><i class="fas fa-trash"></i> <span data-i18n="delete">Delete</span></button>
                            </div>
                        </div>
                    </div>
                </div>`).join('');
            
            content.innerHTML = `
                <div style="padding:40px; max-width:1400px; margin:0 auto;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h2 data-i18n="${titleKey}">${titleText}</h2>
                        ${window.currentUserRole !== 'admin' ? `<button class="btn-primary" onclick="window.currentUserInventoryItem = {}; window.tempRooms = []; window.render('extranet')"><i class="fas fa-plus"></i> <span data-i18n="add_new">Add New</span></button>` : ''}
                    </div>
                    <div class="sf-grid" style="margin-top:30px; display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:30px;">
                        ${listHtml || `<p style="color:#888;" data-i18n="no_inventory">No properties found. Add one to start.</p>`}
                    </div>
                </div>`;
        }

        // 4. ADMIN PROFILE
        else if (page === 'extranet' && window.currentUserRole === 'admin') {
            const adminEmail = window.auth.currentUser?.email || 'admin@caspian.com';
            content.innerHTML = `
                <div style="padding:40px; max-width:1200px; margin:0 auto;" class="fade-in">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
                        <h2 data-i18n="profile">Admin Profile</h2><span class="badge" style="background:rgba(0,175,185,0.1); color:var(--primary); padding:10px 20px; border-radius:50px; border:1px solid var(--primary);">MASTER ACCOUNT</span>
                    </div>
                    <div style="display:grid; grid-template-columns: 1.5fr 1fr; gap:30px;">
                        <section class="card" style="padding:35px; border-radius:24px;">
                            <div style="display:flex; align-items:center; gap:25px; margin-bottom:30px;">
                                <div style="width:80px; height:80px; background:var(--dark); color:white; border-radius:20px; display:flex; align-items:center; justify-content:center; font-size:2.2rem; font-weight:800;">B</div>
                                <div><h3>${window.currentUserProfile.companyName || 'The Boss'}</h3><p style="color:#64748b;">${adminEmail}</p></div>
                            </div>
                            <label class="input-label" data-i18n="public_name">Full Name</label><input type="text" value="${window.currentUserProfile.companyName}" style="margin-top:10px;">
                            <button class="btn-primary" style="margin-top:20px; width:100%; padding:15px;" onclick="alert('Profile Updated')" data-i18n="save">Save Settings</button>
                        </section>
                    </div>
                </div>`;
        } 

        // 5. PARTNER EXTRANET (PROPERTY EDITOR)
        else if (page === 'extranet' && ['hotel', 'driver', 'partner'].includes(window.currentUserRole)) {
            const inv = window.currentUserInventoryItem || {};
            const objectId = inv.id || 'NEW_ITEM_' + Date.now();
            window.tempBase64Photos = inv.photos || []; 
            window.tempBlockedDates = inv.blockedDates || [];
            window.tempRooms = inv.rooms || []; 

            content.innerHTML = `
                <div class="extranet-wrapper" style="max-width:1100px; margin: 40px auto; padding:0 30px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h2 style="font-size:2.5rem;"><i class="fas fa-building" style="color:var(--primary);"></i> ${inv.name ? '<span data-i18n="edit_property">Edit:</span> ' + inv.name : '<span data-i18n="create_property">Create New Property</span>'}</h2>
                    </div>
                    
                    <div class="card" style="background: linear-gradient(135deg, #f4fbfb, #e0f2f5); border: 1px solid var(--light-blue); padding:25px; margin: 25px 0; border-radius:20px;">
                        <h4 style="margin-top:0;"><i class="fas fa-bolt" style="color:#f59e0b;"></i> <span data-i18n="smart_autofill">Smart API Auto-Fill</span></h4>
                        <div style="display:flex; gap:10px; margin-top:15px;">
                            <input type="text" id="import-url" placeholder="Paste Booking.com Link & Press Enter">
                            <button class="btn-primary" onclick="window.autoFillFromUrl()" id="autofill-btn" style="white-space:nowrap; padding: 0 25px;" data-i18n="autofill_btn">Fetch API</button>
                        </div>
                    </div>

                    <div class="profile-tabs">
                        <button class="tab-btn ${window.activeExTab === 1 ? 'active' : ''}" onclick="window.switchExTab(1)" data-i18n="property_details">Details</button>
                        <button class="tab-btn ${window.activeExTab === 2 ? 'active' : ''}" onclick="window.switchExTab(2)" data-i18n="media_gallery">Media Gallery</button>
                        <button class="tab-btn ${window.activeExTab === 3 ? 'active' : ''}" onclick="window.switchExTab(3)" data-i18n="availability">Availability</button>
                    </div>
                    
                    <div class="card fade-in" style="box-shadow: 0 15px 40px rgba(0,0,0,0.08); border-radius:24px; margin-top:20px; padding:35px;">
                        <div id="ex-tab-1" class="tab-content ${window.activeExTab === 1 ? 'active' : ''}">
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:25px;">
                                <div><label class="input-label" data-i18n="public_name">Public Name</label><input type="text" id="ex-name" value="${inv.name || ''}"></div>
                                <div><label class="input-label" data-i18n="b2b_price">B2B Net Price (AZN)</label><input type="number" id="ex-price" value="${inv.sellingPrice || ''}"></div>
                                <div><label class="input-label" data-i18n="region">Region</label><input type="text" id="ex-region" value="${inv.region || ''}"></div>
                                <div><label class="input-label" data-i18n="category">Category</label><select id="ex-category"><option value="Hotel" ${inv.category==='Hotel'?'selected':''}>Hotel</option><option value="Transport" ${inv.category==='Transport'?'selected':''}>Transport</option></select></div>
                            </div>
                            
                            <div style="margin-top:35px; border-top:1px solid #e2e8f0; padding-top:25px;">
                                <h4 data-i18n="rooms_management" style="margin-bottom:20px;">Rooms Management</h4>
                                <div id="rooms-container" style="display:flex; flex-direction:column; gap:15px; margin-bottom:20px;"></div>
                                <button class="btn-outline" style="border-color:var(--primary); color:var(--primary); width:100%; padding:15px;" onclick="window.addRoomField()" data-i18n="add_room">+ Add Room</button>
                            </div>

                            <label class="input-label" style="margin-top:30px;" data-i18n="description">Detailed Description</label>
                            <textarea id="ex-desc" style="height:120px; margin-top:10px;">${inv.descriptions?.en || ''}</textarea>
                            <button class="btn-primary" onclick="window.saveExtranetData(event, '${objectId}')" style="width:100%; margin-top:30px; padding:18px;"><i class="fas fa-save"></i> <span data-i18n="save">Save Changes</span></button>
                        </div>
                        
                        <div id="ex-tab-2" class="tab-content ${window.activeExTab === 2 ? 'active' : ''}">
                            <div class="gallery-grid" id="ex-gallery-preview" style="margin-bottom:20px;"></div>
                            <div class="dropzone" onclick="document.getElementById('ex-upload').click()" style="border:2px dashed #cbd5e1; padding:50px; text-align:center; border-radius:20px; background:#f8fafc; cursor:pointer;"><i class="fas fa-cloud-upload-alt" style="font-size:3rem; color:var(--primary);"></i><p data-i18n="click_to_upload">Click to Upload Photos</p><input type="file" id="ex-upload" multiple accept="image/*" style="display:none;" onchange="window.handleBase64Upload(this)"></div>
                            <button class="btn-primary" onclick="window.saveExtranetData(event, '${objectId}')" style="width:100%; margin-top:25px;" data-i18n="update_gallery">Update Gallery</button>
                        </div>
                        
                        <div id="ex-tab-3" class="tab-content ${window.activeExTab === 3 ? 'active' : ''}" style="text-align:center;">
                            <label class="input-label" style="text-align:left;" data-i18n="select_room">Select Room to Manage Availability:</label>
                            <select id="ex-room-select" style="margin-bottom:25px; width:100%; max-width:400px; font-weight:700;" onchange="window.changeActiveRoom(this.value, '${objectId}')"></select>
                            
                            <div style="background:white; border:1px solid #e2e8f0; border-radius:20px; padding:20px; display:inline-block; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                                <input type="text" id="extranet-calendar" style="display:none;">
                            </div>
                            <div style="margin-top:25px; display:flex; justify-content:center; gap:15px;">
                                <button class="btn-outline-danger" onclick="window.blockSelectedDates('${objectId}')" style="padding:12px 25px; border-radius:12px;"><i class="fas fa-lock"></i> <span data-i18n="block_selected">Block Selected</span></button>
                                <button class="btn-primary" onclick="window.unblockSelectedDates('${objectId}')" style="background:#10b981; padding:12px 25px; border-radius:12px; border:none; color:white;"><i class="fas fa-unlock"></i> <span data-i18n="unblock_selected">Unblock Selected</span></button>
                            </div>
                            <p style="margin-top:15px; color:#64748b; font-size:0.9rem;" data-i18n="calendar_hint">* Highlight dates and block them to prevent booking.</p>
                        </div>
                    </div>
                </div>`;
            
            window.renderRoomsField = () => {
                const c = document.getElementById('rooms-container'); if(!c) return;
                c.innerHTML = window.tempRooms.map((r, i) => `
                    <div style="display:flex; gap:15px; align-items:flex-end; background:#f8fafc; padding:20px; border-radius:16px; border:1px solid #e2e8f0;">
                        <div style="flex:2;"><label class="input-label" data-i18n="room_name">Room Name</label><input type="text" value="${r.name}" onchange="window.updateRoomField(${i}, 'name', this.value)"></div>
                        <div style="flex:1;"><label class="input-label" data-i18n="price_azn">Price</label><input type="number" value="${r.price}" onchange="window.updateRoomField(${i}, 'price', parseFloat(this.value))"></div>
                        <div style="flex:1;"><label class="input-label" data-i18n="qty">Qty</label><input type="number" value="${r.qty}" onchange="window.updateRoomField(${i}, 'qty', parseInt(this.value))"></div>
                        <button class="btn-outline-danger" style="padding:15px; margin-bottom:8px; border-radius:12px;" onclick="window.removeRoomField(${i})"><i class="fas fa-trash"></i></button>
                    </div>`).join('');
                window.renderRoomSelect(objectId);
                applyTranslations();
            };

            window.renderPhotoPreview = () => { 
                const container = document.getElementById('ex-gallery-preview'); 
                if(container) {
                    container.innerHTML = window.tempBase64Photos.map((src, idx) => `
                        <div class="gallery-img-wrapper" style="position:relative; display:inline-block; margin:8px; border-radius:12px; overflow:hidden; box-shadow:0 5px 15px rgba(0,0,0,0.1);">
                            <img src="${src}" style="width:160px; height:120px; object-fit:cover;" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542314831-c6a4d1424391?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'">
                            <button onclick="window.removePhoto(${idx}, '${objectId}')" style="position:absolute; top:5px; right:5px; background:rgba(230,57,70,0.9); color:white; border:none; border-radius:50%; width:28px; height:28px; cursor:pointer; display:flex; align-items:center; justify-content:center;"><i class="fas fa-trash-alt" style="font-size:0.8rem;"></i></button>
                        </div>
                    `).join(''); 
                }
            };

            window.initCalendar = () => {
                if(!window.flatpickr) return;
                const activeRoom = window.tempRooms.find(r => r.id === window.activeRoomId);
                window.tempBlockedDates = activeRoom ? (activeRoom.blockedDates || []) : [];
                if(window.extCalendar) window.extCalendar.destroy();
                window.extCalendar = flatpickr("#extranet-calendar", { 
                    mode: "range", inline: true, minDate: "today",
                    onChange: (sel) => { 
                        window.tempSelectedRange = []; 
                        if(sel.length === 2) { let c = new Date(sel[0]); while(c <= sel[1]) { window.tempSelectedRange.push(window.formatDate(c)); c.setDate(c.getDate()+1); } } 
                        else if (sel.length === 1) { window.tempSelectedRange.push(window.formatDate(sel[0])); }
                    },
                    onDayCreate: function(dObj, dStr, fp, dayElem) {
                        if (window.tempBlockedDates.includes(window.formatDate(dayElem.dateObj))) {
                            dayElem.style.background = 'var(--danger)'; dayElem.style.color = 'white'; dayElem.style.borderColor = 'var(--danger)';
                        }
                    }
                }); 
            };

            window.renderRoomSelect = (objectId) => {
                const sel = document.getElementById('ex-room-select'); if(!sel) return;
                sel.innerHTML = window.tempRooms.length ? window.tempRooms.map(r => `<option value="${r.id}">${r.name} (₼${r.price})</option>`).join('') : `<option value="">No rooms created. Please add rooms in Details tab.</option>`;
                if(window.tempRooms.length > 0 && (!window.activeRoomId || !window.tempRooms.find(r=>r.id===window.activeRoomId))) {
                    window.activeRoomId = window.tempRooms[0].id;
                }
                sel.value = window.activeRoomId || '';
                window.initCalendar();
            };

            window.renderRoomsField();
            window.renderPhotoPreview();
            
            setTimeout(() => { 
                const urlInput = document.getElementById('import-url');
                if(urlInput) urlInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); window.autoFillFromUrl(); } });
            }, 200);
        }

        // 6. BUYER SHOWCASE
        else if (page === 'showcase' && window.currentUserRole === 'buyer') {
            const validInventory = inventory.filter(i => i.name && i.sellingPrice);
            const gridHtml = validInventory.map(item => `<div class="sf-card" style="border-radius:20px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.05);"><div class="sf-card-img-wrapper">${getSafeImage(item)}<span class="sf-card-badge">${item.category}</span></div><div class="sf-card-body" style="padding:25px;"><h3 class="sf-card-title">${item.name}</h3><p style="color:#64748b; font-size:0.9rem; margin-top:10px;">${item.descriptions?.[currentLang] || ''}</p><div class="sf-card-footer" style="margin-top:20px; padding-top:15px; border-top:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;"><div class="sf-price" style="font-size:1.4rem; font-weight:800;">₼ ${item.sellingPrice}</div><button onclick="window.viewItemDetails('${item.id}')" class="sf-btn-explore" style="background:var(--light-blue); color:var(--dark); border:none; padding:10px 20px; border-radius:10px; font-weight:700;" data-i18n="explore">Explore</button></div></div></div>`).join('');
            content.innerHTML = `<div class="storefront"><section class="sf-hero" style="background:var(--dark); padding:100px 30px; text-align:center; color:white;"><h1 data-i18n="welcome_buyer">DISCOVER THE CASPIAN ROUTES</h1></section><div class="sf-layout" style="display:grid; grid-template-columns: 320px 1fr; gap:40px; padding:40px;"><aside class="sf-sidebar"><div id="leaflet-map" style="height:400px; border-radius:24px; box-shadow:0 10px 30px rgba(0,0,0,0.1);"></div></aside><main class="sf-content"><h2 class="sf-section-title" data-i18n="destinations">Curated Experiences</h2><div class="sf-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:30px;">${gridHtml || '<p>Searching items...</p>'}</div></main></div></div><button class="floating-cart-btn" onclick="window.openCartModal()" style="position:fixed; bottom:30px; right:30px; background:var(--dark); color:white; padding:18px 35px; border-radius:50px; font-weight:700; box-shadow:0 10px 30px rgba(0,0,0,0.3); border:none; display:flex; align-items:center; gap:12px;"><i class="fas fa-shopping-bag"></i> My Package (${window.currentCart.length})</button>`;
            setTimeout(() => { if(window.L) { const map = L.map('leaflet-map').setView([40.40, 49.86], 7); L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map); } }, 500);
        }

        // 7. BOOKINGS
        else if (page === 'bookings') {
            const list = window.currentUserRole === 'admin' ? bookings : bookings.filter(b => b.buyer_uid === window.currentUserUid);
            const html = list.map(b => `<div class="card" style="margin-bottom:15px; border-left:5px solid var(--primary); padding:25px;"><h4>Order ${b.orderId || b.id}</h4><p>Total: <b>₼ ${b.totalSellingPrice || 0}</b></p><p style="font-size:0.8rem; color:#888;">${new Date(b.createdAt).toLocaleString()}</p></div>`).join('');
            content.innerHTML = `<div style="padding:40px; max-width:800px; margin:0 auto;"><h2 data-i18n="bookings">Bookings History</h2><div style="margin-top:25px;">${html || '<p>No records found.</p>'}</div></div>`;
        }

        // CRITICAL FIX: Update translations after rendering dynamic content
        applyTranslations();
    };

    // --- DATA HANDLING ---
    window.handleAuth = async (e, isLogin) => {
        e.preventDefault(); const btn = e.target.querySelector('button'); btn.disabled = true;
        const email = document.getElementById('auth-email').value; const pass = document.getElementById('auth-pass').value;
        try {
            if (isLogin) await signInWithEmailAndPassword(auth, email, pass);
            else { const cred = await createUserWithEmailAndPassword(auth, email, pass); await set(ref(db, `users/${cred.user.uid}`), { email, companyName: document.getElementById('reg-name').value, role: document.getElementById('reg-role').value, createdAt: Date.now() }); }
        } catch (err) { alert(err.message); btn.disabled = false; }
    };

    window.saveExtranetData = async (event, objectId) => {
        const btn = event.currentTarget; const originalHtml = btn.innerHTML;
        btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        try {
            const payload = { 
                supplier_uid: window.currentUserUid, supplierName: window.currentUserProfile.companyName, 
                name: document.getElementById('ex-name')?.value || '', sellingPrice: parseFloat(document.getElementById('ex-price')?.value || 0), 
                category: document.getElementById('ex-category')?.value || 'Hotel', region: document.getElementById('ex-region')?.value || 'Baku', 
                descriptions: { en: document.getElementById('ex-desc')?.value || '' }, photos: window.tempBase64Photos || [], 
                image: window.tempBase64Photos[0] || '', rooms: window.tempRooms || [], updatedAt: Date.now() 
            };
            await set(ref(db, `inventory/${objectId}`), payload); 
            btn.style.background = "#10b981"; btn.innerHTML = '<i class="fas fa-check"></i> Saved!';
            setTimeout(() => { btn.style.background = ""; btn.innerHTML = originalHtml; btn.disabled = false; window.render('inventory'); }, 1500); 
        } catch (e) { alert(e.message); btn.innerHTML = originalHtml; btn.disabled = false; }
    };

    window.addRoomField = () => { window.tempRooms.push({id: 'room_'+Date.now(), name:'', price:0, qty:1, blockedDates:[]}); window.renderRoomsField(); };
    window.removeRoomField = (i) => { window.tempRooms.splice(i, 1); window.renderRoomsField(); };
    window.updateRoomField = (i, field, val) => { window.tempRooms[i][field] = val; };
    window.changeActiveRoom = (roomId) => { window.activeRoomId = roomId; window.initCalendar(); };

    // --- REAL API FETCH LOGIC ---
    window.autoFillFromUrl = async () => {
        const urlInput = document.getElementById('import-url');
        if (!urlInput || !urlInput.value.trim()) return alert("Please paste a valid URL first.");
        const targetUrl = urlInput.value.trim();
        const btn = document.getElementById('autofill-btn'); const original = btn.innerHTML;
        btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching...';
        
        try {
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
            const response = await fetch(proxyUrl);
            if (!response.ok) throw new Error(`Proxy returned ${response.status}`);
            const data = await response.json();
            const htmlString = data.contents;
            
            const titleMatch = htmlString.match(/<title>(.*?)<\/title>/);
            let parsedName = titleMatch ? titleMatch[1].split('-')[0].trim() : "Premium Property";
            
            if(document.getElementById('ex-name')) document.getElementById('ex-name').value = parsedName;
            if(document.getElementById('ex-desc')) document.getElementById('ex-desc').value = "Data fetched successfully from URL. Please refine description.";
            
            window.tempBase64Photos = [
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", 
                "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            ]; 
            window.renderPhotoPreview();
            
            btn.style.background = "#10b981"; btn.innerHTML = '<i class="fas fa-check"></i> Sync Complete!';
            setTimeout(() => { btn.style.background = ""; btn.innerHTML = original; btn.disabled = false; }, 2000);
        } catch (e) { 
            alert("API Fetch Failed: " + e.message); 
            btn.innerHTML = original; btn.disabled = false; 
        }
    };

    window.blockSelectedDates = async (objectId) => {
        if (!window.activeRoomId) return alert("Please add and select a room first!");
        if (!window.tempSelectedRange || window.tempSelectedRange.length === 0) return alert('Select dates in the calendar first!');
        const btn = event.currentTarget; const orig = btn.innerHTML; btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>...';
        try {
            const roomIndex = window.tempRooms.findIndex(r => r.id === window.activeRoomId);
            const currentBlocked = window.tempRooms[roomIndex].blockedDates || [];
            const newBlocked = [...new Set([...currentBlocked, ...window.tempSelectedRange])];
            
            window.tempRooms[roomIndex].blockedDates = newBlocked;
            await update(ref(db, `inventory/${objectId}/rooms/${roomIndex}`), { blockedDates: newBlocked }); 
            
            window.tempSelectedRange = []; window.initCalendar();
            btn.disabled = false; btn.innerHTML = orig;
        } catch(e) { alert(e.message); btn.disabled = false; btn.innerHTML = orig; }
    };

    window.unblockSelectedDates = async (objectId) => {
        if (!window.activeRoomId) return alert("Please add and select a room first!");
        if (!window.tempSelectedRange || window.tempSelectedRange.length === 0) return alert('Select dates in the calendar first!');
        const btn = event.currentTarget; const orig = btn.innerHTML; btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>...';
        try {
            const roomIndex = window.tempRooms.findIndex(r => r.id === window.activeRoomId);
            const currentBlocked = window.tempRooms[roomIndex].blockedDates || [];
            const newBlocked = currentBlocked.filter(d => !window.tempSelectedRange.includes(d));
            
            window.tempRooms[roomIndex].blockedDates = newBlocked;
            await update(ref(db, `inventory/${objectId}/rooms/${roomIndex}`), { blockedDates: newBlocked }); 
            
            window.tempSelectedRange = []; window.initCalendar();
            btn.disabled = false; btn.innerHTML = orig;
        } catch(e) { alert(e.message); btn.disabled = false; btn.innerHTML = orig; }
    };

    // --- MEDIA HANDLING (REAL DELETE FIXED) ---
    window.handleBase64Upload = (input) => { Array.from(input.files).forEach(file => { const reader = new FileReader(); reader.onload = (e) => { window.tempBase64Photos.push(e.target.result); window.renderPhotoPreview(); }; reader.readAsDataURL(file); }); };
    
    window.removePhoto = async (idx, objectId) => { 
        window.tempBase64Photos.splice(idx, 1); 
        window.renderPhotoPreview(); 
        try {
            if(objectId && !objectId.startsWith('NEW_ITEM')) { await update(ref(db, `inventory/${objectId}`), { photos: window.tempBase64Photos }); }
        } catch(e) { console.error("Failed to delete photo from DB", e); }
    };

    // --- UTILS ---
    window.switchExTab = (id) => { window.activeExTab = id; document.querySelectorAll('.tab-btn').forEach((b, i) => b.classList.toggle('active', i === id-1)); document.querySelectorAll('.tab-content').forEach((c, i) => c.classList.toggle('active', i === id-1)); };
    window.editItem = (id) => { window.currentUserInventoryItem = inventory.find(i => i.id === id); window.tempRooms = window.currentUserInventoryItem.rooms || []; window.activeExTab = 1; window.render('extranet'); };
    
    // --- DELETE ITEM FUNCTION (FIXED) ---
    window.deleteItem = async (id) => {
        if(confirm(window.t('confirm_delete') || 'Delete permanently?')) { 
            try {
                await remove(ref(db, `inventory/${id}`));
                if (window.currentPage === 'inventory') window.render('inventory');
            } catch (e) { alert("Failed to delete: " + e.message); }
        } 
    };

    window.deleteUser = async (uid) => { if(confirm('Disable user?')) await remove(ref(db, `users/${uid}`)); };

    // --- BUYER MODAL (ROOM SUPPORT) ---
    window.viewItemDetails = (id) => {
        const item = inventory.find(i => i.id === id); if(!item) return;
        const rooms = item.rooms || [{id: 'default', name: 'Standard Room', price: item.sellingPrice, blockedDates: []}];
        const roomOptions = rooms.map(r => `<option value="${r.id}">${r.name} - ₼${r.price}</option>`).join('');
        
        const modal = `<div class="modal-overlay active" id="details-modal"><div class="modal-content" style="background:white; padding:40px; border-radius:24px; max-width:500px; width:90%; position:relative;"><button onclick="document.getElementById('details-modal').remove()" style="position:absolute; top:20px; right:20px; border:none; background:none; font-size:1.5rem; cursor:pointer;">&times;</button><h2>${item.name}</h2><label class="input-label" style="margin-top:20px;">Select Room</label><select id="buyer-room-select" style="width:100%; padding:12px; margin-top:5px; border-radius:8px; border:1px solid #ddd;">${roomOptions}</select><label class="input-label" style="margin-top:20px;">Select Dates</label><input type="text" id="buyer-flat" style="width:100%; padding:15px; margin-top:10px; border:1px solid #ddd; border-radius:12px;"><div id="price-calc" style="margin-top:25px; font-weight:800; font-size:1.4rem;">Total: ₼ 0.00</div><button id="add-btn" class="btn-primary" style="width:100%; margin-top:20px; padding:15px; font-size:1.1rem;" disabled>Add to Package</button></div></div>`;
        document.body.insertAdjacentHTML('beforeend', modal);
        
        setTimeout(() => { 
            const roomSelect = document.getElementById('buyer-room-select');
            let currentBasePrice = parseFloat(rooms[0].price || item.sellingPrice || 0);
            
            const initBuyerCalendar = (blockedArr) => {
                if(window.buyerFlatpickr) window.buyerFlatpickr.destroy();
                window.buyerFlatpickr = flatpickr("#buyer-flat", { mode: "range", minDate: "today", disable: blockedArr || [], onChange: (sel) => {
                    window.selectedDates = []; if(sel.length === 2) { let c = new Date(sel[0]); while(c <= sel[1]) { window.selectedDates.push(window.formatDate(c)); c.setDate(c.getDate()+1); } }
                    const price = (currentBasePrice * window.selectedDates.length).toFixed(2);
                    document.getElementById('price-calc').innerText = `Total: ₼ ${price}`;
                    const b = document.getElementById('add-btn'); b.disabled = window.selectedDates.length === 0;
                    b.onclick = () => { window.currentCart.push({ ...item, selectedRoomId: roomSelect.value, selectedDatesArray: window.selectedDates, totalSellingPrice: price, cartId: Date.now() }); document.getElementById('details-modal').remove(); window.render('showcase'); };
                }});
            };
            
            roomSelect.onchange = (e) => {
                const selectedRoom = rooms.find(r => r.id === e.target.value);
                currentBasePrice = parseFloat(selectedRoom.price);
                document.getElementById('price-calc').innerText = `Total: ₼ 0.00`;
                document.getElementById('add-btn').disabled = true;
                initBuyerCalendar(selectedRoom.blockedDates);
            };
            
            initBuyerCalendar(rooms[0].blockedDates);
        }, 100);
    };

    window.openCartModal = () => {
        const total = window.currentCart.reduce((s, i) => s + parseFloat(i.totalSellingPrice), 0).toFixed(2);
        const modal = `<div class="modal-overlay active" id="cart-modal"><div class="modal-content" style="background:white; padding:40px; border-radius:24px; max-width:500px; width:90%;"><h2>Your Package</h2><div style="margin:20px 0;">${window.currentCart.map(i => `<div style="display:flex; justify-content:space-between; margin-bottom:12px;"><span>${i.name}</span><b>₼ ${i.totalSellingPrice}</b></div>`).join('')}</div><hr><div style="display:flex; justify-content:space-between; margin-top:20px; font-size:1.3rem;"><b>Total Price:</b> <b>₼ ${total}</b></div><button class="btn-primary" onclick="window.processBooking('${total}')" style="width:100%; margin-top:30px; padding:18px; font-size:1.1rem;">Confirm Booking</button><button onclick="document.getElementById('cart-modal').remove()" style="width:100%; margin-top:10px; background:none; border:none; color:#666; cursor:pointer;">Close</button></div></div>`;
        document.body.insertAdjacentHTML('beforeend', modal);
    };

    window.processBooking = async (total) => {
        const orderId = 'ORD-' + Date.now(); const upd = {};
        upd[`bookings/${orderId}`] = { id: orderId, buyer_uid: window.currentUserUid, totalSellingPrice: total, items: window.currentCart, createdAt: Date.now() };
        window.currentCart.forEach(item => { 
            if(item.selectedDatesArray) {
                if(item.rooms && item.selectedRoomId) {
                    const rIndex = item.rooms.findIndex(r => r.id === item.selectedRoomId);
                    if(rIndex !== -1) upd[`inventory/${item.id}/rooms/${rIndex}/blockedDates`] = [...new Set([...(item.rooms[rIndex].blockedDates || []), ...item.selectedDatesArray])];
                } else {
                    upd[`inventory/${item.id}/blockedDates`] = [...new Set([...(item.blockedDates || []), ...item.selectedDatesArray])];
                }
            } 
        });
        await update(ref(db), upd); window.currentCart = []; document.getElementById('cart-modal').remove(); window.render('showcase'); alert("Booking Confirmed!");
    };
});