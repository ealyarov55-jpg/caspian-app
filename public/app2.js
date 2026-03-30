document.addEventListener('DOMContentLoaded', () => {
    const { db, dbFunc, auth, authFunc } = window;
    const { ref, push, set, onValue, remove, update } = dbFunc;
    const { signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence } = authFunc;

    let tours = []; 
    let bookings = []; 
    let editId = null; 
    let searchQuery = ""; 
    let currentPage = 'home'; 
    let chartInstance = null; 
    
    let isAuthenticated = false; 
    let userRole = 'guest';
    let isAuthReady = false; 

    const categories = ["Group", "Private", "VIP"]; 

    function formatDays(d) {
        const num = parseInt(d, 10);
        if (isNaN(num)) return `${d} days`;
        return num === 1 ? '1 day' : `${num} days`;
    }

    // === ГЛОБАЛЬНЫЙ СЛУШАТЕЛЬ (AUTH OBSERVER) ===
    setPersistence(auth, browserLocalPersistence).then(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                isAuthenticated = true;
                userRole = 'admin';
                if (currentPage === 'login') currentPage = 'home'; 
            } else {
                isAuthenticated = false;
                userRole = 'guest';
                // Защита приватных путей: Гостей принудительно кидаем на Login
                if (['home', 'calendar', 'profile'].includes(currentPage)) {
                    currentPage = 'login';
                }
            }

            if (!isAuthReady) {
                isAuthReady = true;
                const loader = document.getElementById('auth-loader');
                if (loader) loader.classList.add('hidden');
                render(currentPage);
            } else {
                render(currentPage);
            }
        });
    });

    onValue(ref(db, 'tours'), (snapshot) => {
        const data = snapshot.val();
        tours = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        if (isAuthReady) {
            if (currentPage === 'tours' && document.activeElement.id !== 'search-input') render('tours');
            else if (currentPage === 'home') render('home'); 
        }
    });

    onValue(ref(db, 'bookings'), (snapshot) => {
        const data = snapshot.val();
        bookings = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        if (isAuthReady && (currentPage === 'calendar' || currentPage === 'home')) {
            render(currentPage);
        }
    });

    const initialHeight = window.innerHeight;
    window.addEventListener('resize', () => {
        const nav = document.querySelector('.bottom-nav');
        if (nav && isAuthenticated) {
            if (window.innerWidth < 768) nav.style.display = window.innerHeight < initialHeight * 0.8 ? 'none' : 'flex';
            else nav.style.display = 'flex'; 
        }
    });

    window.login = async function() {
        const email = document.getElementById('email-field').value;
        const pass = document.getElementById('pass-field').value;
        if (!email || !pass) return alert("Please enter email and password!");
        
        try {
            await signInWithEmailAndPassword(auth, email, pass);
        } catch (error) {
            alert("Access Denied: " + error.message);
        }
    };

    window.logout = async () => { 
        await signOut(auth);
        currentPage = 'login'; 
    };
    
    window.render = (page) => {
        currentPage = page;
        renderInternal(page);
    };
    
    window.deleteTour = (id) => { if(confirm('Delete this route?')) remove(ref(db, `tours/${id}`)); };
    window.editTour = (id) => { editId = id; showForm(tours.find(x => x.id === id)); };
    
    window.bookTour = (id) => {
        const t = tours.find(x => x.id === id);
        const sellP = parseFloat(t.sellingPrice || t.price || 0);
        
        const clientName = prompt(`Booking: ${t.name}\nEnter tourist name or comment:`);
        if (clientName === null) return; 
        
        const defaultDate = t.date ? new Date(t.date).toLocaleDateString('en-GB') : '';
        const tourDate = prompt(`Desired travel date:`, defaultDate);
        if (tourDate === null) return;

        if (confirm(`Send booking request for ${tourDate} for ${clientName || 'Guest'}?`)) {
            push(ref(db, 'bookings'), {
                tourId: id,
                tourName: t.name,
                clientName: clientName || 'Guest',
                price: sellP,
                currency: t.currency,
                date: tourDate || 'Not specified',
                driver: '', 
                status: 'new',
                timestamp: new Date().toISOString()
            });
            alert('Booking request sent successfully!');
        }
    };

    window.assignDriver = (id) => {
        const driverName = prompt("Enter driver name and car (e.g. Ali, Mercedes V-Class):");
        if (driverName) update(ref(db, `bookings/${id}`), { driver: driverName, status: 'confirmed' });
    };

    window.deleteBooking = (id) => {
        if (confirm('Delete this booking?')) remove(ref(db, `bookings/${id}`));
    };

    window.shareWhatsApp = (id) => {
        const t = tours.find(x => x.id === id);
        const d = t.date ? new Date(t.date).toLocaleDateString('en-GB') : 'Open date';
        const sellP = parseFloat(t.sellingPrice || t.price || 0);
        let lines = [`*OFFER: ${t.name.toUpperCase()}*`, "", `Date: ${d}`, `Price: ${sellP} ${t.currency}`, `Duration: ${formatDays(t.days)}`];
        if (t.hotel) lines.push(`Hotel: ${t.hotel}`);
        if (t.food) lines.push(`Meals: ${t.food}`);
        if (t.transport) lines.push(`Transport: ${t.transport}`);
        if (t.included) { lines.push(""); lines.push(`Included: ${t.included}`); }
        lines.push(""); lines.push("_Caspian Travel Routes_");
        window.open("https://wa.me/?text=" + lines.map(l => encodeURIComponent(l)).join('%0A'), '_blank');
    };

    function initChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;
        if (chartInstance) chartInstance.destroy();

        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const data = [120, 190, 300, 250, 420, 480, 650];

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Revenue Volume',
                    data: data, borderColor: '#00afb9', backgroundColor: 'rgba(0, 175, 185, 0.1)',
                    borderWidth: 3, tension: 0.4, fill: true, pointBackgroundColor: '#fff',
                    pointBorderColor: '#00afb9', pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0B1D2A', padding: 10, titleFont: { family: 'Inter', size: 13 }, bodyFont: { family: 'Montserrat', size: 14, weight: 'bold' } } },
                scales: {
                    y: { beginAtZero: true, grid: { borderDash: [5, 5], color: '#e1e4e8', drawBorder: false }, ticks: { font: { family: 'Inter' }, color: '#888' } },
                    x: { grid: { display: false, drawBorder: false }, ticks: { font: { family: 'Inter' }, color: '#888' } }
                }
            }
        });
    }

    function renderInternal(page) {
        if (!isAuthReady) return; 
        
        const content = document.getElementById('app-content');
        if (!content) return;

        // Вторичная защита SPA: Если гость, кидаем на логин
        if (!isAuthenticated && ['home', 'calendar', 'profile'].includes(page)) {
            page = 'login';
            currentPage = 'login';
        }

        document.querySelector('.bottom-nav').style.display = page === 'login' ? 'none' : 'flex';
        updateNav(page);

        if (page === 'login') {
            content.innerHTML = `
                <div class="login-container fade-in">
                    <div class="login-card">
                        <div class="login-logo">CASPIAN<b>ROUTES</b></div>
                        <p style="color:rgba(255,255,255,0.6); margin-top:0; margin-bottom: 30px; font-size: 0.9rem;">Secured B2B Access</p>
                        <input type="email" id="email-field" placeholder="Admin Email" autocomplete="email">
                        <input type="password" id="pass-field" placeholder="Password" autocomplete="current-password" onkeydown="if(event.key === 'Enter') login()">
                        <button class="login-btn" onclick="login()">SECURE LOGIN</button>
                    </div>
                </div>`;
            return;
        }

        if (page === 'tours') {
            const listHtml = tours.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())).map(t => {
                const sellP = parseFloat(t.sellingPrice || t.price || 0);
                const netC = parseFloat(t.netCost || 0);
                const profit = sellP - netC; 
                
                let coverImage = t.image || ""; 
                if (!coverImage) {
                    const n = t.name.toLowerCase();
                    if (n.includes('ичеришехер') || n.includes('icherisheher') || n.includes('old city')) coverImage = "icherisheher_old_city.jpg";
                    else if (n.includes('габала') || n.includes('gabala') || n.includes('qabala')) coverImage = "gabala_lake.jpg";
                    else if (n.includes('губа') || n.includes('quba') || n.includes('guba')) coverImage = "guba_mountains.jpg";
                    else if (n.includes('баку') || n.includes('baku')) coverImage = "baku_night.jpg";
                    else coverImage = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"; 
                }

                let badgeClass = 'badge-private';
                if (t.category === 'VIP') badgeClass = 'badge-vip';
                if (t.category === 'Group') badgeClass = 'badge-group';

                const statusClass = t.date ? 'status-available' : 'status-request';
                const statusText = t.date ? 'Available' : 'On Request';

                return `
                <div class="tour-card fade-in">
                    <div style="position: relative;">
                        <div class="tour-image-bg" style="background-image: url('${coverImage}');"></div>
                        
                        <div style="position:absolute; top:16px; left:16px;">
                            <span class="badge ${badgeClass}">${t.category}</span>
                        </div>
                        <div style="position:absolute; bottom:-16px; right:16px; background:var(--dark); color:white; padding:8px 20px; border-radius:25px; box-shadow:0 4px 15px rgba(0,0,0,0.15); z-index: 2;">
                            <span class="price-tag" style="color:white; font-size:1.2rem;">${t.currency==='AZN'?'₼':'$'}${sellP}</span>
                        </div>
                    </div>
                    
                    <div class="tour-card-content">
                        <h3 style="margin-top:10px;">📍 ${t.name}</h3>
                        <div style="font-size:0.85rem; color:#555; margin-top:10px; flex-grow:1; line-height: 1.6;">
                            ${t.hotel ? `<div><i class="fas fa-hotel" style="width:20px; color:var(--primary);"></i> ${t.hotel}</div>` : ''}
                            ${t.food ? `<div><i class="fas fa-utensils" style="width:20px; color:var(--primary);"></i> ${t.food}</div>` : ''}
                            ${t.transport ? `<div><i class="fas fa-car-side" style="width:20px; color:var(--primary);"></i> ${t.transport}</div>` : ''}
                            <div><i class="far fa-clock" style="width:20px; color:var(--primary);"></i> ${formatDays(t.days)}</div>
                            
                            <div class="status-wrapper ${statusClass}">
                                <span class="status-dot"></span> ${statusText}
                            </div>
                        </div>
                        
                        ${isAuthenticated ? `
                        <div style="background:#f8f9fa; padding:10px 12px; border-radius:8px; margin-top:12px; font-size:0.85rem; color:#2e7d32; display:flex; justify-content:space-between; align-items:center; border: 1px solid #e1e4e8;">
                            <span style="color:#555;">Net: <b>${netC}</b></span>
                            <span style="font-weight:700;">Profit: +${profit} ${t.currency}</span>
                        </div>` : ''}

                        ${t.included ? `<div class="included-box" style="margin-top:12px;">${t.included}</div>` : ''}
                        
                        <div style="display:flex; gap:10px; margin-top:20px;">
                            ${isAuthenticated ? `
                                <button class="btn-share" onclick="shareWhatsApp('${t.id}')"><i class="fab fa-whatsapp" style="font-size:1.3rem;"></i></button>
                                <button onclick="editTour('${t.id}')" class="btn-action btn-edit" style="flex:1;"><i class="fas fa-pen"></i></button>
                                <button onclick="deleteTour('${t.id}')" class="btn-action btn-delete" style="flex:1;"><i class="fas fa-trash"></i></button>
                            ` : `
                                <button onclick="shareWhatsApp('${t.id}')" class="btn-whatsapp-outline" style="flex:1;"><i class="fab fa-whatsapp"></i></button>
                                <button onclick="bookTour('${t.id}')" class="btn-primary" style="flex:4;">BOOK NOW</button>
                            `}
                        </div>
                    </div>
                </div>`
            }).join('');

            const listContainer = document.getElementById('tours-list');
            if (listContainer && document.getElementById('search-input')) {
                listContainer.innerHTML = listHtml || '<div style="text-align:center; padding:40px; color:#999; grid-column: 1 / -1;">No routes found</div>';
            } else {
                content.innerHTML = `
                    <div style="padding:15px 15px 100px 15px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
                            <h2 style="margin:0;">Routes 🗺️</h2>
                            ${isAuthenticated ? `<button class="btn-primary" id="add-tour-btn" style="padding: 10px 16px; font-size: 0.9rem; display:flex; align-items:center; gap:8px; border-radius:12px; margin:0;"><i class="fas fa-plus"></i> Add Route</button>` : ''}
                        </div>
                        <div style="position:relative;">
                            <i class="fas fa-search" style="position:absolute; left:16px; top:18px; color:#aaa;"></i>
                            <input type="text" id="search-input" placeholder="Search destination..." value="${searchQuery}" autocomplete="off" style="padding-left:45px; margin-top:0;">
                        </div>
                        <div id="tours-list">${listHtml}</div>
                    </div>`;
                
                document.getElementById('search-input').addEventListener('input', (e) => {
                    searchQuery = e.target.value;
                    render('tours'); 
                });
            }

        } else if (page === 'home') {
            const newBookings = bookings.filter(b => b.status === 'new').length;
            const revenue = bookings.reduce((sum, b) => sum + Number(b.price || 0), 0);
            
            const totalTours = tours.length;
            const catalogValue = tours.reduce((sum, t) => sum + parseFloat(t.sellingPrice || t.price || 0), 0);
            
            let recentHTML = '';
            if (bookings.length > 0) {
                const recent = [...bookings].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);
                recentHTML = recent.map(b => {
                    const isConf = b.status === 'confirmed';
                    const statusClass = isConf ? 'booking-status-confirmed' : 'booking-status-pending';
                    const statusText = isConf ? 'Confirmed' : 'Pending';

                    return `
                    <div class="booking-row">
                        <div class="booking-info">
                            <div style="font-weight:700; font-size:0.95rem; color:#1a1a1a;">${b.tourName}</div>
                            <div style="font-size:0.8rem; color:#666; margin-top:4px;">
                                <i class="far fa-user" style="margin-right:4px;"></i>${b.clientName || 'Guest'} • 
                                <i class="far fa-calendar" style="margin-right:4px; margin-left:6px;"></i>${b.date}
                            </div>
                        </div>
                        <div class="booking-price">
                            <div style="font-weight:800; color:var(--dark); font-family:'Montserrat', sans-serif;">${b.price} ${b.currency}</div>
                            <div class="booking-status-badge ${statusClass}">
                                <span class="dot"></span>${statusText}
                            </div>
                        </div>
                    </div>
                `}).join('');
            } else {
                recentHTML = `<div style="text-align:center; color:#999; padding:20px; font-size:0.9rem;">No bookings yet</div>`;
            }

            content.innerHTML = `
                <div style="padding:15px 15px 100px 15px;">
                    <h2 style="margin-bottom:8px; font-size: 2rem;">Welcome, Boss! 🤝</h2>
                    <p style="color:#666; margin-top:0; font-size:0.95rem; margin-bottom:25px;">Business Overview</p>
                    
                    <div class="metric-container">
                        <div class="card metric-card">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                                <div>
                                    <div style="font-size:0.75rem; font-weight:700; color:#888; text-transform:uppercase; letter-spacing:0.5px;">TOTAL TOURS</div>
                                    <div style="font-size:2.2rem; font-weight:800; margin:5px 0; font-family:'Montserrat', sans-serif; color:#1a1a1a;">${totalTours}</div>
                                    <div style="color: #27ae60; font-size: 0.85rem; font-weight: 600; margin-top: 5px;"><i class="fas fa-check-circle"></i> Active in Catalog</div>
                                </div>
                                <div style="width:48px; height:48px; background:#e0f7f9; border-radius:12px; display:flex; align-items:center; justify-content:center; color:var(--primary); font-size:1.4rem;">
                                    <i class="fas fa-map-marked-alt"></i>
                                </div>
                            </div>
                        </div>
                        <div class="card metric-card">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                                <div>
                                    <div style="font-size:0.75rem; font-weight:700; color:#888; text-transform:uppercase; letter-spacing:0.5px;">CATALOG VALUE (${tours[0]?.currency || 'AZN'})</div>
                                    <div style="font-size:2.2rem; font-weight:800; margin:5px 0; font-family:'Montserrat', sans-serif; color:#1a1a1a;">${catalogValue}</div>
                                    <div style="color: #27ae60; font-size: 0.85rem; font-weight: 600; margin-top: 5px;"><i class="fas fa-chart-line"></i> Cumulative Value</div>
                                </div>
                                <div style="width:48px; height:48px; background:#fef5e7; border-radius:12px; display:flex; align-items:center; justify-content:center; color:#f39c12; font-size:1.4rem;">
                                    <i class="fas fa-wallet"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card" style="margin-bottom:20px;">
                        <h4 style="margin:0 0 15px 0; color:#1a1a1a;">Sales Dynamics</h4>
                        <div style="position: relative; height: 250px; width: 100%;">
                            <canvas id="salesChart"></canvas>
                        </div>
                    </div>

                    <div class="card" style="margin:0;">
                        <h4 style="margin:0 0 10px 0; display:flex; justify-content:space-between; align-items:center; color:#1a1a1a; border-bottom:1px solid #f0f2f5; padding-bottom:15px;">
                            Recent Bookings 
                            <span onclick="render('calendar')" style="font-size:0.85rem; color:var(--primary); font-weight:600; cursor:pointer; text-transform:none;">See All</span>
                        </h4>
                        ${recentHTML}
                    </div>
                </div>`;
            
            setTimeout(initChart, 50);

        } else if (page === 'calendar') {
            let calHtml = `<div style="padding:15px 15px 100px 15px;"><h2 style="margin-bottom: 20px;">Order Calendar 📅</h2><div>`;
            
            if (bookings.length === 0) {
                calHtml += `<div class="card" style="text-align:center; color:#999; padding:40px;">No bookings found</div>`;
            } else {
                const sorted = [...bookings].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
                sorted.forEach(b => {
                    const isConfirmed = b.status === 'confirmed';
                    const borderColor = isConfirmed ? 'var(--primary)' : '#f39c12'; 
                    
                    calHtml += `
                    <div class="card" style="margin:16px 0; border-left: 5px solid ${borderColor}; padding:20px;">
                        <div style="display:flex; justify-content:space-between; align-items:start;">
                            <span style="font-size:0.8rem; color:#888; font-weight:500;"><i class="far fa-clock"></i> ${new Date(b.timestamp).toLocaleDateString('en-GB')}</span>
                            <strong style="color:var(--dark); font-size:1.2rem; font-family:'Montserrat', sans-serif;">${b.price} ${b.currency}</strong>
                        </div>
                        <h3 style="margin:12px 0 16px 0; font-size:1.15rem; color:#1a1a1a;">📍 ${b.tourName}</h3>
                        
                        <div style="font-size:0.9rem; color:#444; margin-bottom:16px; background:#f8f9fa; padding:12px; border-radius:8px; border:1px solid #e1e4e8;">
                            <div style="margin-bottom:6px;">👤 Tourist: <b>${b.clientName || 'Guest'}</b></div>
                            <div style="margin-bottom:6px;">📅 Travel Date: <b>${b.date || 'Not specified'}</b></div>
                            <div>🚗 Driver: <b>${b.driver || '<span style="color:#e17055;">Not assigned</span>'}</b></div>
                        </div>

                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            ${isAuthenticated ? `
                                <button onclick="assignDriver('${b.id}')" class="btn-primary" style="padding:10px 20px; width:auto;"><i class="fas fa-car-side"></i> Assign</button>
                                <button onclick="deleteBooking('${b.id}')" class="btn-action btn-delete" style="padding:10px; width:45px;"><i class="fas fa-trash"></i></button>
                            ` : ``}
                        </div>
                    </div>`;
                });
            }
            content.innerHTML = calHtml + `</div></div>`;

        } else if (page === 'profile') {
            content.innerHTML = `
                <div style="padding:40px 20px; text-align:center;">
                    <div class="card" style="padding:50px 20px; border-radius:24px; margin: 0 auto; max-width: 400px;">
                        <div style="width:110px; height:110px; background:#f0f2f5; border-radius:50%; margin:0 auto 25px; display:flex; align-items:center; justify-content:center; border:3px solid var(--primary);">
                            <i class="fas fa-user-shield" style="font-size:3.5rem; color:var(--primary);"></i>
                        </div>
                        <h2 style="margin:0 0 10px 0; color:#1a1a1a; font-family:'Montserrat', sans-serif;">Administrator</h2>
                        <p style="color:#666; margin-top:0; font-size:0.95rem;">Caspian DMC Portal Access</p>
                        <div style="height:1px; background:#e1e4e8; margin:30px 0;"></div>
                        <button class="btn-action btn-delete" onclick="logout()" style="width:100%; padding:16px; font-weight:700; background:#fff0f0;">LOGOUT</button>
                    </div>
                </div>`;
        }
    }

    function showForm(data = {}) {
        const existingModal = document.getElementById('tour-modal');
        if (existingModal) existingModal.remove();

        const modalHtml = `
        <div class="modal-overlay" id="tour-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${data.id ? 'Edit Route' : 'Create Route'}</h2>
                    <button class="modal-close" onclick="document.getElementById('tour-modal').classList.remove('active'); setTimeout(() => document.getElementById('tour-modal').remove(), 300);"><i class="fas fa-times"></i></button>
                </div>
                
                <div class="modal-body">
                    <label class="input-label">Tour Name</label>
                    <input type="text" id="t-name" value="${data.name || ''}" placeholder="e.g. Baku City Tour">
                    
                    <div style="display:flex; gap:15px;">
                        <div style="flex:1;">
                            <label class="input-label">Badge Category</label>
                            <select id="t-category">${categories.map(c => `<option value="${c}" ${data.category===c?'selected':''}>${c}</option>`).join('')}</select>
                        </div>
                        <div style="flex:1;">
                            <label class="input-label">Default Date</label>
                            <input type="date" id="t-date" value="${data.date || ''}">
                        </div>
                    </div>
                    
                    <label class="input-label">Image filename (from public folder)</label>
                    <input type="text" id="t-image" value="${data.image || ''}" placeholder="e.g. baku_night.jpg">
                    
                    <div style="display:flex; gap:15px;">
                        <div style="flex:1;">
                            <label class="input-label">Cost (Net)</label>
                            <input type="number" id="t-net-cost" value="${data.netCost || ''}" placeholder="0.00">
                        </div>
                        <div style="flex:1;">
                            <label class="input-label">Price (Selling)</label>
                            <input type="number" id="t-selling-price" value="${data.sellingPrice || data.price || ''}" placeholder="0.00">
                        </div>
                        <div style="flex:0.5;">
                            <label class="input-label">Currency</label>
                            <select id="t-currency"><option value="AZN" ${data.currency==='AZN'?'selected':''}>AZN</option><option value="USD" ${data.currency==='USD'?'selected':''}>USD</option></select>
                        </div>
                    </div>
                    
                    <label class="input-label">Duration (Days)</label>
                    <input type="number" id="t-days" value="${data.days || ''}" placeholder="e.g. 1">
                    
                    <h4 style="margin:25px 0 10px 0; color:#1a1a1a; font-size:1.1rem; border-bottom:1px solid #eee; padding-bottom:5px;">Additional Info</h4>
                    
                    <input type="text" id="t-hotel" value="${data.hotel || ''}" placeholder="Hotel (leave empty if none)" style="margin-top:0;">
                    <input type="text" id="t-food" value="${data.food || ''}" placeholder="Meals (e.g. Breakfast)">
                    <input type="text" id="t-transport" value="${data.transport || ''}" placeholder="Transport (e.g. Free transfer)">
                    
                    <label class="input-label">What's included</label>
                    <textarea id="t-included" placeholder="List included services here..." style="height:100px;">${data.included || ''}</textarea>
                </div>
                
                <div class="modal-footer">
                    <button class="btn-action btn-edit" style="flex:1; padding:14px; font-weight:600;" onclick="document.getElementById('tour-modal').classList.remove('active'); setTimeout(() => document.getElementById('tour-modal').remove(), 300);">CANCEL</button>
                    <button class="save-btn" id="save-action" data-id="${data.id || ''}" style="flex:2; margin:0; padding:14px;">💾 SAVE ROUTE</button>
                </div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        setTimeout(() => document.getElementById('tour-modal').classList.add('active'), 10);
    }

    document.addEventListener('click', (e) => {
        if (e.target.closest('#add-tour-btn')) { editId = null; showForm(); }
        
        if (e.target.id === 'save-action') {
            const editIdLocal = e.target.getAttribute('data-id');
            const sPrice = parseFloat(document.getElementById('t-selling-price').value);
            const nCost = parseFloat(document.getElementById('t-net-cost').value || 0);

            if (!document.getElementById('t-name').value || isNaN(sPrice)) {
                return alert("Please fill in the Tour Name and Price!");
            }
            if (nCost > sPrice) {
                return alert("🛑 Validation Error: Price cannot be lower than Cost!");
            }

            const tData = {
                name: document.getElementById('t-name').value, 
                category: document.getElementById('t-category').value,
                date: document.getElementById('t-date').value, 
                image: document.getElementById('t-image').value || "", 
                netCost: nCost,
                sellingPrice: sPrice,
                price: sPrice, 
                currency: document.getElementById('t-currency').value, 
                days: document.getElementById('t-days').value,
                hotel: document.getElementById('t-hotel').value || "",
                food: document.getElementById('t-food').value || "",
                transport: document.getElementById('t-transport').value || "",
                included: document.getElementById('t-included').value || ""
            };
            
            if (editIdLocal) update(ref(db, `tours/${editIdLocal}`), tData);
            else push(ref(db, 'tours'), tData);
            
            document.getElementById('tour-modal').classList.remove('active');
            setTimeout(() => document.getElementById('tour-modal').remove(), 300);
        }
    });

    function updateNav(page) {
        document.querySelectorAll('.bottom-nav button').forEach(btn => btn.classList.remove('active'));
        const btnIdMap = { 'home': 'nav-home', 'calendar': 'nav-calendar', 'tours': 'nav-tours', 'profile': 'nav-profile', 'login': 'nav-login' };
        const b = document.getElementById(btnIdMap[page]); 
        if (b) b.classList.add('active');

        document.getElementById('nav-home').style.display = isAuthenticated ? 'flex' : 'none';
        document.getElementById('nav-calendar').style.display = isAuthenticated ? 'flex' : 'none';
        document.getElementById('nav-profile').style.display = isAuthenticated ? 'flex' : 'none';
        document.getElementById('nav-logout').style.display = isAuthenticated ? 'flex' : 'none';
        document.getElementById('nav-login').style.display = isAuthenticated ? 'none' : 'flex';
    }
});