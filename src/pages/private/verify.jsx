import React, { useEffect, useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { auth, updateProfileData } from "../../api/firebase";
import { useAuth } from "../../providers/AuthPrpvider";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const VerifyUser = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0); // cooldown timer in seconds
  const { user, loader } = useAuth();

  useEffect(() => {
    if (user?.get?.personalInfo?.email) {
      setEmail(user.get.personalInfo.email);
    }
  }, [loader, user]);

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSendVerification = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    if (!auth.currentUser) return toast.error("You must be logged in.");

    try {
      setLoading(true);
      await sendEmailVerification(auth.currentUser);
      setStep("verify");

      toast.success("📩 Verification email sent!");
      setCooldown(60); // 60 sec cooldown
    } catch (error) {
      console.error("Error sending verification:", error);

      if (error.code === "auth/too-many-requests") {
        toast.error("⚠️ Too many attempts. Please wait a few minutes.");
        setCooldown(180); // longer cooldown
      } else {
        toast.error(error.message || "Failed to send email");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        setStep("success");

        await updateProfileData(auth.currentUser.uid, {
          ...user.get,
          personalInfo: {
            ...user.get.personalInfo,
            verified: true,
          },
        });

        toast.success("✅ Your account is verified!");
      } else {
        toast.error("Email not verified yet. Please check your inbox 📩");
      }
    } catch (error) {
      toast.error(error.message || "Error checking verification");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-6">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body text-center">
          <h1 className="card-title justify-center text-2xl mb-4">
            {step === "success" ? "✅ Verified!" : "🔐 Verify Your Account"}
          </h1>

          {/* Step 1: Enter Email */}
          {step === "email" && (
            <form onSubmit={handleSendVerification} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
              />
              <button
                type="submit"
                disabled={loading || cooldown > 0}
                className="btn btn-primary w-full"
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : cooldown > 0 ? (
                  `Wait ${cooldown}s`
                ) : (
                  "Send Verification Email"
                )}
              </button>
            </form>
          )}

          {/* Step 2: Verification Pending */}
          {step === "verify" && (
            <div className="space-y-4">
              <p className="text-sm opacity-80">
                📩 We’ve sent a verification link to{" "}
                <b>{auth.currentUser?.email}</b>.{" "}
                <Link
                  to="https://mail.google.com/mail/u/0/?tab=rm&ogbl#spam"
                  className="link link-primary"
                  target="_blank"
                >
                  Don’t forget to check spam!
                </Link>
              </p>
              <button
                onClick={handleCheckVerification}
                className="btn btn-success w-full"
              >
                I Verified My Email
              </button>
            </div>
          )}

          {/* Step 3: Success */}
          {step === "success" && (
            <div className="alert alert-success">
              <span>Your account has been successfully verified! 🎉</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyUser;
