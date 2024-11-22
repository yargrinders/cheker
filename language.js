function changeLanguage() {
    const selectedLanguage = document.getElementById("languageSelect").value;
    if (selectedLanguage === "de") {
        window.location.href = "index.html"; // Переход на немецкую версию
    } else if (selectedLanguage === "ru") {
        window.location.href = "index_ru.html"; // Переход на русскую версию
    }
}

// Определение текущего языка и установка выбранного элемента в селекте
function setInitialLanguage() {
    const currentUrl = window.location.pathname;
    const languageSelect = document.getElementById("languageSelect");

    if (currentUrl.includes("index_ru.html")) {
        languageSelect.value = "ru"; // Устанавливаем RU, если русский язык
    } else {
        languageSelect.value = "de"; // По умолчанию DE, если немецкий
    }
}

// Вызов функции установки языка при загрузке страницы
window.onload = setInitialLanguage;