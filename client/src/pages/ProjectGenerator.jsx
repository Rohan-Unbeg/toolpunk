// /client/src/pages/ProjectGenerator.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { generateIdea } from "../services/grok";
import { FaSpinner, FaCopy, FaFilePdf, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import appwriteService from "../services/appwrite";
import { saveAs } from "file-saver";
import { AuthContext } from "../context/AuthContext";

const ProjectGenerator = () => {
    const { user, logout } = useContext(AuthContext);
    const userId = user?.$id;
    const userName = user?.name || user?.email;
    const isPremium = user?.labels?.includes("premium") || false;
    const [branch, setBranch] = useState("CSE");
    const [difficulty, setDifficulty] = useState("Medium");
    const [idea, setIdea] = useState("");
    const [savedIdeas, setSavedIdeas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [error, setError] = useState("");
    const [dailyCount, setDailyCount] = useState(0);
    const branches = ["CSE", "ECE", "Mechanical", "Civil", "IT"];
    const difficulties = ["Easy", "Medium", "Hard"];
    const [success, setSuccess] = useState("");

    const nav = useNavigate();

    useEffect(() => {
        if (userId) {
            loadSavedIdeas(userId);
            checkDailyLimit(userId);
        }
    }, [userId]);

    const checkDailyLimit = async (uid) => {
        if (!uid) return;
        try {
            const today = new Date().toISOString().split("T")[0];
            const limit = await appwriteService.getLimit(uid, today);
            setDailyCount(limit?.count || 0);
        } catch (err) {
            console.error("Limit check failed:", err);
            setDailyCount(0);
        }
    };

    const loadSavedIdeas = async (uid) => {
        if (!uid) return;
        try {
            const docs = await appwriteService.getUserIdeas(uid);
            setSavedIdeas(docs);
        } catch (err) {
            setError("Failed to load saved ideas.");
            console.error("Load ideas error:", err);
        }
    };

    const handleGenerate = async () => {
        if (!isPremium && dailyCount >= 3) {
            setError(
                `You've used ${dailyCount}/3 free ideas today. Upgrade to premium for unlimited ideas!`
            );
            return;
        }
        setLoading(true);
        setError("");
        try {
            const text = await generateIdea(branch, difficulty);
            setIdea(text);
            if (!isPremium) {
                const today = new Date().toISOString().split("T")[0];
                await appwriteService.updateLimit(
                    userId,
                    today,
                    dailyCount + 1
                );
                setDailyCount(dailyCount + 1);
            }
        } catch (err) {
            setError("Failed to generate idea. Try again.");
            console.error("Generate error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!userId || !idea) return;
        setSaveLoading(true);
        setError("");
        setSuccess("");
        try {
            const newIdea = {
                userId,
                branch,
                difficulty,
                ideaText: idea,
                createdAt: new Date().toISOString(),
            };
            const saved = await appwriteService.saveProjectIdea(newIdea);
            setSavedIdeas([{ ...newIdea, $id: saved.$id }, ...savedIdeas]);
            setSuccess("Idea saved!");
        } catch (err) {
            setError("Failed to save idea.");
            console.error("Save error:", err);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleDelete = async (ideaId) => {
        if (!window.confirm("Are you sure you want to delete this idea?"))
            return;
        setError("");
        setSuccess("");
        try {
            await appwriteService.deleteIdea(ideaId);
            setSavedIdeas(savedIdeas.filter((i) => i.$id !== ideaId));
            setSuccess("Idea deleted!");
        } catch (err) {
            setError("Failed to delete idea.");
            console.error("Delete error:", err);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setSuccess("Idea copied!");
    };

    const handleExportPdf = (ideaText) => {
        if (!isPremium) {
            setError("Export is premium-only. Upgrade for ₹100/month!");
            return;
        }
        const blob = new Blob([`Project Idea\n\n${ideaText}`], {
            type: "text/plain",
        });
        saveAs(blob, "project-idea.txt");
    };

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

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight flex items-center justify-center gap-2"
                    >
                        <span className="text-4xl">🎓</span> Project Idea
                        Generator
                        {isPremium && (
                            <span className="text-yellow-500 text-2xl ml-2">
                                🌟
                            </span>
                        )}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-3 text-lg text-gray-600 max-w-xl mx-auto"
                    >
                        {isPremium
                            ? "Unlimited project ideas tailored for you!"
                            : "3 free ideas daily or ₹100/month for unlimited!"}
                    </motion.p>
                </motion.div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md text-red-700 flex justify-between items-center max-w-2xl mx-auto"
                    >
                        <span>{error}</span>
                        {error.includes("premium") ? (
                            <Link
                                to="/premium"
                                className="text-indigo-600 hover:underline font-medium"
                            >
                                Go Premium →
                            </Link>
                        ) : (
                            <button
                                onClick={() => setError("")}
                                className="text-red-600 hover:text-red-800"
                            >
                                ✕
                            </button>
                        )}
                    </motion.div>
                )}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md text-green-700 flex justify-between items-center max-w-2xl mx-auto"
                    >
                        <span>{success}</span>
                        <button
                            onClick={() => setSuccess("")}
                            className="text-green-600 hover:text-green-800"
                        >
                            ✕
                        </button>
                    </motion.div>
                )}

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white p-6 rounded-2xl shadow-lg ring-1 ring-indigo-100/50 mb-8"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Branch
                            </label>
                            <motion.select
                                whileHover={{ scale: 1.02 }}
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gradient-to-r from-indigo-50 to-purple-50"
                            >
                                {branches.map((b) => (
                                    <option key={b} value={b}>
                                        {b}
                                    </option>
                                ))}
                            </motion.select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Difficulty
                            </label>
                            <motion.select
                                whileHover={{ scale: 1.02 }}
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gradient-to-r from-indigo-50 to-purple-50"
                            >
                                {difficulties.map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </motion.select>
                        </div>
                    </div>
                    <div className="text-center">
                        <motion.button
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleGenerate}
                            disabled={loading || !userId}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 flex items-center justify-center mx-auto"
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" />
                                    Generating...
                                </>
                            ) : (
                                "Generate Idea"
                            )}
                        </motion.button>
                    </div>
                </motion.div>

                {/* Idea */}
                {idea && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white p-6 rounded-2xl shadow-lg ring-1 ring-indigo-100/50 mb-8"
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="text-2xl">💡</span> Your Project
                            Idea
                        </h2>
                        <p className="text-gray-700 mb-6 whitespace-pre-line">
                            {idea}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSave}
                                disabled={saveLoading || !idea || !userId}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center disabled:opacity-50"
                            >
                                {saveLoading ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Idea"
                                )}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleCopy(idea)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
                            >
                                <FaCopy className="mr-2" />
                                Copy
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: isPremium ? 1.05 : 1 }}
                                whileTap={{ scale: isPremium ? 0.95 : 1 }}
                                onClick={() => handleExportPdf(idea)}
                                className={`px-4 py-2 rounded-lg flex items-center ${
                                    isPremium
                                        ? "bg-purple-500 text-white hover:bg-purple-600"
                                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                                }`}
                            >
                                {isPremium ? (
                                    <>
                                        <FaFilePdf className="mr-2" />
                                        Export
                                    </>
                                ) : (
                                    <>
                                        <FaLock className="mr-2" />
                                        Export (Premium)
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* Saved Ideas */}
                {savedIdeas.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white p-6 rounded-2xl shadow-lg ring-1 ring-indigo-100/50"
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="text-2xl">💾</span> Saved Ideas
                        </h2>
                        <ul className="space-y-6">
                            {savedIdeas.map((i, index) => (
                                <motion.li
                                    key={i.$id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 + index * 0.1 }}
                                    className="border-b pb-4 last:border-b-0"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <p className="text-gray-700">
                                                <strong>Branch:</strong>{" "}
                                                {i.branch}
                                            </p>
                                            <p className="text-gray-700">
                                                <strong>Difficulty:</strong>{" "}
                                                {i.difficulty}
                                            </p>
                                            <p className="text-gray-700">
                                                <strong>Idea:</strong>{" "}
                                                {i.ideaText}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Saved:{" "}
                                                {new Date(
                                                    i.createdAt
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleDelete(i.$id)}
                                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                                        >
                                            Delete
                                        </motion.button>
                                    </div>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ProjectGenerator;
