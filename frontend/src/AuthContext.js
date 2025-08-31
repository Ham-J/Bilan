import { createContext, useContext, useState } from "react";
import api from "./api";
const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("USER");
    return raw ? JSON.parse(raw) : null;
  });

  const login = async (email, password) => {
    const { data } = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("TOKEN", data.token);
    localStorage.setItem("USER", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("TOKEN");
    localStorage.removeItem("USER");
    setUser(null);
  };

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
