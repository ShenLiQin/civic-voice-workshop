export const THEME_STORAGE_KEY = "civic-voice-theme";

export function getInitialTheme(storage = window.localStorage, prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches) {
  const savedTheme = storage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  return prefersDark ? "dark" : "light";
}

export function saveTheme(theme, storage = window.localStorage) {
  storage.setItem(THEME_STORAGE_KEY, theme);
}
