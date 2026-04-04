import { calculateDashboardStats } from './analytics.js';

// 1. ВСТРОЕННЫЕ СЛОВАРИ (i18n)
const translations = {
    en: {
        dashboard: "Dashboard", inventory: "Inventory", nav_bookings: "Bookings",
        nav_partners: "Partners", nav_profile: "Profile", nav_login: "Login", logout: "Logout",
        welcome: "Welcome, Boss! 🤝", total_volume: "Total Volume (Net)", saved_commissions: "Saved Commissions",
        add_service: "Add Service", add_partner: "Add Account", partners_list: "User Management",
        company_name: "Company Name", role: "Role", actions: "Actions", disable: "Disable",
        hotel: "Hotel", transport: "Transport", activity: "Activity", search_placeholder: "Search...",
        select_dates: "Manage Available Dates", save_details: "Save Details",
        commercial_terms: "Commercial Terms", empty_cart: "Package is empty!", confirm_booking: "Confirm Booking",
        booking_success: "Booking successful!"
    },
    ru: {
        dashboard: "Дашборд", inventory: "Инвентарь", nav_bookings: "Бронирования",
        nav_partners: "Партнеры", nav_profile: "Профиль", nav_login: "Вход", logout: "Выйти",
        welcome: "Добро Пожаловать, Босс! 🤝", total_volume: "Общий Объем (Нетто)", saved_commissions: "Сэкономленная Комиссия",
        add_service: "Добавить Услугу", add_partner: "Создать Аккаунт", partners_list: "Управление Пользователями",
        company_name: "Название Компании", role: "Роль", actions: "Действия", disable: "Отключить",
        hotel: "Отель", transport: "Транспорт", activity: "Активность", search_placeholder: "Поиск...",
        select_dates: "Управление Доступными Датами", save_details: "Сохранить Настройки",
        commercial_terms: "Коммерческие Условия", empty_cart: "Пакет пуст!", confirm_booking: "Подтвердить Заказ",
        booking_success: "Заказ успешно создан!"
    },
    az: {
        dashboard: "Panel", inventory: "İnventar", nav_bookings: "Sifarişlər",
        nav_partners: "Tərəfdaşlar", nav_profile: "Profil", nav_login: "Giriş", logout: "Çıxış",
        welcome: "Xoş Gəldiniz, Müdir! 🤝", total_volume: "Ümumi Həcm (Net)", saved_commissions: "Qənaət Edilmiş Komissiya",
        add_service: "Xidmət Əlavə Et", add_partner: "Hesab Yarat", partners_list: "İstifadəçi İdarəetməsi",
        company_name: "Şirkətin Adı", role: "Rol", actions: "Əməliyyatlar", disable: "Deaktiv et",
        hotel: "Otel", transport: "Nəqliyyat", activity: "Fəaliyyət", search_placeholder: "Axtarış...",
        select_dates: "Mövcud Tarixləri İdarə Et", save_details: "Yadda Saxla",
        commercial_terms: "Kommersiya Şərtləri", empty_cart: "Paket boşdur!", confirm_booking: "Sifarişi Təsdiqlə",
        booking_success: "Sifariş uğurla yaradıldı!"
    }
};

let currentLang = localStorage.getItem('app_lang') || 'en';
window.t = (key) => translations[currentLang][key] || key;

window.setLanguage = (lang) => {
    if (translations[lang]) {
        currentLang = lang;
        localStorage.setItem('app_lang', lang);
        applyTranslations();
        window.render(window.currentPage);
    }
};

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                el.placeholder = translations[currentLang][key];
            } else {
                el.innerHTML = translations[currentLang][key];
            }
        }
    });
}

