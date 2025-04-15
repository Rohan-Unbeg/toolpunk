import React from "react";
import { Mail, Send, MapPin } from "lucide-react";

const Contact = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6 flex items-center justify-center">
            <div className="max-w-2xl w-full bg-gray-50 dark:bg-gray-800 shadow-xl rounded-2xl p-8 space-y-6">
                <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">
                    Contact Us
                </h2>

                <div className="space-y-4 text-center">
                    <p className="text-lg">
                        Got questions, ideas, or just want to say hi? We’d love
                        to hear from you.
                    </p>

                    <div className="flex flex-col sm:flex-row sm:justify-around gap-4 mt-6 text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                            <Mail className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                            <a
                                href="mailto:rohanunbeg0918@gmail.com"
                                className="hover:underline"
                            >
                                rohanunbeg0918@gmail.com
                            </a>
                        </div>

                        {/* <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              <a href="https://t.me/toolpunk" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Telegram: @toolpunk
              </a>
            </div> */}

                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                            <span>Ahmednagar, India</span>
                        </div>
                    </div>
                </div>

                <div className="text-sm text-center text-gray-500 dark:text-gray-400 pt-4">
                    &copy; {new Date().getFullYear()} Toolpunk. All rights
                    reserved.
                </div>
            </div>
        </div>
    );
};

export default Contact;
