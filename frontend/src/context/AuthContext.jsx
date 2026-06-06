import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('tm_token'));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('tm_refresh'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('tm_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const readUser = () => {
      const raw = localStorage.getItem('tm_user');
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    };

    const syncFromStorage = () => {
      setToken(localStorage.getItem('tm_token'));
      setRefreshToken(localStorage.getItem('tm_refresh'));
      setUser(readUser());
    };

    const onStorage = (e) => {
      const keys = ['tm_token', 'tm_refresh', 'tm_user', 'tm_auth_event'];
      if (!e?.key || !keys.includes(e.key)) return;
      syncFromStorage();
    };

    window.addEventListener('tm_auth_change', syncFromStorage);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('tm_auth_change', syncFromStorage);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const login = useCallback(async ({ username, password }) => {
    const { data } = await api.post('/auth/login', { username, password });
    localStorage.setItem('tm_token', data.token);
    if (data.refreshToken) localStorage.setItem('tm_refresh', data.refreshToken);
    localStorage.setItem('tm_user', JSON.stringify(data.user));
    setToken(data.token);
    setRefreshToken(data.refreshToken ?? null);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('tm_token');
    localStorage.removeItem('tm_refresh');
    localStorage.removeItem('tm_user');
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ token, refreshToken, user, login, logout, isAuthenticated: Boolean(token) }),
    [token, refreshToken, user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
