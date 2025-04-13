import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const allowedOrigins = [
    "http://localhost:5173", // For local dev (Vite default port)
    "https://toolpunk.vercel.app", // Production client
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "OPTIONS"], // Allow necessary methods
        credentials: true,
    })
);

app.use(express.json());
// routes
import createOrderRoute from "./create-order.js";
import verifyPaymentRoute from "./verify-payment.js";

app.use("/api/create-order", createOrderRoute);
app.use("/api/verify-payment", verifyPaymentRoute);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
