import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import appwriteService from "../services/appwrite";

const Home = () => {
    const [isPremium, setIsPremium] = useState(false);

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
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-950 pt-20 pb-8 px-4 overflow-hidden">
            <div className="absolute inset-0 bg-grid-indigo dark:bg-grid-indigo opacity-10 z-0"></div>
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
                            background: `radial-gradient(circle, rgba(79, 70, 229, 0.15), transparent) dark:radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent)`,
                            borderRadius: "50%",
                            filter: "blur(60px)",
                            animation: `float ${Math.random() * 10 + 15}s ease-in-out infinite`,
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
                        className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[#fbbf24] tracking-tight"
                    >
                        Welcome to Toolpunk
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto"
                    >
                        Free tools for students: project ideas, railway PNR checks, and more!
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
                            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                        }}
                        className="bg-white dark:bg-neutral-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#e0e7ff]/50 dark:border-[#4338ca]/50"
                    >
                        <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-2 flex items-center gap-2">
                            <span className="text-2xl text-[var(--color-primary)]">🎓</span> Project Ideas
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                            Get 3 free project ideas daily or go premium for unlimited.
                        </p>
                        <Link
                            to="/projectgenerator"
                            className="inline-flex items-center bg-[var(--color-primary)] hover:bg-[#6366f1] text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg"
                        >
                            Try Now
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </motion.div>
                    <motion.div
                        whileHover={{
                            scale: 1.02,
                            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                        }}
                        className="bg-white/80 dark:bg-neutral-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-neutral-200/30 dark:border-neutral-700/30"
                    >
                        <h2 className="text-xl font-semibold text-neutral-800/80 dark:text-neutral-100/90 mb-2 flex items-center gap-2">
                            <span className="text-2xl text-[#8b5cf6]">🚂</span> PNR Checker
                        </h2>
                        <p className="text-neutral-600/80 dark:text-neutral-400/80 mb-4">
                            Check railway PNR status (coming soon).
                        </p>
                        <button
                            disabled
                            className="bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 px-4 py-2 rounded-lg cursor-not-allowed flex items-center"
                        >
                            Coming Soon
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
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
                        <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[#fbbf24] mb-4">
                            Unlock More with Premium
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-xl mx-auto">
                            Get unlimited project ideas for just ₹100/month.
                        </p>
                        <Link
                            to="/premium"
                            className="inline-flex items-center bg-[var(--color-primary)] hover:bg-[#fbbf24] text-white px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
                        >
                            Go Premium
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Home;
