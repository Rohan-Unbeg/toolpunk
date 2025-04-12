import React, { useContext, useEffect, useState } from "react";
import appwriteService from "../services/appwrite";
import { Navigate } from "react-router-dom";
import Login from "../pages/Login";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
    const { user, isLoading } = useContext(AuthContext);

    if (isLoading) return <p className="p-4">⌛ checking auth...</p>;
    if (!user) return <Navigate to="/login" replace />;
    return <>{children}</>;
};

export default PrivateRoute;
