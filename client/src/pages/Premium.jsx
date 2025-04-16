import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FaCheckCircle, FaLock, FaSpinner } from "react-icons/fa";

const Premium = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [authLoaded, setAuthLoaded] = useState(false);
    const { user } = useContext(AuthContext);
    const isPremium = user?.labels?.includes("premium") || false;
    const nav = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user !== undefined) {
            setAuthLoaded(true);
        }
    }, [user]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const paymentStatus = params.get("payment");
        if (paymentStatus === "success") {
            setSuccess("🎉 Premium activated!");
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            );
        } else if (paymentStatus === "failed") {
            setError("⚠️ Payment failed. Try again.");
        }
    }, [location]);

    if (!authLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
                <FaSpinner className="animate-spin text-[var(--color-primary)] text-4xl" />
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
            const res = await fetch(`${apiUrl}/api/instamojo-initiate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.$id,
                    name: user.name || "Toolpunk User",
                    email: user.email,
                    phone: user.phone || "",
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.payment_request?.longurl) {
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
        <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 pt-20 pb-12 px-4">
            {(error || success) && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`fixed top-20 left-0 right-0 mx-auto max-w-2xl rounded-lg p-4 flex items-center justify-between ${
                        error
                            ? "bg-error-100 dark:bg-error-900/50 text-error-800 dark:text-error-300"
                            : "bg-success-100 dark:bg-success-900/50 text-success-800 dark:text-success-300"
                    }`}
                >
                    <span>{error || success}</span>
                    <button
                        onClick={() =>
                            error ? setError(null) : setSuccess(null)
                        }
                        className={`rounded-full p-1 ${
                            error
                                ? "bg-error-200 dark:bg-error-800/50 text-error-600 dark:text-error-400"
                                : "bg-success-200 dark:bg-success-800/50 text-success-600 dark:text-success-400"
                        }`}
                    >
                        ✕
                    </button>
                </motion.div>
            )}

            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl font-bold text-[var(--color-primary)] flex items-center justify-center gap-2">
                        Unlock Toolpunk Premium
                        {isPremium && (
                            <span className="text-accent-400 text-2xl">🌟</span>
                        )}
                    </h1>
                    <p className="mt-2 text-base text-neutral-600 dark:text-neutral-400">
                        {isPremium
                            ? "You're already a Premium member! Enjoy unlimited ideas and more!"
                            : "Get unlimited project ideas and exclusive features for just ₹9/month."}
                    </p>
                    {user && !isPremium && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleInstamojoPayment}
                            disabled={loading}
                            className="mt-4 bg-[var(--color-primary)] text-white px-6 py-2 rounded-lg flex items-center mx-auto disabled:opacity-50 shadow-md hover:shadow-lg hover:bg-primary-500 transition-colors"
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
                    )}
                    {!user && (
                        <div className="mt-4 flex justify-center gap-4">
                            <Link
                                to="/login"
                                className="px-4 py-2 text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)]/10"
                            >
                                Log In
                            </Link>
                            <Link
                                to="/signup"
                                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-primary-500 shadow-md transition-colors"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
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
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.1 }}
                            className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-[var(--color-primary)]/20"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">{benefit.icon}</span>
                                <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-100">
                                    {benefit.title}
                                </h3>
                            </div>
                            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                                {benefit.desc}
                            </p>
                            <FaCheckCircle className="text-[var(--color-primary)] mt-2" />
                        </motion.div>
                    ))}
                </div>

                {!isPremium && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-[var(--color-primary)] p-6 rounded-lg text-center"
                    >
                        <h2 className="text-xl font-semibold text-white mb-2">
                            Ready to Go Premium?
                        </h2>
                        <p className="text-white/90 mb-4">
                            Join thousands of students unlocking their potential
                            for just ₹9/month.
                        </p>
                        {user ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleInstamojoPayment}
                                disabled={loading}
                                className="bg-white text-[var(--color-primary)] px-6 py-2 rounded-lg flex items-center mx-auto disabled:opacity-50 shadow-md hover:shadow-lg hover:bg-neutral-100 transition-colors"
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
                            <div className="flex justify-center gap-4">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 bg-white text-[var(--color-primary)] rounded-lg shadow-md hover:bg-neutral-100 transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-4 py-2 bg-accent-400 text-white rounded-lg shadow-md hover:bg-accent-500 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Premium;