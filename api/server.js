import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.set("trust proxy", 1);

// 1) only for your API routes
const allowedOrigins = [
  "http://localhost:5173",
  "https://toolpunk.vercel.app"
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (mobile apps, curl, health checks)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// 2) apply CORS to all /api routes (including OPTIONS preflight)
app.use("/api", cors(corsOptions));

app.use(express.json());

// 3) mount your routers
import createOrderRoute from "./create-order.js";
import verifyPaymentRoute from "./verify-payment.js";

app.use("/api/create-order", createOrderRoute);
app.use("/api/verify-payment", verifyPaymentRoute);

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
