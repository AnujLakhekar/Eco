import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthPrpvider";
import { auth } from "../../api/firebase";
import { signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User as UserIcon } from "lucide-react";
import { roleStyles } from "../../constant";

const ControlPanel = () => {
  const { user, loader } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const role = user.get?.personalInfo?.role?.toLowerCase() || "default";
  const roleTheme = roleStyles[role] || roleStyles.default;

  async function handleLogout() {
    try {
      await signOut(auth);
      window.location.href = "/api/_auth/SignIn";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      {/* Header */}
      <header className="navbar bg-base-100 shadow-md sticky top-0 z-50 px-4">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 text-2xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent select-none"
        >
          Eco
        </motion.div>

        {/* User Menu */}
        {user.auth && (
          <div className="relative flex items-center gap-3">
            {/* Verify button */}
            {!user.get?.personalInfo?.verified && (
              <Link
                to="verification"
                className="btn btn-sm btn-accent text-base-100"
              >
                Verify
              </Link>
            )}

            {/* Avatar button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={`https://ui-avatars.com/api/?name=${user.get?.personalInfo?.fullName}`}
                  alt="avatar"
                />
              </div>
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-12 right-0 mt-3 w-80 card bg-base-100 shadow-lg border border-base-300 z-50"
                >
                  <div className="card-body p-5 space-y-4">
                    {/* Profile Info */}
                    <div
                      className={`flex items-center gap-4 p-3 rounded-xl ${roleTheme.bg}`}
                    >
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ${roleTheme.badge}`}
                      >
                        {user.get?.personalInfo?.fullName?.[0] || <UserIcon />}
                      </div>
                      <div className="overflow-hidden">
                        <h2 className="card-title text-lg truncate">
                          {user.get?.personalInfo?.fullName || "Unknown User"}
                        </h2>
                        <p className="text-sm opacity-70 truncate">
                          {user.get?.personalInfo?.email}
                        </p>
                        <span className={`badge mt-2 ${roleTheme.badge}`}>
                          {user.get?.personalInfo?.role || "Guest"}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <p>
                        <span className="font-medium">College:</span>
                        <br />
                        {user.get?.personalInfo?.schoolOrCollege || "Not set"}
                      </p>
                      <p>
                        <span className="font-medium">Location:</span>
                        <br />
                        {user.get?.personalInfo?.location || "Not provided"}
                      </p>
                      <p>
                        <span className="font-medium">Level:</span>{" "}
                        {user.get?.gamification?.level}
                      </p>
                      <p>
                        <span className="font-medium">Points:</span>{" "}
                        {user.get?.gamification?.points}
                      </p>
                      <p className="col-span-2">
                        <span className="font-medium">Eco Rank:</span>{" "}
                        {user.get?.gamification?.ecoRank}
                      </p>
                    </div>

                    {/* Joined + Edit */}
                    <div className="flex justify-between items-center text-xs">
                      <p className="opacity-70">
                        Joined:{" "}
                        {new Date(
                          user.get?.personalInfo?.joinedAt
                        ).toDateString()}
                      </p>
                      <button
                        onClick={() =>
                          navigate("/app/profile/" + user.get.personalInfo.uid)
                        }
                        className="btn btn-xs btn-primary"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="divider my-2"></div>

                    {/* Logout */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleLogout}
                      className="btn btn-error w-full"
                    >
                      <LogOut size={18} /> Logout
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="p-6">
        {loader ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center h-64"
          >
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </motion.div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default ControlPanel;
