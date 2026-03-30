import { initAuth } from './auth.js';
import { initInventory } from './inventory.js';

document.addEventListener('DOMContentLoaded', () => {
    window.currentPage = 'home';
    window.searchQuery = "";
    window.currentFilter = "All";

    // Инициализация модулей
    initAuth(renderInternal);
    initInventory(renderInternal);

    window.render = (page) => { window.currentPage = page; renderInternal(page); };
    window.setFilter = (filter) => { window.currentFilter = filter; window.render('inventory'); };

    // --- UI RENDER ENGINE ---
    function renderInternal(page) {
        if (!window.isAuthReady) return; 
        const content = document.getElementById('app-content');
        if (!content) return;

        updateNav(page);

        if (page === 'inventory') {
            let filteredInventory = window.inventory.filter(t => t.name.toLowerCase().includes(window.searchQuery.toLowerCase()));
            if (window.currentFilter !== 'All') {
                filteredInventory = filteredInventory.filter(t => t.category === window.currentFilter);
            }

            const listHtml = filteredInventory.map(t => {
                const sellP = parseFloat(t.sellingPrice || t.price || 0);
                // ЗОЛОТОЙ ЭТАЛОН: Не меняем пути, грузим как есть
                let coverImage = t.image || "baku_night.jpg"; 

                let badgeClass = t.category === 'Hotel' ? 'badge-hotel' : (t.category === 'Transport' ? 'badge-transport' : 'badge-activity');

                return `
                <div class="tour-card fade-in">
                    <div style="position: relative;">
                        <img src="${coverImage}" loading="lazy" class="tour-image" alt="${t.name}" onerror="this.style.opacity='0'; this.style.backgroundColor='#f0f2f5';">
                        
                        <div style="position:absolute; top:16px; left:16px;">
                            <span class="badge ${badgeClass}">${t.category}</span>
                        </div>
                        <div style="position:absolute; bottom:-16px; right:16px; background:var(--dark); color:white; padding:8px 20px; border-radius:25px; box-shadow:0 4px 15px rgba(0,0,0,0.15); z-index: 2;">
                            <span class="price-tag" style="color:white; font-size:1.2rem;">${t.currency==='AZN'?'₼':'$'}${sellP}</span>
                        </div>
                    </div>
                    
                    <div class="tour-card-content">
                        <div style="font-size:0.75rem; color:#888; text-transform:uppercase; font-weight:700;">${t.supplierName || 'Caspian Direct'}</div>
                        <h3 style="margin-top:4px;">${t.name}</h3>
                        
                        ${window.isAuthenticated ? `
                        <div style="background:#f8f9fa; padding:10px 12px; border-radius:8px; margin-top:auto; font-size:0.85rem; display:flex; justify-content:space-between; border: 1px solid #e1e4e8;">
                            <span style="color:#555;">Net: <b style="color:#e74c3c;">${t.netCost}</b></span>
                            <span style="font-weight:700; color:#27ae60;">Margin: ${t.markup || 0}%</span>
                        </div>` : ''}

                        <div style="display:flex; gap:10px; margin-top:15px;">
                            ${window.isAuthenticated ? `
                                <button onclick="deleteItem('${t.id}')" class="btn-action btn-delete" style="flex:1;"><i class="fas fa-trash"></i></button>
                            ` : `
                                <button class="btn-primary" style="flex:1;">BOOK NOW</button>
                            `}
                        </div>
                    </div>
                </div>`
            }).join('');

            content.innerHTML = `
                <div style="padding:15px 15px 100px 15px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px;">
                        <h2 style="margin:0;">Inventory Control</h2>
                    </div>
                    
                    <div class="filter-bar">
                        <button class="filter-btn ${window.currentFilter === 'All' ? 'active' : ''}" onclick="setFilter('All')">All</button>
                        <button class="filter-btn ${window.currentFilter === 'Hotel' ? 'active' : ''}" onclick="setFilter('Hotel')">Hotels</button>
                        <button class="filter-btn ${window.currentFilter === 'Transport' ? 'active' : ''}" onclick="setFilter('Transport')">Transport</button>
                        <button class="filter-btn ${window.currentFilter === 'Activity' ? 'active' : ''}" onclick="setFilter('Activity')">Activities</button>
                    </div>
                    <div id="tours-list">
                        ${listHtml}
                        <div id="scroll-anchor" class="scroll-anchor"></div>
                    </div>
                </div>`;

            // Установка Intersection Observer для Infinite Scroll
            const anchor = document.getElementById('scroll-anchor');
            if (anchor) {
                const observer = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) window.loadMoreInventory();
                }, { rootMargin: '100px' });
                observer.observe(anchor);
            }
        } else if (page === 'home') {
            content.innerHTML = `<div style="padding:15px;"><h2 style="font-size:2rem;">Dashboard</h2><div class="metric-container"><div class="card metric-card"><h3>TOTAL INVENTORY</h3><p style="font-size:2rem; font-weight:800;">${window.inventory.length}</p></div></div></div>`;
        } else if (page === 'profile') {
            content.innerHTML = `<div style="padding:40px; text-align:center;"><div class="card"><h2 style="font-family:'Montserrat';">Profile</h2><button class="btn-action btn-delete" onclick="logout()" style="width:100%; padding:16px;">LOGOUT</button><button onclick="generateDemoData()" style="margin-top:20px; padding:10px; width:100%;">⚙️ Inject Golden Data</button></div></div>`;
        } else if (page === 'login') {
            content.innerHTML = `<div class="login-container"><div class="login-card"><div class="login-logo">CASPIAN<b>DMC</b></div><input type="email" id="email-field" placeholder="Email"><input type="password" id="pass-field" placeholder="Password"><button class="login-btn" onclick="login()">LOGIN</button></div></div>`;
        }
    }

    function updateNav(page) {
        document.querySelectorAll('.bottom-nav button').forEach(btn => btn.classList.remove('active'));
        const b = document.getElementById(`nav-${page}`); if (b) b.classList.add('active');
        document.getElementById('nav-login').style.display = window.isAuthenticated ? 'none' : 'flex';
        document.getElementById('nav-home').style.display = window.isAuthenticated ? 'flex' : 'none';
        document.getElementById('nav-profile').style.display = window.isAuthenticated ? 'flex' : 'none';
    }
});