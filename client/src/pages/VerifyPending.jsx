import { Account } from "appwrite";

export default function VerifyPending() {
  const resend = async () => {
    await Account.createVerification("https://toolpunk.vercel.app/verify-email");
    alert("✅ Verification email sent again. Check your inbox.");
  };

  return (
    <div className="text-center mt-20">
      <h2 className="text-2xl font-semibold mb-4">Verify Your Email</h2>
      <p className="mb-6">Check your inbox and click the link to verify your email.</p>
      <button
        onClick={resend}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Resend Verification Email
      </button>
    </div>
  );
}
