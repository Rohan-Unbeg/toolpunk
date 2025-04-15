import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import { Client, Users } from "node-appwrite";
import { Client, Account, Users } from "node-appwrite";

dotenv.config();

const appwriteClient = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const users = new Users(appwriteClient); // Initialize Users service


console.log('Appwrite Config:', {
    endpoint: process.env.APPWRITE_ENDPOINT,
    projectId: process.env.APPWRITE_PROJECT_ID,
    apiKey: process.env.APPWRITE_API_KEY ? '[REDACTED]' : 'MISSING'
});

const account = new Account(appwriteClient);
const app = express();
app.set("trust proxy", 1);

// Middleware
app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:5173", "https://yourproductiondomain.com"],
        credentials: true,
    })
);

// app.use(
//     cors({
//         origin: "https://toolpunk.vercel.app",
//         methods: ["GET", "POST", "OPTIONS"],
//         credentials: true,
//     })
// );

app.options(/(.*)/, cors()); // allow pre-flight for all routes


app.use((req, res, next) => {
    console.log(`Incoming ${req.method} request to ${req.path}`);
    next();
});

app.post('/api/force-avatar-update', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId || typeof userId !== 'string' || userId.trim() === '') {
            return res.status(400).json({ error: 'Valid User ID required' });
        }

        const user = await users.get(userId); // Use Users service
        const name = encodeURIComponent(user.name || 'User');
        const colors = ['F94144', 'F3722C', 'F8961E', 'F9C74F', '90BE6D', '43AA8B', '577590'];
        const color = colors[parseInt(userId.substr(0, 8), 16) % colors.length];
        const avatarUrl = `https://ui-avatars.com/api/?name=${name}&background=${color}&color=fff&length=2`;

        await users.updatePrefs(userId, { picture: avatarUrl });
        res.json({ success: true, picture: avatarUrl });
    } catch (error) {
        console.error('Avatar update error:', error);
        res.status(500).json({ error: error.message });
    }
});
// Instamojo payment initiation
app.post("/api/instamojo-initiate", async (req, res) => {
    const { userId, name, email, phone } = req.body;

    try {
        const payload = {
            purpose: "Toolpunk Premium",
            amount: "9",
            buyer_name: name || "Toolpunk User",
            email: email || "user@example.com",
            phone: phone || "",
            redirect_url: `${
                process.env.NODE_ENV === "production"
                    ? "https://toolpunk.onrender.com"
                    : "http://localhost:3000"
            }/api/verify-payment?userId=${userId}`,
            send_email: true,
            allow_repeated_payments: false,
        };

        const response = await fetch(
            "https://www.instamojo.com/api/1.1/payment-requests/",
            {
                method: "POST",
                headers: {
                    "X-Api-Key": process.env.INSTAMOJO_API_KEY,
                    "X-Auth-Token": process.env.INSTAMOJO_AUTH_TOKEN,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            }
        );

        const data = await response.json();
        console.log("📦 Instamojo response:", data);

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Instamojo initiation failed");
        }

        res.status(200).json(data);
    } catch (err) {
        console.error("Instamojo error:", err);
        res.status(500).json({ error: "Instamojo error: " + err.message });
    }
});

// Verify payment and redirect
app.get("/api/verify-payment", async (req, res) => {
    try {
        const { payment_id, payment_status, payment_request_id, userId } =
            req.query;

        if (!payment_id || !payment_status || !payment_request_id || !userId) {
            return res.redirect(
                "https://toolpunk.vercel.app/premium?payment=failed"
            );
        }

        const paymentVerification = await fetch(
            `https://www.instamojo.com/api/1.1/payment-requests/${payment_request_id}/`,
            {
                method: "GET",
                headers: {
                    "X-Api-Key": process.env.INSTAMOJO_API_KEY,
                    "X-Auth-Token": process.env.INSTAMOJO_AUTH_TOKEN,
                    "Content-Type": "application/json",
                },
            }
        );

        const paymentDetails = await paymentVerification.json();

        if (
            !paymentDetails.success ||
            paymentDetails.payment_request.status !== "Completed"
        ) {
            return res.redirect(
                "https://toolpunk.vercel.app/premium?payment=failed"
            );
        }

        // Update Appwrite user label
        const client = new Client()
            .setEndpoint(process.env.APPWRITE_ENDPOINT)
            .setProject(process.env.APPWRITE_PROJECT_ID)
            .setKey(process.env.APPWRITE_API_KEY);

        const users = new Users(client);
        await users.updateLabels(userId, ["premium"]);

        console.log("✅ User updated to premium:", userId);

        res.redirect("https://toolpunk.vercel.app/premium?payment=success");
    } catch (err) {
        console.error("Verification error:", err);
        res.redirect("https://toolpunk.vercel.app/premium?payment=failed");
    }
});



// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        origin: req.headers.origin || "none",
        proxy: req.ip,
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
