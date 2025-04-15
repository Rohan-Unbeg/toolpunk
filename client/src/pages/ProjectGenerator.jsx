import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { generateIdea } from "../services/grok";
import {
    FaSpinner,
    FaCopy,
    FaFilePdf,
    FaLock,
    FaSave,
    FaTrash,
    FaLightbulb,
    FaStar,
    FaGraduationCap,
} from "react-icons/fa";
import appwriteService from "../services/appwrite";
import { jsPDF } from "jspdf";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

const ProjectGenerator = React.memo(() => {
    const { user } = useContext(AuthContext);
    const userId = user?.$id;
    const isPremium = user?.labels?.includes("premium") || false;
    const [branch, setBranch] = useState("CSE");
    const [difficulty, setDifficulty] = useState("Medium");
    const [idea, setIdea] = useState("");
    const [savedIdeas, setSavedIdeas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [error, setError] = useState("");
    const [dailyCount, setDailyCount] = useState(0);
    const [activeTab, setActiveTab] = useState("generator");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [ideaToDelete, setIdeaToDelete] = useState(null);
    const nav = useNavigate();

    const branches = ["CSE", "ECE", "Mechanical", "Civil", "IT"];
    const difficulties = ["Easy", "Medium", "Hard"];

    useEffect(() => {
        if (userId) {
            loadSavedIdeas(userId);
            checkDailyLimit(userId);
        }
    }, [userId]);

    const checkDailyLimit = useCallback(async (uid) => {
        if (!uid) return;
        try {
            const today = new Date().toISOString().split("T")[0];
            const limit = await appwriteService.getLimit(uid, today);
            setDailyCount(limit?.count || 0);
        } catch (err) {
            console.error("Limit check failed:", err);
            setDailyCount(0);
        }
    }, []);

    const loadSavedIdeas = useCallback(async (uid) => {
        if (!uid) return;
        try {
            const docs = await appwriteService.getUserIdeas(uid);
            setSavedIdeas(docs.slice(0, 10));
        } catch (err) {
            setError("Failed to load saved ideas.");
            console.error("Load ideas error:", err);
        }
    }, []);

    const handleGenerate = async () => {
        if (!isPremium && dailyCount >= 3) {
            setError(
                `You've used ${dailyCount}/3 free ideas today. Upgrade to premium!`
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
        try {
            const newIdea = {
                userId,
                branch,
                difficulty,
                ideaText: idea,
                createdAt: new Date().toISOString(),
            };
            const saved = await appwriteService.saveProjectIdea(newIdea);
            setSavedIdeas(
                [{ ...newIdea, $id: saved.$id }, ...savedIdeas].slice(0, 10)
            );
            showNotification("notification", "Idea saved successfully!");
        } catch (err) {
            setError("Failed to save idea.");
            console.error("Save error:", err);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleDelete = (ideaId) => {
        setIdeaToDelete(ideaId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await appwriteService.deleteIdea(ideaToDelete);
            setSavedIdeas(savedIdeas.filter((i) => i.$id !== ideaToDelete));
            showNotification(
                "deleteNotification",
                "Idea deleted successfully!"
            );
        } catch (err) {
            setError("Failed to delete idea.");
            console.error("Delete error:", err);
        } finally {
            setShowDeleteModal(false);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        showNotification("copyNotification", "Idea copied to clipboard!");
    };

    const handleExportPdf = (ideaText) => {
        if (!isPremium) {
            setError("Export is premium-only. Upgrade for ₹100/month!");
            return;
        }
        const doc = new jsPDF();
        doc.setFont("helvetica");
        doc.setFontSize(14);
        doc.text("Project Idea", 10, 20);
        doc.setFontSize(12);
        doc.text(doc.splitTextToSize(ideaText, 180), 10, 30);
        doc.save("project-idea.pdf");
        showNotification("exportNotification", "Idea exported successfully!");
    };

    const showNotification = (id, message) => {
        const notification = document.getElementById(id);
        notification.classList.remove("hidden");
        notification.classList.add("flex");
        setTimeout(() => {
            notification.classList.add("hidden");
            notification.classList.remove("flex");
        }, 2000);
    };

    return (
        <div className="min-h-screen flex flex-col bg-indigo-50 dark:bg-gray-900 pt-20 pb-8 px-4 font-['Poppins',sans-serif]">
            {showDeleteModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 bg-black/40 dark:bg-black/60 flex items-center justify-center px-4"
                >
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg w-full max-w-sm p-6 space-y-4 text-center">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            Delete this idea?
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={confirmDelete}
                                className="bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                            >
                                Delete
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowDeleteModal(false)}
                                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg"
                            >
                                Cancel
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="max-w-3xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-center mb-6"
                >
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-2">
                        <FaGraduationCap className="text-blue-500" />
                        Project Idea Generator
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {isPremium
                            ? "Unlimited project ideas!"
                            : `${3 - dailyCount}/3 ideas left today.`}
                    </p>
                    {!isPremium && (
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Link
                                to="/premium"
                                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 dark:bg-yellow-600 text-white dark:text-gray-100 rounded-lg"
                            >
                                <FaStar />
                                Upgrade to Premium
                            </Link>
                        </motion.div>
                    )}
                </motion.div>

                <div className="mb-4 bg-gray-200 dark:bg-gray-800 rounded-lg p-1 flex">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setActiveTab("generator")}
                        className={`flex-1 py-2 px-3 text-sm transition-colors duration-200 ${
                            activeTab === "generator"
                                ? "bg-indigo-500 dark:bg-indigo-600 text-white dark:text-gray-100"
                                : "text-gray-600 dark:text-gray-400"
                        }`}
                    >
                        Generate
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setActiveTab("saved")}
                        className={`flex-1 py-2 px-3 text-sm transition-colors duration-200 ${
                            activeTab === "saved"
                                ? "bg-indigo-500 dark:bg-indigo-600 text-white dark:text-gray-100"
                                : "text-gray-600 dark:text-gray-400"
                        }`}
                    >
                        Saved ({savedIdeas.length})
                    </motion.button>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 p-3 bg-red-100 dark:bg-red-900 rounded-md text-red-800 dark:text-red-200 flex justify-between"
                    >
                        <span>{error}</span>
                        <button
                            onClick={() => setError("")}
                            className="text-red-500 dark:text-red-400"
                        >
                            ×
                        </button>
                    </motion.div>
                )}

                {activeTab === "generator" && (
                    <>
                        <div className="bg-indigo-100 dark:bg-indigo-800 p-6 rounded-lg mb-6">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        Branch
                                    </label>
                                    <select
                                        value={branch}
                                        onChange={(e) =>
                                            setBranch(e.target.value)
                                        }
                                        className="w-full p-3 bg-gray-300 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-lg transition-colors duration-200"
                                    >
                                        {branches.map((b) => (
                                            <option key={b} value={b}>
                                                {b}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        Difficulty
                                    </label>
                                    <select
                                        value={difficulty}
                                        onChange={(e) =>
                                            setDifficulty(e.target.value)
                                        }
                                        className="w-full p-3 bg-gray-300 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-lg transition-colors duration-200"
                                    >
                                        {difficulties.map((d) => (
                                            <option key={d} value={d}>
                                                {d}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleGenerate}
                                disabled={loading || !userId}
                                className="mt-6 w-full bg-indigo-500 dark:bg-indigo-600 text-white dark:text-gray-100 p-3 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <FaLightbulb />
                                        Generate Idea
                                    </>
                                )}
                            </motion.button>
                            {!isPremium && (
                                <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 text-center">
                                    {dailyCount}/3 free generations
                                </div>
                            )}
                        </div>

                        {idea && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-indigo-100 dark:bg-indigo-800 p-6 rounded-lg mb-6"
                            >
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                                    <FaLightbulb className="text-yellow-300" />
                                    Your Idea
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {idea}
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSave}
                                        disabled={
                                            saveLoading || !idea || !userId
                                        }
                                        className="bg-indigo-500 dark:bg-indigo-600 text-white dark:text-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {saveLoading ? (
                                            <>
                                                <FaSpinner className="animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <FaSave />
                                                Save
                                            </>
                                        )}
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleCopy(idea)}
                                        className="bg-indigo-500 dark:bg-indigo-600 text-white dark:text-gray-100 px-4 py-2 rounded-lg flex items-center gap-2"
                                    >
                                        <FaCopy />
                                        Copy
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleExportPdf(idea)}
                                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                                            isPremium
                                                ? "bg-indigo-500 dark:bg-indigo-600 text-white dark:text-gray-100"
                                                : "bg-gray-700 dark:bg-gray-800 text-gray-300 dark:text-gray-400"
                                        }`}
                                    >
                                        {isPremium ? (
                                            <>
                                                <FaFilePdf />
                                                Export
                                            </>
                                        ) : (
                                            <>
                                                <FaLock />
                                                Export (Premium)
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </>
                )}

                {activeTab === "saved" && (
                    <div className="bg-indigo-100 dark:bg-indigo-800 p-6 rounded-lg">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <FaSave className="text-blue-500" />
                            Saved Ideas
                        </h2>
                        {savedIdeas.length === 0 ? (
                            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                                <p className="mb-2">No saved ideas yet.</p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveTab("generator")}
                                    className="bg-indigo-500 dark:bg-indigo-600 text-white dark:text-gray-100 px-4 py-2 rounded-lg"
                                >
                                    Generate Now
                                </motion.button>
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {savedIdeas.map((i) => (
                                    <motion.li
                                        key={i.$id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                        className="bg-gray-300 dark:bg-gray-700 p-4 rounded-lg"
                                    >
                                        <div className="flex flex-col gap-3">
                                            <div className="flex gap-2">
                                                <span className="px-2 py-1 bg-gray-400 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                                                    {i.branch}
                                                </span>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${
                                                        i.difficulty === "Easy"
                                                            ? "bg-green-400 dark:bg-green-600 text-green-600 dark:text-green-400"
                                                            : i.difficulty ===
                                                              "Medium"
                                                            ? "bg-yellow-400 dark:bg-yellow-600 text-yellow-600 dark:text-yellow-400"
                                                            : "bg-red-400 dark:bg-red-600 text-red-600 dark:text-red-400"
                                                    }`}
                                                >
                                                    {i.difficulty}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {i.ideaText}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Saved:{" "}
                                                {new Date(
                                                    i.createdAt
                                                ).toLocaleString()}
                                            </p>
                                            <div className="flex gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() =>
                                                        handleCopy(i.ideaText)
                                                    }
                                                    className="p-2 bg-gray-400 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-lg"
                                                >
                                                    <FaCopy />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() =>
                                                        handleExportPdf(
                                                            i.ideaText
                                                        )
                                                    }
                                                    className={`p-2 rounded-lg ${
                                                        isPremium
                                                            ? "bg-indigo-500 dark:bg-indigo-600 text-white dark:text-gray-100"
                                                            : "bg-gray-700 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                                                    }`}
                                                >
                                                    <FaFilePdf />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() =>
                                                        handleDelete(i.$id)
                                                    }
                                                    className="p-2 bg-red-400 dark:bg-red-600 text-red-600 dark:text-red-400 rounded-lg"
                                                >
                                                    <FaTrash />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                id="notification"
                className="fixed bottom-4 right-4 hidden items-center p-3 bg-green-400 dark:bg-green-600 text-green-600 dark:text-green-400 rounded-lg"
            >
                <FaSave className="mr-2" />
                <span>Idea saved!</span>
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                id="deleteNotification"
                className="fixed bottom-4 right-4 hidden items-center p-3 bg-red-400 dark:bg-red-600 text-red-600 dark:text-red-400 rounded-lg"
            >
                <FaTrash className="mr-2" />
                <span>Idea deleted!</span>
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                id="copyNotification"
                className="fixed bottom-4 right-4 hidden items-center p-3 bg-gray-400 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-lg"
            >
                <FaCopy className="mr-2" />
                <span>Copied!</span>
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                id="exportNotification"
                className="fixed bottom-4 right-4 hidden items-center p-3 bg-indigo-500 dark:bg-indigo-600 text-white dark:text-gray-100 rounded-lg"
            >
                <FaFilePdf className="mr-2" />
                <span>Exported!</span>
            </motion.div>
        </div>
    );
});

export default ProjectGenerator;
