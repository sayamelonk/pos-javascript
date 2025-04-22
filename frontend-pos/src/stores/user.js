// import create dari zustand
import { create } from "zustand";

// import layanan API
import Api from "../services/api";

// import js-cookie
import Cookies from "js-cookie";

export const useStore = create((set) => ({
  // state
  user: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : {}, // parse JSON jika cookie ada
  token: Cookies.get("token") || "",

  // action logiin
  login: async (credentials) => {
    // fetch API
    const response = await Api.post("/api/login", credentials);

    // set state user
    set({ user: response.data.data.user });
    // set state token
    set({ token: response.data.data.token });

    // set cookies
    Cookies.set("user", JSON.stringify(response.data.data.user));
    Cookies.set("token", response.data.data.token);
  },

  // action logout
  logout: () => {
    // clear cookies
    Cookies.remove("user");
    Cookies.remove("token");
    // clear state
    set({ user: {}, token: "" });
  },
}));
