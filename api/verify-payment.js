import crypto from "crypto";
import { Client, Users } from "node-appwrite";

export default async function handler(req, res) {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, userId } = req.body;

        // Check if all required payment details are present
        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !userId) {
            return res.status(400).json({ error: "Missing payment details or user ID" });
        }

        // Verify the payment signature
        const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const generatedSignature = hmac.digest("hex");

        console.log("Generated Signature:", generatedSignature);
        console.log("Received Signature:", razorpay_signature);

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ error: "Invalid signature" });
        }

        // Set up Appwrite client
        const client = new Client();
        client
            .setEndpoint(process.env.APPWRITE_ENDPOINT) // e.g., "https://cloud.appwrite.io/v1"
            .setProject(process.env.APPWRITE_PROJECT_ID) // Your Appwrite project ID
            .setKey(process.env.APPWRITE_API_KEY); // Your Appwrite API key

        const users = new Users(client);

        // Get the user's current labels
        const user = await users.get(userId);
        const currentLabels = user.labels || [];

        // Add 'premium' label if it’s not already there
        if (!currentLabels.includes("premium")) {
            currentLabels.push("premium");
            await users.updateLabels(userId, currentLabels);
            console.log(`Updated user ${userId} with premium label`);
        } else {
            console.log(`User ${userId} already has premium label`);
        }

        // Send success response to frontend
        res.status(200).json({ success: true });
    } catch (err) {
        console.error("Verification error:", err);
        res.status(500).json({ error: "Verification failed" });
    }
}