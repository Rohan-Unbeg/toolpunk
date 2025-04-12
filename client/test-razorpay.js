import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();
console.log('Keys:', process.env.RAZORPAY_KEY_ID);

try {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log('Razorpay instance created');

  const order = await razorpay.orders.create({
    amount: 100 * 100,
    currency: 'INR',
    receipt: `receipt_test_${Date.now()}`,
  });
  console.log('Order:', order);
} catch (err) {
  console.error('Error:', err.message, err.stack);
}