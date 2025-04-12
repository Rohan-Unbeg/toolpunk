import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaSpinner } from "react-icons/fa";

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) setShowSpinner(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (isLoading && showSpinner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="animate-spin text-indigo-600 text-4xl mx-auto mb-3" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;