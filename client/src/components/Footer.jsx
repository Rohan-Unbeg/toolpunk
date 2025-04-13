// /client/src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-900 text-white py-8 border-t border-white/10">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <h3 className="text-xl font-bold mb-2 tracking-tight">
                        🧰 Toolpunk
                    </h3>
                    <p className="text-sm text-white/80">
                        Smart tools for students and solopreneurs. Powered by
                        AI, built with love.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Legal</h4>
                    <ul className="space-y-1 text-sm text-white/80">
                        <li>
                            <Link to="/terms" className="hover:text-white">
                                Terms & Conditions
                            </Link>
                        </li>
                        <li>
                            <Link to="/privacy" className="hover:text-white">
                                Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <Link to="/refunds" className="hover:text-white">
                                Refund Policy
                            </Link>
                        </li>
                        <li>
                            <Link to="/shipping" className="hover:text-white">
                                Shipping Policy
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">More</h4>
                    <ul className="space-y-1 text-sm text-white/80">
                        <li>
                            <Link
                                to="/projectgenerator"
                                className="hover:text-white"
                            >
                                Project Generator
                            </Link>
                        </li>
                        <li>
                            <Link to="/premium" className="hover:text-white">
                                Go Premium
                            </Link>
                        </li>
                        <li>
                            <a
                                href="mailto:rohanunbeg0918@gmail.com"
                                className="hover:text-white"
                            >
                                Contact Support
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mt-8 text-center text-xs text-white/60">
                © {new Date().getFullYear()} Toolpunk — Built in 🇮🇳 with 💻 + ☕
            </div>
        </footer>
    );
};

export default Footer;
