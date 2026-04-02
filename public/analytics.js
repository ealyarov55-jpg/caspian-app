// analytics.js - Модуль расчета метрик и бизнес-аналитики
// FIX [02.04.2026]: Подключение к Firebase /bookings, калькуляция Net и Savings, анимация UI

let isListening = false;
let currentVolume = 0;
let currentSavings = 0;

export function calculateDashboardStats() {
    const { db, dbFunc } = window;
    if (!db || !dbFunc) return;
    const { ref, onValue } = dbFunc;

    // Запускаем слушатель Firebase только один раз, чтобы избежать утечек памяти
    if (!isListening) {
        isListening = true;
        
        onValue(ref(db, 'bookings'), (snapshot) => {
            const data = snapshot.val();
            let totalVolumeNet = 0;
            let totalRackRate = 0;

            if (data) {
                // Перебираем все бронирования
                Object.values(data).forEach(booking => {
                    // Исключаем отмененные заказы
                    if (booking.status !== 'cancelled') {
                        // Суммируем Net Cost и Selling Price (Rack Rate)
                        totalVolumeNet += parseFloat(booking.totalNet || 0);
                        totalRackRate += parseFloat(booking.totalSelling || 0);
                    }
                });
            }

            // Кэшируем значения: 30% комиссии от продажной цены
            currentVolume = totalVolumeNet;
            currentSavings = totalRackRate * 0.30;
            
            // Обновляем интерфейс
            updateDashboardDOM(currentVolume, currentSavings);
        });
    } else {
        // Если слушатель уже работает (например, при переходе между вкладками), 
        // просто рендерим последние известные данные
        updateDashboardDOM(currentVolume, currentSavings);
    }
}

function updateDashboardDOM(volume, savings) {
    // Находим элементы виджетов по ID и классам
    const volumeEl = document.getElementById('metric-volume');
    const savingsEl = document.querySelector('.savings-text');

    if (volumeEl) {
        animateUpdate(volumeEl, `${volume.toFixed(2)} AZN`);
    }
    if (savingsEl) {
        animateUpdate(savingsEl, `${savings.toFixed(2)} AZN`);
    }
}

// Функция для анимации чисел (пульсация)
function animateUpdate(element, newValue) {
    if (element.innerText === newValue) return; // Не анимируем, если цифра не изменилась
    
    element.innerText = newValue;
    element.style.display = 'inline-block';
    element.style.transition = 'transform 0.2s ease-in-out';
    
    // Увеличиваем масштаб
    element.style.transform = 'scale(1.1)';
    
    // Возвращаем в исходное состояние через 200мс
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 200);
}