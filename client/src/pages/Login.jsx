import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, loginWithGoogle, isLoading, user, logout, error, setError } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();

    useEffect(() => {
        if (user && !isLoading) navigate("/projectgenerator", { replace: true });
    }, [user, isLoading, navigate]);

    useEffect(() => {
        if (location.state?.needsVerification) {
            setError("Please verify your email before logging in.");
        }
    }, [location.state]);

    useEffect(() => {
        const oauthError = searchParams.get("error");
        if (oauthError) setError(`Login failed: ${oauthError}`);
    }, [searchParams]);

    useEffect(() => {
        if (error) {
            setIsSubmitting(false);
            toast.error(error);
        }
    }, [error]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (isSubmitting || isLoading) return;
        setError("");
        setIsSubmitting(true);
        try {
            await login(email, password);
        } catch (err) {
            if (err.code === 401 && err.message.includes("email not verified")) {
                toast.error("Please verify your email before logging in.");
                await logout();
            } else {
                setError(err.message || "Login failed.");
                toast.error(err.message || "Login failed.");
            }
            console.error("Login error:", err);
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = () => {
        if (isSubmitting || isLoading) return;
        setError("");
        setIsSubmitting(true);
        loginWithGoogle();
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900">
            <div className="absolute inset-0 bg-grid-neutral-200 dark:bg-grid-neutral-800 opacity-5 z-0"></div>
            <div className="relative inset-0 z-0">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="blob"
                        style={{
                            position: "absolute",
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 300 + 200}px`,
                            height: `${Math.random() * 300 + 200}px`,
                            background: `radial-gradient(circle, rgba(${Math.floor(
                                Math.random() * 100 + 155
                            )}, ${Math.floor(Math.random() * 50 + 90)}, ${Math.floor(
                                Math.random() * 155 + 100
                            )}, 0.15), transparent) dark:radial-gradient(circle, rgba(${Math.floor(
                                Math.random() * 50 + 100
                            )}, ${Math.floor(Math.random() * 50 + 100)}, ${Math.floor(
                                Math.random() * 50 + 100
                            )}, 0.15), transparent)`,
                            borderRadius: "50%",
                            filter: "blur(60px)",
                            animation: `float ${Math.random() * 10 + 15}s ease-in-out infinite`,
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-6 relative z-10 mt-10"
            >
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="flex justify-center"
                    >
                        <span className="text-5xl">🧰</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 text-3xl font-extrabold text-[var(--color-primary)]"
                    >
                        Welcome Back
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-2 text-sm text-neutral-600 dark:text-neutral-400"
                    >
                        Sign in to access your tools and project ideas
                    </motion.p>
                </div>

                {(isLoading || isSubmitting) && (
                    <div className="flex justify-center items-center py-2">
                        <div className="loader">
                            <svg className="circular" viewBox="25 25 50 50">
                                <circle
                                    className="path"
                                    cx="50"
                                    cy="50"
                                    r="20"
                                    fill="none"
                                    strokeWidth="4"
                                    strokeMiterlimit="10"
                                    stroke="[var(--color-primary)]"
                                />
                            </svg>
                        </div>
                    </div>
                )}

                {error && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-error-100 dark:bg-error-900/50 border-l-4 border-error-500 dark:border-error-400 rounded-md text-error-700 dark:text-error-300"
                    >
                        <div className="flex items-center">
                            <svg
                                className="h-5 w-5 text-error-500 dark:text-error-400 mr-2"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>{error}</span>
                        </div>
                    </motion.div>
                )}

                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoogleLogin}
                    disabled={isLoading || isSubmitting}
                    className="w-full flex items-center justify-center py-3 px-4 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl shadow-md text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition duration-150 ease-in-out"
                >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 48 48">
                        <path
                            fill="#EA4335"
                            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                        />
                        <path
                            fill="#4285F4"
                            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.29-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                        />
                        <path
                            fill="#34A853"
                            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        />
                    </svg>
                    Continue with Google
                </motion.button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-300 dark:border-neutral-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-neutral-50 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400">
                            Or continue with email
                        </span>
                    </div>
                </div>

                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    onSubmit={handleLogin}
                    className="mt-6 space-y-6"
                >
                    <div className="rounded-2xl shadow-lg bg-white dark:bg-neutral-800 p-8 space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                            >
                                Email address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-neutral-400 dark:text-neutral-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] dark:focus:border-[var(--color-primary)] block w-full pl-10 pr-3 py-3 border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                            >
                                Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-neutral-400 dark:text-neutral-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] dark:focus:border-[var(--color-primary)] block w-full pl-10 pr-3 py-3 border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading || isSubmitting}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition duration-150 ease-in-out"
                            >
                                {isSubmitting ? (
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                ) : (
                                    "Sign in"
                                )}
                            </motion.button>
                        </div>
                    </div>
                </motion.form>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400"
                >
                    Don’t have an account?{" "}
                    <Link
                        to="/signup"
                        className="font-medium text-[var(--color-primary)] hover:text-accent-400 transition duration-150 ease-in-out"
                    >
                        Sign up now
                    </Link>
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Login;