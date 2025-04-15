import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CheckEmail = () => (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-900 dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full space-y-8 text-center"
        >
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Check Your Email
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
                We've sent a verification link to your email. Click it to
                activate your account.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Didn't receive it? Check your spam folder or{" "}
                <Link
                    to="/signup"
                    className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                    try again
                </Link>
                .
            </p>
        </motion.div>
    </div>
);

export default CheckEmail;
