import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { FaStar, FaLightbulb, FaMoon, FaSun } from "react-icons/fa";
import { motion } from "framer-motion";

const Navbar = () => {
    const { user, isLoading, logout } = useContext(AuthContext);
    const { toggleDarkMode, isDarkMode } = useContext(ThemeContext);
    const isPremium = user?.labels?.includes("premium") || false;
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const isActive = (path) => location.pathname === path;

    const generateFallbackAvatar = (currentUser) => {
        const nameSource =
            currentUser?.name || currentUser?.email?.split("@")[0] || "U";
        const name = encodeURIComponent(nameSource);
        return `https://ui-avatars.com/api/?name=${name}&background=[var(--color-primary)]&color=fff&length=2&size=96`;
    };

    const getAvatar = () => {
        if (!user) return null;
        if (user.prefs?.picture) {
            return (
                <img
                    src={user.prefs.picture}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = generateFallbackAvatar(user);
                    }}
                />
            );
        }
        return (
            <img
                src={generateFallbackAvatar(user)}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover"
            />
        );
    };

    return (
        <nav
            className={`fixed w-full z-50 bg-[var(--color-primary)] text-white py-3 transition-colors duration-200 ${
                scrolled
                    ? "bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 shadow-md"
                    : ""
            }`}
        >
            <div className="max-w-3xl mx-auto px-4 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2">
                    <motion.span
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                        className={`text-2xl ${
                            scrolled
                                ? "text-[var(--color-primary)]"
                                : "text-white"
                        }`}
                    >
                        🧰
                    </motion.span>
                    <span
                        className={`text-lg font-bold ${
                            scrolled
                                ? "text-[var(--color-primary)] dark:text-neutral-100"
                                : "text-white"
                        }`}
                    >
                        Toolpunk
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-4">
                    <NavLink
                        to="/projectgenerator"
                        active={isActive("/projectgenerator")}
                        scrolled={scrolled}
                    >
                        <FaLightbulb className="mr-1" />
                        Project Ideas
                    </NavLink>
                    <NavLink
                        to="/premium"
                        active={isActive("/premium")}
                        scrolled={scrolled}
                    >
                        <FaStar className="mr-1" />
                        Premium
                    </NavLink>
                    {isLoading ? (
                        <div className="w-20 h-6 bg-neutral-200 rounded-full"></div>
                    ) : user ? (
                        <div className="flex items-center gap-3">
                            <Link to="/profile">{getAvatar()}</Link>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={logout}
                                className={`text-sm px-3 py-1 rounded-full shadow-md transition-colors duration-200 ${
                                    scrolled
                                        ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 dark:text-neutral-300 dark:bg-neutral-700/20 dark:hover:bg-neutral-700/30"
                                        : "text-white bg-white/20 hover:bg-white/30 dark:text-neutral-100 dark:bg-neutral-700/20 dark:hover:bg-neutral-700/30"
                                }`}
                            >
                                Logout
                            </motion.button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <NavLink
                                to="/login"
                                active={isActive("/login")}
                                scrolled={scrolled}
                            >
                                Log In
                            </NavLink>
                            <NavLink
                                to="/signup"
                                active={
                                    isActive("/signup") ||
                                    (!isActive("/login") &&
                                        !isActive("/signup"))
                                }
                                scrolled={scrolled}
                                className={`${
                                    scrolled
                                        ? "bg-accent-400 text-neutral-900 hover:bg-accent-500 dark:bg-accent-500 dark:text-white dark:hover:bg-accent-600"
                                        : "bg-accent-400 text-white hover:bg-accent-500 dark:bg-accent-400 dark:text-white dark:hover:bg-accent-500"
                                } shadow-md`}
                            >
                                Sign Up
                            </NavLink>
                        </div>
                    )}
                    <button
                        onClick={toggleDarkMode}
                        className="p-1 rounded-full bg-neutral-200 dark:bg-neutral-600 shadow-md"
                    >
                        {isDarkMode ? (
                            <FaSun className="text-accent-400" />
                        ) : (
                            <FaMoon className="text-neutral-600" />
                        )}
                    </button>
                </div>

                <div className="md:hidden">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2"
                    >
                        <div className="w-6 h-5 flex flex-col justify-between">
                            <motion.span
                                animate={{
                                    rotate: mobileMenuOpen ? 45 : 0,
                                    y: mobileMenuOpen ? 8 : 0,
                                }}
                                transition={{ duration: 0.2 }}
                                className={`h-0.5 w-full ${
                                    scrolled
                                        ? "bg-neutral-800 dark:bg-neutral-300"
                                        : "bg-white"
                                } origin-center`}
                            ></motion.span>
                            <motion.span
                                animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
                                transition={{ duration: 0.2 }}
                                className={`h-0.5 w-full ${
                                    scrolled
                                        ? "bg-neutral-800 dark:bg-neutral-300"
                                        : "bg-white"
                                }`}
                            ></motion.span>
                            <motion.span
                                animate={{
                                    rotate: mobileMenuOpen ? -45 : 0,
                                    y: mobileMenuOpen ? -8 : 0,
                                }}
                                transition={{ duration: 0.2 }}
                                className={`h-0.5 w-full ${
                                    scrolled
                                        ? "bg-neutral-800 dark:bg-neutral-300"
                                        : "bg-white"
                                } origin-center`}
                            ></motion.span>
                        </div>
                    </button>
                </div>
            </div>

            <div
                className={`md:hidden bg-[var(--color-primary)] text-white overflow-hidden transition-all duration-200 ${
                    mobileMenuOpen ? "max-h-screen py-8" : "max-h-0 py-0"
                }`}
            >
                <div className="max-w-3xl mx-auto px-6 space-y-6">
                    <MobileNavLink
                        to="/projectgenerator"
                        active={isActive("/projectgenerator")}
                    >
                        <div className="flex items-center justify-start gap-4">
                            <FaLightbulb className="text-lg" />
                            <span className="text-base">Project Ideas</span>
                        </div>
                    </MobileNavLink>
                    <MobileNavLink to="/premium" active={isActive("/premium")}>
                        <div className="flex items-center justify-start gap-4">
                            <FaStar className="text-lg" />
                            <span className="text-base">
                                {isPremium ? "Premium (Active)" : "Premium"}
                            </span>
                        </div>
                    </MobileNavLink>
                    <MobileNavLink to="/profile" active={isActive("/profile")}>
                        <div className="flex items-center justify-start gap-4">
                            {getAvatar()}
                            <span className="text-base">Profile</span>
                        </div>
                    </MobileNavLink>
                    {user ? (
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={logout}
                            className={`w-full py-3 rounded-lg text-center text-base mt-4 shadow-md transition-colors duration-200 ${
                                scrolled
                                    ? "text-neutral-800 bg-neutral-200/20 hover:bg-neutral-200/30 dark:text-neutral-100 dark:bg-neutral-700/20 dark:hover:bg-neutral-700/30"
                                    : "text-neutral-800 bg-neutral-200/20 hover:bg-neutral-200/30 dark:text-neutral-100 dark:bg-neutral-700/20 dark:hover:bg-neutral-700/30"
                            }`}
                        >
                            Logout
                        </motion.button>
                    ) : (
                        <>
                            <MobileNavLink
                                to="/login"
                                active={isActive("/login")}
                            >
                                <div className="flex items-center justify-start gap-4">
                                    <span className="text-base">Log In</span>
                                </div>
                            </MobileNavLink>
                            <Link
                                to="/signup"
                                className={`block py-3 px-4 rounded-lg text-center text-base mt-2 shadow-md transition-colors duration-200 ${
                                    scrolled
                                        ? "bg-accent-400 text-neutral-900 hover:bg-accent-500 dark:bg-accent-500 dark:text-white dark:hover:bg-accent-600"
                                        : "bg-accent-400 text-white hover:bg-accent-500 dark:bg-accent-400 dark:text-white dark:hover:bg-accent-500"
                                }`}
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                    <button
                        onClick={toggleDarkMode}
                        className="block py-3 px-3 rounded-lg text-base text-center bg-neutral-200 dark:bg-neutral-600 text-neutral-800 dark:text-neutral-100 shadow-md"
                    >
                        {isDarkMode ? (
                            <span className="flex items-center justify-center gap-2">
                                <FaSun className="text-accent-400" /> Light Mode
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <FaMoon className="text-neutral-600" /> Dark
                                Mode
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ children, to, active, scrolled, className = "" }) => (
    <Link
        to={to}
        className={`px-3 py-1 text-sm rounded-lg flex items-center shadow-md transition-colors duration-200 ${
            active
                ? scrolled
                    ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10"
                    : "text-white bg-white/20"
                : scrolled
                ? "text-neutral-800 dark:text-neutral-300 hover:bg-[var(--color-primary)]/10"
                : "text-white hover:bg-white/10"
        } ${className}`}
    >
        {children}
    </Link>
);

const MobileNavLink = ({ children, to, active }) => (
    <Link
        to={to}
        className={`block py-2 px-3 rounded-lg text-base transition-colors duration-200 text-center shadow-md ${
            active ? "bg-white/20 text-white" : "text-white hover:bg-white/10"
        }`}
    >
        {children}
    </Link>
);

export default Navbar;
