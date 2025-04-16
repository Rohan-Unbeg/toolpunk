import { Account } from "appwrite";

export default function VerifyPending() {
    const resend = async () => {
        await Account.createVerification(
            "https://toolpunk.vercel.app/verify-email"
        );
        alert("✅ Verification email sent again. Check your inbox.");
    };

    return (
        <div className="text-center mt-20 bg-light dark:bg-dark text-dark dark:text-light">
            <h2 className="text-2xl font-semibold mb-4">Verify Your Email</h2>
            <p className="mb-6">
                Check your inbox and click the link to verify your email.
            </p>
            <button
                onClick={resend}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition"
            >
                Resend Verification Email
            </button>
        </div>
    );
}
