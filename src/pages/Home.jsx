import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import appwriteService from '../services/appwrite';

const Home = () => {
  const [userName, setUserName] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await appwriteService.getCurrentUser();
        if (user) {
          setUserName(user.name || user.email);
          setIsPremium(user.labels?.includes('premium') || false);
        }
      } catch (err) {
        console.error('Fetch user error:', err);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-800 tracking-tight">
            Welcome to Toolpunk
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-600">
            Free tools for students: project ideas, railway PNR checks, and more!
          </p>
          {userName ? (
            <div className="mt-6 flex justify-center items-center gap-4">
              <span className="text-sm text-gray-700">
                Hey, <span className="font-semibold">{userName}</span>
                {isPremium ? ' 🌟 (Premium)' : ''}
              </span>
              <button
                onClick={async () => {
                  await appwriteService.logout();
                  nav('/login');
                }}
                className="text-red-500 text-sm hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="mt-6">
              <Link
                to="/login"
                className="text-indigo-600 hover:underline text-sm mr-4"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="text-indigo-600 hover:underline text-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Tools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              🎓 Project Ideas
            </h2>
            <p className="text-gray-600 mb-4">
              Get 3 free project ideas daily or go premium for unlimited.
            </p>
            <Link
              to="/projectgenerator"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Try Now
            </Link>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm opacity-50">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              🚂 PNR Checker
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
          </div>
        </div>

        {/* Premium */}
        {!isPremium && (
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Unlock More with Premium
            </h2>
            <p className="text-gray-600 mb-6">
              Get unlimited project ideas for just ₹100/month.
            </p>
            <Link
              to="/premium"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Go Premium
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;