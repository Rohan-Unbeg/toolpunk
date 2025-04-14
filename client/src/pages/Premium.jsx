import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Add useLocation
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FaCheckCircle, FaLock, FaSpinner } from "react-icons/fa";

const Premium = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null); // New for success banner
    const [authLoaded, setAuthLoaded] = useState(false);
    const { user } = useContext(AuthContext);
    const isPremium = user?.labels?.includes("premium") || false;
    const nav = useNavigate();
    const location = useLocation(); // Check query params

    // Wait for auth check
    useEffect(() => {
        if (user !== undefined) {
            setAuthLoaded(true);
        }
    }, [user]);

    // Check for payment status on redirect
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get("payment") === "success") {
            setSuccess("🎉 Premium activated!");
            setTimeout(() => window.location.reload(), 2000); // Reload after 2s
        } else if (params.get("payment") === "failed") {
            setError("⚠️ Payment failed. Try again.");
        }
    }, [location]);

    if (!authLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-purple-50 to-blue-50">
                <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
            </div>
        );
    }

    const handleInstamojoPayment = async () => {
        if (!user) {
            setError("Please login first!");
            nav("/login");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const apiUrl = "https://toolpunk.onrender.com";
            const userId = user.$id;
            const res = await fetch(`${apiUrl}/api/instamojo-initiate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    name: user.name || "Toolpunk User",
                    email: user.email,
                    phone: user.phone || "",
                }),
            });

            const data = await res.json();
            if (
                !res.ok ||
                !data.payment_request ||
                !data.payment_request.longurl
            ) {
                throw new Error(
                    data.error || "Failed to initiate Instamojo payment."
                );
            }

            window.location.href = data.payment_request.longurl;
        } catch (err) {
            setError(err.message || "Something went wrong with Instamojo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 via-purple-50 to-blue-50 pt-20 pb-12 px-4 overflow-hidden">
            <div className="absolute inset-0 bg-grid-indigo opacity-5 z-0"></div>
            <div className="absolute inset-0 z-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="blob"
                        style={{
                            position: "absolute",
                            top: `${Math.random() * 80}%`,
                            left: `${Math.random() * 80}%`,
                            width: `${Math.random() * 200 + 100}px`,
                            height: `${Math.random() * 200 + 100}px`,
                            background: `radial-gradient(circle, rgba(${Math.floor(
                                Math.random() * 100 + 155
                            )}, ${Math.floor(
                                Math.random() * 50 + 90
                            )}, ${Math.floor(
                                Math.random() * 155 + 100
                            )}, 0.15), transparent)`,
                            borderRadius: "50%",
                            filter: "blur(60px)",
                            animation: `float ${
                                Math.random() * 10 + 15
                            }s ease-in-out infinite`,
                        }}
                    />
                ))}
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg shadow-md flex items-center justify-between max-w-2xl mx-auto"
                >
                    <span>{error}</span>
                    <button
                        onClick={() => setError(null)}
                        className="text-red-600 hover:text-red-800"
                    >
                        ✕
                    </button>
                </motion.div>
            )}
            {success && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg shadow-md flex items-center justify-between max-w-2xl mx-auto"
                >
                    <span>{success}</span>
                    <button
                        onClick={() => setSuccess(null)}
                        className="text-green-600 hover:text-green-800"
                    >
                        ✕
                    </button>
                </motion.div>
            )}

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight flex items-center justify-center gap-2"
                    >
                        Unlock Toolpunk Premium
                        {isPremium && (
                            <span className="text-yellow-500 text-3xl ml-2">
                                🌟
                            </span>
                        )}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
                    >
                        {isPremium
                            ? "You're already a Premium member! Enjoy unlimited ideas and more!"
                            : "Get unlimited project ideas and exclusive features for just ₹9/month."}
                    </motion.p>
                    {user && !isPremium && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-6"
                        >
                            <motion.button
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleInstamojoPayment}
                                disabled={loading}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition disabled:opacity-50 flex items-center mx-auto"
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    "Buy Premium (₹9)"
                                )}
                            </motion.button>
                        </motion.div>
                    )}
                    {!user && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-6 flex justify-center gap-4"
                        >
                            <Link
                                to="/login"
                                className="text-sm font-medium text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-full transition"
                            >
                                Log In
                            </Link>
                            <Link
                                to="/signup"
                                className="text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 rounded-full hover:from-indigo-700 hover:to-purple-700 transition"
                            >
                                Sign Up
                            </Link>
                        </motion.div>
                    )}
                </motion.div>

                {/* Benefits */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12"
                >
                    {[
                        {
                            title: "Unlimited Project Ideas",
                            desc: "Generate as many ideas as you want, anytime.",
                            icon: "💡",
                        },
                        {
                            title: "Export to PDF",
                            desc: "Save your ideas as professional PDFs.",
                            icon: "📄",
                        },
                        {
                            title: "Priority Features",
                            desc: "Get early access to new tools and updates.",
                            icon: "🚀",
                        },
                        {
                            title: "Premium Badge",
                            desc: "Show off your status with a shiny badge.",
                            icon: "🌟",
                        },
                    ].map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{
                                opacity: 0,
                                x: index % 2 === 0 ? -20 : 20,
                            }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            whileHover={{
                                scale: 1.02,
                                boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                            }}
                            className="bg-white p-6 rounded-2xl shadow-lg ring-1 ring-indigo-100/50"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">{benefit.icon}</span>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {benefit.title}
                                </h3>
                            </div>
                            <p className="text-gray-600">{benefit.desc}</p>
                            <FaCheckCircle className="text-indigo-500 mt-3" />
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA Card */}
                {!isPremium && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-2xl shadow-xl text-center"
                    >
                        <h2 className="text-2xl font-semibold text-white mb-4">
                            Ready to Go Premium?
                        </h2>
                        <p className="text-indigo-100 mb-6">
                            Join thousands of students unlocking their potential
                            for just ₹9/month.
                        </p>
                        {user ? (
                            <motion.button
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleInstamojoPayment}
                                disabled={loading}
                                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-indigo-50 transition disabled:opacity-50 flex items-center mx-auto"
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <span className="mr-2">Unlock Now</span>
                                        <span className="text-sm">
                                            (₹9/month)
                                        </span>
                                    </>
                                )}
                            </motion.button>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.9 }}
                                className="flex justify-center gap-4"
                            >
                                <Link
                                    to="/login"
                                    className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-indigo-50 transition"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-indigo-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-900 transition"
                                >
                                    Sign Up
                                </Link>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Premium;
