import { useEffect, useState, useRef } from "react";
import { Account, Client } from "appwrite";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);

export default function VerifyEmail() {
  const [status, setStatus] = useState("Verifying email...");
  const navigate = useNavigate();
  const isProcessed = useRef(false); // Prevent duplicate runs

  useEffect(() => {
    if (isProcessed.current) return; // Skip if already processed
    isProcessed.current = true;

    const url = new URL(window.location.href);
    const userId = url.searchParams.get("userId");
    const secret = url.searchParams.get("secret");

    if (!userId || !secret) {
      setStatus("Invalid verification link.");
      toast.error("Invalid verification link.");
      return;
    }

    account
      .updateVerification(userId, secret)
      .then(() => {
        setStatus("Email verified successfully!");
        toast.success("Email verified! Please log in.");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      })
      .catch((error) => {
        console.error("Verification error:", error); // Debug error
        const errorMsg =
          error.message.includes("already verified")
            ? "Email already verified."
            : "Verification failed.";
        setStatus(errorMsg);
        toast.error(errorMsg);
      });

    // No cleanup needed since we navigate away
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50 via-purple-50 to-blue-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <h1 className="text-2xl font-bold text-gray-800">{status}</h1>
      </motion.div>
    </div>
  );
}