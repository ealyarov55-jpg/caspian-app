document.addEventListener('DOMContentLoaded', () => {
    const { db, dbFunc } = window;
    const { ref, push, set, onValue, remove, update } = dbFunc;

    let tours = []; 
    let bookings = []; 
    let editId = null; 
    let searchQuery = ""; 
    let currentPage = 'главная';
    
    let userRole = sessionStorage.getItem('caspian_role');
    let isAuthenticated = !!userRole; 

    const MASTER_PASSWORD = "1299"; 
    const AGENT_PASSWORD = "7777";  
    const categories = ["Групповой", "Индивидуальный", "VIP"];

    // --- УМНОЕ СКЛОНЕНИЕ ДНЕЙ ---
    function formatDays(d) {
        const num = parseInt(d, 10);
        if (isNaN(num)) return `${d} дн.`;
        const n10 = num % 10;
        const n100 = num % 100;
        if (n10 === 1 && n100 !== 11) return `${num} день`;
        if ([2, 3, 4].includes(n10) && ![12, 13, 14].includes(n100)) return `${num} дня`;
        return `${num} дней`;
    }

    // 1. Слушаем базу (Firebase)
    if (isAuthenticated) {
        onValue(ref(db, 'tours'), (snapshot) => {
            const data = snapshot.val();
            tours = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
            if (currentPage !== 'form' && document.activeElement.id !== 'search-input') {
                render(currentPage);
            }
        });

        onValue(ref(db, 'bookings'), (snapshot) => {
            const data = snapshot.val();
            bookings = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
            if (currentPage === 'календарь' || currentPage === 'главная') {
                render(currentPage);
            }
        });
    }

    const initialHeight = window.innerHeight;
    window.addEventListener('resize', () => {
        const nav = document.querySelector('.bottom-nav');
        if (nav && isAuthenticated && window.innerWidth < 768) {
            nav.style.display = window.innerHeight < initialHeight * 0.8 ? 'none' : 'flex';
        }
    });

    window.login = function() {
        const enteredPass = document.getElementById('pass-field').value;
        if (enteredPass === MASTER_PASSWORD) {
            sessionStorage.setItem('caspian_role', 'admin'); 
            location.reload();
        } else if (enteredPass === AGENT_PASSWORD) {
            sessionStorage.setItem('caspian_role', 'agent'); 
            location.reload();
        } else {
            alert("Неверный пароль!");
        }
    };

    window.logout = () => { 
        sessionStorage.removeItem('caspian_role'); 
        location.reload(); 
    };
    
    window.render = (page) => render(page);
    window.deleteTour = (id) => { if(confirm('Удалить этот маршрут?')) remove(ref(db, `tours/${id}`)); };
    window.editTour = (id) => { editId = id; showForm(tours.find(x => x.id === id)); };
    
    window.bookTour = (id) => {
        const t = tours.find(x => x.id === id);
        const sellP = t.sellingPrice || t.price || 0;
        
        const clientName = prompt(`Бронирование: ${t.name}\nВведите имя туриста или комментарий (Кто поедет?):`);
        if (clientName === null) return; 
        
        const defaultDate = t.date ? new Date(t.date).toLocaleDateString('ru-RU') : '';
        const tourDate = prompt(`Желаемая дата тура:`, defaultDate);
        if (tourDate === null) return;

        if (confirm(`Отправить заявку на ${tourDate} для ${clientName}?`)) {
            push(ref(db, 'bookings'), {
                tourId: id,
                tourName: t.name,
                clientName: clientName || 'Без имени',
                price: sellP,
                currency: t.currency,
                date: tourDate || 'Не указана',
                driver: '', 
                status: 'new',
                timestamp: new Date().toISOString()
            });
            alert('Заявка успешно отправлена! Перейдите в "Календарь", чтобы отслеживать статус.');
        }
    };

    window.assignDriver = (id) => {
        const driverName = prompt("Введите имя водителя и авто (например: Али, Mercedes V-Class):");
        if (driverName) {
            update(ref(db, `bookings/${id}`), { driver: driverName, status: 'confirmed' });
        }
    };

    window.deleteBooking = (id) => {
        if (confirm('Удалить эту заявку из системы?')) {
            remove(ref(db, `bookings/${id}`));
        }
    };

    window.shareWhatsApp = (id) => {
        const t = tours.find(x => x.id === id);
        const d = t.date ? new Date(t.date).toLocaleDateString('ru-RU') : 'не указана';
        const sellP = t.sellingPrice || t.price || 0;
        let lines = [`*ОФФЕР: ${t.name.toUpperCase()}*`, "", `Дата: ${d}`, `Цена: ${sellP} ${t.currency}`, `Длительность: ${formatDays(t.days)}`];
        if (t.hotel) lines.push(`Отель: ${t.hotel}`);
        if (t.food) lines.push(`Питание: ${t.food}`);
        if (t.transport) lines.push(`Транспорт: ${t.transport}`);
        if (t.included) { lines.push(""); lines.push(`Включено: ${t.included}`); }
        lines.push(""); lines.push("_Caspian Travel Routes_");
        window.open("https://wa.me/?text=" + lines.map(l => encodeURIComponent(l)).join('%0A'), '_blank');
    };

    // --- ГЛАВНАЯ ФУНКЦИЯ РИСОВАНИЯ ---
    function render(page) {
        currentPage = page;
        const content = document.getElementById('app-content');
        if (!content) return;

        if (!isAuthenticated) {
            content.innerHTML = `<div class="card" style="margin-top:60px; text-align:center;"><i class="fas fa-lock" style="font-size:3rem; color:var(--primary);"></i><h2>Caspian Portal</h2><p style="color:#888; font-size:0.9rem;">Введите код доступа</p><input type="password" id="pass-field" placeholder="Пароль" style="text-align:center;" onkeydown="if(event.key === 'Enter') login()"><button class="save-btn" onclick="login()">Войти</button></div>`;
            document.querySelector('.bottom-nav').style.display = 'none'; return;
        }

        document.querySelector('.bottom-nav').style.display = 'flex';
        updateNav(page);

        // --- ТУРЫ (PWA ДИЗАЙН И ЛОКАЛЬНЫЕ ФОТО) ---
        if (page === 'туры') {
            const listHtml = tours.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())).map(t => {
                const sellP = t.sellingPrice || t.price || 0;
                const netC = t.netCost || 0;
                const profit = sellP - netC;
                
                // --- ФИНАЛЬНЫЙ БЛОК: СИМВОЛ В СИМВОЛ ---
                let coverImage = ""; 
                const n = t.name.toLowerCase();
                
                if (n.includes('ичеришехер') || n.includes('icherisheher') || n.includes('старый город')) {
                    coverImage = "icherisheher_old_city.jpg";
                } else if (n.includes('баку') || n.includes('baku')) {
                    coverImage = "baku_night.jpg";
                } else if (n.includes('габала') || n.includes('gabala')) {
                    coverImage = "gabala_lake.jpg";
                } else if (n.includes('губа') || n.includes('quba') || n.includes('guba')) {
                    coverImage = "guba_mountains.jpg";
                }
                
                // Если картинка не найдена в списке, ставим нейтральный фон гор
                if (!coverImage) {
                    coverImage = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80";
                }

                return `
                <div class="tour-card fade-in">
                    <div style="position: relative;">
                        <img src="${coverImage}" class="tour-image" alt="${t.name}">
                        
                        <div style="position:absolute; top:16px; left:16px;">
                            <span class="badge" style="background:rgba(255,255,255,0.95); box-shadow:0 2px 10px rgba(0,0,0,0.1);"><i class="fas fa-star" style="color:#f1c40f;"></i> ${t.category}</span>
                        </div>
                        <div style="position:absolute; bottom:-16px; right:16px; background:var(--dark); color:white; padding:8px 20px; border-radius:25px; font-weight:800; font-size:1.1rem; box-shadow:0 4px 15px rgba(0,0,0,0.2); z-index: 2;">
                            ${t.currency==='AZN'?'₼':'$'}${sellP}
                        </div>
                    </div>
                    
                    <div class="tour-card-content">
                        <h3 style="margin-top:10px;">📍 ${t.name}</h3>
                        <div style="font-size:0.85rem; color:#636e72; margin-top:10px;">
                            ${t.hotel ? `<div style="margin-bottom:4px;"><i class="fas fa-hotel" style="width:20px; color:var(--primary);"></i> ${t.hotel}</div>` : ''}
                            ${t.food ? `<div style="margin-bottom:4px;"><i class="fas fa-utensils" style="width:20px; color:var(--primary);"></i> ${t.food}</div>` : ''}
                            ${t.transport ? `<div style="margin-bottom:4px;"><i class="fas fa-car-side" style="width:20px; color:var(--primary);"></i> ${t.transport}</div>` : ''}
                            <div><i class="far fa-clock" style="width:20px; color:var(--primary);"></i> ${formatDays(t.days)}</div>
                        </div>
                        
                        ${userRole === 'admin' ? `
                        <div style="background:#e8f5e9; padding:8px 12px; border-radius:8px; margin-top:12px; font-size:0.85rem; color:#2e7d32; display:flex; justify-content:space-between; align-items:center;">
                            <span>Net: <b>${netC}</b></span>
                            <span style="font-weight:700;">Profit: +${profit} ${t.currency}</span>
                        </div>` : ''}

                        ${t.included ? `<div class="included-box" style="margin-top:12px;">${t.included}</div>` : ''}
                        
                        <div style="display:flex; gap:10px; margin-top:15px;">
                            ${userRole === 'admin' ? `
                                <button class="btn-share" onclick="shareWhatsApp('${t.id}')"><i class="fab fa-whatsapp" style="font-size:1.2rem;"></i></button>
                                <button onclick="editTour('${t.id}')" style="flex:1; background:#f1f2f6; color:#333; border:none; border-radius:10px;"><i class="fas fa-pen"></i></button>
                                <button onclick="deleteTour('${t.id}')" style="flex:1; background:#fff0f0; color:var(--danger); border:none; border-radius:10px;"><i class="fas fa-trash"></i></button>
                            ` : `
                                <button onclick="shareWhatsApp('${t.id}')" style="flex:1; background:#f1f2f6; color:#25D366; border:none; border-radius:10px; font-size:1.2rem;"><i class="fab fa-whatsapp"></i></button>
                                <button onclick="bookTour('${t.id}')" style="flex:4; background:var(--primary); color:white; border:none; border-radius:10px; font-weight:bold; font-size:0.9rem;">ЗАБРОНИРОВАТЬ</button>
                            `}
                        </div>
                    </div>
                </div>`
            }).join('');

            const listContainer = document.getElementById('tours-list');
            if (listContainer && document.getElementById('search-input')) {
                listContainer.innerHTML = listHtml || '<p style="text-align:center; padding:20px; color:#999;">Ничего не найдено</p>';
            } else {
                content.innerHTML = `
                    <div style="padding:15px;">
                        <h2>Маршруты 🗺️</h2>
                        <div style="position:relative;">
                            <i class="fas fa-search" style="position:absolute; left:15px; top:25px; color:#aaa;"></i>
                            <input type="text" id="search-input" placeholder="Поиск направления..." value="${searchQuery}" autocomplete="off" style="padding-left:40px;">
                        </div>
                        <div id="tours-list" style="padding-bottom:120px;">${listHtml}</div>
                        ${userRole === 'admin' ? `<button class="add-tour-btn" id="add-tour-btn" aria-label="Добавить новый тур"><i class="fas fa-plus"></i></button>` : ''}
                    </div>`;
                
                document.getElementById('search-input').addEventListener('input', (e) => {
                    searchQuery = e.target.value;
                    render('туры'); 
                });
            }

        // --- ГЛАВНАЯ (DASHBOARD) ---
        } else if (page === 'главная') {
            const newBookings = bookings.filter(b => b.status === 'new').length;
            const revenue = bookings.reduce((sum, b) => sum + Number(b.price || 0), 0);
            
            let recentHTML = '';
            if (bookings.length > 0) {
                const recent = [...bookings].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 3);
                recentHTML = recent.map(b => `
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #eee;">
                        <div>
                            <div style="font-weight:600; font-size:0.9rem;">${b.tourName}</div>
                            <div style="font-size:0.75rem; color:#888;">${b.clientName} • ${b.date}</div>
                        </div>
                        <div style="text-align:right;">
                            <div style="font-weight:700; color:var(--dark);">${b.price} ${b.currency}</div>
                            <div style="font-size:0.7rem; color:${b.status === 'confirmed' ? '#2ecc71' : '#f1c40f'};">
                                ${b.status === 'confirmed' ? 'Подтверждено' : 'Ожидает'}
                            </div>
                        </div>
                    </div>
                `).join('');
            } else {
                recentHTML = `<div style="text-align:center; color:#999; padding:10px; font-size:0.85rem;">Заявок пока нет</div>`;
            }

            content.innerHTML = `
                <div style="padding:15px;">
                    <h2 style="margin-bottom:5px;">Добро пожаловать, ${userRole === 'admin' ? 'Босс' : 'Партнер'}! 🤝</h2>
                    <p style="color:#888; margin-top:0; font-size:0.9rem; margin-bottom:20px;">Краткая сводка по вашему бизнесу</p>
                    
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:20px;">
                        <div class="card" style="margin:0; text-align:center; padding:15px;">
                            <div style="width:40px; height:40px; background:#e0f7f9; border-radius:10px; display:flex; align-items:center; justify-content:center; margin:0 auto 10px; color:var(--primary);">
                                <i class="fas fa-bell"></i>
                            </div>
                            <div style="font-size:1.8rem; font-weight:800; margin:5px 0;">${newBookings}</div>
                            <div style="font-size:0.7rem; color:#888; text-transform:uppercase;">Новых заявок</div>
                        </div>
                        <div class="card" style="margin:0; text-align:center; padding:15px;">
                            <div style="width:40px; height:40px; background:#fef5e7; border-radius:10px; display:flex; align-items:center; justify-content:center; margin:0 auto 10px; color:#f39c12;">
                                <i class="fas fa-wallet"></i>
                            </div>
                            <div style="font-size:1.8rem; font-weight:800; margin:5px 0;">${revenue}</div>
                            <div style="font-size:0.7rem; color:#888; text-transform:uppercase;">Объем (${bookings[0]?.currency || 'AZN'})</div>
                        </div>
                    </div>

                    <div class="card" style="margin:0;">
                        <h4 style="margin:0 0 10px 0; display:flex; justify-content:space-between; align-items:center;">
                            Последние брони 
                            <span onclick="render('календарь')" style="font-size:0.8rem; color:var(--primary); font-weight:400; cursor:pointer;">Все</span>
                        </h4>
                        ${recentHTML}
                    </div>
                </div>`;

        // --- КАЛЕНДАРЬ БРОНИРОВАНИЙ (ЗАЯВКИ) ---
        } else if (page === 'календарь') {
            let calHtml = `<div style="padding:15px;"><h2>Календарь заказов 📅</h2><div style="padding-bottom:100px;">`;
            
            if (bookings.length === 0) {
                calHtml += `<div class="card" style="text-align:center; color:#888;">Пока нет ни одного бронирования</div>`;
            } else {
                const sorted = [...bookings].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
                sorted.forEach(b => {
                    const isConfirmed = b.status === 'confirmed';
                    const borderColor = isConfirmed ? '#2ecc71' : '#f1c40f'; 
                    
                    calHtml += `
                    <div class="card" style="margin:12px 0; border-left: 5px solid ${borderColor}; padding:15px;">
                        <div style="display:flex; justify-content:space-between; align-items:start;">
                            <span style="font-size:0.75rem; color:#a4b0be;"><i class="far fa-clock"></i> ${new Date(b.timestamp).toLocaleDateString('ru-RU')}</span>
                            <strong style="color:var(--dark); font-size:1.1rem;">${b.price} ${b.currency}</strong>
                        </div>
                        <h3 style="margin:8px 0 12px 0; font-size:1.1rem;">📍 ${b.tourName}</h3>
                        
                        <div style="font-size:0.9rem; color:#2d3436; margin-bottom:12px; background:#f5f5f7; padding:10px; border-radius:8px;">
                            <div style="margin-bottom:5px;">👤 Турист: <b>${b.clientName}</b></div>
                            <div style="margin-bottom:5px;">📅 Дата поездки: <b>${b.date}</b></div>
                            <div>🚗 Водитель: <b>${b.driver || '<span style="color:#e17055;">Не назначен</span>'}</b></div>
                        </div>

                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            ${userRole === 'admin' ? `
                                <button onclick="assignDriver('${b.id}')" style="background:#e0f7f9; color:#0081a7; border:none; padding:8px 12px; border-radius:8px; font-weight:600;"><i class="fas fa-car-side"></i> Назначить</button>
                                <button onclick="deleteBooking('${b.id}')" style="background:none; color:var(--danger); border:none; padding:8px; font-size:1.1rem;"><i class="fas fa-trash"></i></button>
                            ` : `
                                <div style="font-size:0.85rem; font-weight:700; color:${borderColor};">
                                    ${isConfirmed ? '<i class="fas fa-check-circle"></i> Подтверждено' : '<i class="fas fa-hourglass-half"></i> В обработке'}
                                </div>
                            `}
                        </div>
                    </div>`;
                });
            }
            content.innerHTML = calHtml + `</div></div>`;

        // --- ПРОФИЛЬ ---
        } else if (page === 'профиль') {
            content.innerHTML = `
                <div style="padding:40px 20px; text-align:center;">
                    <div class="card" style="padding:40px 20px; border-radius:30px;">
                        <div style="width:100px; height:100px; background:#f5f5f7; border-radius:50%; margin:0 auto 20px; display:flex; align-items:center; justify-content:center; border:2px solid var(--primary);">
                            <i class="${userRole === 'admin' ? 'fas fa-user-shield' : 'fas fa-user-tie'}" style="font-size:3rem; color:var(--primary);"></i>
                        </div>
                        <h2 style="margin:0;">${userRole === 'admin' ? 'Administrator' : 'Partner Agent'}</h2>
                        <p style="color:#888; margin-top:10px;">Caspian DMC Portal Access</p>
                        <div style="height:1px; background:#eee; margin:25px 0;"></div>
                        <button class="save-btn" onclick="logout()" style="background:var(--danger); box-shadow:none;">ВЫЙТИ ИЗ СИСТЕМЫ</button>
                    </div>
                </div>`;
        }
    }

    function showForm(data = {}) {
        currentPage = 'form';
        document.getElementById('app-content').innerHTML = `<div class="card" style="margin-bottom:200px;">
            <h3 style="color:var(--dark);">${data.id ? 'Редактирование' : 'Создать маршрут'}</h3>
            <input type="text" id="t-name" value="${data.name || ''}" placeholder="Название направления (Например: Баку)">
            <select id="t-category">${categories.map(c => `<option value="${c}" ${data.category===c?'selected':''}>${c}</option>`).join('')}</select>
            <input type="date" id="t-date" value="${data.date || ''}">
            
            <div style="display:flex; gap:10px;">
                <input type="number" id="t-net-cost" value="${data.netCost || ''}" placeholder="Net Cost (Затраты)" style="flex:1;">
                <input type="number" id="t-selling-price" value="${data.sellingPrice || data.price || ''}" placeholder="Selling Price (Продажа)" style="flex:1;">
                <select id="t-currency" style="flex:1;"><option value="AZN" ${data.currency==='AZN'?'selected':''}>AZN</option><option value="USD" ${data.currency==='USD'?'selected':''}>USD</option></select>
            </div>
            
            <input type="number" id="t-days" value="${data.days || ''}" placeholder="Дни">
            
            <h4 style="margin:15px 0 5px 0; color:#666; font-size:0.9rem;">Дополнительно:</h4>
            <input type="text" id="t-hotel" value="${data.hotel || ''}" placeholder="Отель (оставьте пустым, если нет)">
            <input type="text" id="t-food" value="${data.food || ''}" placeholder="Питание (например: Завтраки)">
            <input type="text" id="t-transport" value="${data.transport || ''}" placeholder="Транспорт (например: V-Class)">
            
            <textarea id="t-included" placeholder="Что включено в стоимость (описание услуг)..." style="height:120px;">${data.included || ''}</textarea>
            <button class="save-btn" id="save-action" style="margin-top:15px;">💾 СОХРАНИТЬ</button>
            <button class="save-btn" style="background:#f5f5f7; color:#666; margin-top:10px; box-shadow:none;" onclick="render('туры')">ОТМЕНА</button>
        </div>`;
        window.scrollTo(0,0);
    }

    document.addEventListener('click', (e) => {
        if (e.target.closest('#add-tour-btn')) { editId = null; showForm(); }
        if (e.target.id === 'save-action') {
            const sPrice = document.getElementById('t-selling-price').value;
            const tData = {
                name: document.getElementById('t-name').value, 
                category: document.getElementById('t-category').value,
                date: document.getElementById('t-date').value, 
                netCost: document.getElementById('t-net-cost').value,
                sellingPrice: sPrice,
                price: sPrice, 
                currency: document.getElementById('t-currency').value, 
                days: document.getElementById('t-days').value,
                hotel: document.getElementById('t-hotel').value || "",
                food: document.getElementById('t-food').value || "",
                transport: document.getElementById('t-transport').value || "",
                included: document.getElementById('t-included').value || ""
            };
            if (!tData.name || !tData.sellingPrice) return alert("Заполни название и цену продажи!");
            if (editId) update(ref(db, `tours/${editId}`), tData); else push(ref(db, 'tours'), tData);
            render('туры');
        }
    });

    function updateNav(page) {
        document.querySelectorAll('.bottom-nav button').forEach(btn => btn.classList.remove('active'));
        const b = document.getElementById({ 'главная':'nav-home', 'календарь':'nav-calendar', 'туры':'nav-tours', 'профиль':'nav-profile' }[page]); if (b) b.classList.add('active');
    }
    
    render('главная');
});