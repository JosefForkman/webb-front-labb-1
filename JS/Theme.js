const html = document.querySelector("html").classList;
export const useClientTheme = () => {
    if (html.contains("light-theme")) {
        return "light";
    }
    if (html.contains("dark-theme")) {
        return "dark";
    }
    return "system";
};

export const useSystemTheme = () => {
    if (html.contains("light-theme") || html.contains("dark-theme")) {
        return "client";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
};
