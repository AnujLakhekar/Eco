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
      <header className="navbar bg-base-100 shadow-md sticky top-0 z-50">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 text-2xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent select-none"
        >
          Eco<span className="text-primary">Quest</span>
        </motion.div>

        {/* User Menu */}
        {user.auth && (
          <div className="relative">
            {user.get?.personalInfo?.verified ? (
              ""
            ) : (
              <motion.button
                className="relative right-6 bg-accent text-base-100 rounded-lg cursor-pointer  p-2 "
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
               <Link to="verification" >Verify</Link>
              </motion.button>
            )}

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className={
                "btn btn-ghost btn-circle avatar " + `${roleTheme.border}`
              }
            >
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 ">
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
                  className="absolute right-0 mt-5 w-80 card bg-base-100 shadow-xl border border-base-300 z-50 "
                >
                  <div className="card-body p-5">
                    {/* Profile Info */}
                    <div
                      className={
                        "flex items-center gap-4 mb-4 p-3 rounded-2xl " +
                        `${roleTheme.bg}`
                      }
                    >
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ${roleTheme.badge}`}
                      >
                        {user.get?.personalInfo?.fullName?.[0] || <UserIcon />}
                      </div>
                      <div>
                        <h2 className="card-title text-lg">
                          {user.get?.personalInfo?.fullName || "Unknown User"}
                        </h2>
                        <p className="text-sm opacity-70 truncate">
                          {user.get?.personalInfo?.email}
                        </p>
                        <div className={`badge mt-2 ${roleTheme.badge}`}>
                          {user.get?.personalInfo?.role || "Guest"}
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">School/College:</span>{" "}
                        {user.get?.personalInfo?.schoolOrCollege || "Not set"}
                      </p>
                      <p>
                        <span className="font-medium">Location:</span>{" "}
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
                      <p>
                        <span className="font-medium">Eco Rank:</span>{" "}
                        {user.get?.gamification?.ecoRank}
                      </p>
                      <div className="mt-3 flex justify-between items-center">
                        <p className="text-xs">
                          <span className="text-primary font-bold">
                            Joined:{" "}
                          </span>
                          {new Date(
                            user.get?.personalInfo?.joinedAt
                          ).toDateString()}
                        </p>
                        <button
                          onClick={() =>
                            navigate(
                              "/app/profile/" + user.get.personalInfo.uid
                            )
                          }
                          className="btn btn-sm btn-primary"
                        >
                          Edit
                        </button>
                      </div>
                    </div>

                    <div className="divider"></div>

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
