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

const allowedOrigins = ["http://localhost:5173", "https://toolpunk.vercel.app"];

const corsOptions = {
    origin: (origin, callback) => {
        // `origin` will be undefined for same‑origin navigations and health checks:
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // if you need cookies/auth headers
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));

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
