import React from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  signUpWithCredentials,
  signInWithCredentials,
} from "../../api/firebase";

const profileNames = [
  "Garfield",
  "Tinkerbell",
  "Loki",
  "Cleo",
  "Angel",
  "Leo",
  "Luna",
];
const profileCollections = [
  "notionists-neutral",
  "adventurer-neutral",
  "fun-emoji",
];

export default function AuthLayout({ type }) {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  const navigate = useNavigate();

  const UserStructure = {
    personalInfo: {
      fullName: "",
      email: "",
      avatar: "",
      verified: false,
      role: "student",
      schoolOrCollege: "",
      location: "",
      joinedAt: new Date().toISOString(),
      uid: "",
    },
    gamification: { level: 1, points: 0, badges: [], ecoRank: "Newbie" },
    challenges: { active: [], completed: [], streakDays: 0 },
    miniGames: { played: [], highScores: {} },
    settings: { language: "en", notifications: true, theme: "light" },
  };

  async function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      if (type === "SignUp") {
        UserStructure.personalInfo.fullName = data.name;
        UserStructure.personalInfo.role = data.role;
        UserStructure.personalInfo.avatar = `https://ui-avatars.com/api/?name=${data.name}`;

        await signUpWithCredentials(data.email, data.password, UserStructure);
        toast.success("Account created successfully!");
      } else {
        await signInWithCredentials(data.email, data.password);
        toast.success("Signed in successfully!");
      }

      navigate(redirect ? `/app/?method${redirect}` : "/app");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-500 via-green-400 to-blue-500 p-8">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {type === "SignIn"
            ? "Sign In to EcoQuest"
            : "Create Your EcoQuest Account"}
        </h1>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {type === "SignUp" && (
            <>
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                required
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <div className="relative w-full">
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-green-600 font-medium">
                  Select Role
                </label>
                <select
                  name="role"
                  className="w-full appearance-none p-3 rounded-xl border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-300 bg-white text-gray-700 font-medium"
                  defaultValue="student"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                  ▼
                </span>
              </div>
            </>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 via-green-400 to-blue-500 text-white py-3 rounded-lg font-bold hover:from-green-600 hover:via-green-500 hover:to-blue-600 transition"
          >
            {type === "SignIn" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          {type === "SignIn" ? (
            <Link
              to={`/api/_auth/SignUp${redirect ? `?redirect=${redirect}` : ""}`}
            >
              Don't have an account? Sign Up
            </Link>
          ) : (
            <Link
              to={`/api/_auth/SignIn${redirect ? `?redirect=${redirect}` : ""}`}
            >
              Already have an account? Sign In
            </Link>
          )}
        </p>
      </div>
    </div>
  );
}
