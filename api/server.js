import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Client, Users } from "node-appwrite";

dotenv.config();
const app = express();
app.set("trust proxy", 1);

app.use(
    cors({
        origin: "https://toolpunk.vercel.app",
        methods: ["GET", "POST", "OPTIONS"],
        credentials: true,
    })
);

app.options(/(.*)/, cors()); // allow pre-flight for all routes

app.use(express.json());

// const corsOptions = { origin: ["https://toolpunk.vercel.app", "http://localhost:5173"] };
// const allowedOrigins = ["https://toolpunk.vercel.app"];
// const corsOptions = { origin: "*" };

// app.use("/api", cors(corsOptions));

// Debug log middleware
app.use((req, res, next) => {
    console.log(`📢 Incoming ${req.method} request to ${req.path}`);
    next();
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
                    ? "https://toolpunk-api.onrender.com"
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

// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { Client, Users } from "node-appwrite";

// dotenv.config();
// const app = express();
// app.set("trust proxy", 1);

// app.use(express.json());

// const corsOptions = { origin: "*" };

// // CORS only for API routes
// app.use("/api", cors(corsOptions));

// // ✅ Debug log middleware
// app.use((req, res, next) => {
//     console.log(`📢 Incoming ${req.method} request to ${req.path}`);
//     next();
// });

// // ✅ API routes

// app.post("/api/instamojo-initiate", async (req, res) => {
//     const { userId, name, email, phone } = req.body;

//     try {
//         const payload = {
//             purpose: "Toolpunk Premium",
//             amount: "9",
//             buyer_name: name || "Toolpunk User",
//             email: email || "user@example.com",
//             phone: phone || "", // Optional, Instamojo doesn't require it
//             redirect_url: `http://localhost:5173/api/verify-payment?userId=${userId}`,
//             send_email: true,
//             allow_repeated_payments: false,
//         };

//         const response = await fetch(
//             "https://www.instamojo.com/api/1.1/payment-requests/",
//             {
//                 method: "POST",
//                 headers: {
//                     "X-Api-Key": process.env.INSTAMOJO_API_KEY,
//                     "X-Auth-Token": process.env.INSTAMOJO_AUTH_TOKEN,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(payload),
//             }
//         );

//         const data = await response.json();
//         console.log("📦 Instamojo response:", data);

//         res.status(200).json(data);
//     } catch (err) {
//         res.status(500).json({ error: "Instamojo error: " + err.message });
//     }
// });

// // Handle GET request from Instamojo after payment success
// app.get("/api/verify-payment", async (req, res) => {
//     try {
//         // Extract payment details from query params
//         const { payment_id, payment_status, payment_request_id, userId } =
//             req.query;

//         if (!payment_id || !payment_status || !payment_request_id) {
//             return res.status(400).json({ error: "Missing payment details" });
//         }

//         // You can now handle POST request for verification internally
//         const paymentVerification = await fetch(
//             `https://www.instamojo.com/api/1.1/payment-requests/${payment_request_id}/`,

//             {
//                 method: "GET",
//                 headers: {
//                     "X-Api-Key": process.env.INSTAMOJO_API_KEY,
//                     "X-Auth-Token": process.env.INSTAMOJO_AUTH_TOKEN,
//                     "Content-Type": "application/json",
//                 },
//             }
//         );

//         const paymentDetails = await paymentVerification.json();

//         if (
//             paymentDetails.success === false ||
//             paymentDetails.payment_request.status !== "Completed"
//         ) {
//             return res
//                 .status(400)
//                 .json({ error: "Payment verification failed", paymentDetails });
//         }

//         // ✅ Update Appwrite user label to "premium"
//         const client = new Client()
//             .setEndpoint(process.env.APPWRITE_ENDPOINT)
//             .setProject(process.env.APPWRITE_PROJECT_ID)
//             .setKey(process.env.APPWRITE_API_KEY);

//         const users = new Users(client);
//         const updatedUser = await users.updateLabels(userId, ["premium"]);

//         console.log("✅ User updated to premium:", updatedUser);

//         res.status(200).json({
//             success: "Payment verified and user upgraded",
//             paymentDetails,
//             user: updatedUser,
//         });
//     } catch (err) {
//         console.error("Verification error:", err);
//         res.status(500).json({ error: "Verification failed" });
//     }
// });

// // ✅ Health check route
// app.get("/api/health", (req, res) => {
//     res.json({
//         status: "OK",
//         origin: req.headers.origin || "none",
//         proxy: req.ip,
//     });
// });

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(`🚀 Server running on port ${port}`);
// });
