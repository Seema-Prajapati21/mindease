import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('mindease_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mindease_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await authApi.getMe();
          setUser(res.user);
          localStorage.setItem('mindease_user', JSON.stringify(res.user));
        } catch (err) {
          // If offline or backend down, keep cached user
          console.warn('Could not refresh user profile from backend, using cached state.');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('mindease_token', res.token);
      localStorage.setItem('mindease_user', JSON.stringify(res.user));
      const curr = {
        name: res.user?.name || email.split('@')[0],
        email: res.user?.email || email,
        age: res.user?.age || 22,
        ageGroup: res.user?.ageGroup || 'young_adult',
        profession: res.user?.profession || 'Student',
      };
      localStorage.setItem('currentUser', JSON.stringify(curr));
      return { success: true };
    } catch (err) {
      // Local fallback for quick preview/offline testing if backend is offline
      if (!err.response || err.code === 'ERR_NETWORK') {
        const demoUser = {
          id: 'demo-user-1',
          name: email.split('@')[0] || 'Friend',
          email,
          settings: { aiConsent: false, showCrisisCard: true },
        };
        const demoToken = 'mock-jwt-token-offline-mode';
        setToken(demoToken);
        setUser(demoUser);
        localStorage.setItem('mindease_token', demoToken);
        localStorage.setItem('mindease_user', JSON.stringify(demoUser));
        return { success: true, isOfflineDemo: true };
      }
      const message = err.response?.data?.message || 'Invalid email or password.';
      return { success: false, error: message };
    }
  };

  const signup = async (nameOrData, emailArg, passwordArg, ageArg, ageGroupArg, professionArg) => {
    let payload = {};
    if (typeof nameOrData === 'object' && nameOrData !== null) {
      payload = nameOrData;
    } else {
      payload = {
        name: nameOrData,
        email: emailArg,
        password: passwordArg,
        age: ageArg,
        ageGroup: ageGroupArg,
        profession: professionArg,
      };
    }

    try {
      const res = await authApi.signup(payload);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('mindease_token', res.token);
      localStorage.setItem('mindease_user', JSON.stringify(res.user));
      const curr = {
        name: res.user?.name || payload.name,
        email: res.user?.email || payload.email,
        age: res.user?.age || payload.age,
        ageGroup: res.user?.ageGroup || payload.ageGroup,
        profession: res.user?.profession || payload.profession,
      };
      localStorage.setItem('currentUser', JSON.stringify(curr));
      return { success: true };
    } catch (err) {
      if (!err.response || err.code === 'ERR_NETWORK') {
        const demoUser = {
          id: 'demo-user-1',
          name: payload.name || 'Friend',
          email: payload.email,
          age: payload.age || 19,
          ageGroup: payload.ageGroup || 'young_adult',
          profession: payload.profession || 'Student',
          settings: { aiConsent: false, showCrisisCard: true },
        };
        const demoToken = 'mock-jwt-token-offline-mode';
        setToken(demoToken);
        setUser(demoUser);
        localStorage.setItem('mindease_token', demoToken);
        localStorage.setItem('mindease_user', JSON.stringify(demoUser));
        localStorage.setItem('currentUser', JSON.stringify({
          name: demoUser.name,
          email: demoUser.email,
          age: demoUser.age,
          ageGroup: demoUser.ageGroup,
          profession: demoUser.profession,
        }));
        return { success: true, isOfflineDemo: true };
      }
      const message = err.response?.data?.message || 'Unable to complete sign up.';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('mindease_token');
    localStorage.removeItem('mindease_user');
  };

  const updateUserSettings = (newSettings) => {
    setUser((prev) => {
      const updated = {
        ...prev,
        settings: { ...prev?.settings, ...newSettings },
      };
      localStorage.setItem('mindease_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        signup,
        logout,
        updateUserSettings,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
