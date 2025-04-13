// /client/src/pages/Premium.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FaCheckCircle, FaLock, FaSpinner } from "react-icons/fa";

const Premium = () => {
    const [loading, setLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const { user } = useContext(AuthContext);
    const isPremium = user?.labels?.includes("premium") || false;
    const nav = useNavigate();

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (!user) {
            alert("Please login first!");
            nav("/login");
            return;
        }

        setLoading(true);
        try {
            const userId = user.$id;
            const amount = 100;

            const res = await fetch(
                "https://toolpunk-api.onrender.com/api/create-order",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount, userId }),
                }
            );

            const data = await res.json();
            if (!res.ok)
                throw new Error(data.error || "Failed to create order");

            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                throw new Error(
                    "Failed to load Razorpay SDK. Please try again."
                );
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: data.currency,
                name: "Toolpunk",
                description: "Buy Premium Plan",
                order_id: data.order_id,
                handler: async function (response) {
                    setIsProcessing(true);
                    if (
                        !response.razorpay_payment_id ||
                        !response.razorpay_order_id ||
                        !response.razorpay_signature
                    ) {
                        alert("Incomplete payment data. Please try again.");
                        setIsProcessing(false);
                        return;
                    }
                    const verifyRes = await fetch(
                        "https://toolpunk-api.onrender.com/verify-payment",
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                userId,
                                razorpay_payment_id:
                                    response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        }
                    );

                    const verifyData = await verifyRes.json();
                    if (verifyData.success) {
                        alert("🎉 Premium activated!");
                        setIsProcessing(false);
                        window.location.reload();
                    } else {
                        alert(
                            "⚠️ Payment verification failed: " +
                                (verifyData.error || "Unknown error")
                        );
                        setIsProcessing(false);
                    }
                },
                prefill: { email: user.email || "" },
                theme: { color: "#4F46E5" }, // Indigo to match Toolpunk
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", function (response) {
                alert(
                    "Payment failed: " +
                        (response.error.description || "Unknown error")
                );
            });
            rzp.open();
        } catch (err) {
            alert(err.message || "Something went wrong with the payment.");
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
                            : "Get unlimited project ideas and exclusive features for just ₹100/month."}
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
                                onClick={handlePayment}
                                disabled={loading || isProcessing}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 flex items-center mx-auto"
                            >
                                {loading || isProcessing ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    "Buy Premium (₹100)"
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
                            for just ₹100/month.
                        </p>
                        {user ? (
                            <motion.button
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handlePayment}
                                disabled={loading || isProcessing}
                                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-indigo-50 transition disabled:opacity-50 flex items-center mx-auto"
                            >
                                {loading || isProcessing ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <span className="mr-2">Unlock Now</span>
                                        <span className="text-sm">
                                            (₹100/month)
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
