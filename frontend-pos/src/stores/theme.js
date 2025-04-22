// import create dari zustand
import { create } from "zustand";

export const useStore = create((set) => ({
  // state
  theme: localStorage.getItem("theme") || "light",

  // action
  changeTheme: () => {
    set((state) => {
      // get new theme
      const newTheme = state.theme === "light" ? "dark" : "light";
      // set new theme to local storage
      localStorage.setItem("theme", newTheme);

      // set new theme to document element
      document.documentElement.setAttribute("data-bs-theme", newTheme);

      // return new state
      return { theme: newTheme };
    });
  },
}));
