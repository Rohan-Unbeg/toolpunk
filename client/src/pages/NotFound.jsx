// /client/src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRocket } from "react-icons/fa";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 via-purple-50 to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-black pt-20 px-4 overflow-hidden">
            <div className="absolute inset-0 bg-grid-indigo opacity-5 dark:bg-grid-gray z-0"></div>
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

            <div className="max-w-2xl mx-auto relative z-10 text-center">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <motion.div
                        initial={{ scale: 0.8, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            delay: 0.2,
                        }}
                        className="text-6xl mb-4"
                    >
                        🚀
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 tracking-tight"
                    >
                        404 - Lost in Space
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-4 text-lg text-gray-600 dark:text-gray-300"
                    >
                        Oops! This page is floating in the void. Let’s get you
                        back to Toolpunk!
                    </motion.p>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Link
                        to="/"
                        className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition shadow-md hover:shadow-lg"
                    >
                        <FaRocket className="mr-2" />
                        Back to Home
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;
