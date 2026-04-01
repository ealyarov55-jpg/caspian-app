import { calculateDashboardStats } from './analytics.js';
import { loadLanguage, applyTranslations, getCurrentLang, t } from './i18n.js';

document.addEventListener('DOMContentLoaded', async () => {
    const { db, dbFunc, auth, authFunc } = window;
    const { ref, push, set, onValue, remove, update } = dbFunc;
    const { signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence } = authFunc;

    let inventory = []; 
    let bookings = []; 
    let searchQuery = ""; 
    let currentFilter = "All"; 
    let currentPage = 'home'; 
    let isAuthReady = false; 

    // === ИНИЦИАЛИЗАЦИЯ ЯЗЫКА ===
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

    // === ЛОГИН (ЗАЩИТА ОТ 400 И ПЕРЕЗАГРУЗКИ) ===
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

    // === ИНИЦИАЛИЗАЦИЯ AUTH ===
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

    // === СЛУШАТЕЛИ БАЗЫ (РЕАКТИВНОСТЬ) ===
    try {
        onValue(ref(db, 'inventory'), (snapshot) => {
            const data = snapshot.val();
            inventory = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
            if (isAuthReady && ['inventory', 'home'].includes(currentPage)) renderInternal(currentPage);
        });

        onValue(ref(db, 'bookings'), (snapshot) => {
            const data = snapshot.val();
            bookings = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
            if (isAuthReady && ['bookings', 'home'].includes(currentPage)) renderInternal(currentPage);
        });
    } catch (e) { console.error("Firebase error:", e); }

    // === ГЛАВНЫЙ РЕНДЕР ===
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
                } else {
                    dynamicHeader.innerHTML = '';
                }
            }

            if (page === 'home') {
                const stats = calculateDashboardStats(inventory);
                content.innerHTML = `
                    <div style="padding:15px 15px 100px 15px;">
                        <h2 style="margin-bottom:8px; font-size: 2rem;" data-i18n="welcome">Welcome, Boss! 🤝</h2>
                        
                        <div class="metric-container" style="margin-top: 25px;">
                            <div class="card metric-card" style="border: 2px solid #27ae60;">
                                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                                    <div>
                                        <div style="font-size:0.75rem; font-weight:700; color:#888;" data-i18n="saved_commissions">Saved B2B Commissions</div>
                                        <div class="savings-text" style="font-size:2.2rem; margin:5px 0;">${stats.savings} AZN</div>
                                    </div>
                                    <div style="width:48px; height:48px; background:#e8f5e9; border-radius:12px; display:flex; align-items:center; justify-content:center; color:#27ae60; font-size:1.4rem;"><i class="fas fa-piggy-bank"></i></div>
                                </div>
                            </div>
                            <div class="card metric-card">
                                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                                    <div>
                                        <div style="font-size:0.75rem; font-weight:700; color:#888;" data-i18n="total_volume">Total Volume (Net)</div>
                                        <div style="font-size:2.2rem; font-weight:800; margin:5px 0;">${stats.volume} AZN</div>
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
                let filteredInventory = inventory.filter(x => (x.name || '').toLowerCase().includes(searchQuery.toLowerCase()));
                if (currentFilter !== 'All') filteredInventory = filteredInventory.filter(x => x.category === currentFilter);

                const listHtml = filteredInventory.map(item => {
                    const sellP = parseFloat(item.sellingPrice || item.price || 0);
                    const rackR = parseFloat(item.rackRate || 0);
                    let coverImage = item.image || "baku_night.jpg"; 
                    
                    let translatedCat = t(item.category.toLowerCase()) || item.category;
                    let badgeClass = item.category === 'Hotel' ? 'badge-hotel' : (item.category === 'Transport' ? 'badge-transport' : 'badge-activity');
                    const verifiedBadge = item.is_verified ? `<i class="fas fa-shield-alt verified-icon" title="Verified Partner" style="color:#27ae60;"></i>` : '';

                    return `
                    <div class="tour-card fade-in">
                        <div style="position: relative;">
                            <img src="${coverImage}" loading="lazy" class="tour-image" onerror="this.style.opacity='0'; this.style.backgroundColor='#f0f2f5';">
                            <div style="position:absolute; top:16px; left:16px;"><span class="badge ${badgeClass}">${translatedCat}</span></div>
                            <div style="position:absolute; bottom:-16px; right:16px; background:var(--dark); color:white; padding:8px 20px; border-radius:25px; box-shadow:0 4px 15px rgba(0,0,0,0.15); z-index: 2;">
                                <span class="price-tag" style="color:white; font-size:1.2rem;">${item.currency==='AZN'?'₼':'$'}${sellP}</span>
                            </div>
                        </div>
                        <div class="tour-card-content">
                            <div style="font-size:0.75rem; color:#888; text-transform:uppercase; font-weight:700;">
                                ${item.supplierName || 'Caspian Direct'} ${verifiedBadge}
                            </div>
                            <h3 style="margin-top:4px;">${item.name}</h3>
                            ${rackR > sellP ? `<div style="font-size:0.8rem; color:#999; text-decoration:line-through;">Rack Rate: ${rackR} ${item.currency||'AZN'}</div>` : ''}
                            
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
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px;">
                            <h2 style="margin:0;" data-i18n="inventory">Inventory</h2>
                        </div>
                        <div class="filter-bar">
                            <button class="filter-btn ${currentFilter === 'All' ? 'active' : ''}" onclick="window.setFilter('All')">All</button>
                            <button class="filter-btn ${currentFilter === 'Hotel' ? 'active' : ''}" onclick="window.setFilter('Hotel')">${t('hotel')}</button>
                            <button class="filter-btn ${currentFilter === 'Transport' ? 'active' : ''}" onclick="window.setFilter('Transport')">${t('transport')}</button>
                        </div>
                        <div style="position:relative;">
                            <i class="fas fa-search" style="position:absolute; left:16px; top:18px; color:#aaa;"></i>
                            <input type="text" id="search-input" data-i18n="search_placeholder" placeholder="Search..." value="${searchQuery}" style="padding-left:45px; margin-top:0;">
                        </div>
                        <div id="tours-list">${listHtml || '<p style="text-align:center;">No items found in database</p>'}</div>
                    </div>`;
                
                const searchInput = document.getElementById('search-input');
                if (searchInput) searchInput.addEventListener('input', (e) => { searchQuery = e.target.value; window.render('inventory'); });
            }

            else if (page === 'bookings') {
                content.innerHTML = `<div style="padding:15px;"><h2 data-i18n="nav_bookings">Bookings</h2><p style="color:#666;" data-i18n="under_construction">Section Under Construction</p></div>`;
            }
            else if (page === 'partners') {
                content.innerHTML = `<div style="padding:15px;"><h2 data-i18n="nav_partners">Partners</h2><p style="color:#666;" data-i18n="under_construction">Section Under Construction</p></div>`;
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

        } catch (e) {
            console.error("Critical Render Error:", e);
        }
    }

    // === ИДЕАЛЬНАЯ МОДАЛЬНАЯ ФОРМА (С ЖЕСТКИМИ ID И СКРОЛЛОМ) ===
    window.showForm = function(data = {}) {
        const existingModal = document.getElementById('tour-modal');
        if (existingModal) existingModal.remove();
        
        window.calculatePrice = () => {
            const netField = document.getElementById('xalis-input');
            const marginField = document.getElementById('marja-input');
            const sellingField = document.getElementById('satis-input');
            
            const net = parseFloat(netField.value) || 0;
            const margin = parseFloat(marginField.value) || 0;
            
            if (net > 0 && margin >= 0) {
                const total = net + (net * margin / 100);
                sellingField.value = total.toFixed(2);
            } else {
                sellingField.value = '';
            }
            window.validateForm();
        };

        window.validateForm = () => {
            const name = document.getElementById('t-name').value.trim();
            const net = document.getElementById('xalis-input').value;
            const margin = document.getElementById('marja-input').value;
            const saveBtn = document.getElementById('save-btn');
            
            if (name !== '' && net !== '' && margin !== '') {
                saveBtn.disabled = false;
                saveBtn.style.opacity = '1';
                saveBtn.style.cursor = 'pointer';
            } else {
                saveBtn.disabled = true;
                saveBtn.style.opacity = '0.5';
                saveBtn.style.cursor = 'not-allowed';
            }
        };

        const modalHtml = `
        <div class="modal-overlay" id="tour-modal">
            <div class="modal-content">
                <form id="service-form" onsubmit="window.saveItem(event, '${data.id || ''}')">
                    <div class="modal-header">
                        <h2 data-i18n="add_service">${data.id ? t('add_service') : t('add_service')}</h2>
                        <button type="button" class="modal-close" onclick="document.getElementById('tour-modal').remove()"><i class="fas fa-times"></i></button>
                    </div>
                    
                    <div class="modal-body">
                        <label class="input-label" data-i18n="service_name">Service Name</label>
                        <input type="text" id="t-name" value="${data.name || ''}" oninput="window.validateForm()" required>
                        
                        <div style="display:flex; gap:15px;">
                            <div style="flex:1;">
                                <label class="input-label" data-i18n="supplier_name">Supplier Name</label>
                                <input type="text" id="t-supplier" value="${data.supplierName || ''}" required>
                            </div>
                            <div style="flex:1;">
                                <label class="input-label" data-i18n="service_type">Service Type</label>
                                <select id="t-category">
                                    <option value="Hotel" ${data.category==='Hotel'?'selected':''}>${t('hotel')}</option>
                                    <option value="Transport" ${data.category==='Transport'?'selected':''}>${t('transport')}</option>
                                </select>
                            </div>
                        </div>
                        
                        <label class="checkbox-label">
                            <input type="checkbox" id="t-verified" ${data.is_verified ? 'checked' : ''}>
                            <span data-i18n="verified_status">Verified Partner Status</span>
                        </label>
                        
                        <h4 data-i18n="pricing_engine" style="margin:25px 0 10px 0; font-size:1.1rem; border-bottom:1px solid #eee; padding-bottom:5px;">Pricing Engine</h4>
                        
                        <div style="display:flex; gap:15px;">
                            <div style="flex:1;">
                                <label class="input-label" data-i18n="rack_rate">Rack Rate</label>
                                <input type="number" id="t-rack-rate" value="${data.rackRate || ''}" required>
                            </div>
                            <div style="flex:1;">
                                <label class="input-label" data-i18n="net_label">Net Cost (Xalis)</label>
                                <input type="number" id="xalis-input" value="${data.netCost || ''}" oninput="window.calculatePrice()" required>
                            </div>
                        </div>
                        
                        <div style="display:flex; gap:15px; margin-top:10px;">
                            <div style="flex:1;">
                                <label class="input-label">${t('margin_label')} (Marja %)</label>
                                <input type="number" id="marja-input" value="${data.markup || ''}" oninput="window.calculatePrice()" required>
                            </div>
                            <div style="flex:1;">
                                <label class="input-label" data-i18n="selling_price">Selling Price</label>
                                <input type="number" id="satis-input" value="${data.sellingPrice || ''}" readonly style="background:#f9f9f9; color:#333; font-weight:bold; cursor:not-allowed;">
                            </div>
                        </div>

                        <label class="input-label" data-i18n="image_filename">Image filename</label>
                        <input type="text" id="t-image" value="${data.image || ''}">
                        
                        <label class="input-label" data-i18n="description">Description</label>
                        <textarea id="t-included" style="height:80px;">${data.included || ''}</textarea>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn-action btn-edit" style="flex:1; padding:14px;" onclick="document.getElementById('tour-modal').remove()" data-i18n="cancel">CANCEL</button>
                        <button type="submit" class="save-btn" id="save-btn" style="flex:2; padding:14px; opacity:0.5; cursor:not-allowed;" disabled data-i18n="save_item">SAVE ITEM</button>
                    </div>
                </form>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        applyTranslations();
        if (data.id) window.validateForm();
        setTimeout(() => document.getElementById('tour-modal').classList.add('active'), 10);
    }

    // === СОХРАНЕНИЕ УСЛУГИ ===
    window.saveItem = function(e, editIdLocal) {
        e.preventDefault(); 
        
        const sPrice = parseFloat(document.getElementById('satis-input').value);
        const nCost = parseFloat(document.getElementById('xalis-input').value || 0);
        const markup = parseFloat(document.getElementById('marja-input').value || 0);
        
        if (isNaN(sPrice) || isNaN(nCost)) return alert("Please calculate prices correctly.");

        const tData = {
            name: document.getElementById('t-name').value, 
            supplierName: document.getElementById('t-supplier').value,
            category: document.getElementById('t-category').value,
            rackRate: parseFloat(document.getElementById('t-rack-rate').value || 0),
            netCost: nCost, 
            markup: markup,
            sellingPrice: sPrice, 
            price: sPrice, 
            image: document.getElementById('t-image').value || "",
            included: document.getElementById('t-included').value || "",
            is_verified: document.getElementById('t-verified').checked, 
            currency: 'AZN'
        };
        
        if (editIdLocal) {
            update(ref(db, `inventory/${editIdLocal}`), tData);
        } else {
            push(ref(db, 'inventory'), tData);
        }
        
        document.getElementById('tour-modal').remove();
    };
});