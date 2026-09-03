import { describe, expect, it } from "vitest";
import { getInitialTheme, saveTheme, THEME_STORAGE_KEY } from "./theme";

function createStorage(initialValue = null) {
  let value = initialValue;
  return {
    getItem: () => value,
    setItem: (_key, nextValue) => { value = nextValue; },
  };
}

describe("theme preferences", () => {
  it("uses a saved theme before the system preference", () => {
    expect(getInitialTheme(createStorage("dark"), false)).toBe("dark");
    expect(getInitialTheme(createStorage("light"), true)).toBe("light");
  });

  it("uses the system preference when no saved theme exists", () => {
    expect(getInitialTheme(createStorage(), true)).toBe("dark");
    expect(getInitialTheme(createStorage(), false)).toBe("light");
  });

  it("persists a selected theme", () => {
    const storage = createStorage();
    saveTheme("dark", storage);
    expect(storage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });
});
