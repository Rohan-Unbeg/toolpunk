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
        const colors = [
            "F94144",
            "F3722C",
            "F8961E",
            "F9C74F",
            "90BE6D",
            "43AA8B",
            "577590",
        ];
        const seed = currentUser?.$id?.substring(0, 8) || "00000000";
        const colorIndex = parseInt(seed, 16) % colors.length;
        const color = colors[colorIndex];
        return `https://ui-avatars.com/api/?name=${name}&background=${color}&color=fff&length=2&size=96`;
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
            className={`fixed w-full z-50 bg-indigo-900 dark:bg-gray-800 text-white dark:text-gray-100 py-3 transition-colors duration-200 ${
                scrolled
                    ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-md"
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
                                ? "text-indigo-600 dark:text-indigo-400"
                                : "text-white dark:text-gray-100"
                        }`}
                    >
                        🧰
                    </motion.span>
                    <span
                        className="text-lg font-bold"
                        style={{
                            backgroundImage: scrolled
                                ? "linear-gradient(45deg, #4f46e5, #7c3aed)"
                                : isDarkMode
                                ? "linear-gradient(45deg, #818cf8, #c4b5fd)"
                                : "linear-gradient(45deg, #e0e7ff, #a5b4fc)",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            color: "transparent",
                        }}
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
                        <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
                    ) : user ? (
                        <div className="flex items-center gap-3">
                            <Link to="/profile">{getAvatar()}</Link>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={logout}
                                className={`text-sm px-3 py-1 rounded-full transition-colors duration-200 ${
                                    scrolled
                                        ? "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400"
                                        : "bg-red-600/20 dark:bg-red-900/50 text-red-100 dark:text-red-400"
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
                                className="bg-blue-500 text-white"
                            >
                                Sign Up
                            </NavLink>
                        </div>
                    )}
                    <button
                        onClick={toggleDarkMode}
                        className="p-1 rounded-full bg-gray-200 dark:bg-gray-600"
                    >
                        {isDarkMode ? (
                            <FaSun className="text-yellow-400" />
                        ) : (
                            <FaMoon className="text-gray-600" />
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
                                className={`h-0.5 w-full ${scrolled ? "bg-gray-800 dark:bg-gray-300" : "bg-white dark:bg-gray-300"} origin-center`}
                            ></motion.span>
                            <motion.span
                                animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
                                transition={{ duration: 0.2 }}
                                className={`h-0.5 w-full ${scrolled ? "bg-gray-800 dark:bg-gray-300" : "bg-white dark:bg-gray-300"}`}
                            ></motion.span>
                            <motion.span
                                animate={{
                                    rotate: mobileMenuOpen ? -45 : 0,
                                    y: mobileMenuOpen ? -8 : 0,
                                }}
                                transition={{ duration: 0.2 }}
                                className={`h-0.5 w-full ${scrolled ? "bg-gray-800 dark:bg-gray-300" : "bg-white dark:bg-gray-300"} origin-center`}
                            ></motion.span>
                        </div>
                    </button>
                </div>
            </div>

            <div
                className={`md:hidden bg-indigo-900 dark:bg-gray-800 text-white dark:text-gray-100 overflow-hidden transition-all duration-200 ${
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
                        <>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={logout}
                                className="w-full py-3 bg-red-600/20 dark:bg-red-900/50 text-red-100 dark:text-red-400 rounded-lg text-center text-base mt-4"
                            >
                                Logout
                            </motion.button>
                        </>
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
                                className="block py-3 px-4 bg-blue-500 text-white rounded-lg text-center text-base mt-2"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                    <button
                        onClick={toggleDarkMode}
                        className="block py-3 px-3 rounded-lg text-base text-center bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100"
                    >
                        {isDarkMode ? (
                            <span className="flex items-center justify-center gap-2">
                                <FaSun className="text-yellow-400" /> Light Mode
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <FaMoon className="text-gray-600" /> Dark Mode
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
        className={`px-3 py-1 text-sm rounded-lg flex items-center transition-colors duration-200 ${
            active
                ? scrolled
                    ? "text-indigo-800 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50"
                    : "text-white dark:text-gray-100 bg-white/20 dark:bg-indigo-900/50"
                : scrolled
                ? "text-gray-800 dark:text-gray-300 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/50"
                : "text-white dark:text-gray-300 hover:bg-white/10 dark:hover:bg-indigo-900/50"
        } ${className}`}
    >
        {children}
    </Link>
);

const MobileNavLink = ({ children, to, active }) => (
    <Link
        to={to}
        className={`block py-2 px-3 rounded-lg text-base transition-colors duration-200 text-center ${
            active
                ? "bg-white/20 dark:bg-indigo-900/50 text-white dark:text-gray-100"
                : "text-blue-100 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-indigo-900/50"
        }`}
    >
        {children}
    </Link>
);

export default Navbar;
