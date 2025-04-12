import React, { useEffect, useState } from "react";
import appwriteService from "../services/appwrite";
import { Navigate } from "react-router-dom";
import Login from "../pages/Login";

const PrivateRoute = ({ children }) => {
    const [user, setUser] = useState(undefined);
    useEffect(() => {
        const checkUser = async () => {
            try {
                const currentUser = await appwriteService.getCurrentUser();
                console.log("✅ Appwrite user:", currentUser);
                setUser(currentUser);
            } catch (error) {
                setUser(null);
            }
        };

        checkUser();
    }, []);

    if (user === undefined) return <p className="p-4">⌛ checking auth...</p>;
    if (!user) return <Navigate to="/login" replace />;
    return <>{children}</>;
};

export default PrivateRoute;
