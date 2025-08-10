// Игровые данные
let coins = 0;
let coinsPerSecond = 0;
let refCount = 0;

// Элементы
const coin = document.getElementById("coin");
const coinsDisplay = document.getElementById("coins");
const cpsDisplay = document.getElementById("cps");
const floatingTexts = document.getElementById("floating-texts");

// Telegram WebApp
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.expand();
    tg.MainButton.setText("Пригласить друга");
    tg.MainButton.show();
    tg.MainButton.onClick(() => {
        tg.sendData(`Присоединяйся к Oven Coin! ${generateRefLink()}`);
    });
    
    // Проверка рефералки
    const initData = tg.initDataUnsafe;
    if (initData?.start_param) {
        refCount = parseInt(localStorage.getItem("refCount")) || 0;
        refCount++;
        localStorage.setItem("refCount", refCount);
    }
}

// Генерация реферальной ссылки
function generateRefLink() {
    const botName = "your_bot_name"; // Замените на имя бота
    return `https://t.me/${botName}?start=ref_${tg?.initDataUnsafe?.user?.id || "0"}`;
}

// Обновление UI
function updateUI() {
    coinsDisplay.textContent = coins;
    cpsDisplay.textContent = coinsPerSecond;
    localStorage.setItem("coins", coins);
    localStorage.setItem("cps", coinsPerSecond);
    
    // Обновляем кнопки улучшений
    document.querySelectorAll(".upgrade-item").forEach(item => {
        const cost = parseInt(item.dataset.cost);
        const btn = item.querySelector(".upgrade-btn");
        btn.disabled = coins < cost;
    });
    
    if (tg?.initDataUnsafe?.user) {
        document.getElementById("ref-link").textContent = generateRefLink();
        document.getElementById("ref-count").textContent = localStorage.getItem("refCount") || 0;
    }
}

// Клик по монетке
coin.addEventListener("click", (e) => {
    coins++;
    updateUI();
    
    // Анимация
    coin.style.transform = "scale(0.95)";
    setTimeout(() => coin.style.transform = "scale(1)", 100);
    
    // Всплывающий текст
    const text = document.createElement("div");
    text.className = "floating-text";
    text.textContent = "+1";
    floatingTexts.appendChild(text);
    
    setTimeout(() => text.remove(), 1000);
});

// Покупка улучшений
document.querySelectorAll(".upgrade-btn").forEach(btn => {
    btn.addEventListener("click", function() {
        const item = this.closest(".upgrade-item");
        const cost = parseInt(item.dataset.cost);
        const cps = parseInt(item.dataset.cps);
        
        if (coins >= cost) {
            coins -= cost;
            coinsPerSecond += cps;
            this.disabled = true;
            this.textContent = "Куплено";
            item.style.opacity = "0.7";
            updateUI();
        }
    });
});

// Автоматический доход
setInterval(() => {
    if (coinsPerSecond > 0) {
        coins += coinsPerSecond;
        updateUI();
    }
}, 1000);

// Загрузка сохранений
if (localStorage.getItem("coins")) {
    coins = parseInt(localStorage.getItem("coins"));
    coinsPerSecond = parseInt(localStorage.getItem("cps"));
    updateUI();
}