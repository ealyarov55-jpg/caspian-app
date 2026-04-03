import { calculateDashboardStats } from './analytics.js';
import { loadLanguage, applyTranslations, getCurrentLang, t } from './i18n.js';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) { registration.unregister(); }
    }).catch(err => console.warn("SW cleanup:", err));
}
if (window.caches) {
    caches.keys().then(names => {
        for (let name of names) caches.delete(name);
    }).catch(err => console.warn("Caches cleanup:", err));
}

document.addEventListener('DOMContentLoaded', async () => {
    const { db, dbFunc, auth, authFunc, storage, storageFunc } = window;
    const { ref, push, set, onValue, remove, update } = dbFunc;
    const { signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence } = authFunc;
    const { storageRef, uploadBytes, getDownloadURL } = storageFunc || {};

    let inventory = []; 
    let bookings = []; 
    let partners = []; 
    let searchQuery = ""; 
    let currentFilter = "All"; 
    let currentPage = 'home'; 
    let isAuthReady = false; 

    window.currentCart = window.currentCart || [];
    window.bookingFilter = 'All';
    window.regionFilter = 'All';
    window.starsFilter = 'All';
    window.selectedDates = []; 
    
    window.currentUserUid = null;
    window.currentUserRole = null;
    window.currentUserProfile = null;

    try { await loadLanguage(getCurrentLang()); } 
    catch (e) { console.error("i18n init error:", e); }

    window.setLanguage = async (lang) => { 
        try { await loadLanguage(lang); window.render(currentPage); } 
        catch (e) { console.error("Language switch error:", e); }
    };
    
    window.updateNavigationByRole = (role) => {
        const navHome = document.getElementById('nav-home');
        const navInv = document.getElementById('nav-inventory');
        const navBook = document.getElementById('nav-bookings');
        const navPart = document.getElementById('nav-partners');
        const navProf = document.getElementById('nav-profile');
        const logoutCont = document.getElementById('logout-container');

        if(role === 'admin') {
            if(navHome) navHome.style.display = 'flex';
            if(navInv) navInv.style.display = 'flex';
            if(navBook) navBook.style.display = 'flex';
            if(navPart) navPart.style.display = 'flex';
            if(navProf) navProf.style.display = 'flex';
        } else if(role === 'partner') {
            if(navHome) navHome.style.display = 'none';
            if(navInv) navInv.style.display = 'flex';
            if(navBook) navBook.style.display = 'none'; // Partner only manages inventory
            if(navPart) navPart.style.display = 'none';
            if(navProf) navProf.style.display = 'flex';
        } else if(role === 'buyer') {
            if(navHome) navHome.style.display = 'none';
            if(navInv) navInv.style.display = 'none';
            if(navBook) navBook.style.display = 'flex';
            if(navPart) navPart.style.display = 'none';
            if(navProf) navProf.style.display = 'flex';
        }
        
        if (role) {
            if(logoutCont) logoutCont.style.display = 'block';
        }
    };

    window.render = (page) => { currentPage = page; renderInternal(page); };
    window.setFilter = (filter) => { currentFilter = filter; window.render('inventory'); };
    window.setBookingFilter = (filter) => { window.bookingFilter = filter; window.render('bookings'); };
    window.setRegionFilter = (val) => { window.regionFilter = val; window.render(currentPage); };
    window.setStarsFilter = (val) => { window.starsFilter = val; window.render(currentPage); };

    window.editItem = (id) => { window.showForm(inventory.find(x => x.id === id)); };
    window.deleteItem = async (id) => { 
        if(confirm('Delete this service?')) {
            try { await remove(ref(db, `inventory/${id}`)); } 
            catch(e) { console.error("Delete error:", e); }
        } 
    };
    
    window.logout = async () => { 
        try { await signOut(auth); window.render('login'); } 
        catch (e) { console.error("Logout error:", e); }
    };

    window.login = async function(e) {
        if (e) e.preventDefault(); 
        const emailInput = document.getElementById('email-field');
        const passInput = document.getElementById('pass-field');
        if (!emailInput || !passInput) return; 
        const email = emailInput.value.trim();
        const pass = passInput.value.trim();
        if (!email || !pass) return; 
        try { await signInWithEmailAndPassword(auth, email, pass); } 
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
                        profile = { role: 'admin', companyName: 'Caspian DMC Admin', is_verified: true, partnerType: 'Hotel' };
                        set(ref(db, `users/${user.uid}`), profile);
                    }
                    window.currentUserRole = profile.role || 'buyer';
                    window.currentUserProfile = profile;
                    window.updateNavigationByRole(window.currentUserRole);
                    
                    const loginBtn = document.getElementById('nav-login');
                    if (loginBtn) loginBtn.style.display = 'none';

                    if (currentPage === 'login') {
                        if (window.currentUserRole === 'admin') currentPage = 'home';
                        else if (window.currentUserRole === 'partner') currentPage = 'inventory';
                        else currentPage = 'bookings';
                    }
                    
                    if (!isAuthReady) {
                        isAuthReady = true;
                        const loader = document.getElementById('auth-loader');
                        if (loader) loader.classList.add('hidden'); 
                    }
                    renderInternal(currentPage);
                });
            } else {
                window.currentUserUid = null;
                window.currentUserRole = null;
                window.currentUserProfile = null;
                
                const loginBtn = document.getElementById('nav-login');
                const logoutCont = document.getElementById('logout-container');
                if (logoutCont) logoutCont.style.display = 'none';
                if (loginBtn) loginBtn.style.display = 'flex';
                
                if (!isAuthReady) {
                    isAuthReady = true;
                    const loader = document.getElementById('auth-loader');
                    if (loader) loader.classList.add('hidden'); 
                }
                currentPage = 'login';
                renderInternal(currentPage);
            }
        });
    } catch (e) { console.error("Auth error:", e); }

    try {
        onValue(ref(db, 'inventory'), (snapshot) => {
            const data = snapshot.val();
            inventory = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
            if (isAuthReady && ['inventory', 'home', 'bookings'].includes(currentPage)) renderInternal(currentPage);
        });
        onValue(ref(db, 'bookings'), (snapshot) => {
            const data = snapshot.val();
            bookings = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
            if (isAuthReady && ['home'].includes(currentPage)) renderInternal(currentPage);
        });
        onValue(ref(db, 'partners'), (snapshot) => {
            const data = snapshot.val();
            partners = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
            if (isAuthReady && currentPage === 'partners') renderInternal(currentPage);
        });
    } catch (e) { console.error("Firebase error:", e); }

    function renderInternal(page) {
        if (!isAuthReady) return; 
        const content = document.getElementById('app-content');
        if (!content) return;

        try {
            if (!window.isAuthenticated && ['home', 'bookings', 'partners', 'profile', 'inventory'].includes(page)) {
                page = 'login'; currentPage = 'login';
            }

            document.querySelector('.bottom-nav').style.display = page === 'login' ? 'none' : 'flex';
            document.querySelectorAll('.nav-links-container button').forEach(btn => btn.classList.remove('active'));
            const activeBtn = document.getElementById(`nav-${page}`);
            if (activeBtn) activeBtn.classList.add('active');

            const dynamicHeader = document.getElementById('dynamic-header-actions');
            if (dynamicHeader) {
                if (page === 'inventory' && window.isAuthenticated && (window.currentUserRole === 'admin' || window.currentUserRole === 'partner')) {
                    dynamicHeader.innerHTML = `<button class="btn-primary" onclick="window.showForm();" style="padding: 6px 14px; border-radius:8px; font-size: 0.85rem;"><i class="fas fa-plus"></i> <span data-i18n="add_service">Add Service</span></button>`;
                } else if (page === 'partners' && window.currentUserRole === 'admin') {
                    dynamicHeader.innerHTML = `<button class="btn-primary" onclick="window.showPartnerForm();" style="padding: 6px 14px; border-radius:8px; font-size: 0.85rem;"><i class="fas fa-plus"></i> <span data-i18n="add_partner">Add Partner</span></button>`;
                } else {
                    dynamicHeader.innerHTML = '';
                }
            }

            if (page === 'home' && window.currentUserRole === 'admin') {
                setTimeout(() => calculateDashboardStats(), 50);
                content.innerHTML = `
                    <div style="padding:15px 15px 100px 15px;">
                        <h2 style="margin-bottom:8px; font-size: 2rem;" data-i18n="welcome">Welcome, Boss! 🤝</h2>
                        <div class="metric-container" style="margin-top: 25px;">
                            <div class="card metric-card" style="border: 2px solid #27ae60;">
                                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                                    <div>
                                        <div style="font-size:0.75rem; font-weight:700; color:#888;" data-i18n="saved_commissions">Saved B2B Commissions</div>
                                        <div class="savings-text" style="font-size:2.2rem; margin:5px 0; display:inline-block;">...</div>
                                    </div>
                                    <div style="width:48px; height:48px; background:#e8f5e9; border-radius:12px; display:flex; align-items:center; justify-content:center; color:#27ae60; font-size:1.4rem;"><i class="fas fa-piggy-bank"></i></div>
                                </div>
                            </div>
                            <div class="card metric-card">
                                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                                    <div>
                                        <div style="font-size:0.75rem; font-weight:700; color:#888;" data-i18n="total_volume">Total Volume (Net)</div>
                                        <div id="metric-volume" style="font-size:2.2rem; font-weight:800; margin:5px 0; display:inline-block;">...</div>
                                    </div>
                                    <div style="width:48px; height:48px; background:#e0f7f9; border-radius:12px; display:flex; align-items:center; justify-content:center; color:var(--primary); font-size:1.4rem;"><i class="fas fa-wallet"></i></div>
                                </div>
                            </div>
                        </div>
                        <div class="metric-container">
                            <div class="card metric-card">
                                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                                    <div>
                                        <div style="font-size:0.75rem; font-weight:700; color:#888;" data-i18n="total_inventory">Total Inventory</div>
                                        <div style="font-size:2.2rem; font-weight:800; margin:5px 0;">${inventory.length}</div>
                                    </div>
                                    <div style="width:48px; height:48px; background:#fef5e7; border-radius:12px; display:flex; align-items:center; justify-content:center; color:#f39c12; font-size:1.4rem;"><i class="fas fa-box-open"></i></div>
                                </div>
                            </div>
                        </div>
                    </div>`;
            }

            else if (page === 'inventory') {
                let filteredInventory = inventory;
                
                if (window.currentUserRole === 'partner') {
                    filteredInventory = filteredInventory.filter(x => x.supplier_uid === window.currentUserUid);
                }
                
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

                    let actionButtons = '';
                    if (window.currentUserRole === 'admin' || window.currentUserRole === 'partner') {
                        actionButtons = `
                            <button onclick="window.manageDates('${item.id}')" class="btn-action btn-edit" title="Availability Calendar" style="flex:1;"><i class="far fa-calendar-alt"></i></button>
                            <button onclick="window.editItem('${item.id}')" class="btn-action btn-edit" style="flex:1;"><i class="fas fa-pen"></i></button>
                            <button onclick="window.deleteItem('${item.id}')" class="btn-action btn-delete" style="flex:1;"><i class="fas fa-trash"></i></button>
                        `;
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
                            ${(window.currentUserRole === 'admin' || window.currentUserRole === 'partner') ? `
                            <div style="background:#f8f9fa; padding:10px 12px; border-radius:8px; margin-top:auto; font-size:0.85rem; display:flex; justify-content:space-between; border: 1px solid #e1e4e8;">
                                <span style="color:#555;">${t('net_label') || 'Net'}: <b style="color:#e74c3c;">${item.netCost || 0}</b></span>
                                <span style="font-weight:700; color:#27ae60;">${t('margin_label') || 'Margin'}: ${item.markup || 0}%</span>
                            </div>` : ''}
                            <div style="display:flex; gap:10px; margin-top:15px;">
                                ${actionButtons}
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
                            <div style="flex: 1 1 calc(50% - 5px);">
                                <select id="filter-region" style="margin-top:0;" onchange="window.setRegionFilter(this.value)">
                                    <option value="All" ${window.regionFilter === 'All' ? 'selected' : ''}>${t('all_regions') || 'All Regions'}</option>
                                    <option value="Baku" ${window.regionFilter === 'Baku' ? 'selected' : ''}>${t('baku') || 'Baku'}</option>
                                    <option value="Gabala" ${window.regionFilter === 'Gabala' ? 'selected' : ''}>${t('gabala') || 'Gabala'}</option>
                                    <option value="Qusar" ${window.regionFilter === 'Qusar' ? 'selected' : ''}>${t('qusar') || 'Qusar'}</option>
                                    <option value="Sheki" ${window.regionFilter === 'Sheki' ? 'selected' : ''}>${t('sheki') || 'Sheki'}</option>
                                    <option value="Lankaran" ${window.regionFilter === 'Lankaran' ? 'selected' : ''}>${t('lankaran') || 'Lankaran'}</option>
                                    <option value="Other" ${window.regionFilter === 'Other' ? 'selected' : ''}>${t('other') || 'Other'}</option>
                                </select>
                            </div>
                            <div style="flex: 1 1 calc(50% - 5px);">
                                <select id="filter-stars" style="margin-top:0;" onchange="window.setStarsFilter(this.value)">
                                    <option value="All" ${window.starsFilter === 'All' ? 'selected' : ''}>${t('all_stars') || 'All Stars'}</option>
                                    <option value="3" ${window.starsFilter === '3' ? 'selected' : ''}>3 ⭐</option>
                                    <option value="4" ${window.starsFilter === '4' ? 'selected' : ''}>4 ⭐</option>
                                    <option value="5" ${window.starsFilter === '5' ? 'selected' : ''}>5 ⭐</option>
                                    <option value="Unrated" ${window.starsFilter === 'Unrated' ? 'selected' : ''}>${t('unrated') || 'Unrated'}</option>
                                </select>
                            </div>
                        </div>

                        <div id="tours-list">${listHtml || '<p style="text-align:center; color:#888; margin-top:30px;">No items match your criteria</p>'}</div>
                        
                        ${window.currentUserRole === 'admin' ? `
                        <div style="margin-top: 40px; text-align: center; border-top: 1px dashed #ccc; padding-top: 20px;">
                            <button id="seed-btn" class="btn-primary" style="margin: 0 auto; background: #34495e; padding: 15px 30px;" onclick="window.seedDatabase()">
                                <i class="fas fa-database"></i> Авто-заполнение базы
                            </button>
                        </div>` : ''}
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

            else if (page === 'bookings') {
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

                        ${window.currentUserRole === 'buyer' || window.currentUserRole === 'admin' ? `
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
                        </div>` : ''}
                    </div>`;
            }

            else if (page === 'partners' && window.currentUserRole === 'admin') {
                const partnersHtml = partners.map(p => {
                    let badgeClass = p.type === 'Hotel' ? 'badge-hotel' : 'badge-transport';
                    let verifiedBadge = p.is_verified ? `<span class="verified-icon" title="Verified" style="color:#27ae60;"><i class="fas fa-check-circle"></i></span>` : '';
                    return `
                    <div class="card tour-card fade-in" style="padding: 20px;">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                            <div>
                                <span class="badge ${badgeClass}">${t(p.type?.toLowerCase()) || p.type || 'Partner'}</span>
                                <h3 style="margin-top: 10px; display:flex; align-items:center; gap:8px;">${p.name} ${verifiedBadge}</h3>
                                <p style="margin: 8px 0 4px 0; font-size: 0.9rem; color: #555;"><i class="fas fa-user" style="color:var(--primary); width:20px;"></i> ${p.contact || 'N/A'}</p>
                                <p style="margin: 0; font-size: 0.9rem; color: #555;"><i class="fas fa-phone" style="color:var(--primary); width:20px;"></i> ${p.phone || 'N/A'}</p>
                            </div>
                        </div>
                        <div style="display:flex; gap:10px; margin-top:20px; border-top: 1px solid #f0f2f5; padding-top: 15px;">
                            <button onclick="window.deletePartner('${p.id}')" class="btn-action btn-delete" style="flex:1;"><i class="fas fa-trash"></i> Удалить</button>
                        </div>
                    </div>`
                }).join('');

                content.innerHTML = `
                    <div style="padding:15px 15px 100px 15px;">
                        <h2 style="margin-bottom: 20px;" data-i18n="partners_list">Our Partners</h2>
                        <div id="tours-list">${partnersHtml || '<p style="text-align:center; color:#888;">Нет добавленных партнеров</p>'}</div>
                    </div>`;
            }
            
            // FIX [04.04.2026]: Улучшенный профиль Покупателя (Простой) vs Партнер (Вкладки)
            else if (page === 'profile') {
                const profile = window.currentUserProfile || {};
                
                if (window.currentUserRole === 'buyer') {
                    content.innerHTML = `
                    <div style="padding:40px 20px; max-width: 600px; margin: 0 auto;">
                        <h2 style="margin:0 0 20px 0; color:#1a1a1a; font-family:'Montserrat', sans-serif; text-align:center;">Buyer Profile</h2>
                        <div class="card" style="padding:40px; border-radius:24px; text-align:center;">
                            <i class="fas fa-user-circle" style="font-size: 4rem; color: #ccc; margin-bottom: 15px;"></i>
                            <h3>${profile.companyName || 'Tour Operator'}</h3>
                            <p style="color:#666;">Access Level: Authorized Buyer</p>
                            <button class="btn-action btn-delete" onclick="window.logout()" style="width:100%; padding:16px; font-weight:700; background:#fff0f0; margin-top:20px;" data-i18n="logout">Logout</button>
                        </div>
                    </div>`;
                } else {
                    // Extranet Tabs Profile for Partners and Admins
                    const pType = profile.partnerType || 'Hotel';
                    const isDriver = pType === 'Transport';
                    const badgeTitle = isDriver ? 'Verified Driver' : 'Verified Partner';

                    let verifiedHtml = profile.is_verified 
                        ? `<span style="color:#27ae60; font-size:0.9rem; margin-left:10px; display:inline-flex; align-items:center; gap:5px;"><i class="fas fa-shield-alt"></i> <strong>${badgeTitle}</strong></span>` 
                        : '';

                    const amAir = profile.amenities?.air_conditioning ? 'checked' : '';
                    const amWifi = profile.amenities?.free_wifi ? 'checked' : '';
                    const amBath = profile.amenities?.private_bathroom ? 'checked' : '';
                    const amBalc = profile.amenities?.balcony ? 'checked' : '';
                    const amTv = profile.amenities?.tv ? 'checked' : '';
                    const amMini = profile.amenities?.minibar ? 'checked' : '';

                    content.innerHTML = `
                        <div style="padding:30px 20px; max-width: 800px; margin: 0 auto; padding-bottom: 100px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
                                <h2 style="margin:0; color:#1a1a1a; font-family:'Montserrat', sans-serif;">Extranet Settings</h2>
                            </div>

                            <div class="profile-tabs">
                                <button class="tab-btn active" id="tab-btn-1" onclick="window.switchProfileTab(1)">Terms & Details</button>
                                <button class="tab-btn" id="tab-btn-2" onclick="window.switchProfileTab(2)">Amenities</button>
                                <button class="tab-btn" id="tab-btn-3" onclick="window.switchProfileTab(3)">Media & Content</button>
                            </div>
                            
                            <div class="card" style="padding: 30px; border-radius: 16px; margin:0;">
                                
                                <div id="tab-1" class="tab-content active">
                                    <label class="input-label" style="display:flex; align-items:center;">Company Name ${verifiedHtml}</label>
                                    <input type="text" value="${profile.companyName || profile.role?.toUpperCase() || ''}" disabled style="background:#f0f2f5; color:#777; font-weight:600; cursor:not-allowed;">
                                    
                                    <label class="input-label">Business Type</label>
                                    <select id="prof-type" onchange="window.saveProfileType(this.value)">
                                        <option value="Hotel" ${pType === 'Hotel' ? 'selected' : ''}>Hotel / Accommodation</option>
                                        <option value="Transport" ${pType === 'Transport' ? 'selected' : ''}>Transport / Driver</option>
                                        <option value="Activity" ${pType === 'Activity' ? 'selected' : ''}>Tour Guide / Activity</option>
                                    </select>

                                    <label class="input-label">Cancellation Policy</label>
                                    <select id="prof-cancel-policy">
                                        <option value="Flexible" ${profile.cancelPolicy === 'Flexible' ? 'selected' : ''}>Flexible (Free up to 24h)</option>
                                        <option value="Standard" ${profile.cancelPolicy === 'Standard' ? 'selected' : ''}>Standard (Free up to 3 days)</option>
                                        <option value="Strict" ${profile.cancelPolicy === 'Strict' ? 'selected' : ''}>Strict (100% Penalty)</option>
                                    </select>

                                    <label class="input-label">Manager Contact (Name & Phone)</label>
                                    <input type="text" id="prof-manager" value="${profile.managerContact || ''}" placeholder="John Doe, +994 50 000 00 00">

                                    <div style="display:flex; gap:15px; margin-top:10px;">
                                        <div style="flex:1;"><label class="input-label">VÖEN</label><input type="text" id="prof-voen" value="${profile.voen || ''}"></div>
                                        <div style="flex:1;"><label class="input-label">IBAN</label><input type="text" id="prof-iban" value="${profile.iban || ''}"></div>
                                    </div>
                                </div>

                                <div id="tab-2" class="tab-content">
                                    <label class="input-label">Room / Car Size</label>
                                    <input type="text" id="prof-room-size" value="${profile.roomSize || ''}" placeholder="e.g. 25 sq.m or 4 seats">
                                    
                                    <h4 style="margin-top: 25px; margin-bottom:10px; color:#333;">Facilities</h4>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                        <label class="checkbox-label"><input type="checkbox" id="am-air" ${amAir}> ❄️ Air Conditioning</label>
                                        <label class="checkbox-label"><input type="checkbox" id="am-wifi" ${amWifi}> 📶 Free WiFi</label>
                                        <label class="checkbox-label"><input type="checkbox" id="am-bath" ${amBath}> 🛁 Private Bathroom</label>
                                        <label class="checkbox-label"><input type="checkbox" id="am-balc" ${amBalc}> 🌇 Balcony</label>
                                        <label class="checkbox-label"><input type="checkbox" id="am-tv" ${amTv}> 📺 TV</label>
                                        <label class="checkbox-label"><input type="checkbox" id="am-mini" ${amMini}> 🍷 Mini-bar</label>
                                    </div>
                                </div>

                                <div id="tab-3" class="tab-content">
                                    <label class="input-label" style="margin-top: 0;">Upload Photos (Max: 5)</label>
                                    <div style="border: 2px dashed #00afb9; border-radius: 12px; padding: 30px; text-align: center; background: rgba(0, 175, 185, 0.05); position: relative; cursor: pointer;">
                                        <i class="fas fa-camera" style="font-size: 2.5rem; color: #00afb9; margin-bottom: 10px;"></i>
                                        <p style="margin: 0; font-size: 0.9rem; color: #555; font-weight: 600;">Drag & Drop or Click to upload</p>
                                        <input type="file" id="prof-photos" multiple accept="image/*" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;">
                                    </div>
                                    <div id="prof-photos-preview" style="display:flex; gap:10px; margin-top:10px; margin-bottom:20px; min-height:20px;"></div>
                                    
                                    <h4 style="margin-bottom:10px; color:#333;">Multilingual Description</h4>
                                    <label class="input-label">English Description</label>
                                    <textarea id="prof-desc-en" style="height: 80px;" placeholder="English...">${profile.description_en || ''}</textarea>
                                    
                                    <label class="input-label">Russian Description</label>
                                    <textarea id="prof-desc-ru" style="height: 80px;" placeholder="Русский...">${profile.description_ru || ''}</textarea>
                                    
                                    <label class="input-label">Azerbaijani Description</label>
                                    <textarea id="prof-desc-az" style="height: 80px;" placeholder="Azərbaycanca...">${profile.description_az || ''}</textarea>
                                </div>

                                <button class="save-btn" onclick="window.saveProfile()" style="margin-top: 30px;">
                                    <i class="fas fa-save"></i> Save Extranet Details
                                </button>
                            </div>
                        </div>`;

                    setTimeout(() => {
                        const photoInput = document.getElementById('prof-photos');
                        const preview = document.getElementById('prof-photos-preview');
                        if(photoInput) {
                            photoInput.addEventListener('change', (e) => {
                                if(e.target.files.length > 5) {
                                    alert("Maximum 5 photos allowed!");
                                    photoInput.value = ""; preview.innerHTML = ""; return;
                                }
                                preview.innerHTML = `<span style="font-size:0.85rem; color:#27ae60; font-weight:600;"><i class="fas fa-check"></i> ${e.target.files.length} photo(s) selected</span>`;
                            });
                        }
                    }, 100);
                }
            }
            else if (page === 'login') {
                content.innerHTML = `
                    <div class="login-container fade-in">
                        <div class="login-card">
                            <div class="login-logo">CASPIAN<b>DMC</b></div>
                            <form onsubmit="window.login(event)">
                                <input type="email" id="email-field" placeholder="Email" required>
                                <input type="password" id="pass-field" placeholder="Password" required>
                                <button type="submit" class="login-btn" data-i18n="nav_login">Login</button>
                            </form>
                        </div>
                    </div>`;
            }

            applyTranslations();

        } catch (e) { console.error("Critical Render Error:", e); }
    }

    window.switchProfileTab = (tabId) => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(`tab-btn-${tabId}`).classList.add('active');
        document.getElementById(`tab-${tabId}`).classList.add('active');
    };

    window.saveProfileType = async (type) => {
        try {
            await update(ref(db, `users/${window.currentUserUid}`), { partnerType: type });
            if(window.currentUserProfile) window.currentUserProfile.partnerType = type;
            window.render('profile');
        } catch(e) {}
    };

    window.saveProfile = async () => {
        const address = document.getElementById('prof-address').value.trim();
        const voen = document.getElementById('prof-voen').value.trim();
        const iban = document.getElementById('prof-iban').value.trim();
        const cancelPolicy = document.getElementById('prof-cancel-policy') ? document.getElementById('prof-cancel-policy').value : 'Standard';
        const manager = document.getElementById('prof-manager') ? document.getElementById('prof-manager').value.trim() : '';
        const roomSize = document.getElementById('prof-room-size') ? document.getElementById('prof-room-size').value.trim() : '';
        
        const descEn = document.getElementById('prof-desc-en') ? document.getElementById('prof-desc-en').value.trim() : '';
        const descRu = document.getElementById('prof-desc-ru') ? document.getElementById('prof-desc-ru').value.trim() : '';
        const descAz = document.getElementById('prof-desc-az') ? document.getElementById('prof-desc-az').value.trim() : '';
        
        const amenitiesObj = {
            air_conditioning: document.getElementById('am-air')?.checked || false,
            free_wifi: document.getElementById('am-wifi')?.checked || false,
            private_bathroom: document.getElementById('am-bath')?.checked || false,
            balcony: document.getElementById('am-balc')?.checked || false,
            tv: document.getElementById('am-tv')?.checked || false,
            minibar: document.getElementById('am-mini')?.checked || false,
        };
        
        const saveBtn = document.querySelector('#app-content .save-btn');
        const origHtml = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        saveBtn.disabled = true;

        try {
            await update(ref(db, `users/${window.currentUserUid}`), {
                legalAddress: address, voen: voen, iban: iban,
                cancelPolicy: cancelPolicy, managerContact: manager,
                roomSize: roomSize, amenities: amenitiesObj,
                description_en: descEn, description_ru: descRu, description_az: descAz
            });
            
            alert("Məlumatlar uğurla yadda saxlanıldı! (Saved successfully)");
            
            if(window.currentUserProfile) {
                window.currentUserProfile.legalAddress = address;
                window.currentUserProfile.voen = voen;
                window.currentUserProfile.iban = iban;
                window.currentUserProfile.cancelPolicy = cancelPolicy;
                window.currentUserProfile.managerContact = manager;
                window.currentUserProfile.roomSize = roomSize;
                window.currentUserProfile.amenities = amenitiesObj;
                window.currentUserProfile.description_en = descEn;
                window.currentUserProfile.description_ru = descRu;
                window.currentUserProfile.description_az = descAz;
            }
        } catch(e) {
            alert("Error: " + e.message);
        } finally {
            saveBtn.innerHTML = origHtml;
            saveBtn.disabled = false;
        }
    };

    window.generateMonthHTML = function(year, month) {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay(); 
        const startOffset = firstDay === 0 ? 6 : firstDay - 1; 

        let html = `
        <div class="calendar-month">
            <div class="calendar-month-header">
                <h4>${monthNames[month]} ${year}</h4>
                <div class="calendar-bulk-actions">
                    <button type="button" onclick="window.bulkSelectMonth(${year}, ${month}, true)">Select All</button>
                    <button type="button" onclick="window.bulkSelectMonth(${year}, ${month}, false)">Clear</button>
                </div>
            </div>
            <div class="calendar-grid">
                <div class="cal-day-name">Mon</div><div class="cal-day-name">Tue</div><div class="cal-day-name">Wed</div>
                <div class="cal-day-name">Thu</div><div class="cal-day-name">Fri</div><div class="cal-day-name">Sat</div><div class="cal-day-name">Sun</div>`;

        for (let i = 0; i < startOffset; i++) {
            html += `<div class="cal-cell empty"></div>`;
        }

        const today = new Date();
        today.setHours(0,0,0,0);

        for (let d = 1; d <= daysInMonth; d++) {
            const currentD = new Date(year, month, d);
            const dateStr = `${year}-${String(month+1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isPast = currentD < today;
            const isAvail = window.currentAvailableDates.includes(dateStr);

            if (isPast) {
                 html += `<div class="cal-cell past"><span class="cal-date-num">${d}</span></div>`;
            } else {
                 let cellClass = isAvail ? 'cal-cell available' : 'cal-cell blocked';
                 let icon = isAvail ? '<i class="fas fa-check"></i>' : '<i class="fas fa-times"></i>';
                 html += `<div id="cal-cell-${dateStr}" class="${cellClass}" onclick="window.toggleDateExtranet('${dateStr}')">
                    <span class="cal-date-num">${d}</span>
                    <span class="cal-status-icon" id="cal-icon-${dateStr}">${icon}</span>
                 </div>`;
            }
        }
        html += `</div></div>`;
        return html;
    };

    window.toggleDateExtranet = function(dateStr) {
        const idx = window.currentAvailableDates.indexOf(dateStr);
        const cell = document.getElementById(`cal-cell-${dateStr}`);
        const icon = document.getElementById(`cal-icon-${dateStr}`);

        if(idx > -1) {
            window.currentAvailableDates.splice(idx, 1);
            cell.className = 'cal-cell blocked';
            icon.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            window.currentAvailableDates.push(dateStr);
            cell.className = 'cal-cell available';
            icon.innerHTML = '<i class="fas fa-check"></i>';
        }
    };

    window.bulkSelectMonth = function(year, month, isSelect) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        today.setHours(0,0,0,0);

        for (let d = 1; d <= daysInMonth; d++) {
            const currentD = new Date(year, month, d);
            if (currentD < today) continue;
            const dateStr = `${year}-${String(month+1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const idx = window.currentAvailableDates.indexOf(dateStr);
            const cell = document.getElementById(`cal-cell-${dateStr}`);
            const icon = document.getElementById(`cal-icon-${dateStr}`);

            if(isSelect && idx === -1) {
                window.currentAvailableDates.push(dateStr);
                if(cell) cell.className = 'cal-cell available';
                if(icon) icon.innerHTML = '<i class="fas fa-check"></i>';
            } else if(!isSelect && idx > -1) {
                window.currentAvailableDates.splice(idx, 1);
                if(cell) cell.className = 'cal-cell blocked';
                if(icon) icon.innerHTML = '<i class="fas fa-times"></i>';
            }
        }
    };

    window.manageDates = function(id) {
        const item = inventory.find(i => i.id === id);
        if(!item) return;
        window.currentEditingItemId = id;
        window.currentAvailableDates = item.availableDates ? [...item.availableDates] : [];
        
        const today = new Date();
        const y1 = today.getFullYear();
        const m1 = today.getMonth();
        let y2 = y1; let m2 = m1 + 1;
        if(m2 > 11) { m2 = 0; y2++; }

        const html1 = window.generateMonthHTML(y1, m1);
        const html2 = window.generateMonthHTML(y2, m2);

        const modalHtml = `
        <div class="modal-overlay" id="calendar-modal">
            <div class="modal-content" style="max-width:700px; max-height: 85vh !important; overflow-y: auto;">
                <div class="modal-header">
                    <h2>Availability: ${item.name}</h2>
                    <button type="button" class="modal-close" onclick="document.getElementById('calendar-modal').remove()"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body" style="background: #fff;">
                    <p style="color:#666; font-size:0.9rem; margin-bottom: 20px;">Manage your availability. Green means dates are open for booking.</p>
                    ${html1}
                    ${html2}
                </div>
                <div class="modal-footer">
                    <button class="save-btn" onclick="window.saveDates()"><i class="fas fa-save"></i> Save</button>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        setTimeout(() => document.getElementById('calendar-modal').classList.add('active'), 10);
    };

    window.saveDates = async function() {
        if(!window.currentEditingItemId) return;
        const btn = document.querySelector('#calendar-modal .save-btn');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        try {
            await update(ref(db, `inventory/${window.currentEditingItemId}`), {
                availableDates: window.currentAvailableDates
            });
            document.getElementById('calendar-modal').remove();
        } catch(e) {
            alert("Error: " + e.message);
            btn.innerHTML = '<i class="fas fa-save"></i> Save';
        }
    };

    // FIX [04.04.2026]: Booking.com Modal + Multilingual Descriptions
    window.viewItemDetails = function(id) {
        const item = inventory.find(i => i.id === id);
        if(!item) return;
        window.selectedDates = []; 
        window.selectedItemToBook = item;
        
        const supplierUid = item.supplier_uid;
        
        if (supplierUid && supplierUid !== 'admin') {
            const unsub = onValue(ref(db, `users/${supplierUid}`), (snapshot) => {
                unsub(); 
                const profile = snapshot.val() || {};
                renderBookingModal(item, profile);
            });
        } else {
            renderBookingModal(item, {
                amenities: { air_conditioning: true, free_wifi: true, private_bathroom: true, tv: true },
                cancelPolicy: 'Flexible', roomSize: '25',
                description_en: "Luxurious accommodation with premium services."
            });
        }
    };

    function renderBookingModal(item, supplierProfile) {
        const amenities = supplierProfile.amenities || {};
        const cancelPolicy = supplierProfile.cancelPolicy || 'Standard';
        
        const currentLang = getCurrentLang() || 'en';
        let localizedDesc = supplierProfile[`description_${currentLang}`];
        if (!localizedDesc || localizedDesc.trim() === '') {
            localizedDesc = supplierProfile.description_en || item.included || 'Detailed description will be provided by the partner soon.';
        }
        
        let cancelHtml = '';
        if (cancelPolicy === 'Flexible') cancelHtml = '<div style="color:#27ae60; font-weight:700; margin-bottom:10px;"><i class="fas fa-check"></i> Free Cancellation (Flexible)</div>';
        else if (cancelPolicy === 'Standard') cancelHtml = '<div style="color:#f39c12; font-weight:700; margin-bottom:10px;"><i class="fas fa-info-circle"></i> Free Cancellation up to 3 days</div>';
        else cancelHtml = '<div style="color:#e74c3c; font-weight:700; margin-bottom:10px;"><i class="fas fa-times-circle"></i> Strict Policy (100% Penalty)</div>';

        let amenitiesHtml = '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:15px; font-weight:500; color:#444;">';
        if(amenities.air_conditioning) amenitiesHtml += '<div>❄️ Air Conditioning</div>';
        if(amenities.free_wifi) amenitiesHtml += '<div>📶 Free WiFi</div>';
        if(amenities.private_bathroom) amenitiesHtml += '<div>🛁 Private Bathroom</div>';
        if(amenities.balcony) amenitiesHtml += '<div>🌇 Balcony</div>';
        if(amenities.tv) amenitiesHtml += '<div>📺 TV</div>';
        if(amenities.minibar) amenitiesHtml += '<div>🍷 Mini-bar</div>';
        amenitiesHtml += '</div>';

        const roomSizeHtml = supplierProfile.roomSize ? `<div style="margin-top:15px; font-weight:600; color:#333;"><i class="fas fa-vector-square" style="color:var(--primary);"></i> Area: ${supplierProfile.roomSize}</div>` : '';

        let datesHtml = '<div style="display:grid; grid-template-columns: repeat(7, 1fr); gap:6px; margin-top:10px;">';
        let today = new Date();
        let availCount = 0;
        const availDates = item.availableDates || [];
        
        // Сетка для выбора дат (Компактный календарь Покупателя)
        for(let i=0; i<35; i++) {
            let d = new Date(today);
            d.setDate(d.getDate() + i);
            let dateStr = d.toISOString().split('T')[0];
            if(availDates.includes(dateStr)) {
                availCount++;
                datesHtml += `<div id="buyer-date-${dateStr}" class="buyer-cal-day" onclick="window.selectBookingDate('${dateStr}')">${dateStr.substring(8,10)}<br><span style="font-size:0.65rem; color:#888; font-weight:400;">${dateStr.substring(5,7)}</span></div>`;
            } else {
                datesHtml += `<div class="buyer-cal-day blocked">${dateStr.substring(8,10)}</div>`;
            }
        }
        datesHtml += '</div>';

        const starString = item.stars && item.stars !== 'Unrated' ? '⭐'.repeat(parseInt(item.stars)) : '';
        const basePrice = parseFloat(item.sellingPrice || item.price || 0).toFixed(2);

        const modalHtml = `
        <div class="modal-overlay" id="details-modal">
            <div class="modal-content" style="max-width:900px; padding:0; overflow:hidden;">
                <div style="position:relative; height:300px; background:#000;">
                    <img src="${item.image || 'placeholder.jpg'}" loading="lazy" style="width:100%; height:100%; object-fit:cover; opacity:0.8;">
                    <button type="button" onclick="document.getElementById('details-modal').remove()" style="position:absolute; top:15px; right:15px; background:rgba(0,0,0,0.5); color:white; border:none; border-radius:50%; width:40px; height:40px; font-size:1.2rem; cursor:pointer;"><i class="fas fa-times"></i></button>
                    <div style="position:absolute; bottom:20px; left:20px; color:white;">
                        <div style="font-size:0.85rem; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:5px;">${t(item.category?.toLowerCase()) || item.category}</div>
                        <h2 style="margin:0; font-size:2.2rem; text-shadow:0 2px 4px rgba(0,0,0,0.5);">${item.name}</h2>
                        ${starString ? `<div style="margin-top:5px; font-size:1.2rem;">${starString}</div>` : ''}
                    </div>
                </div>
                
                <div style="padding: 30px; display:flex; flex-wrap:wrap; gap:30px;">
                    <div style="flex: 1 1 55%;">
                        ${cancelHtml}
                        <h3 style="margin-top:15px; color:var(--dark);">About this service</h3>
                        <p style="color:#555; line-height:1.7; font-size:0.95rem; white-space: pre-line;">${localizedDesc}</p>
                        ${roomSizeHtml}
                        ${amenitiesHtml}
                        
                        <div style="margin-top:30px; background:#f8f9fa; padding:20px; border-radius:12px;">
                            <h4 style="margin-top:0; color:#333;"><i class="far fa-calendar-alt" style="color:var(--primary);"></i> Select Dates (Range)</h4>
                            <p style="font-size:0.85rem; color:#888; margin-bottom:10px;">Select your Check-in & Check-out dates.</p>
                            ${datesHtml}
                        </div>
                    </div>
                    
                    <div style="flex: 1 1 35%;">
                        <div style="border:1px solid #e1e4e8; padding:25px; border-radius:16px; position:sticky; top:20px; text-align:center;">
                            <div style="color:#888; font-size:0.85rem; font-weight:700; text-transform:uppercase;">Booking Summary</div>
                            <div id="modal-price-calc" style="margin:20px 0;">
                                <div style="font-size:0.9rem; color:#666;">Price per day: ${basePrice} AZN</div>
                                <div style="font-size:1.8rem; font-weight:800; color:var(--dark); opacity:0.5; margin-top:5px;">Total: 0.00 AZN</div>
                            </div>
                            <div id="selected-date-display" style="margin:20px 0; color:#e74c3c; font-weight:600; font-size:0.9rem;">Please select dates</div>
                            <button class="save-btn" onclick="window.confirmAddToCart()" id="add-to-package-btn" disabled style="opacity:0.5; cursor:not-allowed; width:100%;">Add to Package</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        setTimeout(() => document.getElementById('details-modal').classList.add('active'), 10);
    }

    // FIX [04.04.2026]: Логика выделения нескольких дат и умножения цены
    window.selectBookingDate = function(dateStr) {
        const availDates = window.selectedItemToBook.availableDates || [];

        if (window.selectedDates.length === 0 || window.selectedDates.length >= 2) {
            window.selectedDates = [dateStr];
        } else {
            let d1 = new Date(window.selectedDates[0]);
            let d2 = new Date(dateStr);
            
            if (d1 > d2) { const temp = d1; d1 = d2; d2 = temp; }

            window.selectedDates = [];
            let currentD = new Date(d1);
            
            while (currentD <= d2) {
                let dStr = currentD.toISOString().split('T')[0];
                if (availDates.includes(dStr)) {
                    window.selectedDates.push(dStr);
                }
                currentD.setDate(currentD.getDate() + 1);
            }
        }

        const btns = document.querySelectorAll('.buyer-cal-day');
        btns.forEach(b => { 
            if (!b.classList.contains('blocked')) {
                b.className = 'buyer-cal-day'; 
            }
        });

        if (window.selectedDates.length === 1) {
            const btn = document.getElementById(`buyer-date-${window.selectedDates[0]}`);
            if(btn) btn.classList.add('selected');
        } else if (window.selectedDates.length > 1) {
            const first = window.selectedDates[0];
            const last = window.selectedDates[window.selectedDates.length - 1];
            window.selectedDates.forEach(d => {
                const btn = document.getElementById(`buyer-date-${d}`);
                if(btn) {
                    if (d === first || d === last) btn.classList.add('selected');
                    else btn.classList.add('in-range');
                }
            });
        }

        const display = document.getElementById('selected-date-display');
        const addBtn = document.getElementById('add-to-package-btn');
        const basePrice = parseFloat(window.selectedItemToBook.sellingPrice || window.selectedItemToBook.price || 0);

        if (window.selectedDates.length > 0) {
            const days = window.selectedDates.length;
            const total = (basePrice * days).toFixed(2);
            
            document.getElementById('modal-price-calc').innerHTML = `
                <div style="font-size:0.9rem; color:#666;">Price per day: ${basePrice.toFixed(2)} AZN</div>
                <div style="font-size:0.9rem; color:#666; margin-bottom: 10px;">Selected days: ${days}</div>
                <div style="font-size:1.8rem; font-weight:800; color:var(--dark);">Total: ${total} AZN</div>
            `;
            
            display.innerHTML = `<span style="color:#008b8b;"><i class="fas fa-calendar-check"></i> ${days} day(s) selected</span>`;
            addBtn.disabled = false; addBtn.style.opacity = '1'; addBtn.style.cursor = 'pointer';
        } else {
            document.getElementById('modal-price-calc').innerHTML = `
                <div style="font-size:0.9rem; color:#666;">Price per day: ${basePrice.toFixed(2)} AZN</div>
                <div style="font-size:1.8rem; font-weight:800; color:var(--dark); opacity:0.5;">Total: 0.00 AZN</div>
            `;
            display.innerHTML = `<span style="color:#e74c3c;">Please select dates</span>`;
            addBtn.disabled = true; addBtn.style.opacity = '0.5'; addBtn.style.cursor = 'not-allowed';
        }
    };

    window.confirmAddToCart = function() {
        if(!window.selectedItemToBook || window.selectedDates.length === 0) return;
        
        const daysCount = window.selectedDates.length;
        const dateLabel = daysCount > 1 
            ? `${window.selectedDates[0]} to ${window.selectedDates[daysCount - 1]} (${daysCount} days)` 
            : window.selectedDates[0];
        
        const baseSelling = parseFloat(window.selectedItemToBook.sellingPrice || window.selectedItemToBook.price || 0);
        const baseNet = parseFloat(window.selectedItemToBook.netCost || 0);

        const itemWithDateRange = {
            ...window.selectedItemToBook,
            selectedDatesArray: window.selectedDates, 
            selectedDate: dateLabel, 
            sellingPrice: (baseSelling * daysCount).toFixed(2), 
            netCost: (baseNet * daysCount).toFixed(2),
            cartId: Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        };
        
        window.currentCart.push(itemWithDateRange);
        document.getElementById('details-modal').remove();
        window.render('bookings');
    };

    window.removeFromCart = (cartId) => {
        window.currentCart = window.currentCart.filter(i => i.cartId !== cartId);
        window.render('bookings');
    };

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

                        <div id="hotel-fields" style="display: ${(!data.category || data.category === 'Hotel') ? 'flex' : 'none'}; gap: 15px; margin-top: 15px;">
                            <div style="flex:1;">
                                <label class="input-label" data-i18n="region">Region</label>
                                <select id="t-region">
                                    <option value="Baku" ${data.region==='Baku'?'selected':''}>${t('baku')}</option>
                                    <option value="Gabala" ${data.region==='Gabala'?'selected':''}>${t('gabala')}</option>
                                    <option value="Qusar" ${data.region==='Qusar'?'selected':''}>${t('qusar')}</option>
                                    <option value="Sheki" ${data.region==='Sheki'?'selected':''}>${t('sheki')}</option>
                                    <option value="Lankaran" ${data.region==='Lankaran'?'selected':''}>${t('lankaran')}</option>
                                    <option value="Other" ${data.region==='Other'?'selected':''}>${t('other')}</option>
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
                        <label class="input-label" data-i18n="image_filename">Upload Image</label>
                        <input type="file" id="service-image" accept="image/*" style="padding: 10px; margin-bottom: 15px; border: 1px solid #e1e4e8; border-radius: 8px; width: 100%; box-sizing: border-box;">
                        <h4 data-i18n="pricing_engine" style="margin:25px 0 10px 0; font-size:1.1rem; border-bottom:1px solid #eee; padding-bottom:5px;">Pricing Engine</h4>
                        <label class="input-label" data-i18n="rack_rate" style="margin-top:5px;">Rack Rate</label>
                        <input type="number" id="t-rack-rate" value="${data.rackRate || ''}">
                        <div style="display:flex; gap:10px; margin-top:10px;">
                            <div style="flex:1;">
                                <label class="input-label" data-i18n="net_label" style="margin-top:0;">Net (Xalis)</label>
                                <input type="number" id="xalis-input" value="${data.netCost || ''}" oninput="window.calculatePrice()">
                            </div>
                            <div style="flex:1;">
                                <label class="input-label" style="margin-top:0;">${t('margin_label')} (%)</label>
                                <input type="number" id="marja-input" value="${data.markup || ''}" oninput="window.calculatePrice()" placeholder="0">
                            </div>
                            <div style="flex:1;">
                                <label class="input-label" data-i18n="selling_price" style="margin-top:0;">Selling</label>
                                <input type="number" id="satis-input" value="${data.sellingPrice || ''}" readonly style="background:#f5f5f7; color:#333; font-weight:bold; cursor:not-allowed;">
                            </div>
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
        const originalText = saveBtn ? saveBtn.innerHTML : 'SAVE ITEM';
        const nameField = document.getElementById('t-name').value.trim();
        const netInputStr = document.getElementById('xalis-input').value.trim();
        const marginInputStr = document.getElementById('marja-input').value.trim();
        const categoryVal = document.getElementById('t-category').value;
        const rackRateVal = parseFloat(document.getElementById('t-rack-rate').value || 0);
        
        if (!nameField) return alert("Забыли ввести название услуги!");
        if (!netInputStr) return alert("Забыли ввести Xalis (Нетто)!");
        
        const nCost = parseFloat(netInputStr);
        const markup = marginInputStr === '' ? 0 : parseFloat(marginInputStr);
        const sPrice = nCost + (nCost * markup / 100);

        if (categoryVal === 'Activity') {
            if (rackRateVal < 50 && sPrice < 50) {
                return alert(t('anti_dumping_error') || "Error: To prevent dumping, the minimum price for guides is 50 AZN.");
            }
        }

        if (saveBtn) { saveBtn.disabled = true; saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Загрузка...'; }

        try {
            let finalImageUrl = "";
            let preserveAvailableDates = [];
            
            if (editIdLocal) {
                const existingItem = inventory.find(x => x.id === editIdLocal);
                if (existingItem) {
                    if (existingItem.image) finalImageUrl = existingItem.image;
                    if (existingItem.availableDates) preserveAvailableDates = existingItem.availableDates;
                }
            }
            
            const fileInput = document.getElementById('service-image');
            if (fileInput && fileInput.files.length > 0 && storageRef) {
                const file = fileInput.files[0];
                const imageReference = storageRef(storage, `inventory/${Date.now()}_${file.name}`);
                const uploadResult = await uploadBytes(imageReference, file);
                finalImageUrl = await getDownloadURL(uploadResult.ref);
            }

            const tData = {
                name: nameField, supplierName: document.getElementById('t-supplier').value, category: categoryVal,
                rackRate: rackRateVal, netCost: nCost, markup: markup,
                sellingPrice: sPrice, price: sPrice, image: finalImageUrl,
                is_verified: document.getElementById('t-verified').checked, currency: 'AZN',
                region: categoryVal === 'Hotel' ? document.getElementById('t-region').value : null,
                stars: categoryVal === 'Hotel' ? document.getElementById('t-stars').value : null,
                supplier_uid: window.currentUserUid || 'admin',
                availableDates: preserveAvailableDates
            };

            if (categoryVal === 'Activity') tData.is_certified = true;
            
            if (editIdLocal) await update(ref(db, `inventory/${editIdLocal}`), tData);
            else await push(ref(db, 'inventory'), tData);
            
            const modal = document.getElementById('tour-modal');
            if (modal) modal.remove();

        } catch (err) {
            console.error("Ошибка сохранения:", err);
            alert("Ошибка: " + err.message);
            if (saveBtn) { saveBtn.disabled = false; saveBtn.innerHTML = originalText; }
        }
    };

    window.processBooking = async () => {
        if(window.currentCart.length === 0) return alert(t('empty_cart') || "Package is empty!");
        const btn = document.getElementById('checkout-btn');
        const origText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        try {
            const totalSelling = window.currentCart.reduce((sum, item) => sum + parseFloat(item.sellingPrice || item.price || 0), 0);
            const totalNet = window.currentCart.reduce((sum, item) => sum + parseFloat(item.netCost || 0), 0);
            const orderId = 'ORD-' + Date.now();
            
            const orderData = {
                orderId: orderId,
                items: window.currentCart, 
                totalSellingPrice: totalSelling, 
                totalNetPrice: totalNet,
                totalMargin: totalSelling - totalNet, 
                status: 'pending', 
                timestamp: Date.now(),
                createdAt: Date.now(),
                buyer_uid: window.currentUserUid
            };

            await push(ref(db, 'bookings'), orderData);
            window.showInvoiceModal(orderData);
            
        } catch(e) {
            console.error("Booking Error:", e);
            alert("Error: " + e.message);
            btn.innerHTML = origText; btn.disabled = false;
        }
    };

    window.showInvoiceModal = function(orderData) {
        const existingModal = document.getElementById('invoice-modal');
        if (existingModal) existingModal.remove();

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
                        <div>
                            <h1 style="margin: 0; color: var(--dark); font-family: 'Montserrat', sans-serif;">Caspian Travel Routes</h1>
                            <p style="color: #666; margin: 5px 0 0 0; font-weight: 600;">Official B2B Invoice</p>
                        </div>
                        <div style="text-align: right;">
                            <h3 style="margin: 0; color: #333; font-family: 'Montserrat', sans-serif;">INVOICE</h3>
                            <p style="margin: 5px 0 0 0; color: #666;"><strong>Order ID:</strong> ${orderData.orderId}</p>
                            <p style="margin: 5px 0 0 0; color: #666;"><strong>Date:</strong> ${dateStr}</p>
                        </div>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                        <thead>
                            <tr style="background: #f8f9fa; text-align: left;">
                                <th style="padding: 12px 10px; border-bottom: 2px solid #ddd; color: #555;">Service Details</th>
                                <th style="padding: 12px 10px; border-bottom: 2px solid #ddd; color: #555;">Type</th>
                                <th style="padding: 12px 10px; border-bottom: 2px solid #ddd; text-align: right; color: #555;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>
                    <div style="display: flex; justify-content: flex-end;">
                        <div style="min-width: 250px; background: #f8f9fa; padding: 20px; border-radius: 12px;">
                            <div style="display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: 800; color: var(--dark);">
                                <span>TOTAL:</span>
                                <span>₼ ${orderData.totalSellingPrice.toFixed(2)}</span>
                            </div>
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

    window.closeInvoiceAndClear = () => {
        const modal = document.getElementById('invoice-modal');
        if (modal) modal.remove();
        window.currentCart = [];
        alert(t('booking_success') || "Sifariş uğurla yaradıldı!");
        window.render('bookings');
    };
});