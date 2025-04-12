import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import createOrder from "./create-order.js";
import verifyPayment from "./verify-payment.js";

dotenv.config();
const app = express();
const PORT = 3000;

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());
// routes
import createOrderRoute from './create-order.js';
import verifyPaymentRoute from './verify-payment.js';

app.use('/api/create-order', createOrderRoute);
app.use('/api/verify-payment', verifyPaymentRoute);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});