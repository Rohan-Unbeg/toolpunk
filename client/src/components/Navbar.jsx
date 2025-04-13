// /client/src/components/Navbar.jsx
import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

const Navbar = () => {
    const { user, isLoading, logout } = useContext(AuthContext);
    const isPremium = user?.labels?.includes("premium") || false;
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className={`fixed w-full z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-white text-gray-800 shadow-lg py-3"
                    : "bg-gradient-to-r from-indigo-900 to-indigo-700 text-white py-4"
            }`}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <motion.div
                            whileHover={{
                                rotate: 5, // Single value works with spring
                                scale: 1.1,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 10,
                            }}
                            className="origin-center"
                        >
                            <span className="text-3xl">🧰</span>
                        </motion.div>

                        <motion.span
                            className="text-xl font-black tracking-tighter"
                            style={{
                                background:
                                    "linear-gradient(45deg, #6366f1, #8b5cf6, #d946ef)",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                color: "transparent",
                                backgroundSize: "200% auto",
                                filter: "drop-shadow(0 2px 1px rgba(79, 70, 229, 0.2))",
                            }}
                            animate={{
                                backgroundPosition: [
                                    "0% center",
                                    "100% center",
                                ],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        >
                            Toolpunk
                        </motion.span>
                    </Link>

                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <NavLink
                            to="/projectgenerator"
                            active={isActive("/projectgenerator")}
                            scrolled={scrolled}
                        >
                            Project Ideas
                        </NavLink>

                        {isPremium ? (
                            <NavLink
                                to="/premium"
                                active={isActive("/premium")}
                                isPremium={true}
                                scrolled={scrolled}
                            >
                                Premium ✨
                            </NavLink>
                        ) : (
                            <NavLink
                                to="/premium"
                                active={isActive("/premium")}
                                scrolled={scrolled}
                            >
                                Premium
                            </NavLink>
                        )}

                        {isLoading ? (
                            <div className="w-24 h-8 bg-gray-200 animate-pulse rounded-full"></div>
                        ) : user ? (
                            <div className="flex items-center space-x-3">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                                        isPremium
                                            ? "bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900"
                                            : "bg-indigo-100 text-indigo-800"
                                    }`}
                                >
                                    {user.name?.split(" ")[0] ||
                                        user.email?.split("@")[0]}
                                    {isPremium && " 🌟"}
                                </motion.div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={logout}
                                    className={`text-sm font-medium px-3 py-1.5 rounded-full ${
                                        scrolled
                                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                                            : "bg-red-600/20 text-red-50 hover:bg-red-600/30"
                                    }`}
                                >
                                    Logout
                                </motion.button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
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
                                    } // Default active for Sign Up
                                    scrolled={scrolled}
                                >
                                    Sign Up
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

const NavLink = ({ children, to, active, isPremium, scrolled }) => (
    <Link
        to={to}
        className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            active
                ? "text-indigo-800 bg-indigo-50"
                : scrolled
                ? "text-gray-800 hover:text-indigo-600 hover:bg-indigo-50/50"
                : "text-white hover:text-indigo-200 hover:bg-indigo-800/50"
        } ${isPremium ? "animate-pulse-subtle" : ""}`}
    >
        {children}
        {active && (
            <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
        )}
    </Link>
);

export default Navbar;
