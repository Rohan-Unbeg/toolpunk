import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { amount, currency = "INR" } = req.body;

    if (!amount) {
        return res.status(400).json({ error: "Missing amount" });
    }

    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
        amount: amount * 100, // convert to paise
        currency,
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1,
    };

    try {
        const order = await razorpay.orders.create(options);
        console.log("Created Order:", order);
        res.status(200).json({
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        console.error("❌ Razorpay create order error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
