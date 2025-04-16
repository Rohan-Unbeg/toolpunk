import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import appwriteService from "../services/appwrite";
import { FaSpinner } from "react-icons/fa";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await appwriteService.getCurrentUser();
        if (currentUser) {
          const isGoogleUser = currentUser.identities?.some((id) => id.provider === "google");
          if (!isGoogleUser && !currentUser.emailVerification) {
            await appwriteService.logout();
            navigate("/login", { state: { needsVerification: true } });
            return;
          }
          setUser(currentUser);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, [navigate]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      await appwriteService.login(email, password);
      const currentUser = await appwriteService.getCurrentUser();
      setUser(currentUser);
      navigate("/projectgenerator", { replace: true });
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await appwriteService.loginWithGoogle();
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await appwriteService.logout();
      setUser(null);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    setIsLoading(true);
    try {
      await appwriteService.register(email, password, name);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        login,
        loginWithGoogle,
        logout,
        signup,
        error,
        setError,
      }}
    >
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
          <FaSpinner className="animate-spin text-[var(--color-primary)] text-4xl" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};