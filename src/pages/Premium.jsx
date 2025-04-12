import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Premium = () => {
  const { user, isLoading } = useContext(AuthContext);
  const nav = useNavigate();

  const userName = user ? user.name || user.email : '';
  const isPremium = user?.labels?.includes('premium') || false;

  const handleBuyNow = () => {
    if (isPremium) {
      alert('You’re already premium! No need to buy again.');
      return;
    }
    alert('Payment integration coming soon! Contact us to upgrade.');
  };

  const startPayment = async () => {
    const res = await axios.post("https://your-server/create-order"); // or direct call
    const { orderId } = res.data;
  
    const options = {
      key: "rzp_test_gyTmXJ91YxGDNq", // replace with env
      amount: 10000, // in paise = ₹100
      currency: "INR",
      name: "Toolpunk Premium",
      order_id: orderId,
      handler: async (response) => {
        // ✅ Hit Appwrite function to add 'premium' label
        await axios.post("/api/verify-payment", { response });
      },
      prefill: {
        email: user.email,
        name: user.name,
      },
      theme: { color: "#6366F1" },
    };
  
    const razor = new window.Razorpay(options);
    razor.open();
  };
  

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-100 flex items-center justify-center">
        <div className="text-indigo-600 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-800 tracking-tight">
            🚀 Go Premium
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Unlock unlimited project ideas and exclusive features for just ₹100/month!
          </p>
          {userName && (
            <div className="mt-4 flex justify-center items-center gap-4">
              <span className="text-sm text-gray-700">
                Hey, <span className="font-semibold">{userName}</span>
                {isPremium ? ' 🌟 (Premium)' : ''}
              </span>
              <button
                onClick={async () => {
                  await appwriteService.logout();
                  nav('/login', { replace: true });
                }}
                className="text-red-500 text-sm hover:underline"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        {isPremium && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg text-center">
            You’re already premium! Enjoy unlimited ideas.
          </div>
        )}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Premium Plan
          </h2>
          <p className="text-4xl font-bold text-indigo-600 text-center mb-4">
            ₹100 <span className="text-lg font-normal text-gray-600">/month</span>
          </p>
          <ul className="space-y-3 mb-6 text-gray-700">
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Unlimited project ideas (no 3/day limit)
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Export ideas as PDF
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Priority support
            </li>
          </ul>
          <div className="text-center">
            <button
              onClick={startPayment}
              disabled={isPremium}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                isPremium
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isPremium ? 'Already Premium' : 'Buy Premium - ₹100/month'}
            </button>
          </div>
        </div>
        <div className="text-center mt-6">
          <Link
            to="/projectgenerator"
            className="text-indigo-600 hover:underline text-sm"
          >
            Back to Project Generator
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Premium;