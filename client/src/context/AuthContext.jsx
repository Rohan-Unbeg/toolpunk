import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import appwriteService from "../services/appwrite";
import { FaSpinner } from "react-icons/fa";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Starts as true
    const navigate = useNavigate();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const currentUser = await appwriteService.getCurrentUser();
                if (currentUser) {
                    // Check email verification status
                    if (!currentUser.emailVerification) {
                        await logout();
                        navigate('/login', { state: { needsVerification: true } });
                    }
                }
                setUser(currentUser);
            } catch (error) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        initAuth();
    }, []);

    // Email/password login
    const login = async (email, password) => {
        setIsLoading(true);
        try {
            await appwriteService.login(email, password);
            const currentUser = await appwriteService.getCurrentUser();
            setUser(currentUser);
            navigate("/projectgenerator", { replace: true });
        } catch (error) {
            console.error("Login error:", error);
            setUser(null);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Google OAuth login (redirect)
    const loginWithGoogle = () => {
        appwriteService.loginWithGoogle();
    };

    // Logout
    const logout = async () => {
        setIsLoading(true);
        try {
            await appwriteService.logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);
            setIsLoading(false);
            navigate("/login", { replace: true });
        }
    };

    // Signup
    const signup = async (email, password, name) => {
        setIsLoading(true);
        try {
            await appwriteService.register(email, password, name);
            console.log("User registered, verification email sent");
            // const currentUser = await appwriteService.getCurrentUser();
            // setUser(currentUser);
            // navigate("/projectgenerator", { replace: true });
        } catch (error) {
            console.error("Signup error:", error);
            // setUser(null);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const checkUser = async () => {
        if (isLoggingOut) return;
        setIsLoading(true);
        try {
            const currentUser = await appwriteService.getCurrentUser();
            if (currentUser) {
                // Fetch user labels
                const client = new Client()
                    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
                    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
                const users = new Users(client);
                const userData = await users.get(currentUser.$id);
                setUser({ ...currentUser, labels: userData.labels });
            } else {
                setUser(null);
            }
            console.log("AuthContext checkUser:", currentUser);
        } catch (error) {
            console.error("Check user error:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, isLoading, login, loginWithGoogle, logout, signup }}
        >
            {isLoading ? (
                <div className="min-h-screen flex items-center justify-center">
                    <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
