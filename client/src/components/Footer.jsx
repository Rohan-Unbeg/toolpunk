import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-[var(--color-primary)] text-white py-8 border-t border-[var(--color-primary)]/20">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <h3 className="text-xl font-bold mb-2 tracking-tight">
                        🧰 Toolpunk
                    </h3>
                    <p className="text-sm text-neutral-200 dark:text-neutral-300">
                        Smart tools for students and solopreneurs. Powered by
                        AI, built with love.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold mb-2 text-[var(--accent-600)]">Legal</h4>
                    <ul className="space-y-1 text-sm text-neutral-200 dark:text-neutral-300">
                        <li>
                            <Link
                                to="/terms"
                                className="hover:text-[var(--accent-600)]"
                            >
                                Terms & Conditions
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/privacy"
                                className="hover:text-[var(--accent-600)]"
                            >
                                Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/refunds"
                                className="hover:text-[var(--accent-600)]"
                            >
                                Refund Policy
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/shipping"
                                className="hover:text-[var(--accent-600)]"
                            >
                                Shipping Policy
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-2 text-[var(--accent-600)]">More</h4>
                    <ul className="space-y-1 text-sm text-neutral-200 dark:text-neutral-300">
                        <li>
                            <Link
                                to="/projectgenerator"
                                className="hover:text-[var(--accent-600)]"
                            >
                                Project Generator
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/premium"
                                className="hover:text-[var(--accent-600)]"
                            >
                                Go Premium
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contact"
                                className="hover:text-[var(--accent-600)]"
                            >
                                Contact
                            </Link>
                        </li>
                        <li>
                            <a
                                href="mailto:rohanunbeg0918@gmail.com"
                                className="hover:text-[var(--accent-600)]"
                            >
                                Contact Support
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mt-8 text-center text-sm text-neutral-200 dark:text-neutral-300">
                © {new Date().getFullYear()} Toolpunk — Built in 🇮🇳 with 💻 + ☕
            </div>
        </footer>
    );
};

export default Footer;