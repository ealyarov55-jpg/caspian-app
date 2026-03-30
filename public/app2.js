document.addEventListener('DOMContentLoaded', () => {
    const { db, dbFunc, auth, authFunc } = window;
    const { ref, push, set, onValue, remove, update } = dbFunc;
    const { signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence } = authFunc;

    let inventory = []; 
    let bookings = []; 
    let editId = null; 
    let searchQuery = ""; 
    let currentFilter = "All"; 
    let currentPage = 'home'; 
    let chartInstance = null; 
    
    let isAuthenticated = false; 
    let userRole = 'guest';
    let isAuthReady = false; 

    const serviceTypes = ["Hotel", "Transport", "Activity", "Guide"]; 
    const vehicleTypes = ["Sedan (up to 3 pax)", "Minivan (up to 7 pax)", "Sprinter (up to 18 pax)", "Bus (45+ pax)"];

    function formatDays(d) {
        const num = parseInt(d, 10);
        if (isNaN(num)) return d;
        return num === 1 ? '1 day' : `${num} days`;
    }

    // === ИНИЦИАЛИЗАЦИЯ AUTH ===
    setPersistence(auth, browserLocalPersistence).then(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                isAuthenticated = true;
                userRole = 'admin';
                if (currentPage === 'login') currentPage = 'home'; 
            } else {
                isAuthenticated = false;
                userRole = 'agent'; 
                if (['home', 'bookings', 'partners', 'profile'].includes(currentPage)) {
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

    // === СИНХРОНИЗАЦИЯ БАЗЫ ===
    onValue(ref(db, 'inventory'), (snapshot) => {
        const data = snapshot.val();
        inventory = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        if (isAuthReady) {
            if (currentPage === 'inventory' && document.activeElement.id !== 'search-input') render('inventory');
            else if (currentPage === 'home') render('home'); 
        }
    });

    onValue(ref(db, 'bookings'), (snapshot) => {
        const data = snapshot.val();
        bookings = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        if (isAuthReady && (currentPage === 'bookings' || currentPage === 'home')) {
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

    // === ГЛОБАЛЬНЫЕ ФУНКЦИИ ===
    window.login = async function() {
        const email = document.getElementById('email-field').value;
        const pass = document.getElementById('pass-field').value;
        if (!email || !pass) return alert("Please enter email and password!");
        try { await signInWithEmailAndPassword(auth, email, pass); } 
        catch (error) { alert("Access Denied: " + error.message); }
    };

    window.logout = async () => { await signOut(auth); currentPage = 'login'; };
    window.render = (page) => { currentPage = page; renderInternal(page); };
    window.setFilter = (filter) => { currentFilter = filter; render('inventory'); };
    
    // --- ИСПРАВЛЕННАЯ ЛОГИКА УДАЛЕНИЯ (DELETE) 🗑️ ---
    window.deleteItem = (id) => { 
        if(confirm('Boss, are you sure you want to delete this service?')) {
            remove(ref(db, `inventory/${id}`))
                .then(() => alert("Database updated successfully!"))
                .catch((error) => alert("Error deleting item: " + error.message));
        }
    };

    // --- ИСПРАВЛЕННАЯ ЛОГИКА РЕДАКТИРОВАНИЯ (EDIT) ✏️ ---
    window.editItem = (id) => { 
        editId = id; 
        showForm(inventory.find(x => x.id === id)); 
    };
    
    window.bookItem = (id) => {
        const item = inventory.find(x => x.id === id);
        const sellP = parseFloat(item.sellingPrice || item.price || 0);
        
        const clientName = prompt(`Booking: ${item.name}\nEnter client name or reference:`);
        if (clientName === null) return; 
        
        const serviceDate = prompt(`Desired service date:`, new Date().toLocaleDateString('en-GB'));
        if (serviceDate === null) return;

        if (confirm(`Confirm booking request for ${serviceDate}?`)) {
            push(ref(db, 'bookings'), {
                tourId: id,
                tourName: item.name,
                clientName: clientName || 'Partner Guest',
                price: sellP,
                currency: item.currency || 'AZN',
                date: serviceDate || 'Not specified',
                driver: '', status: 'new', timestamp: new Date().toISOString()
            });
            alert('Booking request sent to Caspian DMC Operations!');
        }
    };

    window.downloadQuote = (id) => {
        const item = inventory.find(x => x.id === id);
        const sellP = parseFloat(item.sellingPrice || item.price || 0);
        const quoteHtml = `
            <html><head><title>Quote - ${item.name}</title>
            <style>body { font-family: Arial, sans-serif; padding: 40px; color: #333; } h1 { color: #0B1D2A; } .header { border-bottom: 2px solid #00afb9; padding-bottom: 20px; margin-bottom: 20px; } .price { font-size: 24px; font-weight: bold; color: #0081a7; margin: 20px 0; } .details { background: #f8f9fa; padding: 20px; border-radius: 8px; }</style></head>
            <body><div class="header"><h1>CASPIAN DMC - Official Quote</h1><p>Date: ${new Date().toLocaleDateString()}</p></div>
            <h2>Service: ${item.name}</h2><p><strong>Supplier/Category:</strong> ${item.supplierName || 'Verified Partner'} (${item.category})</p>
            <div class="details"><p><strong>Description:</strong> ${item.included || 'Standard service as per contract.'}</p></div>
            <div class="price">Total Price: ${sellP} ${item.currency || 'AZN'}</div>
            <p style="font-size:12px; color:#888; margin-top:50px;">This quote is valid subject to availability at the time of booking.</p>
            <script>window.onload = function() { window.print(); window.close(); }</script></body></html>`;
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(quoteHtml);
        printWindow.document.close();
    };

    // --- МАТЕМАТИЧЕСКИЙ КОНТРОЛЬ ЦЕНЫ 🔢 ---
    window.calculatePrice = () => {
        const net = parseFloat(document.getElementById('t-net-cost').value || 0);
        const markup = parseFloat(document.getElementById('t-markup').value || 0);
        const sellInput = document.getElementById('t-selling-price');
        
        if (net > 0 && markup >= 0) {
            // Формула: Price_B2B = Cost_Net * (1 + Markup/100)
            const finalPrice = net * (1 + (markup / 100));
            sellInput.value = finalPrice.toFixed(2);
        } else {
            sellInput.value = "";
        }
    };

    window.toggleDynamicFields = () => {
        const cat = document.getElementById('t-category').value;
        const hotelFields = document.getElementById('hotel-dynamic-fields');
        const transportFields = document.getElementById('transport-dynamic-fields');
        if(hotelFields) hotelFields.style.display = (cat === 'Hotel') ? 'block' : 'none';
        if(transportFields) transportFields.style.display = (cat === 'Transport') ? 'block' : 'none';
    };

    window.assignDriver = (id) => {
        const driverName = prompt("Enter driver name and car (e.g. Ali, Mercedes V-Class):");
        if (driverName) update(ref(db, `bookings/${id}`), { driver: driverName, status: 'confirmed' });
    };

    window.deleteBooking = (id) => { if (confirm('Delete this booking?')) remove(ref(db, `bookings/${id}`)); };

    // === DATA SEEDER ===
    window.generateDemoData = async () => {
        if (!confirm("Initialize Simulation Mode? This will inject 10 demo items into the inventory.")) return;

        const defaultMarkup = 15;
        const calcPrice = (net) => parseFloat((net * (1 + defaultMarkup / 100)).toFixed(2));

        const demoItems = [
            { name: "Marriott Boulevard Baku", supplierName: "Absheron Hotel Group", category: "Hotel", netCost: 150, markup: defaultMarkup, sellingPrice: calcPrice(150), price: calcPrice(150), currency: "AZN", stars: "5", location: "White City", image: "baku_night.jpg", included: "Standard Room, Breakfast included, Free Wi-Fi" },
            { name: "Fairmont Baku Flame Towers", supplierName: "Fairmont", category: "Hotel", netCost: 180, markup: defaultMarkup, sellingPrice: calcPrice(180), price: calcPrice(180), currency: "AZN", stars: "5", location: "Flame Towers", image: "baku_night.jpg", included: "Deluxe City View, Spa Access" },
            { name: "Chenot Palace Gabala", supplierName: "Chenot", category: "Hotel", netCost: 300, markup: defaultMarkup, sellingPrice: calcPrice(300), price: calcPrice(300), currency: "AZN", stars: "5", location: "Gabala", image: "gabala_lake.jpg", included: "Wellness Retreat Package, Full Board" },
            { name: "Hilton Baku", supplierName: "Hilton Worldwide", category: "Hotel", netCost: 160, markup: defaultMarkup, sellingPrice: calcPrice(160), price: calcPrice(160), currency: "AZN", stars: "5", location: "City Center", image: "baku_night.jpg", included: "Guest Room, 360 Bar Access" },
            { name: "Shah Palace Hotel", supplierName: "Shah Hotels", category: "Hotel", netCost: 80, markup: defaultMarkup, sellingPrice: calcPrice(80), price: calcPrice(80), currency: "AZN", stars: "4", location: "Icherisheher", image: "icherisheher_old_city.jpg", included: "Classic Room, Traditional Breakfast" },
            { name: "Quba Palace Hotel", supplierName: "Quba Palace", category: "Hotel", netCost: 130, markup: defaultMarkup, sellingPrice: calcPrice(130), price: calcPrice(130), currency: "AZN", stars: "5", location: "Guba", image: "guba_mountains.jpg", included: "Mountain View, Spa & Golf Access" },
            { name: "Winter Park Hotel", supplierName: "Winter Park", category: "Hotel", netCost: 75, markup: defaultMarkup, sellingPrice: calcPrice(75), price: calcPrice(75), currency: "AZN", stars: "4", location: "City Center", image: "baku_night.jpg", included: "Superior Room, Breakfast" },
            { name: "Premium VIP Transfer (V-Class)", supplierName: "VIP Trans", category: "Transport", netCost: 80, markup: defaultMarkup, sellingPrice: calcPrice(80), price: calcPrice(80), currency: "AZN", vehicleType: "Minivan (up to 7 pax)", capacity: "6", image: "baku_night.jpg", included: "Mercedes V-Class, Wi-Fi, Water" },
            { name: "Group Transfer (Sprinter)", supplierName: "Caspian Transport", category: "Transport", netCost: 120, markup: defaultMarkup, sellingPrice: calcPrice(120), price: calcPrice(120), currency: "AZN", vehicleType: "Sprinter (up to 18 pax)", capacity: "18", image: "baku_night.jpg", included: "Mercedes Sprinter, Luggage space" },
            { name: "Standard Airport Transfer", supplierName: "Caspian Transport", category: "Transport", netCost: 30, markup: defaultMarkup, sellingPrice: calcPrice(30), price: calcPrice(30), currency: "AZN", vehicleType: "Sedan (up to 3 pax)", capacity: "3", image: "baku_night.jpg", included: "Meet & Greet at Airport" }
        ];

        try {
            for (const item of demoItems) {
                await push(ref(db, 'inventory'), item);
            }
            alert("✅ Simulation data successfully injected!");
        } catch (error) {
            console.error(error);
            alert("Error injecting data: " + error.message);
        }
    };

    function initChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;
        if (chartInstance) chartInstance.destroy();
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const data = [120, 190, 300, 250, 420, 480, 650];
        chartInstance = new Chart(ctx, {
            type: 'line', 
            data: { labels: labels, datasets: [{ label: 'Revenue Volume', data: data, borderColor: '#00afb9', backgroundColor: 'rgba(0, 175, 185, 0.1)', borderWidth: 3, tension: 0.4, fill: true, pointBackgroundColor: '#fff', pointBorderColor: '#00afb9', pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 6 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0B1D2A', padding: 10, titleFont: { family: 'Inter', size: 13 }, bodyFont: { family: 'Montserrat', size: 14, weight: 'bold' } } }, scales: { y: { beginAtZero: true, grid: { borderDash: [5, 5], color: '#e1e4e8', drawBorder: false }, ticks: { font: { family: 'Inter' }, color: '#888' } }, x: { grid: { display: false, drawBorder: false }, ticks: { font: { family: 'Inter' }, color: '#888' } } } }
        });
    }

    // === ГЛАВНАЯ ФУНКЦИЯ РЕНДЕРИНГА ===
    function renderInternal(page) {
        if (!isAuthReady) return; 
        const content = document.getElementById('app-content');
        if (!content) return;

        if (!isAuthenticated && ['home', 'bookings', 'partners', 'profile'].includes(page)) {
            page = 'login';
            currentPage = 'login';
        }

        document.querySelector('.bottom-nav').style.display = page === 'login' ? 'none' : 'flex';
        updateNav(page);

        if (page === 'login') {
            content.innerHTML = `
                <div class="login-container fade-in">
                    <div class="login-card">
                        <div class="login-logo">CASPIAN<b>DMC</b></div>
                        <p style="color:rgba(255,255,255,0.6); margin-top:0; margin-bottom: 30px; font-size: 0.9rem;">B2B Partner Portal</p>
                        <input type="email" id="email-field" placeholder="Email Address" autocomplete="email">
                        <input type="password" id="pass-field" placeholder="Password" autocomplete="current-password" onkeydown="if(event.key === 'Enter') login()">
                        <button class="login-btn" onclick="login()">SECURE LOGIN</button>
                    </div>
                </div>`;
            return;
        }

        if (page === 'inventory') {
            let filteredInventory = inventory.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
            if (currentFilter !== 'All') {
                filteredInventory = filteredInventory.filter(t => t.category === currentFilter);
            }

            const listHtml = filteredInventory.map(t => {
                const sellP = parseFloat(t.sellingPrice || t.price || 0);
                const netC = parseFloat(t.netCost || 0);
                
                let coverImage = t.image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"; 

                let badgeClass = 'badge-package';
                if (t.category === 'Hotel') badgeClass = 'badge-hotel';
                if (t.category === 'Transport') badgeClass = 'badge-transport';
                if (t.category === 'Activity') badgeClass = 'badge-activity';

                let specificInfo = '';
                if (t.category === 'Hotel') {
                    specificInfo = `<div style="margin-bottom:6px; color:#f39c12;"><i class="fas fa-star"></i> ${t.stars || 'N/A'} Stars • <i class="fas fa-map-marker-alt" style="color:var(--primary);"></i> ${t.location || 'N/A'}</div>`;
                } else if (t.category === 'Transport') {
                    specificInfo = `<div style="margin-bottom:6px;"><i class="fas fa-car" style="color:var(--primary);"></i> ${t.vehicleType || 'Standard'} • <i class="fas fa-user-friends" style="color:var(--primary);"></i> Up to ${t.capacity || '?'} pax</div>`;
                }

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
                        <div style="font-size:0.75rem; color:#888; text-transform:uppercase; font-weight:700;">${t.supplierName || 'Caspian Direct'}</div>
                        <h3 style="margin-top:4px;">${t.name}</h3>
                        
                        <div style="font-size:0.85rem; color:#555; margin-top:10px; flex-grow:1; line-height: 1.6;">
                            ${specificInfo}
                            ${t.included ? `<div class="included-box">${t.included}</div>` : ''}
                        </div>
                        
                        ${isAuthenticated ? `
                        <div style="background:#f8f9fa; padding:10px 12px; border-radius:8px; margin-top:12px; font-size:0.85rem; display:flex; justify-content:space-between; align-items:center; border: 1px solid #e1e4e8;">
                            <span style="color:#555;">Net: <b style="color:#e74c3c;">${netC}</b></span>
                            <span style="font-weight:700; color:#27ae60;">Margin: ${t.markup || 0}%</span>
                        </div>` : ''}

                        <div style="display:flex; gap:10px; margin-top:20px;">
                            ${isAuthenticated ? `
                                <button onclick="editItem('${t.id}')" class="btn-action btn-edit" style="flex:1;"><i class="fas fa-pen"></i></button>
                                <button onclick="deleteItem('${t.id}')" class="btn-action btn-delete" style="flex:1;"><i class="fas fa-trash"></i></button>
                            ` : `
                                <button onclick="downloadQuote('${t.id}')" class="btn-quote" style="flex:1;"><i class="fas fa-file-pdf"></i> Quote</button>
                                <button onclick="bookItem('${t.id}')" class="btn-primary" style="flex:1;">BOOK NOW</button>
                            `}
                        </div>
                    </div>
                </div>`
            }).join('');

            const emptyMsg = '<div style="text-align:center; padding:40px; color:#999; grid-column: 1 / -1;">No inventory found</div>';

            content.innerHTML = `
                <div style="padding:15px 15px 100px 15px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px;">
                        <h2 style="margin:0;">Inventory Control</h2>
                        ${isAuthenticated ? `<button class="btn-primary" id="add-tour-btn" style="padding: 10px 16px; font-size: 0.9rem; border-radius:12px; margin:0;"><i class="fas fa-plus"></i> Add Service</button>` : ''}
                    </div>
                    
                    <div class="filter-bar">
                        <button class="filter-btn ${currentFilter === 'All' ? 'active' : ''}" onclick="setFilter('All')">All Inventory</button>
                        <button class="filter-btn ${currentFilter === 'Hotel' ? 'active' : ''}" onclick="setFilter('Hotel')">Hotels</button>
                        <button class="filter-btn ${currentFilter === 'Transport' ? 'active' : ''}" onclick="setFilter('Transport')">Transport</button>
                        <button class="filter-btn ${currentFilter === 'Activity' ? 'active' : ''}" onclick="setFilter('Activity')">Activities</button>
                    </div>

                    <div style="position:relative;">
                        <i class="fas fa-search" style="position:absolute; left:16px; top:18px; color:#aaa;"></i>
                        <input type="text" id="search-input" placeholder="Search service or supplier..." value="${searchQuery}" autocomplete="off" style="padding-left:45px; margin-top:0;">
                    </div>
                    <div id="tours-list">${listHtml || emptyMsg}</div>
                </div>`;
            
            document.getElementById('search-input').addEventListener('input', (e) => {
                searchQuery = e.target.value;
                render('inventory'); 
            });

        } else if (page === 'home') {
            const newBookings = bookings.filter(b => b.status === 'new').length;
            const revenue = bookings.reduce((sum, b) => sum + Number(b.price || 0), 0);
            const totalItems = inventory.length;
            const catalogValue = inventory.reduce((sum, t) => sum + parseFloat(t.sellingPrice || t.price || 0), 0);
            
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
                    <p style="color:#666; margin-top:0; font-size:0.95rem; margin-bottom:25px;">B2B Analytics Dashboard</p>
                    
                    <div class="metric-container">
                        <div class="card metric-card">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                                <div>
                                    <div style="font-size:0.75rem; font-weight:700; color:#888; text-transform:uppercase;">TOTAL INVENTORY</div>
                                    <div style="font-size:2.2rem; font-weight:800; margin:5px 0; font-family:'Montserrat', sans-serif; color:#1a1a1a;">${totalItems}</div>
                                </div>
                                <div style="width:48px; height:48px; background:#e0f7f9; border-radius:12px; display:flex; align-items:center; justify-content:center; color:var(--primary); font-size:1.4rem;">
                                    <i class="fas fa-box-open"></i>
                                </div>
                            </div>
                        </div>
                        <div class="card metric-card">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                                <div>
                                    <div style="font-size:0.75rem; font-weight:700; color:#888; text-transform:uppercase;">CATALOG VALUE (${inventory[0]?.currency || 'AZN'})</div>
                                    <div style="font-size:2.2rem; font-weight:800; margin:5px 0; font-family:'Montserrat', sans-serif; color:#1a1a1a;">${catalogValue}</div>
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

        } else if (page === 'bookings') {
            let calHtml = `<div style="padding:15px 15px 100px 15px;"><h2 style="margin-bottom: 20px;">Booking Management 📅</h2><div>`;
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
                            <div style="margin-bottom:6px;">👤 Partner Client: <b>${b.clientName || 'Guest'}</b></div>
                            <div style="margin-bottom:6px;">📅 Travel Date: <b>${b.date || 'Not specified'}</b></div>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <button onclick="assignDriver('${b.id}')" class="btn-primary" style="padding:10px 20px; width:auto;"><i class="fas fa-check"></i> Process</button>
                            <button onclick="deleteBooking('${b.id}')" class="btn-action btn-delete" style="padding:10px; width:45px;"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>`;
                });
            }
            content.innerHTML = calHtml + `</div></div>`;

        } else if (page === 'partners') {
            content.innerHTML = `<div style="padding:15px;"><h2 style="margin-bottom: 20px;">B2B Partners Directory 🤝</h2><div class="card" style="text-align:center; padding:40px; color:#888;">B2B Partners directory coming soon...</div></div>`;

        } else if (page === 'profile') {
            content.innerHTML = `
                <div style="padding:40px 20px; text-align:center;">
                    <div class="card" style="padding:50px 20px; border-radius:24px; margin: 0 auto; max-width: 400px;">
                        <div style="width:110px; height:110px; background:#f0f2f5; border-radius:50%; margin:0 auto 25px; display:flex; align-items:center; justify-content:center; border:3px solid var(--primary);">
                            <i class="fas fa-user-shield" style="font-size:3.5rem; color:var(--primary);"></i>
                        </div>
                        <h2 style="margin:0 0 10px 0; color:#1a1a1a; font-family:'Montserrat', sans-serif;">System Administrator</h2>
                        <p style="color:#666; margin-top:0; font-size:0.95rem;">Caspian DMC Portal Access</p>
                        <div style="height:1px; background:#e1e4e8; margin:30px 0;"></div>
                        <button class="btn-action btn-delete" onclick="logout()" style="width:100%; padding:16px; font-weight:700; background:#fff0f0;">LOGOUT</button>
                        
                        <button onclick="generateDemoData()" style="margin-top: 25px; font-size: 0.75rem; color: #a0aab2; background: none; border: 1px dashed #e1e4e8; padding: 8px 15px; border-radius: 8px; cursor: pointer; width: 100%; transition: 0.3s;" onmouseover="this.style.color='#00afb9'; this.style.borderColor='#00afb9';" onmouseout="this.style.color='#a0aab2'; this.style.borderColor='#e1e4e8';">
                            <i class="fas fa-magic"></i> Populate Demo Inventory
                        </button>
                    </div>
                </div>`;
        }
    }

    // --- УМНАЯ ФОРМА (РЕДАКТИРОВАНИЕ/СОЗДАНИЕ) ---
    function showForm(data = {}) {
        const existingModal = document.getElementById('tour-modal');
        if (existingModal) existingModal.remove();

        // Меняем текст кнопки в зависимости от переданного ID
        const buttonText = data.id ? '🔄 UPDATE ITEM' : '➕ ADD ITEM';

        const modalHtml = `
        <div class="modal-overlay" id="tour-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${data.id ? 'Edit Service' : 'Add to Inventory'}</h2>
                    <button class="modal-close" onclick="document.getElementById('tour-modal').classList.remove('active'); setTimeout(() => document.getElementById('tour-modal').remove(), 300);"><i class="fas fa-times"></i></button>
                </div>
                
                <div class="modal-body">
                    <label class="input-label">Service Name</label>
                    <input type="text" id="t-name" value="${data.name || ''}" placeholder="e.g. Baku City Tour">
                    
                    <div style="display:flex; gap:15px;">
                        <div style="flex:1;">
                            <label class="input-label">Supplier Name</label>
                            <input type="text" id="t-supplier" value="${data.supplierName || ''}" placeholder="e.g. Marriott Hotel">
                        </div>
                        <div style="flex:1;">
                            <label class="input-label">Service Type</label>
                            <select id="t-category" onchange="toggleDynamicFields()">
                                ${serviceTypes.map(c => `<option value="${c}" ${data.category===c?'selected':''}>${c}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div id="hotel-dynamic-fields" style="display: none; background: #f8f9fa; padding: 15px; border-radius: 12px; margin-top: 15px; border: 1px solid #e1e4e8;">
                        <h4 style="margin: 0 0 10px 0; font-size: 0.9rem; color: var(--primary);">Hotel Details</h4>
                        <div style="display:flex; gap:15px;">
                            <div style="flex:1;">
                                <label class="input-label" style="margin-top:0;">Stars</label>
                                <input type="number" id="t-stars" value="${data.stars || ''}" placeholder="e.g. 4" min="1" max="5">
                            </div>
                            <div style="flex:2;">
                                <label class="input-label" style="margin-top:0;">Location Area</label>
                                <input type="text" id="t-location" value="${data.location || ''}" placeholder="e.g. City Center">
                            </div>
                        </div>
                    </div>

                    <div id="transport-dynamic-fields" style="display: none; background: #f8f9fa; padding: 15px; border-radius: 12px; margin-top: 15px; border: 1px solid #e1e4e8;">
                        <h4 style="margin: 0 0 10px 0; font-size: 0.9rem; color: var(--primary);">Transport Details</h4>
                        <div style="display:flex; gap:15px;">
                            <div style="flex:2;">
                                <label class="input-label" style="margin-top:0;">Vehicle Class</label>
                                <select id="t-vehicle-type">
                                    ${vehicleTypes.map(v => `<option value="${v}" ${data.vehicleType===v?'selected':''}>${v}</option>`).join('')}
                                </select>
                            </div>
                            <div style="flex:1;">
                                <label class="input-label" style="margin-top:0;">Capacity (Pax)</label>
                                <input type="number" id="t-capacity" value="${data.capacity || ''}" placeholder="e.g. 3">
                            </div>
                        </div>
                    </div>
                    
                    <h4 style="margin:25px 0 10px 0; color:#1a1a1a; font-size:1.1rem; border-bottom:1px solid #eee; padding-bottom:5px;">B2B Pricing Engine</h4>
                    
                    <div style="display:flex; gap:15px;">
                        <div style="flex:1;">
                            <label class="input-label">Net Cost</label>
                            <input type="number" id="t-net-cost" value="${data.netCost || ''}" placeholder="0.00" oninput="calculatePrice()">
                        </div>
                        <div style="flex:1;">
                            <label class="input-label">Markup (%)</label>
                            <input type="number" id="t-markup" value="${data.markup || ''}" placeholder="e.g. 20" oninput="calculatePrice()">
                        </div>
                        <div style="flex:1;">
                            <label class="input-label">Selling Price</label>
                            <input type="number" id="t-selling-price" value="${data.sellingPrice || data.price || ''}" placeholder="0.00" readonly style="background:#f0f2f5; font-weight:bold; color:var(--primary);">
                        </div>
                    </div>
                    
                    <label class="input-label" style="margin-top:15px;">Image filename (from public folder)</label>
                    <input type="text" id="t-image" value="${data.image || ''}" placeholder="e.g. baku_night.jpg">
                    
                    <label class="input-label" style="margin-top:15px;">Description / Included Services</label>
                    <textarea id="t-included" placeholder="Service description..." style="height:80px;">${data.included || ''}</textarea>
                </div>
                
                <div class="modal-footer">
                    <button class="btn-action btn-edit" style="flex:1; padding:14px; font-weight:600;" onclick="document.getElementById('tour-modal').classList.remove('active'); setTimeout(() => document.getElementById('tour-modal').remove(), 300);">CANCEL</button>
                    <button class="save-btn" id="save-action" data-id="${data.id || ''}" style="flex:2; margin:0; padding:14px;">${buttonText}</button>
                </div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        toggleDynamicFields(); 
        
        setTimeout(() => document.getElementById('tour-modal').classList.add('active'), 10);
    }

    document.addEventListener('click', (e) => {
        if (e.target.closest('#add-tour-btn')) { editId = null; showForm(); }
        
        if (e.target.id === 'save-action') {
            const editIdLocal = e.target.getAttribute('data-id');
            const sPrice = parseFloat(document.getElementById('t-selling-price').value);
            const nCost = parseFloat(document.getElementById('t-net-cost').value || 0);
            const markup = parseFloat(document.getElementById('t-markup').value || 0);
            const cat = document.getElementById('t-category').value;

            if (!document.getElementById('t-name').value || isNaN(sPrice)) {
                return alert("Please fill in the Name, Cost and Markup!");
            }

            const tData = {
                name: document.getElementById('t-name').value, 
                supplierName: document.getElementById('t-supplier').value,
                category: cat,
                image: document.getElementById('t-image').value || "", 
                netCost: nCost,
                markup: markup,
                sellingPrice: sPrice,
                price: sPrice, 
                currency: 'AZN', 
                included: document.getElementById('t-included').value || ""
            };

            if (cat === 'Hotel') {
                tData.stars = document.getElementById('t-stars').value;
                tData.location = document.getElementById('t-location').value;
            } else if (cat === 'Transport') {
                tData.vehicleType = document.getElementById('t-vehicle-type').value;
                tData.capacity = document.getElementById('t-capacity').value;
            }
            
            if (editIdLocal) {
                update(ref(db, `inventory/${editIdLocal}`), tData)
                    .then(() => alert("Database updated successfully!"))
                    .catch((error) => alert("Update failed: " + error.message));
            } else {
                push(ref(db, 'inventory'), tData)
                    .then(() => alert("Database updated successfully!"))
                    .catch((error) => alert("Save failed: " + error.message));
            }
            
            document.getElementById('tour-modal').classList.remove('active');
            setTimeout(() => document.getElementById('tour-modal').remove(), 300);
        }
    });

    function updateNav(page) {
        document.querySelectorAll('.bottom-nav button').forEach(btn => btn.classList.remove('active'));
        const btnIdMap = { 'home': 'nav-home', 'calendar': 'nav-bookings', 'bookings': 'nav-bookings', 'tours': 'nav-inventory', 'inventory': 'nav-inventory', 'partners': 'nav-partners', 'profile': 'nav-profile', 'login': 'nav-login' };
        const b = document.getElementById(btnIdMap[page]); 
        if (b) b.classList.add('active');

        document.getElementById('nav-home').style.display = isAuthenticated ? 'flex' : 'none';
        document.getElementById('nav-bookings').style.display = isAuthenticated ? 'flex' : 'none';
        document.getElementById('nav-partners').style.display = isAuthenticated ? 'flex' : 'none';
        document.getElementById('nav-profile').style.display = isAuthenticated ? 'flex' : 'none';
        document.getElementById('nav-logout').style.display = isAuthenticated ? 'flex' : 'none';
        document.getElementById('nav-login').style.display = isAuthenticated ? 'none' : 'flex';
    }
});