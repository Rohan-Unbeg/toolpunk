// /client/src/components/Navbar.jsx
import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaLightbulb, FaGraduationCap } from "react-icons/fa";

const Navbar = () => {
    const { user, isLoading, logout } = useContext(AuthContext);
    const isPremium = user?.labels?.includes("premium") || false;
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu when changing routes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const isActive = (path) => location.pathname === path;

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className={`fixed w-full z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-white/90 text-gray-800 shadow-lg backdrop-blur-md py-3"
                    : location.pathname === "/projectgenerator" 
                      ? "bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-800 text-white py-4"
                      : "bg-gradient-to-r from-indigo-900 to-indigo-700 text-white py-4"
            }`}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2 z-20">
                        <motion.div
                            whileHover={{
                                rotate: 5,
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
                                backgroundImage: scrolled
                                  ? "linear-gradient(45deg, #4f46e5, #7c3aed, #c026d3)"
                                  : "linear-gradient(45deg, #6366f1, #8b5cf6, #d946ef)",
                                backgroundSize: "200% auto",
                                backgroundPosition: "0% center", // optional initial position
                                backgroundRepeat: "no-repeat",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                color: "transparent",
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

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
                        <NavLink
                            to="/projectgenerator"
                            active={isActive("/projectgenerator")}
                            scrolled={scrolled}
                            icon={<FaLightbulb className="mr-1" />}
                        >
                            Project Ideas
                        </NavLink>

                        {isPremium ? (
                            <NavLink
                                to="/premium"
                                active={isActive("/premium")}
                                isPremium={true}
                                scrolled={scrolled}
                                icon={<FaStar className="mr-1 text-yellow-300" />}
                            >
                                Premium
                            </NavLink>
                        ) : (
                            <NavLink
                                to="/premium"
                                active={isActive("/premium")}
                                scrolled={scrolled}
                                icon={<FaStar className="mr-1" />}
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
                                            : scrolled
                                              ? "bg-indigo-100 text-indigo-800"
                                              : "bg-white/20 text-white backdrop-blur-sm"
                                    } flex items-center gap-1`}
                                >
                                    {user.name?.split(" ")[0] ||
                                        user.email?.split("@")[0]}
                                    {isPremium && <FaStar className="text-amber-600" />}
                                </motion.div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={logout}
                                    className={`text-sm font-medium px-3 py-1.5 rounded-full transition-all ${
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
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg"
                                >
                                    Sign Up
                                </NavLink>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden z-20">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`p-2 rounded-lg focus:outline-none ${
                                scrolled ? "text-indigo-700" : "text-white"
                            }`}
                        >
                            <span className="sr-only">Open menu</span>
                            <div className="w-6 flex flex-col items-end justify-center space-y-1.5">
                                <motion.span
                                    animate={{
                                        rotate: mobileMenuOpen ? 45 : 0,
                                        y: mobileMenuOpen ? 8 : 0,
                                        width: mobileMenuOpen ? "100%" : "100%",
                                    }}
                                    className={`block h-0.5 ${
                                        scrolled ? "bg-indigo-700" : "bg-white"
                                    } transition-all duration-300 ease-out`}
                                ></motion.span>
                                <motion.span
                                    animate={{
                                        opacity: mobileMenuOpen ? 0 : 1,
                                        width: "75%",
                                    }}
                                    className={`block h-0.5 ${
                                        scrolled ? "bg-indigo-700" : "bg-white"
                                    } transition-all duration-300 ease-out`}
                                ></motion.span>
                                <motion.span
                                    animate={{
                                        rotate: mobileMenuOpen ? -45 : 0,
                                        y: mobileMenuOpen ? -8 : 0,
                                        width: mobileMenuOpen ? "100%" : "50%",
                                    }}
                                    className={`block h-0.5 ${
                                        scrolled ? "bg-indigo-700" : "bg-white"
                                    } transition-all duration-300 ease-out`}
                                ></motion.span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-800 shadow-lg overflow-hidden z-10"
                    >
                        <div className="px-4 py-6 space-y-4">
                            <MobileNavLink
                                to="/projectgenerator"
                                active={isActive("/projectgenerator")}
                                icon={<FaLightbulb className="mr-2 text-yellow-300" />}
                            >
                                Project Ideas
                            </MobileNavLink>
                            
                            <MobileNavLink
                                to="/premium"
                                active={isActive("/premium")}
                                isPremium={isPremium}
                                icon={<FaStar className="mr-2 text-yellow-300" />}
                            >
                                {isPremium ? "Premium (Active)" : "Premium"}
                            </MobileNavLink>
                            
                            {user ? (
                                <>
                                    <div className="flex items-center py-2 px-3 text-white">
                                        <span className="text-lg font-medium">
                                            {isPremium ? (
                                                <span className="flex items-center">
                                                    <FaStar className="mr-2 text-yellow-300" />
                                                    Premium User: {user.name?.split(" ")[0] || user.email?.split("@")[0]}
                                                </span>
                                            ) : (
                                                `Signed in as: ${user.name?.split(" ")[0] || user.email?.split("@")[0]}`
                                            )}
                                        </span>
                                    </div>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={logout}
                                        className="w-full py-3 px-3 rounded-lg bg-red-600/20 text-red-50 hover:bg-red-600/30 flex items-center justify-center text-lg font-medium mt-2"
                                    >
                                        Logout
                                    </motion.button>
                                </>
                            ) : (
                                <div className="flex flex-col space-y-3">
                                    <MobileNavLink
                                        to="/login"
                                        active={isActive("/login")}
                                    >
                                        Log In
                                    </MobileNavLink>
                                    <Link
                                        to="/signup"
                                        className="py-3 px-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-center text-lg font-medium shadow-md hover:shadow-lg transition-all"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

const NavLink = ({ children, to, active, isPremium, scrolled, icon, className = "" }) => (
    <Link
        to={to}
        className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center ${
            active
                ? scrolled
                  ? "text-indigo-800 bg-indigo-50 shadow-sm"
                  : "text-white bg-white/20 backdrop-blur-sm"
                : scrolled
                ? "text-gray-800 hover:text-indigo-600 hover:bg-indigo-50/50"
                : "text-white hover:text-white hover:bg-white/10"
        } ${isPremium ? "animate-pulse-subtle" : ""} ${className}`}
    >
        {icon && <span className={active ? "text-indigo-500" : ""}>{icon}</span>}
        {children}
        {active && (
            <motion.div
                layoutId="activeTab"
                className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                    scrolled
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                        : "bg-gradient-to-r from-blue-300 to-purple-300"
                } rounded-full`}
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
        )}
    </Link>
);

const MobileNavLink = ({ children, to, active, isPremium, icon }) => (
    <Link
        to={to}
        className={`flex items-center w-full py-3 px-3 rounded-lg transition-all duration-200 text-lg font-medium ${
            active
                ? "bg-white/20 text-white"
                : "text-blue-100 hover:bg-white/10"
        } ${isPremium ? "border-l-4 border-yellow-400" : ""}`}
    >
        {icon}
        {children}
    </Link>
);

export default Navbar;