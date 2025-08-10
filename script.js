// Данные игры
let cookies = 0;
let cookiesPerSecond = 0;
let refCount = 0;

// Элементы интерфейса
const ovenButton = document.getElementById("oven-button");
const cookiesDisplay = document.getElementById("cookies");
const cpsDisplay = document.getElementById("cps");
const refLink = document.getElementById("ref-link");
const refCountDisplay = document.getElementById("ref-count");

// Инициализация Telegram WebApp
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.expand(); // Развернуть на весь экран
    tg.MainButton.setText("Share Oven");
    tg.MainButton.show();
    tg.MainButton.onClick(() => {
        tg.sendData(`🔥 I'm baking cookies in Oven! Join me: ${generateRefLink()}`);
    });
    
    // Проверка рефералки
    const initData = tg.initDataUnsafe;
    if (initData?.start_param) {
        refCount = localStorage.getItem("refCount") || 0;
        refCount++;
        localStorage.setItem("refCount", refCount);
    }
}

// Генерация реферальной ссылки
function generateRefLink() {
    const botName = "your_bot_name"; // Замените на имя бота
    return `https://t.me/${botName}?start=ref_${tg.initDataUnsafe.user?.id || "0"}`;
}

// Обновление рефералки
if (tg?.initDataUnsafe?.user) {
    refLink.textContent = generateRefLink();
    refCountDisplay.textContent = localStorage.getItem("refCount") || 0;
}

// Клик по печи
ovenButton.addEventListener("click", () => {
    cookies++;
    updateUI();
});

// Покупка улучшений
document.querySelectorAll(".upgrade").forEach(button => {
    button.addEventListener("click", () => {
        const cost = parseInt(button.getAttribute("data-cost"));
        const cps = parseInt(button.getAttribute("data-cps"));
        
        if (cookies >= cost) {
            cookies -= cost;
            cookiesPerSecond += cps;
            button.style.opacity = "0.5";
            button.disabled = true;
            updateUI();
        }
    });
});

// Автоматический доход
setInterval(() => {
    cookies += cookiesPerSecond;
    updateUI();
}, 1000);

// Обновление интерфейса
function updateUI() {
    cookiesDisplay.textContent = cookies;
    cpsDisplay.textContent = cookiesPerSecond;
    localStorage.setItem("cookies", cookies);
    localStorage.setItem("cps", cookiesPerSecond);
}

// Загрузка сохранений
if (localStorage.getItem("cookies")) {
    cookies = parseInt(localStorage.getItem("cookies"));
    cookiesPerSecond = parseInt(localStorage.getItem("cps"));
    updateUI();
}