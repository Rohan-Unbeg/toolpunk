import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CheckEmail = () => (
  <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50 via-purple-50 to-blue-50">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full space-y-8 text-center"
    >
      <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
        Check Your Email
      </h1>
      <p className="text-gray-600">
        We've sent a verification link to your email. Click it to activate your account.
      </p>
      <p className="text-sm text-gray-500">
        Didn't receive it? Check your spam folder or{" "}
        <Link to="/signup" className="text-indigo-600 hover:text-indigo-500">
          try again
        </Link>.
      </p>
    </motion.div>
  </div>
);

export default CheckEmail;