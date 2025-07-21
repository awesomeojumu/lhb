import { createContext, useContext, useEffect, useState } from "react";
import { login as loginService, logout as logoutService } from "@services/authService";
import { getProfile } from "@services/userService";
import { setToken, getToken, removeToken } from "@utils/storage";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Auto-fetch user if token exists (on page reload)
  useEffect(() => {
    const init = async () => {
      const token = getToken();
      if (token) {
        try {
          const profile = await getProfile();
          setUser(profile);
        } catch (err) {
          console.error("Auth init error:", err.message);
          removeToken();
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  // ✅ Login function
  const login = async (email, password) => {
    const res = await loginService(email, password);
    setToken(res.token);
    setUser({
      _id: res._id,
      firstName: res.firstName,
      lastName: res.lastName,
      email: res.email,
      role: res.role,
      battalion: res.battalion,
    });
    return res;
  };

  // ✅ Logout function
  const logout = async () => {
    try {
      await logoutService();
    } catch (err) {
      console.warn("Logout service error (ignored):", err.message);
    }
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
