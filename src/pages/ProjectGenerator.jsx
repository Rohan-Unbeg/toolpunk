// import React, { useEffect, useState } from "react";

// import appwriteService from "../services/appwrite";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const branches = ["CSE", "ECE", "Mechanical", "Civil", "IT"];
// const difficulties = ["Easy", "Medium", "Hard"];

// const ProjectGenerator = () => {
//     const [branch, setBranch] = useState("CSE");
//     const [difficulty, setDifficulty] = useState("Medium");
//     const [idea, setIdea] = useState("");
//     const [userId, setUserId] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [savedIdeas, setSavedIdeas] = useState([]);
//     const [userName, setUserName] = useState("");

//     const nav = useNavigate();

//     // on mount
//     useEffect(() => {
//         const fetchUser = async () => {
//             const user = await appwriteService.getCurrentUser();
//             console.log("👀 user from Appwrite:", user);
//             if (user) {
//                 setUserId(user.$id);
//                 loadSavedIdeas(user.$id);
//                 setUserName(user.name || user.email);
//             }
//         };
//         fetchUser();
//     }, []);

//     const handleLogout = async () => {
//         await appwriteService.logout();
//         alert("logged out!");
//         nav("/login");
//     };

//     const loadSavedIdeas = async (uid) => {
//         try {
//             console.log("✅ UID being queried:", uid);
//             const docs = await appwriteService.getUserIdeas(uid);
//             console.log("📦 Docs from Appwrite:", docs);
//             if (!docs || docs.length === 0) {
//                 console.log("No ideas found for this user.");
//             }
//             setSavedIdeas(docs);
//         } catch (error) {
//             console.error("failed to load ideas", error);
//         }
//     };

//     // console.log("🔑 OPENAI KEY:", import.meta.env.VITE_OPENAI_KEY);

//     const handleGenerate = async () => {
//         setLoading(true);
//         try {
//             const res = await axios.post(
//                 "https://api.groq.com/openai/v1/chat/completions",
//                 {
//                     model: "llama3-70b-8192", // ✅ valid Groq model
//                     messages: [
//                         {
//                             role: "user",
//                             content: `Suggest a ${difficulty} level final year project idea for a ${branch} student. Keep it under 5 lines, no markdown or formatting.`,
//                         },
//                     ],
//                     temperature: 0.7,
//                     max_tokens: 300,
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${
//                             import.meta.env.VITE_GROK_API_KEY
//                         }`, // ✅ use correct env
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );

//             // Groq response
//             let text = res.data.choices[0].message.content.trim();

//             // 🔧 Sanitize: remove markdown formatting
//             text = text
//                 .replace(/\*\*/g, "")
//                 .replace(/#+/g, "")
//                 .replace(/[`_]/g, "");

//             // 🔪 Safety limit: Appwrite max length is 1000
//             if (text.length > 950) {
//                 text = text.substring(0, 947) + "...";
//             }

//             setIdea(text);
//         } catch (error) {
//             console.error("Groq API Error:", error?.response?.data || error);
//             setIdea("⚠️ Something went wrong with Groq. Try again later.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSave = async () => {
//         if (!userId || !idea) return;
//         try {
//             // Save the new idea in Appwrite
//             await appwriteService.saveProjectIdea({
//                 userId,
//                 branch,
//                 difficulty,
//                 ideaText: idea,
//             });
    
//             // Optimistically update the saved ideas in the state
//             const newIdea = {
//                 userId,
//                 branch,
//                 difficulty,
//                 ideaText: idea,
//                 createdAt: new Date().toISOString(),
//                 $id: `temp-${Date.now()}`, // Temporary ID for optimistic UI
//             };
    
//             setSavedIdeas([newIdea, ...savedIdeas]); // Prepend the new idea to the list
    
//             alert("Saved");
    
//             // Optionally, you can re-fetch the saved ideas after saving if you want to confirm the save
//             loadSavedIdeas(userId);
//         } catch (error) {
//             console.error("Save failed!", error);
//         }
//     };
    

//     return (
//         <div className="p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
//           <h1 className="text-4xl font-bold text-center mb-6 text-indigo-600">🎓 College Project Idea Generator</h1>
//           {userName && (
//             <p className="text-sm text-gray-600 text-center mb-4">
//               Logged in as: <span className="font-semibold">{userName}</span>
//             </p>
//           )}
    
//           <div className="text-center mb-6">
//             <button
//               onClick={handleLogout}
//               className="text-red-500 text-sm hover:underline"
//             >
//               Logout
//             </button>
//           </div>
    
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <div className="w-1/2 mr-2">
//                 <label className="block text-lg font-medium mb-1">Branch</label>
//                 <select
//                   value={branch}
//                   onChange={(e) => setBranch(e.target.value)}
//                   className="w-full border p-3 rounded-lg text-gray-700 focus:ring-indigo-500"
//                 >
//                   {branches.map((b) => (
//                     <option key={b} value={b}>{b}</option>
//                   ))}
//                 </select>
//               </div>
    
//               <div className="w-1/2 ml-2">
//                 <label className="block text-lg font-medium mb-1">Difficulty</label>
//                 <select
//                   value={difficulty}
//                   onChange={(e) => setDifficulty(e.target.value)}
//                   className="w-full border p-3 rounded-lg text-gray-700 focus:ring-indigo-500"
//                 >
//                   {difficulties.map((d) => (
//                     <option key={d} value={d}>{d}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
    
//             <div className="text-center">
//               <button
//                 onClick={handleGenerate}
//                 disabled={loading}
//                 className="bg-indigo-600 text-white py-3 px-6 rounded-lg text-lg hover:bg-indigo-700 transition"
//               >
//                 {loading ? "Generating..." : "Generate Idea"}
//               </button>
//             </div>
    
