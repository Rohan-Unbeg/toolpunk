import React, { createContext, useState, useEffect } from 'react';
import appwriteService from '../services/appwrite';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const checkUser = async () => {
    try {
      const currentUser = await appwriteService.getCurrentUser();
      console.log('AuthContext checkUser:', currentUser);
      setUser(currentUser || null);
    } catch (error) {
      console.error('Check user error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const login = async (email, password) => {
    await appwriteService.login(email, password);
    await checkUser();
  };

  const loginWithGoogle = async () => {
    await appwriteService.loginWithGoogle();
    await checkUser();
  };

  const logout = async () => {
    await appwriteService.logout();
    setUser(null);
  };

  const signup = async (email, password, name) => {
    await appwriteService.register(email, password, name);
    await checkUser();
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, loginWithGoogle, logout, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
};