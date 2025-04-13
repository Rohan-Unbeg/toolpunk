// /client/src/pages/ProjectGenerator.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { generateIdea } from "../services/grok";
import { FaSpinner, FaCopy, FaFilePdf, FaLock, FaSave, FaTrash, FaLightbulb, FaStar, FaGraduationCap } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import appwriteService from "../services/appwrite";
import { saveAs } from "file-saver";
import { AuthContext } from "../context/AuthContext";

const ProjectGenerator = () => {
  const { user, logout } = useContext(AuthContext);
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
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState('generator');
  const branches = ["CSE", "ECE", "Mechanical", "Civil", "IT"];
  const difficulties = ["Easy", "Medium", "Hard"];
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
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      if (!isPremium) {
        const today = new Date().toISOString().split("T")[0];
        await appwriteService.updateLimit(userId, today, dailyCount + 1);
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
      setSavedIdeas([{ ...newIdea, $id: saved.$id }, ...savedIdeas]);
      
      // Show success notification
      const notification = document.getElementById('notification');
      notification.classList.remove('hidden');
      notification.classList.add('flex');
      setTimeout(() => {
        notification.classList.add('hidden');
        notification.classList.remove('flex');
      }, 3000);
    } catch (err) {
      setError("Failed to save idea.");
      console.error("Save error:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (ideaId) => {
    if (!window.confirm("Are you sure you want to delete this idea?")) return;
    try {
      await appwriteService.deleteIdea(ideaId);
      setSavedIdeas(savedIdeas.filter((i) => i.$id !== ideaId));
      
      // Show delete notification
      const deleteNotification = document.getElementById('deleteNotification');
      deleteNotification.classList.remove('hidden');
      deleteNotification.classList.add('flex');
      setTimeout(() => {
        deleteNotification.classList.add('hidden');
        deleteNotification.classList.remove('flex');
      }, 3000);
    } catch (err) {
      setError("Failed to delete idea.");
      console.error("Delete error:", err);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    
    // Show copy notification
    const copyNotification = document.getElementById('copyNotification');
    copyNotification.classList.remove('hidden');
    copyNotification.classList.add('flex');
    setTimeout(() => {
      copyNotification.classList.add('hidden');
      copyNotification.classList.remove('flex');
    }, 3000);
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
    
    // Show export notification
    const exportNotification = document.getElementById('exportNotification');
    exportNotification.classList.remove('hidden');
    exportNotification.classList.add('flex');
    setTimeout(() => {
      exportNotification.classList.add('hidden');
      exportNotification.classList.remove('flex');
    }, 3000);
  };

  // Confetti effect animation
  const generateConfetti = () => {
    if (!showConfetti) return null;
    
    return Array.from({ length: 100 }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ 
          y: -20, 
          x: Math.random() * window.innerWidth,
          rotate: 0,
          opacity: 1
        }}
        animate={{ 
          y: window.innerHeight + 100, 
          x: Math.random() * window.innerWidth,
          rotate: Math.random() * 360,
          opacity: 0
        }}
        transition={{ 
          duration: Math.random() * 2 + 1,
          ease: "easeOut" 
        }}
        style={{
          position: "fixed",
          width: Math.random() * 10 + 5,
          height: Math.random() * 10 + 5,
          backgroundColor: ['#FF5555', '#5555FF', '#55FF55', '#FFFF55', '#FF55FF'][Math.floor(Math.random() * 5)],
          borderRadius: "50%",
          zIndex: 9999,
        }}
      />
    ));
  };

  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.1 }}
        className="w-4 h-4 text-yellow-400"
      >
        <FaStar />
      </motion.div>
    ));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-800 pt-20 pb-12 px-4 overflow-hidden font-['Poppins',sans-serif]">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.7, scale: 1 }}
            animate={{
              opacity: [0.5, 0.8, 0.5],
              scale: [1, 1.2, 1],
              x: [0, Math.random() * 50 - 25, 0],
              y: [0, Math.random() * 50 - 25, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: "absolute",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 400 + 200}px`,
              height: `${Math.random() * 400 + 200}px`,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)`,
              filter: "blur(50px)",
              zIndex: 0,
            }}
          />
        ))}
      </div>

      {/* Confetti effect */}
      {showConfetti && generateConfetti()}

      {/* Main content container */}
      <div className="max-w-5xl mx-auto w-full relative z-10 mt-10">
        {/* Header with premium badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center mb-8"
        >
          <div className="relative inline-block">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl gap-2 sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-pink-200 tracking-tight flex items-center justify-center p-4"
            >
              <FaGraduationCap className="text-4xl sm:text-4xl text-blue-300 " /> 
              Project Idea Generator
            </motion.h1>
            
            {isPremium && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -top-5 sm:-right-20 right-0 sm:rotate-6 rotate-0 text-xs bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-bold px-3 py-1 rounded-lg transform rotate-6 shadow-lg flex items-center space-x-1 "
              >
                <div className="flex">{renderStars()}</div>
                <span>PREMIUM</span>
              </motion.div>
            )}
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-4 text-lg text-blue-200 max-w-2xl mx-auto"
          >
            {isPremium
              ? "Unlimited project ideas tailored for you. Get inspired anytime!"
              : `${3 - dailyCount}/3 ideas remaining today. Upgrade for unlimited access!`}
          </motion.p>
          
          {isPremium ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-indigo-700/30 rounded-full backdrop-blur-sm text-sm font-medium text-indigo-200"
            >
              <FaStar className="text-yellow-400" />
              <span>Premium Member</span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-3"
            >
              <Link to="/premium" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <FaStar className="text-black" /> 
                Upgrade to Premium
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Tabs for navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6 bg-white/10 backdrop-blur-md rounded-2xl p-1 flex w-full max-w-md mx-auto"
        >
          <motion.button
            whileHover={{ backgroundColor: activeTab === 'generator' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab('generator')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${
              activeTab === 'generator' ? 'bg-white/20 text-white shadow-sm' : 'text-blue-200 hover:bg-white/5'
            }`}
          >
            <FaLightbulb className={activeTab === 'generator' ? 'text-yellow-300' : 'text-blue-300'} />
            Generate Ideas
          </motion.button>
          <motion.button
            whileHover={{ backgroundColor: activeTab === 'saved' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${
              activeTab === 'saved' ? 'bg-white/20 text-white shadow-sm' : 'text-blue-200 hover:bg-white/5'
            }`}
          >
            <FaSave className={activeTab === 'saved' ? 'text-green-300' : 'text-blue-300'} />
            Saved Ideas {savedIdeas.length > 0 && <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">{savedIdeas.length}</span>}
          </motion.button>
        </motion.div>

        {/* Error Notification */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-6 p-4 bg-red-900/60 border-l-4 border-red-400 backdrop-blur-sm rounded-md text-red-100 flex justify-between items-center"
            >
              <span>{error}</span>
              {error.includes("premium") && (
                <Link
                  to="/premium"
                  className="text-yellow-300 hover:text-yellow-200 hover:underline font-medium ml-4 whitespace-nowrap"
                >
                  Go Premium →
                </Link>
              )}
              <button 
                onClick={() => setError("")}
                className="ml-4 text-red-300 hover:text-red-100"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === 'generator' && (
          <>
            {/* Generator Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20 mb-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Project Branch
                  </label>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="relative"
                  >
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full p-4 bg-indigo-800/40 border border-indigo-600/50 text-white rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent appearance-none transition-all duration-300 shadow-inner"
                    >
                      {branches.map((b) => (
                        <option key={b} value={b} className="bg-indigo-900 text-white">
                          {b}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-blue-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </motion.div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Project Difficulty
                  </label>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="relative"
                  >
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full p-4 bg-indigo-800/40 border border-indigo-600/50 text-white rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent appearance-none transition-all duration-300 shadow-inner"
                    >
                      {difficulties.map((d) => (
                        <option key={d} value={d} className="bg-indigo-900 text-white">
                          {d}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-blue-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(79, 70, 229, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerate}
                  disabled={loading || !userId}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform shadow-lg hover:shadow-xl flex items-center justify-center mx-auto space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="relative">
                        <FaSpinner className="animate-spin text-white mr-2" />
                        <div className="absolute inset-0 rounded-full border-t-2 border-blue-300 animate-ping opacity-20"></div>
                      </div>
                      <span>Generating your idea...</span>
                    </>
                  ) : (
                    <>
                      <FaLightbulb className="text-yellow-300 mr-2" />
                      <span>Generate Project Idea</span>
                    </>
                  )}
                </motion.button>
                
                {!isPremium && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-4 text-sm text-blue-300"
                  >
                    {dailyCount}/3 free generations used today
                    <div className="w-full bg-indigo-800/50 h-2 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-indigo-500 h-full rounded-full"
                        style={{ width: `${(dailyCount / 3) * 100}%` }}
                      ></div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Idea Display */}
            <AnimatePresence>
              {idea && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20 mb-8 relative overflow-hidden"
                >
                  {/* Glowing corner accent */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl"></div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl"></div>
                  
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                    <span className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-lg">
                      <FaLightbulb className="text-yellow-300 text-xl" />
                    </span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-pink-200">
                      Your Project Idea
                    </span>
                  </h2>
                  
                  <div className="bg-indigo-900/30 border border-indigo-800/60 rounded-xl p-6 mb-6 relative z-10">
                    <p className="text-blue-100 whitespace-pre-line leading-relaxed">{idea}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 relative z-10">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(72, 187, 120, 0.4)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      disabled={saveLoading || !idea || !userId}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saveLoading ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <FaSave className="mr-2" />
                          <span>Save Idea</span>
                        </>
                      )}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(66, 153, 225, 0.4)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCopy(idea)}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center"
                    >
                      <FaCopy className="mr-2" />
                      <span>Copy to Clipboard</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: isPremium ? 1.05 : 1, boxShadow: isPremium ? "0 5px 15px rgba(159, 122, 234, 0.4)" : "none" }}
                      whileTap={{ scale: isPremium ? 0.95 : 1 }}
                      onClick={() => handleExportPdf(idea)}
                      className={`px-4 py-3 rounded-lg flex items-center transition-all duration-300 ${
                        isPremium
                          ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white hover:shadow-lg"
                          : "bg-gray-700/60 text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      {isPremium ? (
                        <>
                          <FaFilePdf className="mr-2" />
                          <span>Export as Text</span>
                        </>
                      ) : (
                        <>
                          <FaLock className="mr-2" />
                          <span>Export (Premium Only)</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Saved Ideas Tab Content */}
        {activeTab === 'saved' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-lg">
                <FaSave className="text-blue-300 text-xl" />
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-pink-200">
                Your Saved Ideas
              </span>
            </h2>
            
            {savedIdeas.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center py-10 text-blue-300"
              >
                <div className="mb-4 text-5xl opacity-50">📂</div>
                <p className="text-lg mb-2">You don't have any saved ideas yet</p>
                <p className="text-sm text-blue-400">Generate and save your first project idea!</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('generator')}
                  className="mt-6 bg-blue-600/40 hover:bg-blue-600/60 text-white px-4 py-2 rounded-lg transition-all duration-300"
                >
                  Go to Generator
                </motion.button>
              </motion.div>
            ) : (
              <ul className="space-y-6">
                {savedIdeas.map((i, index) => (
                  <motion.li
                    key={i.$id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="bg-indigo-900/30 border border-indigo-800/60 rounded-xl p-6 hover:bg-indigo-800/30 transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap gap-3"><span className="px-3 py-1 bg-blue-800/50 text-blue-200 rounded-full text-xs font-medium">
                            {i.branch}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            i.difficulty === 'Easy' ? 'bg-green-800/50 text-green-200' :
                            i.difficulty === 'Medium' ? 'bg-yellow-800/50 text-yellow-200' :
                            'bg-red-800/50 text-red-200'
                          }`}>
                            {i.difficulty}
                          </span>
                        </div>
                        
                        <p className="text-blue-100 leading-relaxed">
                          {i.ideaText}
                        </p>
                        
                        <p className="text-sm text-blue-400">
                          Saved: {new Date(i.createdAt).toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex flex-row sm:flex-col gap-3 items-start">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCopy(i.ideaText)}
                          className="p-2 bg-blue-800/40 hover:bg-blue-700/60 text-blue-300 rounded-lg transition-all duration-300 tooltip-container"
                        >
                          <FaCopy />
                          <span className="tooltip-text">Copy</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: isPremium ? 1.05 : 1 }}
                          whileTap={{ scale: isPremium ? 0.95 : 1 }}
                          onClick={() => handleExportPdf(i.ideaText)}
                          className={`p-2 rounded-lg transition-all duration-300 tooltip-container ${
                            isPremium
                              ? "bg-purple-800/40 hover:bg-purple-700/60 text-purple-300"
                              : "bg-gray-700/60 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <FaFilePdf />
                          <span className="tooltip-text">{isPremium ? "Export" : "Premium Only"}</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(i.$id)}
                          className="p-2 bg-red-800/40 hover:bg-red-700/60 text-red-300 rounded-lg transition-all duration-300 tooltip-container"
                        >
                          <FaTrash />
                          <span className="tooltip-text">Delete</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </div>

      {/* Toast Notifications */}
      <div id="notification" className="fixed bottom-6 right-6 hidden items-center p-4 mb-4 bg-green-800/90 text-green-200 rounded-lg shadow-lg backdrop-blur-sm border border-green-700 transition-all duration-500 z-50">
        <FaSave className="mr-3 text-green-300" />
        <span>Idea saved successfully!</span>
      </div>
      
      <div id="deleteNotification" className="fixed bottom-6 right-6 hidden items-center p-4 mb-4 bg-red-800/90 text-red-200 rounded-lg shadow-lg backdrop-blur-sm border border-red-700 transition-all duration-500 z-50">
        <FaTrash className="mr-3 text-red-300" />
        <span>Idea deleted successfully!</span>
      </div>
      
      <div id="copyNotification" className="fixed bottom-6 right-6 hidden items-center p-4 mb-4 bg-blue-800/90 text-blue-200 rounded-lg shadow-lg backdrop-blur-sm border border-blue-700 transition-all duration-500 z-50">
        <FaCopy className="mr-3 text-blue-300" />
        <span>Idea copied to clipboard!</span>
      </div>
      
      <div id="exportNotification" className="fixed bottom-6 right-6 hidden items-center p-4 mb-4 bg-purple-800/90 text-purple-200 rounded-lg shadow-lg backdrop-blur-sm border border-purple-700 transition-all duration-500 z-50">
        <FaFilePdf className="mr-3 text-purple-300" />
        <span>Idea exported successfully!</span>
      </div>

      {/* CSS for tooltips - add to your global CSS or as inline styles */}
      <style>{`
        .tooltip-container {
          position: relative;
        }
        
        .tooltip-text {
          visibility: hidden;
          position: absolute;
          z-index: 100;
          background-color: rgba(17, 24, 39, 0.9);
          color: white;
          text-align: center;
          padding: 4px 8px;
          border-radius: 6px;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          font-size: 12px;
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        .tooltip-container:hover .tooltip-text {
          visibility: visible;
          opacity: 1;
        }
        
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          50% { transform: translateY(-20px) translateX(10px) rotate(10deg); }
          100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
        }
        
        .blob {
          animation-delay: var(--delay, 0s);
        }
      `}</style>
    </div>
  );
};

export default ProjectGenerator;