//             {idea && (
//               <div className="bg-gray-100 p-4 rounded-lg mt-6 border border-gray-300">
//                 <p className="text-lg font-medium mb-3">Generated Idea:</p>
//                 <p className="text-sm mb-4 whitespace-pre-line">{idea}</p>
//                 <button
//                   disabled={loading || !idea}
//                   onClick={handleSave}
//                   className="text-white bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600"
//                 >
//                   Save This Idea
//                 </button>
//               </div>
//             )}
    
//             {savedIdeas.length > 0 && (
//               <div className="mt-8">
//                 <h2 className="text-2xl font-semibold mb-4">💾 Your Saved Ideas</h2>
//                 <ul className="space-y-4">
//                   {savedIdeas.map((i) => (
//                     <li
//                       key={i.$id}
//                       className="bg-white p-4 border rounded-lg shadow-md"
//                     >
//                       <div className="space-y-2">
//                         <p><strong>Branch:</strong> {i.branch}</p>
//                         <p><strong>Difficulty:</strong> {i.difficulty}</p>
//                         <p><strong>Idea:</strong> {i.ideaText}</p>
//                         <p className="text-sm text-gray-500">
//                           Created on: {new Date(i.createdAt).toLocaleString()}
//                         </p>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>
//       );
    
// };

// export default ProjectGenerator;



import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ID } from 'appwrite';
import appwriteService from '../services/appwrite';
import { saveAs } from 'file-saver'; // For PDF download
import { FaSpinner, FaCopy, FaFilePdf } from 'react-icons/fa'; // Icons

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
  const [isPremium, setIsPremium] = useState(false); // Placeholder for premium check

  const nav = useNavigate();

  // Fetch user and limits on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await appwriteService.getCurrentUser();
        if (user) {
          setUserId(user.$id);
          setUserName(user.name || user.email);
          // Check premium status (mock for now)
          setIsPremium(user.labels?.includes('premium') || false);
          await loadSavedIdeas(user.$id);
          await checkDailyLimit(user.$id);
        } else {
          nav('/login');
        }
      } catch (err) {
        setError('Failed to load user. Please log in.');
      }
    };
    fetchUser();
  }, []);

  // Check daily limit (3 ideas/day for free users)
  const checkDailyLimit = async (uid) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const limit = await appwriteService.getLimit(uid, today);
      setDailyCount(limit?.count || 0);
    } catch (err) {
      console.error('Limit check failed:', err);
    }
  };

  // Load saved ideas
  const loadSavedIdeas = async (uid) => {
    try {
      const docs = await appwriteService.getUserIdeas(uid);
      setSavedIdeas(docs);
    } catch (err) {
      setError('Failed to load saved ideas.');
    }
  };

  // Generate idea via Appwrite Function (not direct Groq call)
  const handleGenerate = async () => {
    if (!isPremium && dailyCount >= 3) {
      setError('Free limit reached! Get premium for ₹100/month.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const execution = await appwriteService.executeFunction(
        'generateIdea',
        JSON.stringify({ branch, difficulty })
      );
      const ideaText = JSON.parse(execution.responseBody).idea;
      setIdea(ideaText);

      // Update limit for free users
      if (!isPremium) {
        const today = new Date().toISOString().split('T')[0];
        await appwriteService.updateLimit(userId, today, dailyCount + 1);
        setDailyCount(dailyCount + 1);
      }
    } catch (err) {
      setError('Failed to generate idea. Try again.');
      console.error('Generate error:', err);
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
      await appwriteService.saveProjectIdea(newIdea);
      setSavedIdeas([newIdea, ...savedIdeas]); // Optimistic update
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
    }
  };

  // Copy idea to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Idea copied to clipboard!');
  };

  // Export idea as PDF (premium only)
  const handleExportPdf = (ideaText) => {
    if (!isPremium) {
      setError('PDF export is premium-only. Upgrade for ₹100/month!');
      return;
    }
    const blob = new Blob([`Project Idea\n\n${ideaText}`], { type: 'text/plain' });
    saveAs(blob, 'project-idea.txt'); // .txt for now, swap to pdfkit later
  };

  // Logout
  const handleLogout = async () => {
    await appwriteService.logout();
    alert('Logged out!');
    nav('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-700">
            🎓 Project Idea Generator
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Free ideas for college projects. 3/day free or ₹100/month for unlimited!
          </p>
          {userName && (
            <div className="mt-4 flex justify-center items-center gap-4">
              <span className="text-sm text-gray-700">
                Hey, <span className="font-semibold">{userName}</span> {isPremium ? '(Premium)' : ''}
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

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
            {!isPremium && error.includes('premium') && (
              <Link
                to="/premium"
                className="ml-2 text-indigo-600 hover:underline"
              >
                Go Premium →
              </Link>
            )}
          </div>
        )}

        {/* Form */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {branches.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {difficulties.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center mx-auto"
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

        {/* Generated Idea */}
        {idea && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Idea</h2>
            <p className="text-gray-700 mb-4 whitespace-pre-line">{idea}</p>
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
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 flex items-center"
              >
                <FaFilePdf className="mr-2" />
                Export {isPremium ? '' : '(Premium)'}
              </button>
            </div>
          </div>
        )}

        {/* Saved Ideas */}
        {savedIdeas.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">💾 Saved Ideas</h2>
            <ul className="space-y-4">
              {savedIdeas.map((i) => (
                <li key={i.$id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-gray-700"><strong>Branch:</strong> {i.branch}</p>
                      <p className="text-gray-700"><strong>Difficulty:</strong> {i.difficulty}</p>
                      <p className="text-gray-700"><strong>Idea:</strong> {i.ideaText}</p>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(i.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(i.$id)}
                      className="text-red-500 hover:text-red-700 text-sm"
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