import React, { useEffect, useState } from "react";

import { sendEmailVerification } from "firebase/auth";
import { auth, updateProfileData } from "../../api/firebase";
import { useAuth } from "../../providers/AuthPrpvider";

const VerifyUser = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const { user, setUser, loader } = useAuth();

  useEffect(() => {
    setEmail(user.get.personalInfo.email);
  }, [loader]);

  const handleSendVerification = async (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter your email");

    try {
      setLoading(true);
      
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setStep("verify");
      } else {
        alert("You must be logged in to verify your account.");
      }
    } catch (error) {
      console.error("Error sending verification:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        setStep("success");

        const updatedUser = {
          ...user, 
          personalInfo: {
            ...user.personalInfo,
            verified: true, 
          },
        };
        updateProfileData(auth.currentUser.uid, updatedUser);
      } else {
        alert("Email not verified yet. Please check your inbox 📩");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 via-purple-600 to-purple-400 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-purple-800 mb-4">
          {step === "success" ? "✅ Verified!" : "🔐 Verify Your Account "}
        </h1>

        {step === "email" && (
          <form onSubmit={handleSendVerification} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded-lg shadow-md transition"
            >
              {loading ? "Sending..." : "Send Verification Email"}
            </button>
          </form>
        )}

        {step === "verify" && (
          <div className="space-y-4">
            <p className="text-gray-700">
              📩 We’ve sent a verification link to{" "}
              <b>{auth.currentUser?.email}</b> check spam
            </p>
            <button
              onClick={handleCheckVerification}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
            >
              I Verified My Email
            </button>
          </div>
        )}

        {step === "success" && (
          <div>
            <p className="text-lg text-green-700 font-semibold">
              Your account has been successfully verified 🎉
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyUser;
