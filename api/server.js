// /server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://toolpunk.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("CORS origin requested:", origin); // Debug
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// Debug all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} from origin: ${req.headers.origin}`);
  next();
});

// Routes
import createOrderRoute from "./create-order.js";
import verifyPaymentRoute from "./verify-payment.js";

app.use("/api/create-order", createOrderRoute);
app.use("/api/verify-payment", verifyPaymentRoute);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", origin: req.headers.origin });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});