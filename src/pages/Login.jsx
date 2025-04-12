import React, { useState } from "react";
import appwriteService from "../services/appwrite";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const nav = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await appwriteService.login(email, password);
            alert("logged in!");
            nav("/projectgenerator");
        } catch (error) {
            alert("login failed" + error.message);
            console.error(error);
        }
    };

    return (
        <div className="max-w-md mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-4">🔐 Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="w-full bg-black text-white py-2 rounded">
                    Login
                </button>
            </form>
            <p className="mt-4 text-sm">
                No account?{" "}
                <a href="/signup" className="text-blue-500 underline">
                    Sign up here
                </a>
            </p>
        </div>
    );
};

export default Login;
