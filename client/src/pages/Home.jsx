// /client/src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import appwriteService from "../services/appwrite";

const Home = () => {
    const [userName, setUserName] = useState("");
    const [isPremium, setIsPremium] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await appwriteService.getCurrentUser();
                if (user) {
                    setUserName(user.name || user.email);
                    setIsPremium(user.labels?.includes("premium") || false);
                }
            } catch (err) {
                console.error("Fetch user error:", err);
            }
        };
        fetchUser();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 via-purple-50 to-blue-50 pt-20 pb-8 px-4 overflow-hidden">
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
                {/* Header */}
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
                        className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight"
                    >
                        Welcome to Toolpunk
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
                    >
                        Free tools for students: project ideas, railway PNR
                        checks, and more!
                    </motion.p>
                </motion.div>

                {/* Tools */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    <motion.div
                        whileHover={{
                            scale: 1.02,
                            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                        }}
                        className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-indigo-100/50"
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <span className="text-2xl">🎓</span> Project Ideas
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Get 3 free project ideas daily or go premium for
                            unlimited.
                        </p>
                        <Link
                            to="/projectgenerator"
                            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition"
                        >
                            Try Now
                        </Link>
                    </motion.div>
                    <motion.div
                        whileHover={{
                            scale: 1.02,
                            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                        }}
                        className="bg-white p-6 rounded-2xl shadow-sm opacity-75"
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <span className="text-2xl">🚂</span> PNR Checker
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Check railway PNR status (coming soon).
                        </p>
                        <button
                            disabled
                            className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed"
                        >
                            Coming Soon
                        </button>
                    </motion.div>
                </motion.div>

                {/* Premium */}
                {!isPremium && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-12 text-center"
                    >
                        <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
                            Unlock More with Premium
                        </h2>
                        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                            Get unlimited project ideas for just ₹100/month.
                        </p>
                        <Link
                            to="/premium"
                            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-md hover:shadow-lg"
                        >
                            Go Premium
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Home;
