import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import appwriteService from "./../services/appwrite";

const Premium = () => {
    const [userName, setUserName] = useState("");
    const [error, setError] = useState("");
    const nav = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await appwriteService.getCurrentUser();
                if (user) {
                    setUserName(user.name || user.email);
                } else {
                    setError("Please log in to view premium plans.");
                    nav("/login");
                }
            } catch (err) {
                setError("Failed to load user.");
                console.error("Fetch user error:", err);
            }
        };
        fetchUser();
    }, []);

    // Placeholder buy action
  const handleBuyNow = () => {
    setError('Payment integration coming soon! Contact us to upgrade.');
    // TODO: Add Razorpay or Stripe later
  };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-800 tracking-tight">
                        🚀 Go Premium
                    </h1>
                    <p className="mt-3 text-lg text-gray-600">
                        Unlock unlimited project ideas and exclusive features
                        for just ₹100/month!
                    </p>
                    {userName && (
                        <div className="mt-4 flex justify-center items-center gap-4">
                            <span className="text-sm text-gray-700">
                                Hey,{" "}
                                <span className="font-semibold">
                                    {userName}
                                </span>
                            </span>
                            <button
                                onClick={async () => {
                                    await appwriteService.logout();
                                    nav("/login");
                                }}
                                className="text-red-500 text-sm hover:underline"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">
                        {error}
                    </div>
                )}

                {/* Pricing Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                        Premium Plan
                    </h2>
                    <p className="text-4xl font-bold text-indigo-600 text-center mb-4">
                        ₹100{" "}
                        <span className="text-lg font-normal text-gray-600">
                            /month
                        </span>
                    </p>
                    <ul className="space-y-3 mb-6 text-gray-700">
                        <li className="flex items-center">
                            <svg
                                className="w-5 h-5 text-green-500 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            Unlimited project ideas (no 3/day limit)
                        </li>
                        <li className="flex items-center">
                            <svg
                                className="w-5 h-5 text-green-500 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            Export ideas as PDF
                        </li>
                        <li className="flex items-center">
                            <svg
                                className="w-5 h-5 text-green-500 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            Priority support
                        </li>
                    </ul>
                    <div className="text-center">
                        <button
                            onClick={handleBuyNow}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>

                {/* Back Link */}
                <div className="text-center mt-6">
                    <Link
                        to="/projectgenerator"
                        className="text-indigo-600 hover:underline text-sm"
                    >
                        Back to Project Generator
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Premium;
