import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import createOrderRoute from "./create-order.js";
import verifyPaymentRoute from "./verify-payment.js";

dotenv.config();
const app = express();
app.set("trust proxy", 1);

// Allowed origins for PRODUCTION
const allowedOrigins = [
  "https://toolpunk.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like curl, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// CORS only for API routes
app.use("/api", cors(corsOptions));

app.use(express.json());

// API routes
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
