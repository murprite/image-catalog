const KEY = "theme";

export function getTheme(): "dark" | "light" {
    return (localStorage.getItem(KEY) as any) || "dark";
}

export function setTheme(theme: "dark" | "light") {
    localStorage.setItem(KEY, theme);

    document.documentElement.classList.toggle(
        "dark",
        theme === "dark"
    );

    document.documentElement.classList.toggle(
        "light",
        theme === "light"
    );

    // 🔥 глобальный сигнал для всех компонентов
    window.dispatchEvent(
        new Event("theme-change")
    );
}