function loadFlatpickr() {
    if (!document.getElementById('flatpickr-css')) {
        const link = document.createElement('link');
        link.id = 'flatpickr-css'; link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
        document.head.appendChild(link);
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
        document.body.appendChild(script);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    loadFlatpickr(); 
    applyTranslations();

    const { db, dbFunc, auth, authFunc, storage, storageFunc } = window;
    const { ref, push, set, onValue, remove, update } = dbFunc;
    const { signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence } = authFunc;
    const { storageRef, uploadBytes, getDownloadURL } = storageFunc || {};

    let inventory = []; 
    let bookings = []; 
    let partners = []; 
    let searchQuery = ""; 
    window.currentPage = 'home'; 
    let isAuthReady = false; 

    window.currentCart = window.currentCart || [];
    window.bookingFilter = 'All';
    window.regionFilter = 'All';
    window.starsFilter = 'All';
    
    window.currentUserUid = null;
    window.currentUserRole = null;
    window.currentUserProfile = null;

    const langBtn = document.getElementById('langBtn');
    const langMenu = document.getElementById('langMenu');
    if (langBtn && langMenu) {
        langBtn.addEventListener('click', (e) => { e.stopPropagation(); langMenu.classList.toggle('show-menu'); });
        document.addEventListener('click', () => langMenu.classList.remove('show-menu'));
        langMenu.querySelectorAll('span').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                window.setLanguage(e.target.getAttribute('data-lang'));
                langMenu.classList.remove('show-menu');
            });
        });
    }

    window.updateNavigationByRole = (role) => {
        const navHome = document.getElementById('nav-home');
        const navInv = document.getElementById('nav-inventory');
        const navBook = document.getElementById('nav-bookings');
        const navPart = document.getElementById('nav-partners');
        const navProf = document.getElementById('nav-profile');
        const logoutCont = document.getElementById('logout-container');

        if (role === 'admin') {
            if(navHome) navHome.style.display = 'flex';
            if(navInv) navInv.style.display = 'flex';
            if(navBook) navBook.style.display = 'flex';
            if(navPart) navPart.style.display = 'flex';
            if(navProf) navProf.style.display = 'flex';
        } else if (role === 'partner') {
            if(navHome) navHome.style.display = 'none'; 
            if(navInv) navInv.style.display = 'none'; 
            if(navBook) navBook.style.display = 'none'; 
            if(navPart) navPart.style.display = 'none'; 
            if(navProf) navProf.style.display = 'flex';
        } else if (role === 'buyer') {
            if(navHome) navHome.style.display = 'none';
            if(navInv) navInv.style.display = 'none';
            if(navBook) navBook.style.display = 'flex'; 
            if(navPart) navPart.style.display = 'none';
            if(navProf) navProf.style.display = 'flex';
        }
        if (role && logoutCont) logoutCont.style.display = 'block';
    };

    window.render = (page) => { window.currentPage = page; renderInternal(page); };

    window.logout = async () => { 
        try { await signOut(auth); window.render('login'); } 
        catch (e) { console.error("Logout error:", e); }
    };

    window.login = async function(e) {
        if (e) e.preventDefault(); 
        const emailInput = document.getElementById('email-field');
        const passInput = document.getElementById('pass-field');
        if (!emailInput || !passInput) return; 
        try { await signInWithEmailAndPassword(auth, emailInput.value.trim(), passInput.value.trim()); } 
        catch (error) { alert("Access Denied: " + error.message); }
    };

    try {
        await setPersistence(auth, browserLocalPersistence);
        onAuthStateChanged(auth, (user) => {
            window.isAuthenticated = !!user;
            if (user) {
                window.currentUserUid = user.uid;
                onValue(ref(db, `users/${user.uid}`), (snapshot) => {
                    let profile = snapshot.val();
                    if (!profile) {
                        profile = { role: 'buyer', companyName: 'Tour Operator', is_verified: false, partnerType: 'Hotel' };
                        set(ref(db, `users/${user.uid}`), profile);
                    }
                    window.currentUserRole = profile.role || 'buyer';
                    window.currentUserProfile = profile;
                    window.updateNavigationByRole(window.currentUserRole);
                    
                    const loginBtn = document.getElementById('nav-login');
                    if (loginBtn) loginBtn.style.display = 'none';

                    if (window.currentPage === 'login') {
                        if (window.currentUserRole === 'admin') window.currentPage = 'home';
                        else if (window.currentUserRole === 'partner') window.currentPage = 'profile'; 
                        else window.currentPage = 'bookings'; 
                    }
                    
                    if (!isAuthReady) {
                        isAuthReady = true;
                        document.getElementById('auth-loader')?.classList.add('hidden'); 
                    }
                    renderInternal(window.currentPage);
                });
            } else {
                window.currentUserUid = null; window.currentUserRole = null; window.currentUserProfile = null;
                document.getElementById('logout-container')?.style.setProperty('display', 'none');
                if (!isAuthReady) { isAuthReady = true; document.getElementById('auth-loader')?.classList.add('hidden'); }
                window.currentPage = 'login'; renderInternal('login');
            }
        });

        // Слушатель для админской таблицы (ИСПРАВЛЕНО)
        onValue(ref(db, 'users'), (snapshot) => {
            const data = snapshot.val();
            if(data) {
                partners = Object.keys(data).map(key => ({ id: key, ...data[key] }));
            } else { partners = []; }
            if (isAuthReady && window.currentPage === 'partners') renderInternal('partners');
        });

        onValue(ref(db, 'inventory'), (snapshot) => {
            const data = snapshot.val();
            inventory = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
            if (window.currentUserRole === 'partner') {
                window.currentUserInventoryItem = inventory.find(x => x.supplier_uid === window.currentUserUid) || {};
            }
            if (isAuthReady) renderInternal(window.currentPage);
        });

        onValue(ref(db, 'bookings'), (snapshot) => {
            const data = snapshot.val();
            bookings = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
            if (isAuthReady && ['home', 'profile'].includes(window.currentPage)) renderInternal(window.currentPage);
        });

    } catch (e) { console.error("Firebase error:", e); }

    window.setFilter = (filter) => { currentFilter = filter; window.render('inventory'); };
    window.setBookingFilter = (filter) => { window.bookingFilter = filter; window.render('bookings'); };
    window.setRegionFilter = (val) => { window.regionFilter = val; window.render(window.currentPage); };
    window.setStarsFilter = (val) => { window.starsFilter = val; window.render(window.currentPage); };
    window.editItem = (id) => { window.showForm(inventory.find(x => x.id === id)); };
    window.deleteItem = async (id) => { 
        if(confirm('Delete this service?')) { try { await remove(ref(db, `inventory/${id}`)); } catch(e) { console.error(e); } } 
    };
    window.deleteUserAccount = async (uid) => {
        if(confirm('Are you sure you want to disable this account?')) { try { await remove(ref(db, `users/${uid}`)); } catch(e) { console.error(e); } }
    };

    function renderInternal(page) {
        if (!isAuthReady) return; 
        const content = document.getElementById('app-content');
        if (!content) return;

        if (!window.isAuthenticated && page !== 'login') { page = 'login'; window.currentPage = 'login'; }

        content.innerHTML = ''; 

        document.querySelector('.bottom-nav').style.display = page === 'login' ? 'none' : 'flex';
        document.querySelectorAll('.nav-links-container button').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.getElementById(`nav-${page}`);
        if (activeBtn) activeBtn.classList.add('active');

        const dynamicHeader = document.getElementById('dynamic-header-actions');
        if (dynamicHeader) {
            if (page === 'inventory' && window.currentUserRole === 'admin') {
                dynamicHeader.innerHTML = `<button class="btn-primary" onclick="window.showForm();" style="padding: 6px 14px; border-radius:8px; font-size: 0.85rem;"><i class="fas fa-plus"></i> <span data-i18n="add_service">Add Service</span></button>`;
            } else if (page === 'partners' && window.currentUserRole === 'admin') {
                dynamicHeader.innerHTML = `<button class="btn-primary" onclick="window.showPartnerForm();" style="padding: 6px 14px; border-radius:8px; font-size: 0.85rem;"><i class="fas fa-user-plus"></i> <span data-i18n="add_partner">Add Account</span></button>`;
            } else {
                dynamicHeader.innerHTML = '';
            }
        }

        if (page === 'home' && window.currentUserRole === 'admin') {
            setTimeout(() => calculateDashboardStats(), 50);
            content.innerHTML = `
                <div style="padding:15px 15px 100px 15px;">
                    <h2 style="margin-bottom:8px; font-size: 2rem;" data-i18n="welcome">Welcome, Boss! 🤝</h2>
                    <p style="color:#888;">Global Platform Statistics</p>
                    <div class="metric-container" style="margin-top: 25px;">
                        <div class="card metric-card" style="border: 2px solid #27ae60;">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                                <div>
                                    <div style="font-size:0.75rem; font-weight:700; color:#888;" data-i18n="saved_commissions">Saved B2B Commissions</div>
                                    <div class="savings-text" style="font-size:2.2rem; font-weight:800; color:#27ae60; margin:5px 0; display:inline-block;">...</div>
                                </div>
                                <div style="width:48px; height:48px; background:#e8f5e9; border-radius:12px; display:flex; align-items:center; justify-content:center; color:#27ae60; font-size:1.4rem;"><i class="fas fa-piggy-bank"></i></div>
                            </div>
                        </div>
                        <div class="card metric-card">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                                <div>
                                    <div style="font-size:0.75rem; font-weight:700; color:#888;" data-i18n="total_volume">Total Volume (Net)</div>
                                    <div id="metric-volume" style="font-size:2.2rem; font-weight:800; color:var(--dark); margin:5px 0; display:inline-block;">...</div>
                                </div>
                                <div style="width:48px; height:48px; background:#e0f7f9; border-radius:12px; display:flex; align-items:center; justify-content:center; color:var(--primary); font-size:1.4rem;"><i class="fas fa-wallet"></i></div>
                            </div>
                        </div>
                    </div>
                    <div class="metric-container">
                        <div class="card metric-card">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                                <div>
                                    <div style="font-size:0.75rem; font-weight:700; color:#888;">Total Inventory</div>
                                    <div style="font-size:2.2rem; font-weight:800; margin:5px 0;">${inventory.length}</div>
                                </div>
                                <div style="width:48px; height:48px; background:#fef5e7; border-radius:12px; display:flex; align-items:center; justify-content:center; color:#f39c12; font-size:1.4rem;"><i class="fas fa-box-open"></i></div>
                            </div>
                        </div>
                    </div>
                </div>`;
        }

        else if (page === 'inventory' && window.currentUserRole === 'admin') {
            let filteredInventory = inventory;
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                filteredInventory = filteredInventory.filter(x => (x.name || '').toLowerCase().includes(q) || (x.supplierName || '').toLowerCase().includes(q));
            }
            if (currentFilter !== 'All') filteredInventory = filteredInventory.filter(x => x.category === currentFilter);
            if (window.regionFilter !== 'All') filteredInventory = filteredInventory.filter(x => x.region === window.regionFilter);
            if (window.starsFilter !== 'All') filteredInventory = filteredInventory.filter(x => x.stars === window.starsFilter);

            const listHtml = filteredInventory.map(item => {
                const sellP = parseFloat(item.sellingPrice || item.price || 0);
                let coverImage = item.image || "baku_night.jpg"; 
                let badgeClass = item.category === 'Hotel' ? 'badge-hotel' : (item.category === 'Transport' ? 'badge-transport' : 'badge-activity');
                const verifiedBadge = item.is_verified ? `<i class="fas fa-shield-alt verified-icon" title="Verified Partner" style="color:#27ae60;"></i>` : '';

                let hotelMeta = '';
                if (item.category === 'Hotel' && item.region) {
                    const starString = item.stars === 'Unrated' ? t('unrated') : '⭐'.repeat(parseInt(item.stars) || 0);
                    hotelMeta = `<div style="font-size:0.85rem; color:#f39c12; margin-top:4px; font-weight:600;">${starString} <span style="color:#888; font-weight:400;">| ${t(item.region?.toLowerCase()) || item.region}</span></div>`;
                }

                return `
                <div class="tour-card fade-in">
                    <div style="position: relative;">
                        <img src="${coverImage}" loading="lazy" class="tour-image" onerror="this.style.opacity='0'; this.style.backgroundColor='#f0f2f5';">
                        <div style="position:absolute; top:16px; left:16px;"><span class="badge ${badgeClass}">${t(item.category?.toLowerCase()) || item.category}</span></div>
                        <div style="position:absolute; bottom:-16px; right:16px; background:var(--dark); color:white; padding:8px 20px; border-radius:25px; box-shadow:0 4px 15px rgba(0,0,0,0.15); z-index: 2;">
                            <span class="price-tag" style="color:white; font-size:1.2rem;">${item.currency==='AZN'?'₼':'$'}${sellP}</span>
                        </div>
                    </div>
                    <div class="tour-card-content">
                        <div style="font-size:0.75rem; color:#888; text-transform:uppercase; font-weight:700;">${item.supplierName || 'Caspian Direct'} ${verifiedBadge}</div>
                        <h3 style="margin:4px 0 0 0;">${item.name}</h3>
                        ${hotelMeta}
                        <div style="margin-top:10px;"></div>
                        <div style="background:#f8f9fa; padding:10px 12px; border-radius:8px; margin-top:auto; font-size:0.85rem; display:flex; justify-content:space-between; border: 1px solid #e1e4e8;">
                            <span style="color:#555;">${t('net_label') || 'Net'}: <b style="color:#e74c3c;">${item.netCost || 0}</b></span>
                            <span style="font-weight:700; color:#27ae60;">${t('margin_label') || 'Margin'}: ${item.markup || 0}%</span>
                        </div>
                        <div style="display:flex; gap:10px; margin-top:15px;">
                            <button onclick="window.editItem('${item.id}')" class="btn-action btn-edit" style="flex:1;"><i class="fas fa-pen"></i></button>
                            <button onclick="window.deleteItem('${item.id}')" class="btn-action btn-delete" style="flex:1;"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                </div>`
            }).join('');

            content.innerHTML = `
                <div style="padding:15px 15px 100px 15px;">
                    <h2 style="margin:0 0 15px 0;" data-i18n="inventory">Inventory</h2>
                    <div class="filter-bar">
                        <button class="filter-btn ${currentFilter === 'All' ? 'active' : ''}" onclick="window.setFilter('All')">All</button>
                        <button class="filter-btn ${currentFilter === 'Hotel' ? 'active' : ''}" onclick="window.setFilter('Hotel')">${t('hotel')}</button>
                        <button class="filter-btn ${currentFilter === 'Transport' ? 'active' : ''}" onclick="window.setFilter('Transport')">${t('transport')}</button>
                        <button class="filter-btn ${currentFilter === 'Activity' ? 'active' : ''}" onclick="window.setFilter('Activity')">${t('activity')}</button>
                    </div>
                    <div style="display:flex; gap:10px; margin-bottom: 20px; flex-wrap: wrap;">
                        <div style="flex: 1 1 100%; position:relative;">
                            <i class="fas fa-search" style="position:absolute; left:16px; top:18px; color:#aaa;"></i>
                            <input type="text" id="search-input" data-i18n="search_placeholder" placeholder="Search..." value="${searchQuery}" style="padding-left:45px; margin-top:0;">
                        </div>
                    </div>

                    <div id="tours-list">${listHtml || '<p style="text-align:center; color:#888; margin-top:30px;">No items found</p>'}</div>
                    
                    <div style="margin-top: 40px; text-align: center; border-top: 1px dashed #ccc; padding-top: 20px;">
                        <button id="seed-btn" class="btn-primary" style="margin: 0 auto; background: #34495e; padding: 15px 30px;" onclick="window.seedDatabase()">
                            <i class="fas fa-database"></i> Seed Mock Data
                        </button>
                    </div>
                </div>`;
            
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                if (searchQuery.length > 0) {
                    searchInput.focus();
                    searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
                }
                searchInput.addEventListener('input', (e) => {
                    const val = e.target.value;
                    if (!val) { searchQuery = ""; window.render('inventory'); return; }
                    if (window.searchTimeout) clearTimeout(window.searchTimeout);
                    window.searchTimeout = setTimeout(() => { searchQuery = val; window.render('inventory'); }, 300);
                });
            }
        }

        else if (page === 'bookings' && (window.currentUserRole === 'buyer' || window.currentUserRole === 'admin')) {
            let filteredForBooking = inventory;
            
            if (window.bookingFilter !== 'All') filteredForBooking = inventory.filter(x => x.category === window.bookingFilter);
            if (window.regionFilter !== 'All') filteredForBooking = filteredForBooking.filter(x => x.region === window.regionFilter);
            if (window.starsFilter !== 'All') filteredForBooking = filteredForBooking.filter(x => x.stars === window.starsFilter);

            const leftHtml = filteredForBooking.map(item => {
                const sellP = parseFloat(item.sellingPrice || item.price || 0);
                let hotelMeta = '';
                if (item.category === 'Hotel' && item.region) {
                    const starString = item.stars === 'Unrated' ? t('unrated') : '⭐'.repeat(parseInt(item.stars) || 0);
                    hotelMeta = `<div style="font-size:0.75rem; color:#f39c12;">${starString} | ${t(item.region?.toLowerCase()) || item.region}</div>`;
                }

                return `
                <div class="card" style="padding:15px; display:flex; justify-content:space-between; align-items:center; gap:10px; border-left: 4px solid var(--primary); cursor:pointer; transition:0.2s;" onclick="window.viewItemDetails('${item.id}')" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                    <div>
                        <div style="font-size:0.75rem; color:#888; font-weight:700;">${t(item.category?.toLowerCase()) || item.category} | ${item.supplierName || ''}</div>
                        <h4 style="margin:4px 0;">${item.name}</h4>
                        ${hotelMeta}
                        <div style="color:var(--dark); font-weight:800; margin-top:4px;">${item.currency==='AZN'?'₼':'$'}${sellP} / day</div>
                    </div>
                    <button class="btn-primary" style="padding:10px 15px; border-radius:8px; font-size:0.85rem;"><i class="fas fa-search"></i> Select</button>
                </div>`;
            }).join('');

            let totalSelling = 0; let totalNet = 0;
            const cartHtml = window.currentCart.map(cartItem => {
                totalSelling += parseFloat(cartItem.sellingPrice || cartItem.price || 0);
                totalNet += parseFloat(cartItem.netCost || 0);
                return `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #eee;">
                    <div style="flex:1;">
                        <div style="font-weight:600; font-size:0.9rem;">${cartItem.name}</div>
                        <div style="font-size:0.8rem; color:#888;"><i class="far fa-calendar-alt"></i> ${cartItem.selectedDate} • ${cartItem.currency==='AZN'?'₼':'$'}${cartItem.sellingPrice || cartItem.price || 0}</div>
                    </div>
                    <button onclick="window.removeFromCart('${cartItem.cartId}')" class="btn-action btn-delete" style="padding:6px 10px; border-radius:6px;"><i class="fas fa-times"></i></button>
                </div>`;
            }).join('');

            content.innerHTML = `
                <div style="padding:15px; display:flex; flex-wrap:wrap; gap:25px; padding-bottom:100px;">
                    <div style="flex: 1 1 55%; min-width:300px;">
                        <h2 style="margin-bottom:15px;" data-i18n="nav_bookings">Tour Builder</h2>
                        <div class="filter-bar" style="margin-bottom:15px;">
                            <button class="filter-btn ${window.bookingFilter === 'All' ? 'active' : ''}" onclick="window.setBookingFilter('All')">All</button>
                            <button class="filter-btn ${window.bookingFilter === 'Hotel' ? 'active' : ''}" onclick="window.setBookingFilter('Hotel')">${t('hotel')}</button>
                            <button class="filter-btn ${window.bookingFilter === 'Transport' ? 'active' : ''}" onclick="window.setBookingFilter('Transport')">${t('transport')}</button>
                            <button class="filter-btn ${window.bookingFilter === 'Activity' ? 'active' : ''}" onclick="window.setBookingFilter('Activity')">${t('activity')}</button>
                        </div>
                        
                        <div style="display:flex; gap:10px; margin-bottom: 20px;">
                            <div style="flex: 1;">
                                <select id="filter-region" style="margin-top:0;" onchange="window.setRegionFilter(this.value)">
                                    <option value="All" ${window.regionFilter === 'All' ? 'selected' : ''}>${t('all_regions') || 'All Regions'}</option>
                                    <option value="Baku" ${window.regionFilter === 'Baku' ? 'selected' : ''}>${t('baku') || 'Baku'}</option>
                                    <option value="Gabala" ${window.regionFilter === 'Gabala' ? 'selected' : ''}>${t('gabala') || 'Gabala'}</option>
                                    <option value="Qusar" ${window.regionFilter === 'Qusar' ? 'selected' : ''}>${t('qusar') || 'Qusar'}</option>
                                    <option value="Sheki" ${window.regionFilter === 'Sheki' ? 'selected' : ''}>${t('sheki') || 'Sheki'}</option>
                                    <option value="Lankaran" ${window.regionFilter === 'Lankaran' ? 'selected' : ''}>${t('lankaran') || 'Lankaran'}</option>
                                </select>
                            </div>
                            <div style="flex: 1;">
                                <select id="filter-stars" style="margin-top:0;" onchange="window.setStarsFilter(this.value)">
                                    <option value="All" ${window.starsFilter === 'All' ? 'selected' : ''}>${t('all_stars') || 'All Stars'}</option>
                                    <option value="3" ${window.starsFilter === '3' ? 'selected' : ''}>3 ⭐</option>
                                    <option value="4" ${window.starsFilter === '4' ? 'selected' : ''}>4 ⭐</option>
                                    <option value="5" ${window.starsFilter === '5' ? 'selected' : ''}>5 ⭐</option>
                                </select>
                            </div>
                        </div>

                        <div style="display:flex; flex-direction:column; gap:10px;">
                            ${leftHtml || '<p style="color:#888; text-align:center; padding:20px;">No items match your criteria.</p>'}
                        </div>
                    </div>

                    <div style="flex: 1 1 35%; min-width:300px;">
                        <div class="card" style="position:sticky; top:90px;">
                            <h3 style="border-bottom:2px solid #f0f2f5; padding-bottom:10px; margin-top:0;" data-i18n="current_package">Current Package</h3>
                            <div style="min-height:100px; max-height:40vh; overflow-y:auto; margin-bottom:20px;">
                                ${cartHtml || `<p style="color:#aaa; text-align:center; margin-top:30px; font-size:0.9rem;" data-i18n="empty_cart">Package is empty!</p>`}
                            </div>
                            <div style="background:#f8f9fa; padding:15px; border-radius:12px; margin-bottom:15px;">
                                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                                    <span style="color:#555;" data-i18n="total_price">Total Price</span>
                                    <span style="font-weight:800; color:var(--dark); font-size:1.1rem;">₼ ${totalSelling.toFixed(2)}</span>
                                </div>
                                ${window.currentUserRole === 'admin' ? `
                                <div style="display:flex; justify-content:space-between; border-top:1px dashed #ccc; padding-top:5px; margin-top:5px;">
                                    <span style="color:#888; font-size:0.85rem;" data-i18n="net_price">Net Cost</span>
                                    <span style="color:#e74c3c; font-weight:700; font-size:0.85rem;">₼ ${totalNet.toFixed(2)}</span>
                                </div>` : ''}
                            </div>
                            <button id="checkout-btn" class="save-btn" onclick="window.processBooking()" ${window.currentCart.length === 0 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                                <i class="fas fa-check-circle" style="margin-right:8px;"></i> <span data-i18n="confirm_booking">Confirm Booking</span>
                            </button>
                        </div>
                    </div>
                </div>`;
        }

        else if (page === 'partners' && window.currentUserRole === 'admin') {
            const partnerRows = partners
                .filter(p => p.id !== window.currentUserUid)
                .map(p => {
                    let badgeClass = p.role === 'partner' ? 'badge-hotel' : 'badge-activity';
                    let roleLabel = p.role === 'partner' ? `Supplier (${p.partnerType || 'Hotel'})` : 'B2B Buyer';
                    return `
                    <tr>
                        <td><strong>${p.companyName || p.name || 'Unnamed'}</strong></td>
                        <td>${p.email}</td>
                        <td><span class="badge ${badgeClass}">${roleLabel}</span></td>
                        <td style="text-align:right;">
                            <button onclick="window.deleteUserAccount('${p.id}')" class="btn-action btn-delete" style="padding:8px 12px; display:inline-flex;">
                                <i class="fas fa-ban"></i> <span data-i18n="disable">Disable</span>
                            </button>
                        </td>
                    </tr>`
                }).join('');

            content.innerHTML = `
                <div style="padding:15px 15px 100px 15px; max-width: 1000px; margin: 0 auto;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
                        <h2 style="margin:0;" data-i18n="partners_list">User Management</h2>
                    </div>
                    <div style="overflow-x:auto;">
                        <table class="b2b-table">
                            <thead>
                                <tr>
                                    <th data-i18n="company_name">Company Name</th>
                                    <th>Email</th>
                                    <th data-i18n="role">Role</th>
                                    <th style="text-align:right;" data-i18n="actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${partnerRows || '<tr><td colspan="4" style="text-align:center; padding:20px; color:#888;">No users found</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>`;
        }
        
        else if (page === 'profile') {
            const profile = window.currentUserProfile || {};
            
            if (window.currentUserRole === 'admin' || window.currentUserRole === 'buyer') {
                content.innerHTML = `
                <div style="padding:40px 20px; max-width: 600px; margin: 0 auto; text-align:center;">
                    <h2 style="margin:0 0 20px 0; color:#1a1a1a; font-family:'Montserrat', sans-serif;">${window.currentUserRole === 'admin' ? 'Welcome, Boss! 🤝' : 'Buyer Profile'}</h2>
                    <div class="card" style="padding:40px; border-radius:24px;">
                        <i class="fas fa-user-tie" style="font-size: 4rem; color: var(--primary); margin-bottom: 15px;"></i>
                        <h3>${profile.companyName || 'User Account'}</h3>
                        <p style="color:#666;">Access Level: ${window.currentUserRole.toUpperCase()}</p>
                    </div>
                </div>`;
            } 
            else {
                // EXTRANET DASHBOARD
                const pType = profile.partnerType || 'Hotel';
                const isDriver = pType === 'Transport';
                const badgeTitle = isDriver ? 'Verified Driver' : 'Verified Partner';
                const titleDesc = isDriver ? 'Car Specifications' : 'Hotel Description';
                const titlePhoto = isDriver ? 'Car Photos' : 'Hotel Photos';

                let verifiedHtml = profile.is_verified 
                    ? `<span style="color:#27ae60; font-size:0.9rem; margin-left:10px; display:inline-flex; align-items:center; gap:5px;"><i class="fas fa-shield-alt"></i> <strong>${badgeTitle}</strong></span>` 
                    : '';

                let partnerRevenue = 0; let partnerOrdersCount = 0;
                bookings.forEach(order => {
                    if (order.status !== 'cancelled' && order.items) {
                        let hasMyItem = false;
                        order.items.forEach(item => {
                            if (item.supplier_uid === window.currentUserUid) {
                                hasMyItem = true;
                                partnerRevenue += parseFloat(item.sellingPrice || item.price || 0);
                            }
                        });
                        if (hasMyItem) partnerOrdersCount++;
                    }
                });

                const invItem = window.currentUserInventoryItem || {};
                const amAir = invItem.amenities?.air_conditioning ? 'checked' : '';
                const amWifi = invItem.amenities?.free_wifi ? 'checked' : '';
                const amBath = invItem.amenities?.private_bathroom ? 'checked' : '';
                const amBalc = invItem.amenities?.balcony ? 'checked' : '';
                const amTv = invItem.amenities?.tv ? 'checked' : '';
                const amMini = invItem.amenities?.minibar ? 'checked' : '';

                const existingPhotosHtml = (invItem.photos || []).map((url, idx) => `
                    <div class="gallery-img-wrapper">
                        <img src="${url}" loading="lazy">
                        <button class="delete-photo-btn" onclick="window.deleteExtranetPhoto(${idx})" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                `).join('');

                content.innerHTML = `
                    <div style="padding:20px 20px 100px 20px; max-width: 1000px; margin: 0 auto;">
                        <div style="margin-bottom: 30px;">
                            <h2 style="margin:0 0 5px 0; color:#1a1a1a; font-size:1.8rem;">Welcome to Extranet, ${profile.companyName || 'Partner'}!</h2>
                            <p style="color:#888; margin:0;">Manage your inventory, availability and profile here.</p>
                        </div>

                        <div class="metric-container" style="margin-bottom: 40px;">
                            <div class="card metric-card">
                                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                                    <div>
                                        <div style="font-size:0.75rem; font-weight:700; color:#888; text-transform:uppercase;">Upcoming Bookings</div>
                                        <div style="font-size:2.2rem; font-weight:800; margin:5px 0;">${partnerOrdersCount}</div>
                                    </div>
                                    <div style="width:48px; height:48px; background:#fef5e7; border-radius:12px; display:flex; align-items:center; justify-content:center; color:#f39c12; font-size:1.4rem;"><i class="far fa-calendar-check"></i></div>
                                </div>
                            </div>
                            <div class="card metric-card">
                                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                                    <div>
                                        <div style="font-size:0.75rem; font-weight:700; color:#888; text-transform:uppercase;">Total Revenue</div>
                                        <div style="font-size:2.2rem; font-weight:800; color:#27ae60; margin:5px 0;">₼ ${partnerRevenue.toFixed(2)}</div>
                                    </div>
                                    <div style="width:48px; height:48px; background:#e8f5e9; border-radius:12px; display:flex; align-items:center; justify-content:center; color:#27ae60; font-size:1.4rem;"><i class="fas fa-hand-holding-usd"></i></div>
                                </div>
                            </div>
                        </div>

                        <div class="card" style="padding:25px; margin-bottom:25px; background: linear-gradient(135deg, #f0f8fa, #e0f2f5); border: 1px solid #bce4e8;">
                            <h3 style="margin-top:0; color: var(--dark);"><i class="fas fa-magic"></i> Auto-fill from Booking.com / Expedia</h3>
                            <p style="font-size:0.9rem; color:#555; margin-bottom:15px;">Paste your property URL to instantly import descriptions, amenities, and high-quality photos.</p>
                            <div style="display:flex; gap:10px;">
                                <input type="text" id="import-url" placeholder="https://www.booking.com/hotel/az/..." style="flex:1; margin:0;">
                                <button class="btn-primary" onclick="window.autoFillFromUrl()" id="autofill-btn" style="padding: 0 25px;"><i class="fas fa-bolt"></i> Auto-Fill</button>
                            </div>
                        </div>

                        <div class="profile-tabs">
                            <button class="tab-btn active" id="tab-btn-1" onclick="window.switchProfileTab(1)"><i class="fas fa-building"></i> Details & Amenities</button>
                            <button class="tab-btn" id="tab-btn-2" onclick="window.switchProfileTab(2)"><i class="fas fa-images"></i> Media Gallery</button>
                            <button class="tab-btn" id="tab-btn-3" onclick="window.switchProfileTab(3)"><i class="far fa-calendar-alt"></i> Availability Calendar</button>
                        </div>
                        
                        <div class="card" style="padding: 30px; border-radius: 16px; margin:0;">
                            
                            <div id="tab-1" class="tab-content active">
                                <label class="input-label" style="display:flex; align-items:center;">Company Name ${verifiedHtml}</label>
                                <input type="text" id="prof-name-input" value="${profile.companyName || ''}" style="font-weight:600;">
                                
                                <div style="display:flex; gap:15px;">
                                    <div style="flex:1;">
                                        <label class="input-label">Business Type</label>
                                        <select id="prof-type" onchange="window.saveProfileType(this.value)">
                                            <option value="Hotel" ${pType === 'Hotel' ? 'selected' : ''}>Hotel / Accommodation</option>
                                            <option value="Transport" ${pType === 'Transport' ? 'selected' : ''}>Transport / Driver</option>
                                        </select>
                                    </div>
                                    <div style="flex:1;">
                                        <label class="input-label">Cancellation Policy</label>
                                        <select id="prof-cancel-policy">
                                            <option value="Flexible" ${profile.cancelPolicy === 'Flexible' ? 'selected' : ''}>Flexible (Free up to 24h)</option>
                                            <option value="Standard" ${profile.cancelPolicy === 'Standard' ? 'selected' : ''}>Standard (Free up to 3 days)</option>
                                            <option value="Strict" ${profile.cancelPolicy === 'Strict' ? 'selected' : ''}>Strict (100% Penalty)</option>
                                        </select>
                                    </div>
                                </div>

                                <div style="display:flex; gap:15px; margin-top:10px;">
                                    <div style="flex:1;"><label class="input-label">VÖEN / Tax ID</label><input type="text" id="prof-voen" value="${profile.voen || ''}"></div>
                                    <div style="flex:1;"><label class="input-label">Bank IBAN</label><input type="text" id="prof-iban" value="${profile.iban || ''}"></div>
                                </div>
                                
                                <h4 style="margin-top: 25px; margin-bottom:15px; color:#333; border-top: 1px solid #f0f2f5; padding-top:20px;">Facilities & Description</h4>
                                
                                <label class="input-label">Room / Car Size (sq.m / seats)</label>
                                <input type="text" id="prof-room-size" value="${profile.roomSize || ''}" placeholder="e.g. 25 sq.m">

                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top:15px; margin-bottom:20px;">
                                    <div class="amenity-item">
                                        <div class="amenity-info"><i class="fas fa-snowflake" style="color:var(--primary);"></i> Air Conditioning</div>
                                        <label class="toggle-switch"><input type="checkbox" id="am-air" ${amAir}><span class="slider"></span></label>
                                    </div>
                                    <div class="amenity-item">
                                        <div class="amenity-info"><i class="fas fa-wifi" style="color:var(--primary);"></i> Free WiFi</div>
                                        <label class="toggle-switch"><input type="checkbox" id="am-wifi" ${amWifi}><span class="slider"></span></label>
                                    </div>
                                    <div class="amenity-item">
                                        <div class="amenity-info"><i class="fas fa-bath" style="color:var(--primary);"></i> Private Bathroom</div>
                                        <label class="toggle-switch"><input type="checkbox" id="am-bath" ${amBath}><span class="slider"></span></label>
                                    </div>
                                    <div class="amenity-item">
                                        <div class="amenity-info"><i class="fas fa-city" style="color:var(--primary);"></i> Balcony / View</div>
                                        <label class="toggle-switch"><input type="checkbox" id="am-balc" ${amBalc}><span class="slider"></span></label>
                                    </div>
                                    <div class="amenity-item">
                                        <div class="amenity-info"><i class="fas fa-tv" style="color:var(--primary);"></i> Flat-screen TV</div>
                                        <label class="toggle-switch"><input type="checkbox" id="am-tv" ${amTv}><span class="slider"></span></label>
                                    </div>
                                    <div class="amenity-item">
                                        <div class="amenity-info"><i class="fas fa-glass-martini-alt" style="color:var(--primary);"></i> Mini-bar</div>
                                        <label class="toggle-switch"><input type="checkbox" id="am-mini" ${amMini}><span class="slider"></span></label>
                                    </div>
                                </div>

                                <label class="input-label" style="margin-bottom:10px;">Property Description (Multilingual)</label>
                                <div class="lang-tabs">
                                    <button class="lang-tab-btn active" onclick="window.switchLangTab('en')" type="button">🇬🇧 EN</button>
                                    <button class="lang-tab-btn" onclick="window.switchLangTab('ru')" type="button">🇷🇺 RU</button>
                                    <button class="lang-tab-btn" onclick="window.switchLangTab('az')" type="button">🇦🇿 AZ</button>
                                </div>
                                <textarea id="prof-desc-en" class="lang-desc-field active" style="height: 100px;" placeholder="English description...">${profile.descriptions?.en || ''}</textarea>
                                <textarea id="prof-desc-ru" class="lang-desc-field" style="height: 100px;" placeholder="Описание на русском...">${profile.descriptions?.ru || ''}</textarea>
                                <textarea id="prof-desc-az" class="lang-desc-field" style="height: 100px;" placeholder="Azərbaycan dilində təsvir...">${profile.descriptions?.az || ''}</textarea>

                                <button class="save-btn" onclick="window.saveExtranetDetails()" style="margin-top: 30px;">
                                    <i class="fas fa-save"></i> Save Details & Amenities
                                </button>
                            </div>

                            <div id="tab-2" class="tab-content">
                                <h4 style="margin-top: 0; color:#333;">${titlePhoto} (Max: 5)</h4>
                                
                                <div class="gallery-grid" id="extranet-gallery-container">
                                    ${existingPhotosHtml}
                                </div>

                                <div style="border: 2px dashed #00afb9; border-radius: 12px; padding: 40px 20px; text-align: center; background: rgba(0, 175, 185, 0.03); position: relative; cursor: pointer; transition: 0.2s; margin-top:20px;">
                                    <i class="fas fa-cloud-upload-alt" style="font-size: 3rem; color: #00afb9; margin-bottom: 15px;"></i>
                                    <p style="margin: 0; font-size: 1rem; color: #333; font-weight: 600;">Drag & Drop to add new photos</p>
                                    <input type="file" id="extranet-photos" multiple accept="image/*" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;" onchange="window.previewExtranetPhotos(this)">
                                </div>
                                <div id="extranet-photos-preview" style="display:flex; gap:10px; margin-top:10px; font-weight:600; color:var(--primary);"></div>
                                
                                <button id="upload-photos-btn" class="save-btn" onclick="window.uploadExtranetPhotos()" style="margin-top: 20px; display:none;">
                                    <i class="fas fa-upload"></i> Upload Selected Photos
                                </button>
                            </div>

                            <div id="tab-3" class="tab-content">
                                <p style="color:#666; font-size:0.9rem; margin-bottom: 20px;">Select dates to mark them as AVAILABLE for B2B buyers.</p>
                                <input type="text" id="extranet-calendar" placeholder="Loading calendar..." style="background:white; cursor:pointer; width:100%; padding:15px; border-radius:12px; border:1px solid #ddd;">
                                <button class="save-btn" onclick="window.saveExtranetDates()" style="margin-top: 25px;">
                                    <i class="fas fa-save"></i> Save Availability
                                </button>
                            </div>
                        </div>
                    </div>`;

                // ИНИЦИАЛИЗАЦИЯ FLATPICKR
                setTimeout(() => {
                    if (window.flatpickr) {
                        const existingDates = invItem.availableDates || [];
                        window.extranetDatePicker = flatpickr("#extranet-calendar", {
                            mode: "multiple",
                            dateFormat: "Y-m-d",
                            minDate: "today",
                            defaultDate: existingDates,
                            inline: true,
                            onChange: function(selectedDates, dateStr, instance) {
                                window.tempSelectedDates = dateStr ? dateStr.split(', ') : [];
                            }
                        });
                        window.tempSelectedDates = existingDates;
                    }
                }, 100);
            }
        }
        else if (page === 'login') {
            content.innerHTML = `
                <div class="login-container">
                    <div class="login-card">
                        <div class="login-logo">CASPIAN<b>DMC</b></div>
                        <form onsubmit="window.login(event)">
                            <input type="email" id="email-field" placeholder="Email Address" required>
                            <input type="password" id="pass-field" placeholder="Password" required>
                            <button type="submit" class="login-btn" data-i18n="nav_login">Secure Login</button>
                        </form>
                    </div>
                </div>`;
        }

        applyTranslations();
    }

    // ЛОГИКА ЭКСТРАНЕТА 
    window.switchProfileTab = (tabId) => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(`tab-btn-${tabId}`).classList.add('active');
        document.getElementById(`tab-${tabId}`).classList.add('active');
    };

    window.switchLangTab = (lang) => {
        const btns = document.querySelectorAll('.lang-tab-btn');
        const fields = document.querySelectorAll('.lang-desc-field');
        btns.forEach(b => b.classList.remove('active'));
        fields.forEach(f => f.classList.remove('active'));
        event.target.classList.add('active');
        document.getElementById(`prof-desc-${lang}`).classList.add('active');
    };

    window.autoFillFromUrl = () => {
        const url = document.getElementById('import-url').value;
        if(!url) return alert("Please enter a valid URL!");
        const btn = document.getElementById('autofill-btn');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Parsing...';
        btn.disabled = true;

        setTimeout(() => {
            const nameInput = document.getElementById('prof-name-input');
            if(nameInput) nameInput.value = "Grand Premium Hotel Baku";

            document.getElementById('prof-room-size').value = "45";
            document.getElementById('am-air').checked = true;
            document.getElementById('am-wifi').checked = true;
            document.getElementById('am-bath').checked = true;
            document.getElementById('am-tv').checked = true;
            document.getElementById('am-mini').checked = true;

            document.getElementById('prof-desc-en').value = "Experience luxury in the heart of Baku. Featuring premium amenities, stunning city views, and world-class service.";
            document.getElementById('prof-desc-ru').value = "Ощутите роскошь в самом сердце Баку. Премиальные удобства, потрясающий вид на город и сервис мирового класса.";
            document.getElementById('prof-desc-az').value = "Bakının qəlbində lüksü yaşayın. Premium rahatlıqlar, heyrətamiz şəhər mənzərəsi və dünya səviyyəli xidmət.";

            window.mockScrapedPhotos = [
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            ];

            const preview = document.getElementById('extranet-photos-preview');
            if(preview) preview.innerHTML = `<span style="color:#27ae60;"><i class="fas fa-check"></i> Found ${window.mockScrapedPhotos.length} high-quality images. Save profile to apply.</span>`;
            
            btn.innerHTML = '<i class="fas fa-check"></i> Success!';
            setTimeout(() => { btn.innerHTML = '<i class="fas fa-bolt"></i> Auto-Fill'; btn.disabled = false; }, 2000);
        }, 1500);
    };

    window.saveProfileType = async (type) => {
        try { await update(ref(db, `users/${window.currentUserUid}`), { partnerType: type }); } catch(e) {}
    };

    window.saveExtranetDetails = async () => {
        const compName = document.getElementById('prof-name-input').value.trim();
        const voen = document.getElementById('prof-voen').value.trim();
        const iban = document.getElementById('prof-iban').value.trim();
        const cancelPolicy = document.getElementById('prof-cancel-policy') ? document.getElementById('prof-cancel-policy').value : 'Standard';
        const roomSize = document.getElementById('prof-room-size') ? document.getElementById('prof-room-size').value.trim() : '';
        
        const descEn = document.getElementById('prof-desc-en').value.trim();
        const descRu = document.getElementById('prof-desc-ru').value.trim();
        const descAz = document.getElementById('prof-desc-az').value.trim();
        
        const amenitiesObj = {
            air_conditioning: document.getElementById('am-air')?.checked || false,
            free_wifi: document.getElementById('am-wifi')?.checked || false,
            private_bathroom: document.getElementById('am-bath')?.checked || false,
            balcony: document.getElementById('am-balc')?.checked || false,
            tv: document.getElementById('am-tv')?.checked || false,
            minibar: document.getElementById('am-mini')?.checked || false,
        };
        
        const saveBtn = document.querySelector('#tab-1 .save-btn');
        const origHtml = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; saveBtn.disabled = true;

        try {
            await update(ref(db, `users/${window.currentUserUid}`), {
                companyName: compName, voen: voen, iban: iban, cancelPolicy: cancelPolicy, roomSize: roomSize,
                descriptions: { en: descEn, ru: descRu, az: descAz }
            });
            
            let finalPhotos = [...(window.currentUserInventoryItem?.photos || [])];
            if (window.mockScrapedPhotos && window.mockScrapedPhotos.length > 0) {
                finalPhotos = window.mockScrapedPhotos; window.mockScrapedPhotos = []; 
            }

            let invId = window.currentUserInventoryItem?.id || window.currentUserUid; 

            const invData = {
                supplier_uid: window.currentUserUid, supplierName: compName, name: compName,
                category: window.currentUserProfile.partnerType || 'Hotel',
                is_verified: window.currentUserProfile.is_verified || false,
                amenities: amenitiesObj, descriptions: { en: descEn, ru: descRu, az: descAz },
                photos: finalPhotos, image: finalPhotos[0] || '', currency: "AZN"
            };

            await update(ref(db, `inventory/${invId}`), invData);
            alert("Settings Saved Successfully!");
        } catch(e) {
            alert("Error: " + e.message);
        } finally {
            saveBtn.innerHTML = origHtml; saveBtn.disabled = false;
        }
    };

    window.previewExtranetPhotos = function(input) {
        const preview = document.getElementById('extranet-photos-preview');
        const btn = document.getElementById('upload-photos-btn');
        if (input.files.length > 5) {
            alert("Max 5 photos!"); input.value = ''; preview.innerHTML = ''; btn.style.display = 'none'; return;
        }
        if (input.files.length > 0) {
            preview.innerHTML = `<i class="fas fa-check"></i> ${input.files.length} file(s) ready to upload`;
            btn.style.display = 'block';
        }
    };

    window.uploadExtranetPhotos = async () => {
        const fileInput = document.getElementById('extranet-photos');
        if (!fileInput.files.length) return;
        const btn = document.getElementById('upload-photos-btn');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...'; btn.disabled = true;

        let currentPhotos = window.currentUserInventoryItem?.photos || [];
        let invId = window.currentUserInventoryItem?.id || window.currentUserUid;
        
        try {
            for (let file of fileInput.files) {
                const imgRef = storageRef(storage, `partners/${window.currentUserUid}/${Date.now()}_${file.name}`);
                const uploadResult = await uploadBytes(imgRef, file);
                const url = await getDownloadURL(uploadResult.ref);
                currentPhotos.push(url);
            }
            
            await update(ref(db, `inventory/${invId}`), { supplier_uid: window.currentUserUid, photos: currentPhotos, image: currentPhotos[0] || '' });
            alert("Photos uploaded successfully!");
        } catch (e) {
            alert("Upload failed: " + e.message);
        } finally {
            btn.innerHTML = '<i class="fas fa-upload"></i> Upload Selected Photos'; btn.disabled = false;
            fileInput.value = ''; document.getElementById('extranet-photos-preview').innerHTML = ''; btn.style.display = 'none';
        }
    };

    window.deleteExtranetPhoto = async (index) => {
        if(!confirm('Delete this photo?')) return;
        let currentPhotos = window.currentUserInventoryItem?.photos || [];
        currentPhotos.splice(index, 1);
        let invId = window.currentUserInventoryItem?.id || window.currentUserUid;
        try { await update(ref(db, `inventory/${invId}`), { supplier_uid: window.currentUserUid, photos: currentPhotos, image: currentPhotos[0] || '' }); } 
        catch (e) { console.error(e); }
    };

    window.saveExtranetDates = async () => {
        const btn = document.querySelector('#tab-3 .save-btn');
        const origHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; btn.disabled = true;
        try {
            let invId = window.currentUserInventoryItem?.id || window.currentUserUid;
            await update(ref(db, `inventory/${invId}`), { supplier_uid: window.currentUserUid, availableDates: window.tempSelectedDates || [] });
            alert("Availability Updated!");
        } catch(e) { alert("Error saving dates: " + e.message); } 
        finally { btn.innerHTML = origHtml; btn.disabled = false; }
    };

    // АДМИН - УПРАВЛЕНИЕ УСЛУГАМИ
    window.showForm = function(data = {}) {
        const existingModal = document.getElementById('tour-modal');
        if (existingModal) existingModal.remove();
        
        window.calculatePrice = () => {
            const netField = document.getElementById('xalis-input');
            const marginField = document.getElementById('marja-input');
            const sellingField = document.getElementById('satis-input');
            if (!netField || !marginField || !sellingField) return;
            const net = netField.value.trim() === '' ? NaN : parseFloat(netField.value.trim());
            const margin = marginField.value.trim() === '' ? 0 : parseFloat(marginField.value.trim());
            if (!isNaN(net) && net > 0) sellingField.value = (net + (net * margin / 100)).toFixed(2);
            else sellingField.value = '';
        };

        let supplierSelectHtml = '';
        if (window.currentUserRole === 'admin') {
            const partnerOptions = partners
                .filter(p => p.role === 'partner')
                .map(p => `<option value="${p.id}" ${data.supplier_uid === p.id ? 'selected' : ''}>${p.companyName || p.email}</option>`).join('');
            
            supplierSelectHtml = `
                <div style="margin-top: 15px; padding: 15px; background: rgba(0, 175, 185, 0.05); border-radius: 8px; border: 1px dashed var(--primary);">
                    <label class="input-label" style="margin-top:0;">Assign Owner (Partner Account)</label>
                    <select id="t-supplier-uid" style="margin-bottom:0;">
                        <option value="admin" ${!data.supplier_uid || data.supplier_uid === 'admin' ? 'selected' : ''}>Caspian DMC (Internal)</option>
                        ${partnerOptions}
                    </select>
                </div>`;
        }

        const modalHtml = `
        <div class="modal-overlay" id="tour-modal">
            <div class="modal-content">
                <form id="service-form" onsubmit="window.handleFinalSave(event, '${data.id || ''}')" novalidate>
                    <div class="modal-header">
                        <h2 data-i18n="add_service">${data.id ? t('add_service') : t('add_service')}</h2>
                        <button type="button" class="modal-close" onclick="document.getElementById('tour-modal').remove()"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        <label class="input-label" data-i18n="service_name">Service Name</label>
                        <input type="text" id="t-name" value="${data.name || ''}">
                        
                        <div style="display:flex; gap:15px;">
                            <div style="flex:1;">
                                <label class="input-label" data-i18n="supplier_name">Supplier Name</label>
                                <input type="text" id="t-supplier" value="${data.supplierName || ''}">
                            </div>
                            <div style="flex:1;">
                                <label class="input-label" data-i18n="service_type">Service Type</label>
                                <select id="t-category" onchange="document.getElementById('hotel-fields').style.display = this.value === 'Hotel' ? 'flex' : 'none';">
                                    <option value="Hotel" ${data.category==='Hotel'?'selected':''}>${t('hotel')}</option>
                                    <option value="Transport" ${data.category==='Transport'?'selected':''}>${t('transport')}</option>
                                    <option value="Activity" ${data.category==='Activity'?'selected':''}>${t('activity')}</option>
                                </select>
                            </div>
                        </div>

                        ${supplierSelectHtml}

                        <div id="hotel-fields" style="display: ${(!data.category || data.category === 'Hotel') ? 'flex' : 'none'}; gap: 15px; margin-top: 15px;">
                            <div style="flex:1;">
                                <label class="input-label" data-i18n="region">Region</label>
                                <select id="t-region">
                                    <option value="Baku" ${data.region==='Baku'?'selected':''}>${t('baku')}</option>
                                    <option value="Gabala" ${data.region==='Gabala'?'selected':''}>${t('gabala')}</option>
                                    <option value="Qusar" ${data.region==='Qusar'?'selected':''}>${t('qusar')}</option>
                                    <option value="Sheki" ${data.region==='Sheki'?'selected':''}>${t('sheki')}</option>
                                    <option value="Lankaran" ${data.region==='Lankaran'?'selected':''}>${t('lankaran')}</option>
                                </select>
                            </div>
                            <div style="flex:1;">
                                <label class="input-label" data-i18n="stars">Stars</label>
                                <select id="t-stars">
                                    <option value="3" ${data.stars==='3'?'selected':''}>3 ⭐</option>
                                    <option value="4" ${data.stars==='4'?'selected':''}>4 ⭐</option>
                                    <option value="5" ${data.stars==='5'?'selected':''}>5 ⭐</option>
                                    <option value="Unrated" ${data.stars==='Unrated'?'selected':''}>${t('unrated')}</option>
                                </select>
                            </div>
                        </div>

                        <label class="checkbox-label">
                            <input type="checkbox" id="t-verified" ${data.is_verified ? 'checked' : ''}>
                            <span data-i18n="verified_status">Verified Partner Status</span>
                        </label>
                        <h4 data-i18n="pricing_engine" style="margin:25px 0 10px 0; font-size:1.1rem; border-bottom:1px solid #eee; padding-bottom:5px;">Pricing Engine</h4>
                        <label class="input-label" data-i18n="rack_rate" style="margin-top:5px;">Rack Rate</label>
                        <input type="number" id="t-rack-rate" value="${data.rackRate || ''}">
                        <div style="display:flex; gap:10px; margin-top:10px;">
                            <div style="flex:1;"><label class="input-label" data-i18n="net_label" style="margin-top:0;">Net (Xalis)</label><input type="number" id="xalis-input" value="${data.netCost || ''}" oninput="window.calculatePrice()"></div>
                            <div style="flex:1;"><label class="input-label" style="margin-top:0;">${t('margin_label')} (%)</label><input type="number" id="marja-input" value="${data.markup || ''}" oninput="window.calculatePrice()" placeholder="0"></div>
                            <div style="flex:1;"><label class="input-label" data-i18n="selling_price" style="margin-top:0;">Selling</label><input type="number" id="satis-input" value="${data.sellingPrice || ''}" readonly style="background:#f5f5f7; color:#333; font-weight:bold; cursor:not-allowed;"></div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn-action btn-edit" style="flex:1; padding:14px;" onclick="document.getElementById('tour-modal').remove()" data-i18n="cancel">CANCEL</button>
                        <button type="submit" class="save-btn" id="save-btn" style="flex:2; padding:14px;" data-i18n="save_item">SAVE ITEM</button>
                    </div>
                </form>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        applyTranslations();
        setTimeout(() => document.getElementById('tour-modal').classList.add('active'), 10);
    }

    window.handleFinalSave = async function(e, editIdLocal) {
        e.preventDefault(); 
        const saveBtn = document.getElementById('save-btn');
        const nameField = document.getElementById('t-name').value.trim();
        const netInputStr = document.getElementById('xalis-input').value.trim();
        const marginInputStr = document.getElementById('marja-input').value.trim();
        const categoryVal = document.getElementById('t-category').value;
        const rackRateVal = parseFloat(document.getElementById('t-rack-rate').value || 0);
        
        const supplierUidField = document.getElementById('t-supplier-uid');
        const assignedSupplierUid = supplierUidField ? supplierUidField.value : window.currentUserUid;
        
        if (!nameField) return alert("Забыли ввести название услуги!");
        if (!netInputStr) return alert("Забыли ввести Xalis (Нетто)!");
        
        const nCost = parseFloat(netInputStr);
        const markup = marginInputStr === '' ? 0 : parseFloat(marginInputStr);
        const sPrice = nCost + (nCost * markup / 100);

        if (saveBtn) { saveBtn.disabled = true; saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Загрузка...'; }

        try {
            const tData = {
                name: nameField, supplierName: document.getElementById('t-supplier').value, category: categoryVal,
                rackRate: rackRateVal, netCost: nCost, markup: markup, sellingPrice: sPrice, price: sPrice,
                is_verified: document.getElementById('t-verified').checked, currency: 'AZN',
                region: categoryVal === 'Hotel' ? document.getElementById('t-region').value : null,
                stars: categoryVal === 'Hotel' ? document.getElementById('t-stars').value : null,
                supplier_uid: assignedSupplierUid
            };
            
            let docId = editIdLocal || (assignedSupplierUid !== 'admin' ? assignedSupplierUid : Date.now().toString());
            await update(ref(db, `inventory/${docId}`), tData);
            document.getElementById('tour-modal').remove();
        } catch (err) {
            alert("Ошибка: " + err.message);
            if (saveBtn) { saveBtn.disabled = false; saveBtn.innerHTML = "SAVE"; }
        }
    };

    window.showPartnerForm = function() {
        const existingModal = document.getElementById('partner-modal');
        if (existingModal) existingModal.remove();

        const modalHtml = `
        <div class="modal-overlay" id="partner-modal">
            <div class="modal-content" style="max-width: 500px;">
                <form id="partner-form" onsubmit="window.handlePartnerRegistration(event)" novalidate>
                    <div class="modal-header">
                        <h2>Create Account</h2>
                        <button type="button" class="modal-close" onclick="document.getElementById('partner-modal').remove()"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        <label class="input-label">Company / Full Name</label>
                        <input type="text" id="p-name" required placeholder="Ex: Caspian Hotels LLC">
                        <label class="input-label">Email</label>
                        <input type="email" id="p-email" required placeholder="partner@example.com">
                        <label class="input-label">Password</label>
                        <input type="password" id="p-password" required minlength="6" placeholder="Min 6 characters">
                        <label class="input-label">Account Role</label>
                        <select id="p-role">
                            <option value="partner">Supplier (Hotel/Transport)</option>
                            <option value="buyer">B2B Buyer (Tour Operator)</option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn-action btn-edit" style="flex:1; padding:14px;" onclick="document.getElementById('partner-modal').remove()">CANCEL</button>
                        <button type="submit" class="save-btn" id="save-partner-btn" style="flex:2; padding:14px;">CREATE ACCOUNT</button>
                    </div>
                </form>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        setTimeout(() => document.getElementById('partner-modal').classList.add('active'), 10);
    };

    window.handlePartnerRegistration = async function(e) {
        e.preventDefault(); 
        const saveBtn = document.getElementById('save-partner-btn');
        const nameField = document.getElementById('p-name').value.trim();
        const emailField = document.getElementById('p-email').value.trim();
        const passField = document.getElementById('p-password').value;
        const roleField = document.getElementById('p-role').value;

        saveBtn.disabled = true; saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        try {
            const apiKey = window.auth.app.options.apiKey;
            const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailField, password: passField, returnSecureToken: true })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error.message);
            
            await set(ref(db, `users/${data.localId}`), { email: emailField, companyName: nameField, role: roleField, is_verified: true, createdAt: Date.now() });
            document.getElementById('partner-modal').remove();
            alert("Account successfully created!");
        } catch (err) {
            alert("Error: " + err.message); saveBtn.disabled = false; saveBtn.innerHTML = 'CREATE ACCOUNT';
        }
    };

    // ПОКУПАТЕЛЬ - МОДАЛКА БРОНИРОВАНИЯ (Flatpickr Range)
    window.viewItemDetails = function(id) {
        const item = inventory.find(i => i.id === id);
        if(!item) return;
        window.selectedDates = []; window.selectedItemToBook = item;
        
        const supplierUid = item.supplier_uid;
        if (supplierUid && supplierUid !== 'admin') {
            const unsub = onValue(ref(db, `users/${supplierUid}`), (snapshot) => {
                unsub(); const profile = snapshot.val() || {}; renderBookingModal(item, profile);
            });
        } else {
            renderBookingModal(item, {
                amenities: { air_conditioning: true, free_wifi: true, private_bathroom: true, tv: true },
                cancelPolicy: 'Flexible', roomSize: '25', descriptions: {en: "Luxury room with city view."}
            });
        }
    };

    function renderBookingModal(item, supplierProfile) {
        const amenities = item.amenities || supplierProfile.amenities || {};
        const cancelPolicy = item.cancelPolicy || supplierProfile.cancelPolicy || 'Standard';
        
        const currentLang = getCurrentLang() || 'en';
        let localizedDesc = item.descriptions?.[currentLang] || supplierProfile.descriptions?.[currentLang];
        if (!localizedDesc || localizedDesc.trim() === '') {
            localizedDesc = item.descriptions?.en || item.description_en || item.included || 'Detailed description will be provided by the partner soon.';
        }
        
        let cancelHtml = '';
        if (cancelPolicy === 'Flexible') cancelHtml = '<div style="color:#27ae60; font-weight:700; margin-bottom:10px;"><i class="fas fa-check"></i> Free Cancellation (Flexible)</div>';
        else if (cancelPolicy === 'Standard') cancelHtml = '<div style="color:#f39c12; font-weight:700; margin-bottom:10px;"><i class="fas fa-info-circle"></i> Free Cancellation up to 3 days</div>';
        else cancelHtml = '<div style="color:#e74c3c; font-weight:700; margin-bottom:10px;"><i class="fas fa-times-circle"></i> Strict Policy (100% Penalty)</div>';

        let amenitiesHtml = '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:15px; font-weight:500; color:#444;">';
        if(amenities.air_conditioning) amenitiesHtml += '<div><i class="fas fa-snowflake" style="color:var(--primary);"></i> Air Conditioning</div>';
        if(amenities.free_wifi) amenitiesHtml += '<div><i class="fas fa-wifi" style="color:var(--primary);"></i> Free WiFi</div>';
        if(amenities.private_bathroom) amenitiesHtml += '<div><i class="fas fa-bath" style="color:var(--primary);"></i> Private Bathroom</div>';
        if(amenities.balcony) amenitiesHtml += '<div><i class="fas fa-city" style="color:var(--primary);"></i> Balcony / View</div>';
        if(amenities.tv) amenitiesHtml += '<div><i class="fas fa-tv" style="color:var(--primary);"></i> TV</div>';
        if(amenities.minibar) amenitiesHtml += '<div><i class="fas fa-glass-martini-alt" style="color:var(--primary);"></i> Mini-bar</div>';
        amenitiesHtml += '</div>';

        const roomSizeHtml = supplierProfile.roomSize ? `<div style="margin-top:15px; font-weight:600; color:#333;"><i class="fas fa-vector-square" style="color:var(--primary);"></i> Area: ${supplierProfile.roomSize} sq.m</div>` : '';

        const photosHtml = (item.photos || [item.image || 'placeholder.jpg']).map(url => `
            <img src="${url}" loading="lazy" style="width:80px; height:60px; object-fit:cover; border-radius:8px; cursor:pointer; border: 2px solid transparent; transition:0.2s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='transparent'" onclick="document.getElementById('main-modal-img').src='${url}'">
        `).join('');

        const starString = item.stars && item.stars !== 'Unrated' ? '⭐'.repeat(parseInt(item.stars)) : '';
        const basePrice = parseFloat(item.sellingPrice || item.price || 0).toFixed(2);

        const modalHtml = `
        <div class="modal-overlay" id="details-modal">
            <div class="modal-content" style="max-width:900px; padding:0; overflow:hidden;">
                <div style="position:relative; height:350px; background:#000;">
                    <img id="main-modal-img" src="${item.image || (item.photos && item.photos.length > 0 ? item.photos[0] : 'placeholder.jpg')}" loading="lazy" style="width:100%; height:100%; object-fit:cover; opacity:0.8; transition:0.3s;">
                    <button type="button" onclick="document.getElementById('details-modal').remove()" style="position:absolute; top:15px; right:15px; background:rgba(0,0,0,0.5); color:white; border:none; border-radius:50%; width:40px; height:40px; font-size:1.2rem; cursor:pointer;"><i class="fas fa-times"></i></button>
                    <div style="position:absolute; bottom:20px; left:20px; color:white;">
                        <div style="font-size:0.85rem; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:5px;">${t(item.category?.toLowerCase()) || item.category}</div>
                        <h2 style="margin:0; font-size:2.2rem; text-shadow:0 2px 4px rgba(0,0,0,0.5);">${item.name}</h2>
                        ${starString ? `<div style="margin-top:5px; font-size:1.2rem;">${starString}</div>` : ''}
                    </div>
                </div>
                
                <div style="padding: 30px; display:flex; flex-wrap:wrap; gap:30px;">
                    <div style="flex: 1 1 55%;">
                        <div style="display:flex; gap:10px; margin-bottom:20px; overflow-x:auto; padding-bottom:5px;">${photosHtml}</div>
                        ${cancelHtml}
                        <h3 style="margin-top:15px; color:var(--dark);">About this service</h3>
                        <p style="color:#555; line-height:1.7; font-size:0.95rem; white-space: pre-line;">${localizedDesc}</p>
                        ${roomSizeHtml}
                        ${amenitiesHtml}
                        
                        <div style="margin-top:30px; background:#f8f9fa; padding:20px; border-radius:12px;">
                            <h4 style="margin-top:0; color:#333;"><i class="far fa-calendar-alt" style="color:var(--primary);"></i> Select Dates (Range)</h4>
                            <p style="font-size:0.85rem; color:#888; margin-bottom:10px;">Select Check-in & Check-out dates.</p>
                            <input type="text" id="buyer-flatpickr" placeholder="Click to select dates..." style="background:white; cursor:pointer; font-weight:bold;">
                        </div>
                    </div>
                    
                    <div style="flex: 1 1 35%;">
                        <div style="border:1px solid #e1e4e8; padding:25px; border-radius:16px; position:sticky; top:20px; text-align:center;">
                            <div style="color:#888; font-size:0.85rem; font-weight:700; text-transform:uppercase;">Booking Summary</div>
                            <div id="modal-price-calc" style="margin:20px 0;">
                                <div style="font-size:0.9rem; color:#666;">Price per day: ${basePrice} AZN</div>
                                <div style="font-size:1.8rem; font-weight:800; color:var(--dark); opacity:0.5; margin-top:5px;">Total: 0.00 AZN</div>
                            </div>
                            <button class="save-btn" onclick="window.confirmAddToCart()" id="add-to-package-btn" disabled style="opacity:0.5; cursor:not-allowed; width:100%;">Add to Package</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        setTimeout(() => {
            document.getElementById('details-modal').classList.add('active');
            if (window.flatpickr) {
                const availDates = item.availableDates || [];
                flatpickr("#buyer-flatpickr", {
                    mode: "range",
                    minDate: "today",
                    dateFormat: "Y-m-d",
                    enable: availDates, // Разрешаем выбирать ТОЛЬКО даты из массива партнера
                    onChange: function(selectedDates, dateStr, instance) {
                        window.selectedDates = [];
                        if (selectedDates.length === 2) {
                            let currentD = new Date(selectedDates[0]);
                            let endD = new Date(selectedDates[1]);
                            while (currentD <= endD) {
                                window.selectedDates.push(currentD.toISOString().split('T')[0]);
                                currentD.setDate(currentD.getDate() + 1);
                            }
                        } else if (selectedDates.length === 1) {
                            window.selectedDates = [selectedDates[0].toISOString().split('T')[0]];
                        }
                        
                        const addBtn = document.getElementById('add-to-package-btn');
                        if (window.selectedDates.length > 0) {
                            const days = window.selectedDates.length;
                            const total = (basePrice * days).toFixed(2);
                            document.getElementById('modal-price-calc').innerHTML = `
                                <div style="font-size:0.9rem; color:#666;">Price per day: ${basePrice} AZN</div>
                                <div style="font-size:0.9rem; color:#666; margin-bottom: 10px;">Selected days: ${days}</div>
                                <div style="font-size:1.8rem; font-weight:800; color:var(--dark);">Total: ${total} AZN</div>`;
                            addBtn.disabled = false; addBtn.style.opacity = '1'; addBtn.style.cursor = 'pointer';
                        } else {
                            document.getElementById('modal-price-calc').innerHTML = `
                                <div style="font-size:0.9rem; color:#666;">Price per day: ${basePrice} AZN</div>
                                <div style="font-size:1.8rem; font-weight:800; color:var(--dark); opacity:0.5;">Total: 0.00 AZN</div>`;
                            addBtn.disabled = true; addBtn.style.opacity = '0.5'; addBtn.style.cursor = 'not-allowed';
                        }
                    }
                });
            }
        }, 100);
    }

    window.confirmAddToCart = function() {
        if(!window.selectedItemToBook || window.selectedDates.length === 0) return;
        const daysCount = window.selectedDates.length;
        const dateLabel = daysCount > 1 ? `${window.selectedDates[0]} to ${window.selectedDates[daysCount - 1]} (${daysCount} days)` : window.selectedDates[0];
        const baseSelling = parseFloat(window.selectedItemToBook.sellingPrice || window.selectedItemToBook.price || 0);
        const baseNet = parseFloat(window.selectedItemToBook.netCost || 0);

        const itemWithDateRange = {
            ...window.selectedItemToBook, selectedDatesArray: window.selectedDates, selectedDate: dateLabel, 
            sellingPrice: (baseSelling * daysCount).toFixed(2), netCost: (baseNet * daysCount).toFixed(2),
            cartId: Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        };
        
        window.currentCart.push(itemWithDateRange);
        document.getElementById('details-modal').remove();
        window.render('bookings');
    };

    window.removeFromCart = (cartId) => { window.currentCart = window.currentCart.filter(i => i.cartId !== cartId); window.render('bookings'); };

    window.processBooking = async () => {
        if(window.currentCart.length === 0) return alert(t('empty_cart'));
        const btn = document.getElementById('checkout-btn'); const origText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; btn.disabled = true;

        try {
            const totalSelling = window.currentCart.reduce((sum, item) => sum + parseFloat(item.sellingPrice || item.price || 0), 0);
            const totalNet = window.currentCart.reduce((sum, item) => sum + parseFloat(item.netCost || 0), 0);
            const orderId = 'ORD-' + Date.now();
            
            const orderData = {
                orderId: orderId, items: window.currentCart, totalSellingPrice: totalSelling, totalNetPrice: totalNet,
                totalMargin: totalSelling - totalNet, status: 'pending', timestamp: Date.now(), createdAt: Date.now(), buyer_uid: window.currentUserUid
            };

            await push(ref(db, 'bookings'), orderData);
            window.showInvoiceModal(orderData);
        } catch(e) { alert("Error: " + e.message); btn.innerHTML = origText; btn.disabled = false; }
    };

    window.showInvoiceModal = function(orderData) {
        const existingModal = document.getElementById('invoice-modal'); if (existingModal) existingModal.remove();
        const itemsHtml = orderData.items.map(item => `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 10px; font-family: 'Inter', sans-serif;">${item.name} <br><span style="font-size:0.8rem; color:#888;">Dates: ${item.selectedDate}</span></td>
                <td style="padding: 12px 10px; font-family: 'Inter', sans-serif; color: #666;">${t(item.category?.toLowerCase()) || item.category}</td>
                <td style="padding: 12px 10px; text-align: right; font-weight: 600;">${item.currency === 'AZN' ? '₼' : '$'} ${item.sellingPrice || item.price}</td>
            </tr>
        `).join('');

        const dateStr = new Date(orderData.createdAt).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const modalHtml = `
        <div class="modal-overlay" id="invoice-modal" style="z-index: 5000;">
            <div class="modal-content" style="max-width: 800px; padding: 0;">
                <div id="invoice-print-area">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 2px solid var(--primary); padding-bottom: 20px;">
                        <div><h1 style="margin: 0; color: var(--dark); font-family: 'Montserrat', sans-serif;">Caspian Travel Routes</h1><p style="color: #666; margin: 5px 0 0 0; font-weight: 600;">Official B2B Invoice</p></div>
                        <div style="text-align: right;"><h3 style="margin: 0; color: #333; font-family: 'Montserrat', sans-serif;">INVOICE</h3><p style="margin: 5px 0 0 0; color: #666;"><strong>Order ID:</strong> ${orderData.orderId}</p><p style="margin: 5px 0 0 0; color: #666;"><strong>Date:</strong> ${dateStr}</p></div>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                        <thead><tr style="background: #f8f9fa; text-align: left;"><th style="padding: 12px 10px; border-bottom: 2px solid #ddd; color: #555;">Service Details</th><th style="padding: 12px 10px; border-bottom: 2px solid #ddd; color: #555;">Type</th><th style="padding: 12px 10px; border-bottom: 2px solid #ddd; text-align: right; color: #555;">Price</th></tr></thead>
                        <tbody>${itemsHtml}</tbody>
                    </table>
                    <div style="display: flex; justify-content: flex-end;">
                        <div style="min-width: 250px; background: #f8f9fa; padding: 20px; border-radius: 12px;">
                            <div style="display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: 800; color: var(--dark);"><span>TOTAL:</span><span>₼ ${orderData.totalSellingPrice.toFixed(2)}</span></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer no-print" style="justify-content: flex-end; background: #f0f2f5; border-radius: 0 0 20px 20px;">
                    <button type="button" class="btn-action btn-edit" style="padding: 12px 20px;" onclick="window.closeInvoiceAndClear()">Close</button>
                    <button type="button" class="btn-primary" style="padding: 12px 20px;" onclick="window.print()"><i class="fas fa-print"></i> Print / Save as PDF</button>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        setTimeout(() => document.getElementById('invoice-modal').classList.add('active'), 10);
    };

    window.closeInvoiceAndClear = () => { document.getElementById('invoice-modal')?.remove(); window.currentCart = []; window.render('bookings'); };

    window.seedDatabase = async () => {
        const btn = document.getElementById('seed-btn');
        if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Загрузка в Firebase...'; btn.disabled = true; }

        const regionalHotelsSeed = [
            { service_type: 'hotel', service_name: "Gabala Forest Retreat", supplier_name: "Gabala Tourism LLC", region: "Gabala", stars: 4, rack_rate: 110.00, net_rate: 77.00, is_verified: true, image_filename: "", description: "Standard Double Room with Breakfast and Mountain View" },
            { service_type: 'hotel', service_name: "Caucasus Boutique Hotel", supplier_name: "Caucasus Hospitality", region: "Gabala", stars: 3, rack_rate: 70.00, net_rate: 49.00, is_verified: false, image_filename: "", description: "Standard Twin Room, Free WiFi" }
        ];

        try {
            for (const item of regionalHotelsSeed) {
                const markupCalc = ((item.rack_rate - item.net_rate) / item.net_rate) * 100;
                let mockDates = []; let d = new Date();
                for(let i=0; i<10; i++) {
                    let dMock = new Date(d); dMock.setDate(dMock.getDate() + Math.floor(Math.random() * 30));
                    mockDates.push(dMock.toISOString().split('T')[0]);
                }
                const formattedHotel = {
                    category: "Hotel", name: item.service_name, supplierName: item.supplier_name, region: item.region,
                    stars: item.stars.toString(), rackRate: item.rack_rate, netCost: item.net_rate, markup: parseFloat(markupCalc.toFixed(2)), 
                    sellingPrice: item.rack_rate, price: item.rack_rate, is_verified: item.is_verified, image: item.image_filename,
                    currency: "AZN", is_certified: false, supplier_uid: 'admin', availableDates: mockDates, descriptions: {en: item.description}
                };
                await push(ref(db, 'inventory'), formattedHotel);
            }
            alert("Отели успешно загружены!"); window.location.reload(); 
        } catch (err) { alert("Ошибка: " + err.message); if (btn) { btn.innerHTML = 'Авто-заполнение базы'; btn.disabled = false; } }
    };
});