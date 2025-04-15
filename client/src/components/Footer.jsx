// /client/src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-indigo-900 dark:bg-gray-800 text-white dark:text-gray-100 py-8 border-t border-blue-300 dark:border-blue-500">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <h3 className="text-xl font-bold mb-2 tracking-tight">
                        🧰 Toolpunk
                    </h3>
                    <p className="text-sm text-gray-300 dark:text-gray-400">
                        Smart tools for students and solopreneurs. Powered by
                        AI, built with love.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Legal</h4>
                    <ul className="space-y-1 text-sm text-gray-300 dark:text-gray-400">
                        <li>
                            <Link
                                to="/terms"
                                className="hover:text-gray-100 dark:hover:text-gray-200"
                            >
                                Terms & Conditions
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/privacy"
                                className="hover:text-gray-100 dark:hover:text-gray-200"
                            >
                                Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/refunds"
                                className="hover:text-gray-100 dark:hover:text-gray-200"
                            >
                                Refund Policy
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/shipping"
                                className="hover:text-gray-100 dark:hover:text-gray-200"
                            >
                                Shipping Policy
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">More</h4>
                    <ul className="space-y-1 text-sm text-gray-300 dark:text-gray-400">
                        <li>
                            <Link
                                to="/projectgenerator"
                                className="hover:text-gray-100 dark:hover:text-gray-200"
                            >
                                Project Generator
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/premium"
                                className="hover:text-gray-100 dark:hover:text-gray-200"
                            >
                                Go Premium
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contact"
                                className="hover:text-gray-100 dark:hover:text-gray-200"
                            >
                                Contact
                            </Link>
                        </li>
                        <li>
                            <a
                                href="mailto:rohanunbeg0918@gmail.com"
                                className="hover:text-gray-100 dark:hover:text-gray-200"
                            >
                                Contact Support
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
                © {new Date().getFullYear()} Toolpunk — Built in 🇮🇳 with 💻 + ☕
            </div>
        </footer>
    );
};

export default Footer;
