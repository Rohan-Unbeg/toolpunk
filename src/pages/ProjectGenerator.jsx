import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaSpinner, FaCopy, FaFilePdf } from 'react-icons/fa';
import appwriteService from '../services/appwrite';
import { saveAs } from 'file-saver';

const branches = ['CSE', 'ECE', 'Mechanical', 'Civil', 'IT'];
const difficulties = ['Easy', 'Medium', 'Hard'];

const ProjectGenerator = () => {
  const [branch, setBranch] = useState('CSE');
  const [difficulty, setDifficulty] = useState('Medium');
  const [idea, setIdea] = useState('');
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [savedIdeas, setSavedIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');
  const [dailyCount, setDailyCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);

  const nav = useNavigate();

  // Fetch user and limits
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await appwriteService.getCurrentUser();
        console.log('User:', user); // Debug
        if (user) {
          setUserId(user.$id);
          setUserName(user.name || user.email);
          setIsPremium(user.labels?.includes('premium') || false);
          await loadSavedIdeas(user.$id);
          await checkDailyLimit(user.$id);
        } else {
          nav('/login');
        }
      } catch (err) {
        setError('Failed to load user. Please log in.');
        console.error('Fetch user error:', err);
      }
    };
    fetchUser();
  }, []);

  // Check daily limit
  const checkDailyLimit = async (uid) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      console.log('Checking limit for:', { uid, today }); // Debug
      const limit = await appwriteService.getLimit(uid, today);
      console.log('Limit result:', limit); // Debug
      setDailyCount(limit.count || 0);
    } catch (err) {
      console.error('Limit check failed:', err);
      setError('Failed to check usage limit.');
    }
  };

  // Load saved ideas
  const loadSavedIdeas = async (uid) => {
    try {
      const docs = await appwriteService.getUserIdeas(uid);
      setSavedIdeas(docs);
    } catch (err) {
      setError('Failed to load saved ideas.');
      console.error('Load ideas error:', err);
    }
  };

  // Generate idea
  const handleGenerate = async () => {
    if (!isPremium && dailyCount >= 3) {
      setError('Free limit reached! Get premium for ₹100/month.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-70b-8192',
          messages: [
            {
              role: 'user',
              content: `Suggest a ${difficulty} level final year project idea for a ${branch} student. Keep it under 5 lines, no markdown or formatting.`,
            },
          ],
          temperature: 0.7,
          max_tokens: 300,
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_GROK_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      let text = res.data.choices[0].message.content.trim();
      text = text.replace(/\*\*/g, '').replace(/#+/g, '').replace(/[`_]/g, '');
      if (text.length > 950) text = text.substring(0, 947) + '...';

      setIdea(text);

      if (!isPremium) {
        const today = new Date().toISOString().split('T')[0];
        await appwriteService.updateLimit(userId, today, dailyCount + 1);
        setDailyCount(dailyCount + 1);
      }
    } catch (err) {
      setError('Failed to generate idea. Try again.');
      console.error('Generate error:', err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  // Save idea
  const handleSave = async () => {
    if (!userId || !idea) return;

    setSaveLoading(true);
    setError('');
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
      alert('Idea saved!');
    } catch (err) {
      setError('Failed to save idea.');
      console.error('Save error:', err);
    } finally {
      setSaveLoading(false);
    }
  };

  // Delete idea
  const handleDelete = async (ideaId) => {
    try {
      await appwriteService.deleteIdea(ideaId);
      setSavedIdeas(savedIdeas.filter((i) => i.$id !== ideaId));
      alert('Idea deleted!');
    } catch (err) {
      setError('Failed to delete idea.');
      console.error('Delete error:', err);
    }
  };

  // Copy idea
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Idea copied!');
  };

  // Export idea
  const handleExportPdf = (ideaText) => {
    if (!isPremium) {
      setError('Export is premium-only. Upgrade for ₹100/month!');
      return;
    }
    const blob = new Blob([`Project Idea\n\n${ideaText}`], { type: 'text/plain' });
    saveAs(blob, 'project-idea.txt');
  };

  // Logout
  const handleLogout = async () => {
    try {
      await appwriteService.logout();
      alert('Logged out!');
      nav('/login');
    } catch (err) {
      setError('Failed to log out.');
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-800 tracking-tight">
            🎓 Project Idea Generator
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Free project ideas for college. 3/day free or ₹100/month for unlimited!
          </p>
          {userName && (
            <div className="mt-4 flex justify-center items-center gap-4">
              <span className="text-sm text-gray-700">
                Hey, <span className="font-semibold">{userName}</span> {isPremium ? '🌟' : ''}
              </span>
              <button
                onClick={handleLogout}
                className="text-red-500 text-sm hover:underline"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            {error.includes('premium') && (
              <Link to="/premium" className="text-indigo-600 hover:underline">
                Go Premium →
              </Link>
            )}
          </div>
        )}

        {/* Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {difficulties.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center mx-auto"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                'Generate Idea'
              )}
            </button>
          </div>
        </div>

        {/* Idea */}
        {idea && (
          <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Project Idea</h2>
            <p className="text-gray-700 mb-6 whitespace-pre-line">{idea}</p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleSave}
                disabled={saveLoading || !idea}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center disabled:opacity-50"
              >
                {saveLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Idea'
                )}
              </button>
              <button
                onClick={() => handleCopy(idea)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
              >
                <FaCopy className="mr-2" />
                Copy
              </button>
              <button
                onClick={() => handleExportPdf(idea)}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  isPremium
                    ? 'bg-purple-500 text-white hover:bg-purple-600'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
              >
                <FaFilePdf className="mr-2" />
                Export {isPremium ? '' : '(Premium)'}
              </button>
            </div>
          </div>
        )}

        {/* Saved Ideas */}
        {savedIdeas.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">💾 Saved Ideas</h2>
            <ul className="space-y-6">
              {savedIdeas.map((i) => (
                <li key={i.$id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <strong>Branch:</strong> {i.branch}
                      </p>
                      <p className="text-gray-700">
                        <strong>Difficulty:</strong> {i.difficulty}
                      </p>
                      <p className="text-gray-700">
                        <strong>Idea:</strong> {i.ideaText}
                      </p>
                      <p className="text-sm text-gray-500">
                        Saved: {new Date(i.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(i.$id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectGenerator;