import React, { createContext, useState, useEffect } from 'react';
import appwriteService from '../services/appwrite';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const checkUser = async () => {
    setIsLoading(true);
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
    setUser(null); // Clear immediately
    setIsLoading(true); // Show loading state
    try {
      await appwriteService.logout();
      await checkUser(); // Verify session is gone
      console.log('AuthContext logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      await checkUser(); // Double-check
    } finally {
      setIsLoading(false);
    }
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