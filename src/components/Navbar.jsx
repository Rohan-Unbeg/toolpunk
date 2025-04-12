import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import appwriteService from '../services/appwrite';

const Navbar = () => {
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
    <nav className="bg-indigo-800 text-white py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Toolpunk
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/projectgenerator"
            className="hover:underline text-sm sm:text-base"
          >
            Project Ideas
          </Link>
          <Link
            to="/premium"
            className="hover:underline text-sm sm:text-base"
          >
            Premium
          </Link>
          {userName ? (
            <>
              <span className="text-sm">
                Hey, {userName}
                {isPremium ? ' 🌟' : ''}
              </span>
              <button
                onClick={async () => {
                  await appwriteService.logout();
                  nav('/login');
                }}
                className="text-sm hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm hover:underline">
                Log In
              </Link>
              <Link to="/register" className="text-sm hover:underline">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;