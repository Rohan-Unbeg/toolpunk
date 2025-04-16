import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CheckEmail = () => (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-neutral-50 to-neutral-900 dark:from-neutral-900 dark:to-black">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full space-y-8 text-center"
        >
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Check Your Email
            </h1>
            <p className="text-neutral-600 dark:text-neutral-300">
                We've sent a verification link to your email. Click it to
                activate your account.
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Didn't receive it? Check your spam folder or{" "}
                <Link
                    to="/signup"
                    className="text-primary hover:text-secondary"
                >
                    try again
                </Link>
                .
            </p>
        </motion.div>
    </div>
);

export default CheckEmail;
