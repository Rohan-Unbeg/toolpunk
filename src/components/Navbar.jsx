import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, isLoading, logout } = useContext(AuthContext);
  const isPremium = user?.labels?.includes('premium') || false;

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

          {isLoading ? (
            <span className="text-sm">...</span>
          ) : user ? (
            <>
              <span className="text-sm">
                Hey, {user.name || user.email}
                {isPremium ? ' 🌟' : ''}
              </span>
              <button
                onClick={logout}
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
              <Link to="/signup" className="text-sm hover:underline">
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