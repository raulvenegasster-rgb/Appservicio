import { createContext, useEffect, useMemo, useState } from 'react';
import { getProfile, loginRequest, registerRequest } from '../services/api.js';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ofibowl_token');
    if (!token) {
      setLoading(false);
      return;
    }

    getProfile()
      .then((profile) => setUser(profile))
      .catch(() => localStorage.removeItem('ofibowl_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const data = await loginRequest(credentials);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const data = await registerRequest(payload);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('ofibowl_token');
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, login, register, logout, loading }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
