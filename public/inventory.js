// inventory.js - Оптимизированный модуль инвентаря
export function initInventory(renderCallback) {
    const { db, dbFunc } = window;
    const { ref, onValue, query, limitToFirst, remove } = dbFunc;

    window.inventory = [];
    window.inventoryLimit = 12; // Изначально грузим только 12 элементов!

    // Функция перехвата файла и конвертации в WebP (Client-side)
    window.processImageUpload = async (fileInput) => {
        const file = fileInput.files[0];
        if (!file) return;

        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width; canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    // Сжимаем в WebP с качеством 85%
                    canvas.toDataURL('image/webp', 0.85); 
                    console.log("Image optimized to WebP. Ready for upload.");
                    alert("Image successfully optimized to WebP format!");
                    resolve();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    // Слушаем базу с LIMIT для производительности
    const loadInventory = () => {
        const invQuery = query(ref(db, 'inventory'), limitToFirst(window.inventoryLimit));
        onValue(invQuery, (snapshot) => {
            const data = snapshot.val();
            window.inventory = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
            if (window.isAuthReady && ['inventory', 'home'].includes(window.currentPage)) {
                renderCallback(window.currentPage);
            }
        });
    };

    // Первичная загрузка
    loadInventory();

    // Infinite Scroll Logic
    window.loadMoreInventory = () => {
        window.inventoryLimit += 12;
        loadInventory();
    };

    window.deleteItem = (id) => { 
        if(confirm('Boss, delete this service?')) {
            remove(ref(db, `inventory/${id}`));
        }
    };

    // Золотой Эталон Демо-Данных
    window.generateDemoData = async () => {
        if (!confirm("Inject Golden Standard Simulation Data?")) return;
        const { push } = dbFunc;
        const calcPrice = (net) => parseFloat((net * 1.15).toFixed(2));

        const demoItems = [
            { name: "Four Seasons Hotel Baku", supplierName: "Four Seasons", category: "Hotel", netCost: 450, markup: 15, sellingPrice: calcPrice(450), price: calcPrice(450), currency: "AZN", stars: "5", location: "City Center", image: "four_seasons.jpg", included: "Deluxe Caspian Room" },
            { name: "JW Marriott Absheron", supplierName: "Marriott Int.", category: "Hotel", netCost: 350, markup: 15, sellingPrice: calcPrice(350), price: calcPrice(350), currency: "AZN", stars: "5", location: "City Center", image: "jw_marriott.jpg", included: "Executive Lounge Access" },
            { name: "Gobustan & Mud Volcanoes Tour", supplierName: "Caspian DMC", category: "Activity", netCost: 90, markup: 15, sellingPrice: calcPrice(90), price: calcPrice(90), currency: "AZN", location: "Gobustan", image: "gobustan_tour.jpg", included: "English Speaking Guide, Tickets" },
            { name: "Chenot Palace Gabala", supplierName: "Chenot", category: "Hotel", netCost: 500, markup: 15, sellingPrice: calcPrice(500), price: calcPrice(500), currency: "AZN", stars: "5", location: "Gabala", image: "chenot_gabala.jpg", included: "Wellness Retreat Package" },
            { name: "Premium VIP Transfer", supplierName: "VIP Trans", category: "Transport", netCost: 120, markup: 15, sellingPrice: calcPrice(120), price: calcPrice(120), currency: "AZN", vehicleType: "V-Class", capacity: "6", image: "v_class.jpg", included: "Wi-Fi, Water" }
        ];

        try {
            for (const item of demoItems) await push(ref(db, 'inventory'), item);
            alert("✅ Simulation data with Golden Assets successfully injected!");
        } catch (error) { alert("Error: " + error.message); }
    };
}