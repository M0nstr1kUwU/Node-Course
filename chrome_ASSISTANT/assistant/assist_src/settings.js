const defaultSettings = {
  theme: "dark",
  accent: "#ff8800"
};

function getSettings() {
  const s = localStorage.getItem("settings");
  return s ? JSON.parse(s) : defaultSettings;
}

function saveSettings(s) {
  localStorage.setItem("settings", JSON.stringify(s));
  applyTheme(s);
}

// применяем тему и accent
function applyTheme(settings = getSettings()) {
  document.body.className = settings.theme;
  document.documentElement.style.setProperty("--accent", settings.accent);
  document.documentElement.style.setProperty("--hover", lightenColor(settings.accent, 20));
}

// светлеем цвет для hover
function lightenColor(hex, percent) {
  const num = parseInt(hex.replace("#",""),16);
  const r = Math.min(255, ((num >> 16) + (255 * percent/100))|0);
  const g = Math.min(255, (((num >> 8) & 0x00FF) + (255 * percent/100))|0);
  const b = Math.min(255, ((num & 0x0000FF) + (255 * percent/100))|0);
  return `rgb(${r},${g},${b})`;
}

// подключаем к элементам настроек
document.getElementById("theme").value = getSettings().theme;
document.getElementById("accent").value = getSettings().accent;

document.getElementById("save").onclick = () => {
  const newSettings = {
    theme: document.getElementById("theme").value,
    accent: document.getElementById("accent").value
  };
  saveSettings(newSettings);
  alert("Сохранено");
};

// применяем сразу при загрузке страницы
applyTheme();