import React, { useState } from "react";
import appwriteService from "../services/appwrite";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const nav = useNavigate();

    const handleSignup = async (e) =>{
        e.preventDefault()
        try {
            await appwriteService.register(email,password, name)
            await appwriteService.login(email, password)
            alert('Signed up & logged in!')
            nav('/projectgenerator')
        } catch (error) {
            alert('Signup failed!')
            console.error('signup failed!', error)
        }

    }
    return (
        <div className="max-w-md mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-4">🆕 Signup</h1>
            <form onSubmit={handleSignup} className="space-y-4">
                <input
                    type="text"
                    placeholder="Name"
                    className="w-full border p-2 rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
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
                    Sign Up
                </button>
            </form>
            <p className="mt-4 text-sm">
                Already have an account?{" "}
                <a href="/login" className="text-blue-500 underline">
                    Log in here
                </a>
            </p>
        </div>
    );
};

export default SignUp;
