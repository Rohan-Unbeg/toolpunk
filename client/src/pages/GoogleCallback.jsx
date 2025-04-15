import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import appwriteService from "../services/appwrite";
import { FaSpinner } from "react-icons/fa";

export default function GoogleCallback() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleAuth = async () => {
            try {
                // Wait for session to stabilize
                await new Promise((resolve) => setTimeout(resolve, 1500));

                let user = await appwriteService.getCurrentUser();
                if (!user) throw new Error("No user session");

                // Force update picture with retry logic
                let attempts = 0;
                while (
                    attempts < 3 &&
                    (!user.prefs?.picture ||
                        !user.prefs.picture.startsWith("http"))
                ) {
                    user = await appwriteService.updatePrefsIfGoogle(user);
                    attempts++;
                    if (attempts < 3)
                        await new Promise((resolve) =>
                            setTimeout(resolve, 1000)
                        );
                }

                navigate("/projectgenerator");
            } catch (error) {
                console.error("Callback error:", error);
                navigate("/login", { state: { error: "Google login failed" } });
            }
        };

        handleAuth();
    }, [navigate]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="text-red-500 mb-4">Error: {error}</div>
                <p className="text-gray-800 dark:text-gray-200">
                    Redirecting to login...
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <FaSpinner className="animate-spin text-indigo-600 text-4xl mb-4" />
            <p className="text-gray-800 dark:text-gray-200">
                Completing Google authentication...
            </p>
        </div>
    );
}
