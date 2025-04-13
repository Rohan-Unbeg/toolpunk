import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Trust proxy (important for Render.com)
app.set("trust proxy", 1);

// Request logging middleware (single instance)
app.use((req, res, next) => {
    console.log("Received Origin:", req.headers.origin);
    console.log(`${req.method} ${req.path}`);
    next();
});

// const allowedOrigins = ["http://localhost:5173", "https://toolpunk.vercel.app"];

app.use(cors());

// Body parser
app.use(express.json());

// Routes
import createOrderRoute from "./create-order.js";
import verifyPaymentRoute from "./verify-payment.js";

// Verify route files exist and export properly
try {
    app.use("/api/create-order", createOrderRoute);
    app.use("/api/verify-payment", verifyPaymentRoute);
} catch (err) {
    console.error("Route loading error:", err);
    process.exit(1);
}



app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        origin: req.headers.origin || "none",
        proxy: req.ip,
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
