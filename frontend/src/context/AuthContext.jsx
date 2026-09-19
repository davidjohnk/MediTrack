import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, check if we already have a saved login in localStorage
  useEffect(() => {
    const token = localStorage.getItem('meditrack_token');
    const savedUser = localStorage.getItem('meditrack_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('meditrack_token', data.token);
    localStorage.setItem(
      'meditrack_user',
      JSON.stringify({ _id: data._id, name: data.name, email: data.email })
    );
    setUser({ _id: data._id, name: data.name, email: data.email });
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('meditrack_token', data.token);
    localStorage.setItem(
      'meditrack_user',
      JSON.stringify({ _id: data._id, name: data.name, email: data.email })
    );
    setUser({ _id: data._id, name: data.name, email: data.email });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('meditrack_token');
    localStorage.removeItem('meditrack_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
