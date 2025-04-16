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
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pt-20 pb-8 px-4 transition-colors duration-200">
            {showDeleteModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 bg-black/40 dark:bg-black/60 flex items-center justify-center px-4"
                >
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 max-w-sm w-full">
                        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-2">
                            Delete this idea?
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-6">
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-neutral-600 dark:text-neutral-300 rounded-lg border border-neutral-300 dark:border-neutral-600"
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                Delete
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
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-3 flex items-center justify-center gap-3">
                        <FaGraduationCap className="text-[var(--color-primary)]" />
                        Project Idea Generator
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">
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
                                className="inline-flex items-center bg-[var(--color-primary)] hover:bg-accent-400 text-white px-5 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg"
                            >
                                <FaStar className="mr-2" />
                                Upgrade to Premium
                            </Link>
                        </motion.div>
                    )}
                </motion.div>

                <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1 mb-6">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setActiveTab("generator")}
                        className={`flex-1 py-2 px-4 text-sm font-medium transition-colors duration-200 rounded-md ${
                            activeTab === "generator"
                                ? "bg-white dark:bg-neutral-700 text-[var(--color-primary)] shadow-sm"
                                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                        }`}
                    >
                        Generate
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setActiveTab("saved")}
                        className={`flex-1 py-2 px-4 text-sm font-medium transition-colors duration-200 rounded-md ${
                            activeTab === "saved"
                                ? "bg-white dark:bg-neutral-700 text-[var(--color-primary)] shadow-sm"
                                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
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
                        className="mb-6 p-3 bg-error-100 dark:bg-error-900/50 text-error-700 dark:text-error-300 rounded-lg flex justify-between items-center"
                    >
                        <span>{error}</span>
                        <button
                            onClick={() => setError("")}
                            className="text-error-500 dark:text-error-400 hover:text-error-700 dark:hover:text-error-200"
                        >
                            ×
                        </button>
                    </motion.div>
                )}

                {activeTab === "generator" && (
                    <>
                        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 mb-6 border border-[var(--color-primary)]/20">
                            <div className="grid grid-cols-1 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                        Branch
                                    </label>
                                    <select
                                        value={branch}
                                        onChange={(e) => setBranch(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                    >
                                        {branches.map((b) => (
                                            <option key={b} value={b}>
                                                {b}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                        Difficulty
                                    </label>
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
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
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleGenerate}
                                disabled={loading || !userId}
                                className="mt-6 w-full bg-[var(--color-primary)] hover:bg-primary-500 text-white py-3 rounded-lg disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
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
                                <div className="mt-3 text-sm text-neutral-500 dark:text-neutral-400 text-center">
                                    {dailyCount}/3 free generations today
                                </div>
                            )}
                        </div>

                        {idea && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 mb-6 border border-[var(--color-primary)]/20"
                            >
                                <h2 className="text-xl font-bold text-[var(--color-primary)] mb-4 flex items-center gap-3">
                                    <FaLightbulb className="text-accent-400" />
                                    Your Project Idea
                                </h2>
                                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg mb-6">
                                    <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
                                        {idea}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSave}
                                        disabled={saveLoading || !idea || !userId}
                                        className="flex-1 bg-[var(--color-primary)] hover:bg-primary-500 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60 transition-colors"
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
                                        className="flex-1 bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <FaCopy />
                                        Copy
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleExportPdf(idea)}
                                        className={`flex-1 px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                                            isPremium
                                                ? "bg-accent-400 hover:bg-accent-500 text-white"
                                                : "bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400"
                                        }`}
                                    >
                                        {isPremium ? (
                                            <>
                                                <FaFilePdf />
                                                Export PDF
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
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 border border-[var(--color-primary)]/20">
                        <h2 className="text-xl font-bold text-[var(--color-primary)] mb-6 flex items-center gap-3">
                            <FaSave className="text-secondary-500" />
                            Saved Ideas
                        </h2>
                        {savedIdeas.length === 0 ? (
                            <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                                <p className="mb-4">No saved ideas yet.</p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveTab("generator")}
                                    className="bg-[var(--color-primary)] hover:bg-primary-500 text-white px-5 py-2.5 rounded-lg"
                                >
                                    Generate New Idea
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
                                        className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-5 border border-[var(--color-primary)]/20"
                                    >
                                        <div className="flex flex-col gap-4">
                                            <div className="flex gap-2">
                                                <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-3 py-1 rounded-lg text-xs">
                                                    {i.branch}
                                                </span>
                                                <span
                                                    className={`px-3 py-1 rounded-lg text-xs ${
                                                        i.difficulty === "Easy"
                                                            ? "bg-success-100 dark:bg-success-900/50 text-success-800 dark:text-success-200"
                                                            : i.difficulty === "Medium"
                                                            ? "bg-accent-100 dark:bg-accent-900/50 text-accent-800 dark:text-accent-200"
                                                            : "bg-error-100 dark:bg-error-900/50 text-error-800 dark:text-error-200"
                                                    }`}
                                                >
                                                    {i.difficulty}
                                                </span>
                                            </div>
                                            <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
                                                {i.ideaText}
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                    Saved: {new Date(i.createdAt).toLocaleString()}
                                                </p>
                                                <div className="flex gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleCopy(i.ideaText)}
                                                        className="p-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                                                    >
                                                        <FaCopy />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleExportPdf(i.ideaText)}
                                                        className={`p-2 rounded-lg transition-colors ${
                                                            isPremium
                                                                ? "bg-accent-400 hover:bg-accent-500 text-white"
                                                                : "bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400"
                                                        }`}
                                                    >
                                                        <FaFilePdf />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleDelete(i.$id)}
                                                        className="p-2 bg-error-100 dark:bg-error-900/50 text-error-600 dark:text-error-300 rounded-lg hover:bg-error-200 dark:hover:bg-error-800 transition-colors"
                                                    >
                                                        <FaTrash />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            {/* Notifications */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                id="notification"
                className="fixed bottom-6 right-6 hidden items-center p-4 bg-success-500 text-white rounded-lg shadow-lg"
            >
                <FaSave className="mr-3" />
                <span>Idea saved successfully!</span>
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                id="deleteNotification"
                className="fixed bottom-6 right-6 hidden items-center p-4 bg-error-500 text-white rounded-lg shadow-lg"
            >
                <FaTrash className="mr-3" />
                <span>Idea deleted successfully!</span>
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                id="copyNotification"
                className="fixed bottom-6 right-6 hidden items-center p-4 bg-secondary-500 text-white rounded-lg shadow-lg"
            >
                <FaCopy className="mr-3" />
                <span>Copied to clipboard!</span>
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                id="exportNotification"
                className="fixed bottom-6 right-6 hidden items-center p-4 bg-accent-400 text-white rounded-lg shadow-lg"
            >
                <FaFilePdf className="mr-3" />
                <span>Exported as PDF!</span>
            </motion.div>
        </div>
    );
});

export default ProjectGenerator;