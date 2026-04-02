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

    try { await loadLanguage(getCurrentLang()); } 
    catch (e) { console.error("i18n init error:", e); }

    window.setLanguage = async (lang) => { 
        try {
            await loadLanguage(lang); 
            window.render(currentPage); 
        } catch (e) { console.error("Language switch error:", e); }
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
            const profileBtn = document.getElementById('nav-profile');
            const loginBtn = document.getElementById('nav-login');
            const logoutBtn = document.getElementById('nav-logout');
            if (profileBtn) profileBtn.style.display = window.isAuthenticated ? 'flex' : 'none';
            if (logoutBtn) logoutBtn.style.display = window.isAuthenticated ? 'flex' : 'none';
            if (loginBtn) loginBtn.style.display = window.isAuthenticated ? 'none' : 'flex';

            if (!user && ['home', 'bookings', 'partners', 'profile'].includes(currentPage)) currentPage = 'login';
            if (user && currentPage === 'login') currentPage = 'home';
            if (!isAuthReady) {
                isAuthReady = true;
                const loader = document.getElementById('auth-loader');
                if (loader) loader.classList.add('hidden'); 
            }
            renderInternal(currentPage);
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
            if (!window.isAuthenticated && ['home', 'bookings', 'partners', 'profile'].includes(page)) {
                page = 'login'; currentPage = 'login';
            }

            document.querySelector('.bottom-nav').style.display = page === 'login' ? 'none' : 'flex';
            document.querySelectorAll('.bottom-nav button').forEach(btn => btn.classList.remove('active'));
            const activeBtn = document.getElementById(`nav-${page}`);
            if (activeBtn) activeBtn.classList.add('active');

            const dynamicHeader = document.getElementById('dynamic-header-actions');
            if (dynamicHeader) {
                if (page === 'inventory' && window.isAuthenticated) {
                    dynamicHeader.innerHTML = `<button class="btn-primary" onclick="window.showForm();" style="padding: 6px 14px; border-radius:8px; font-size: 0.85rem;"><i class="fas fa-plus"></i> <span data-i18n="add_service">Add Service</span></button>`;
                } else if (page === 'partners' && window.isAuthenticated) {
                    dynamicHeader.innerHTML = `<button class="btn-primary" onclick="window.showPartnerForm();" style="padding: 6px 14px; border-radius:8px; font-size: 0.85rem;"><i class="fas fa-plus"></i> <span data-i18n="add_partner">Add Partner</span></button>`;
                } else {
                    dynamicHeader.innerHTML = '';
                }
            }

            if (page === 'home') {
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
                if (searchQuery) {
                    const q = searchQuery.toLowerCase();
                    filteredInventory = inventory.filter(x => (x.name || '').toLowerCase().includes(q) || (x.supplierName || '').toLowerCase().includes(q));
                }
                if (currentFilter !== 'All') {
                    filteredInventory = filteredInventory.filter(x => x.category === currentFilter);
                }
                if (window.regionFilter !== 'All') {
                    filteredInventory = filteredInventory.filter(x => x.region === window.regionFilter);
                }
                if (window.starsFilter !== 'All') {
                    filteredInventory = filteredInventory.filter(x => x.stars === window.starsFilter);
                }

                const listHtml = filteredInventory.map(item => {
                    const sellP = parseFloat(item.sellingPrice || item.price || 0);
                    const rackR = parseFloat(item.rackRate || 0);
                    let coverImage = item.image || "baku_night.jpg"; 
                    let badgeClass = item.category === 'Hotel' ? 'badge-hotel' : (item.category === 'Transport' ? 'badge-transport' : 'badge-activity');
                    const verifiedBadge = item.is_verified ? `<i class="fas fa-shield-alt verified-icon" title="Verified Partner" style="color:#27ae60;"></i>` : '';

                    let hotelMeta = '';
                    if (item.category === 'Hotel' && item.region) {
                        const starString = item.stars === 'Unrated' ? t('unrated') : '⭐'.repeat(parseInt(item.stars) || 0);
                        hotelMeta = `<div style="font-size:0.85rem; color:#f39c12; margin-top:4px; font-weight:600;">${starString} <span style="color:#888; font-weight:400;">| ${t(item.region.toLowerCase())}</span></div>`;
                    }

                    return `
                    <div class="tour-card fade-in">
                        <div style="position: relative;">
                            <img src="${coverImage}" loading="lazy" class="tour-image" onerror="this.style.opacity='0'; this.style.backgroundColor='#f0f2f5';">
                            <div style="position:absolute; top:16px; left:16px;"><span class="badge ${badgeClass}">${t(item.category.toLowerCase()) || item.category}</span></div>
                            <div style="position:absolute; bottom:-16px; right:16px; background:var(--dark); color:white; padding:8px 20px; border-radius:25px; box-shadow:0 4px 15px rgba(0,0,0,0.15); z-index: 2;">
                                <span class="price-tag" style="color:white; font-size:1.2rem;">${item.currency==='AZN'?'₼':'$'}${sellP}</span>
                            </div>
                        </div>
                        <div class="tour-card-content">
                            <div style="font-size:0.75rem; color:#888; text-transform:uppercase; font-weight:700;">${item.supplierName || 'Caspian Direct'} ${verifiedBadge}</div>
                            <h3 style="margin:4px 0 0 0;">${item.name}</h3>
                            ${hotelMeta}
                            <div style="margin-top:10px;"></div>
                            ${window.isAuthenticated ? `
                            <div style="background:#f8f9fa; padding:10px 12px; border-radius:8px; margin-top:auto; font-size:0.85rem; display:flex; justify-content:space-between; border: 1px solid #e1e4e8;">
                                <span style="color:#555;">${t('net_label')}: <b style="color:#e74c3c;">${item.netCost || 0}</b></span>
                                <span style="font-weight:700; color:#27ae60;">${t('margin_label')}: ${item.markup || 0}%</span>
                            </div>` : ''}
                            <div style="display:flex; gap:10px; margin-top:15px;">
                                ${window.isAuthenticated ? `
                                    <button onclick="window.editItem('${item.id}')" class="btn-action btn-edit" style="flex:1;"><i class="fas fa-pen"></i></button>
                                    <button onclick="window.deleteItem('${item.id}')" class="btn-action btn-delete" style="flex:1;"><i class="fas fa-trash"></i></button>
                                ` : `<button class="btn-primary" style="flex:1;">BOOK NOW</button>`}
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
                                    <option value="All" ${window.regionFilter === 'All' ? 'selected' : ''}>${t('all_regions')}</option>
                                    <option value="Baku" ${window.regionFilter === 'Baku' ? 'selected' : ''}>${t('baku')}</option>
                                    <option value="Gabala" ${window.regionFilter === 'Gabala' ? 'selected' : ''}>${t('gabala')}</option>
                                    <option value="Qusar" ${window.regionFilter === 'Qusar' ? 'selected' : ''}>${t('qusar')}</option>
                                    <option value="Sheki" ${window.regionFilter === 'Sheki' ? 'selected' : ''}>${t('sheki')}</option>
                                    <option value="Lankaran" ${window.regionFilter === 'Lankaran' ? 'selected' : ''}>${t('lankaran')}</option>
                                    <option value="Other" ${window.regionFilter === 'Other' ? 'selected' : ''}>${t('other')}</option>
                                </select>
                            </div>
                            <div style="flex: 1 1 calc(50% - 5px);">
                                <select id="filter-stars" style="margin-top:0;" onchange="window.setStarsFilter(this.value)">
                                    <option value="All" ${window.starsFilter === 'All' ? 'selected' : ''}>${t('all_stars')}</option>
                                    <option value="3" ${window.starsFilter === '3' ? 'selected' : ''}>3 ⭐</option>
                                    <option value="4" ${window.starsFilter === '4' ? 'selected' : ''}>4 ⭐</option>
                                    <option value="5" ${window.starsFilter === '5' ? 'selected' : ''}>5 ⭐</option>
                                    <option value="Unrated" ${window.starsFilter === 'Unrated' ? 'selected' : ''}>${t('unrated')}</option>
                                </select>
                            </div>
                        </div>
                        <div id="tours-list">${listHtml || '<p style="text-align:center; color:#888; margin-top:30px;">No items match your criteria</p>'}</div>
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
                
                if (window.bookingFilter !== 'All') {
                    filteredForBooking = inventory.filter(x => x.category === window.bookingFilter);
                }
                if (window.regionFilter !== 'All') {
                    filteredForBooking = filteredForBooking.filter(x => x.region === window.regionFilter);
                }
                if (window.starsFilter !== 'All') {
                    filteredForBooking = filteredForBooking.filter(x => x.stars === window.starsFilter);
                }

                const leftHtml = filteredForBooking.map(item => {
                    const sellP = parseFloat(item.sellingPrice || item.price || 0);
                    let hotelMeta = '';
                    if (item.category === 'Hotel' && item.region) {
                        const starString = item.stars === 'Unrated' ? t('unrated') : '⭐'.repeat(parseInt(item.stars) || 0);
                        hotelMeta = `<div style="font-size:0.75rem; color:#f39c12;">${starString} | ${t(item.region.toLowerCase())}</div>`;
                    }

                    return `
                    <div class="card" style="padding:15px; display:flex; justify-content:space-between; align-items:center; gap:10px; border-left: 4px solid var(--primary);">
                        <div>
                            <div style="font-size:0.75rem; color:#888; font-weight:700;">${t(item.category?.toLowerCase()) || item.category} | ${item.supplierName || ''}</div>
                            <h4 style="margin:4px 0;">${item.name}</h4>
                            ${hotelMeta}
                            <div style="color:var(--dark); font-weight:800; margin-top:4px;">${item.currency==='AZN'?'₼':'$'}${sellP}</div>
                        </div>
                        <button onclick="window.addToCart('${item.id}')" class="btn-primary" style="padding:10px 15px; border-radius:8px; font-size:0.85rem;"><i class="fas fa-plus"></i></button>
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
                            <div style="font-size:0.8rem; color:#888;">${cartItem.currency==='AZN'?'₼':'$'}${cartItem.sellingPrice || cartItem.price || 0}</div>
                        </div>
                        <button onclick="window.removeFromCart('${cartItem.cartId}')" class="btn-action btn-delete" style="padding:6px 10px; border-radius:6px;"><i class="fas fa-times"></i></button>
                    </div>`;
                }).join('');

                content.innerHTML = `
                    <div style="padding:15px; display:flex; flex-wrap:wrap; gap:25px; padding-bottom:100px;">
                        <div style="flex: 1 1 55%; min-width:300px;">
                            <h2 style="margin-bottom:15px;" data-i18n="nav_bookings">Bookings</h2>
                            <div class="filter-bar" style="margin-bottom:15px;">
                                <button class="filter-btn ${window.bookingFilter === 'All' ? 'active' : ''}" onclick="window.setBookingFilter('All')">All</button>
                                <button class="filter-btn ${window.bookingFilter === 'Hotel' ? 'active' : ''}" onclick="window.setBookingFilter('Hotel')">${t('hotel')}</button>
                                <button class="filter-btn ${window.bookingFilter === 'Transport' ? 'active' : ''}" onclick="window.setBookingFilter('Transport')">${t('transport')}</button>
                                <button class="filter-btn ${window.bookingFilter === 'Activity' ? 'active' : ''}" onclick="window.setBookingFilter('Activity')">${t('activity')}</button>
                            </div>
                            <div style="display:flex; gap:10px; margin-bottom: 20px;">
                                <div style="flex: 1;">
                                    <select id="filter-region" style="margin-top:0;" onchange="window.setRegionFilter(this.value)">
                                        <option value="All" ${window.regionFilter === 'All' ? 'selected' : ''}>${t('all_regions')}</option>
                                        <option value="Baku" ${window.regionFilter === 'Baku' ? 'selected' : ''}>${t('baku')}</option>
                                        <option value="Gabala" ${window.regionFilter === 'Gabala' ? 'selected' : ''}>${t('gabala')}</option>
                                        <option value="Qusar" ${window.regionFilter === 'Qusar' ? 'selected' : ''}>${t('qusar')}</option>
                                        <option value="Sheki" ${window.regionFilter === 'Sheki' ? 'selected' : ''}>${t('sheki')}</option>
                                        <option value="Lankaran" ${window.regionFilter === 'Lankaran' ? 'selected' : ''}>${t('lankaran')}</option>
                                        <option value="Other" ${window.regionFilter === 'Other' ? 'selected' : ''}>${t('other')}</option>
                                    </select>
                                </div>
                                <div style="flex: 1;">
                                    <select id="filter-stars" style="margin-top:0;" onchange="window.setStarsFilter(this.value)">
                                        <option value="All" ${window.starsFilter === 'All' ? 'selected' : ''}>${t('all_stars')}</option>
                                        <option value="3" ${window.starsFilter === '3' ? 'selected' : ''}>3 ⭐</option>
                                        <option value="4" ${window.starsFilter === '4' ? 'selected' : ''}>4 ⭐</option>
                                        <option value="5" ${window.starsFilter === '5' ? 'selected' : ''}>5 ⭐</option>
                                        <option value="Unrated" ${window.starsFilter === 'Unrated' ? 'selected' : ''}>${t('unrated')}</option>
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
                                    ${window.isAuthenticated ? `
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

            else if (page === 'partners') {
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
                            ${p.documentUrl ? `<a href="${p.documentUrl}" target="_blank" style="color:var(--dark); font-size:1.8rem; transition:0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--dark)'"><i class="fas fa-file-pdf"></i></a>` : ''}
                        </div>
                        ${window.isAuthenticated ? `
                        <div style="display:flex; gap:10px; margin-top:20px; border-top: 1px solid #f0f2f5; padding-top: 15px;">
                            <button onclick="window.deletePartner('${p.id}')" class="btn-action btn-delete" style="flex:1;"><i class="fas fa-trash"></i> Удалить</button>
                        </div>` : ''}
                    </div>`
                }).join('');

                content.innerHTML = `
                    <div style="padding:15px 15px 100px 15px;">
                        <h2 style="margin-bottom: 20px;" data-i18n="partners_list">Our Partners</h2>
                        <div id="tours-list">${partnersHtml || '<p style="text-align:center; color:#888;">Нет добавленных партнеров</p>'}</div>
                    </div>`;
            }
            
            else if (page === 'profile') {
                content.innerHTML = `
                    <div style="padding:40px 20px; text-align:center;">
                        <div class="card" style="padding:50px 20px; border-radius:24px; margin: 0 auto; max-width: 400px;">
                            <h2 style="margin:0 0 10px 0; color:#1a1a1a; font-family:'Montserrat', sans-serif;" data-i18n="nav_profile">Profile</h2>
                            <button class="btn-action btn-delete" onclick="window.logout()" style="width:100%; padding:16px; font-weight:700; background:#fff0f0;" data-i18n="logout">Logout</button>
                        </div>
                    </div>`;
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

    window.addToCart = (id) => {
        const item = inventory.find(i => i.id === id);
        if (item) {
            window.currentCart.push({ ...item, cartId: Date.now() + '_' + Math.random().toString(36).substr(2, 9) });
            window.render('bookings');
        }
    };
    window.removeFromCart = (cartId) => {
        window.currentCart = window.currentCart.filter(i => i.cartId !== cartId);
        window.render('bookings');
    };

    // FIX [02.04.2026]: Новая логика обработки заказа и создания B2B-Инвойса
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
                createdAt: Date.now()
            };

            // Сохраняем в базу данных
            await push(ref(db, 'bookings'), orderData);
            
            // Вызываем рендер инвойса
            window.showInvoiceModal(orderData);
            
        } catch(e) {
            console.error("Booking Error:", e);
            alert("Error: " + e.message);
            btn.innerHTML = origText; btn.disabled = false;
        }
    };

    // FIX [02.04.2026]: Генерация HTML-инвойса для клиента
    window.showInvoiceModal = function(orderData) {
        const existingModal = document.getElementById('invoice-modal');
        if (existingModal) existingModal.remove();

        const itemsHtml = orderData.items.map(item => `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 10px; font-family: 'Inter', sans-serif;">${item.name}</td>
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
                        <label class="input-label" data-i18n="description">Description</label>
                        <textarea id="t-included" style="height:80px;">${data.included || ''}</textarea>
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
            if (editIdLocal) {
                const existingItem = inventory.find(x => x.id === editIdLocal);
                if (existingItem && existingItem.image) finalImageUrl = existingItem.image;
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
                sellingPrice: sPrice, price: sPrice, image: finalImageUrl, included: document.getElementById('t-included').value || "",
                is_verified: document.getElementById('t-verified').checked, currency: 'AZN',
                region: categoryVal === 'Hotel' ? document.getElementById('t-region').value : null,
                stars: categoryVal === 'Hotel' ? document.getElementById('t-stars').value : null
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

    window.deletePartner = async (id) => { 
        if(confirm('Точно удалить этого партнера?')) {
            try { await remove(ref(db, `partners/${id}`)); } 
            catch(e) { console.error("Delete error:", e); }
        } 
    };

    window.showPartnerForm = function() {
        const existingModal = document.getElementById('partner-modal');
        if (existingModal) existingModal.remove();

        const modalHtml = `
        <div class="modal-overlay" id="partner-modal">
            <div class="modal-content">
                <form id="partner-form" onsubmit="window.handlePartnerSave(event)" novalidate>
                    <div class="modal-header">
                        <h2 data-i18n="add_partner">Add Partner</h2>
                        <button type="button" class="modal-close" onclick="document.getElementById('partner-modal').remove()"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        <label class="input-label" data-i18n="company_name">Company Name</label>
                        <input type="text" id="p-name" required placeholder="Caspian Hotels LLC">
                        <label class="input-label" data-i18n="partner_type">Partner Type</label>
                        <select id="p-type">
                            <option value="Hotel">${t('hotel')}</option>
                            <option value="Transport">${t('transport')}</option>
                            <option value="Activity">${t('activity')}</option>
                        </select>
                        <div style="display:flex; gap:15px;">
                            <div style="flex:1;">
                                <label class="input-label" data-i18n="contact_person">Contact Person</label>
                                <input type="text" id="p-contact" required>
                            </div>
                            <div style="flex:1;">
                                <label class="input-label" data-i18n="phone">Phone</label>
                                <input type="tel" id="p-phone" required placeholder="+994...">
                            </div>
                        </div>
                        <label class="input-label" data-i18n="upload_license">Upload License / VÖEN</label>
                        <input type="file" id="p-document" accept=".pdf,image/*" style="padding: 10px; margin-bottom: 15px; border: 1px solid #e1e4e8; border-radius: 8px; width: 100%; box-sizing: border-box;">
                        <label class="checkbox-label">
                            <input type="checkbox" id="p-verified">
                            <span data-i18n="verified_partner">Verified Partner</span>
                        </label>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn-action btn-edit" style="flex:1; padding:14px;" onclick="document.getElementById('partner-modal').remove()" data-i18n="cancel">CANCEL</button>
                        <button type="submit" class="save-btn" id="save-partner-btn" style="flex:2; padding:14px;" data-i18n="save_item">SAVE</button>
                    </div>
                </form>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        applyTranslations();
        setTimeout(() => document.getElementById('partner-modal').classList.add('active'), 10);
    };

    window.handlePartnerSave = async function(e) {
        e.preventDefault(); 
        const saveBtn = document.getElementById('save-partner-btn');
        const originalText = saveBtn.innerHTML;
        const nameField = document.getElementById('p-name').value.trim();
        if (!nameField) return alert("Введите название компании!");

        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Загрузка...';

        try {
            let documentUrl = "";
            const fileInput = document.getElementById('p-document');
            if (fileInput && fileInput.files.length > 0 && storageRef) {
                const file = fileInput.files[0];
                const docReference = storageRef(storage, `partners_docs/${Date.now()}_${file.name}`);
                const uploadResult = await uploadBytes(docReference, file);
                documentUrl = await getDownloadURL(uploadResult.ref);
            }

            const partnerData = {
                name: nameField, type: document.getElementById('p-type').value, contact: document.getElementById('p-contact').value.trim(),
                phone: document.getElementById('p-phone').value.trim(), is_verified: document.getElementById('p-verified').checked,
                documentUrl: documentUrl, createdAt: Date.now()
            };
            
            await push(ref(db, 'partners'), partnerData);
            document.getElementById('partner-modal').remove();

        } catch (err) {
            console.error("Ошибка сохранения партнера:", err);
            alert("Ошибка: " + err.message);
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalText;
        }
    };
});