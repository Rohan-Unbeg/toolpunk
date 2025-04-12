import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Premium = () => {
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const [isProcessing, setIsProcessing] = useState(false);

    // Razorpay script loader
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (!user) return alert("Please login first!");

        setLoading(true);
        try {
            const userId = user?.$id;
            const amount = 100; // INR ₹100

            // Create Razorpay order from backend
            const res = await fetch("http://localhost:3000/api/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, userId }),
            });

            const data = await res.json();
            console.log("Create Order Response:", data);
            if (!res.ok)
                throw new Error(data.error || "Failed to create order");

            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                throw new Error(
                    "Failed to load Razorpay SDK. Please try again."
                );
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: data.currency,
                name: "Toolpunk",
                description: "Buy Premium Plan",
                order_id: data.order_id, // Ensure this matches the backend response key
                handler: async function (response) {
                    setIsProcessing(true);

                    console.log("Full Razorpay Response:", response);
                    if (
                        !response.razorpay_payment_id ||
                        !response.razorpay_order_id ||
                        !response.razorpay_signature
                    ) {
                        console.error("Missing fields in response:", response);
                        alert("Incomplete payment data. Please try again.");
                        return;
                    }
                    // Call backend to verify payment
                    const verifyRes = await fetch(
                        "http://localhost:3000/api/verify-payment",
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                userId,
                                razorpay_payment_id:
                                    response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        }
                    );

                    const verifyData = await verifyRes.json();
                    if (verifyData.success) {
                        alert("🎉 Premium activated!");
                        // In your payment handler
                        // After payment completes (success or fail)
                        setIsProcessing(false);
                        window.location.reload();
                    } else {
                        alert(
                            "⚠️ Payment verification failed: " +
                                (verifyData.error || "Unknown error")
                        );
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    email: user?.email || "",
                },
                theme: {
                    color: "#3399cc",
                },
            };

            console.log("Razorpay Options:", options);
            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", function (response) {
                console.error("Payment Failed:", response);
                alert(
                    "Payment failed: " +
                        (response.error.description || "Unknown error")
                );
            });
            rzp.open();
        } catch (err) {
            console.error("Payment Error:", err);
            alert(err.message || "Something went wrong with the payment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center mt-6">
            
            <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
                {loading ? "Processing..." : "Buy Premium (₹100)"}
            </button>
        </div>
    );
};

export default Premium;
