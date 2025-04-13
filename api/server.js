// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";

// dotenv.config();
// const app = express();
// app.set("trust proxy", 1);

// // 1) only for your API routes
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://toolpunk.vercel.app"
// ];

// const corsOptions = {
//   origin: (origin, callback) => {
//     // allow requests with no origin (mobile apps, curl, health checks)
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// };

// // 2) apply CORS to all /api routes (including OPTIONS preflight)
// app.use("/api", cors(corsOptions));

// app.use(express.json());

// // 3) mount your routers
// import createOrderRoute from "./create-order.js";
// import verifyPaymentRoute from "./verify-payment.js";

// app.use("/api/create-order", createOrderRoute);
// app.use("/api/verify-payment", verifyPaymentRoute);

// app.get("/api/health", (req, res) => {
//   res.json({
//     status: "OK",
//     origin: req.headers.origin || "none",
//     proxy: req.ip,
//   });
// });

// const port = 3000;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });



// create-order.js
import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
    const { amount, currency = "INR" } = req.body;

    if (!amount) {
        return res.status(400).json({ error: "Missing amount" });
    }

    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
        amount: amount * 100,
        currency,
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1,
    };

    try {
        const order = await razorpay.orders.create(options);
        console.log("✅ Created Order:", order);
        res.status(200).json({
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        console.error("❌ Razorpay create order error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
