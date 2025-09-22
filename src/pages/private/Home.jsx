import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthPrpvider";
import { auth } from "../../api/firebase";
import { signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User as UserIcon, Play, ClipboardList, Trophy, Bell, Settings as SettingsIcon } from "lucide-react";
import { roleStyles } from "../../constant";
import ProfileContainer from "../../components/common/profileContainer";

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
      <header className="sticky top-0 z-50 pop-in">
        <div className="mx-auto max-w-7xl px-3 py-2">
          <div className="navbar rounded-2xl border border-base-300/30 bg-base-100/40 backdrop-blur-xl shadow-lg">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-1 pl-4  text-2xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent select-none"
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
                className="btn border border-base-content/10 hover:border-base-content duration-150 ease-in btn-sm btn-base-200 text-base-content text-base-100"
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
              <ProfileContainer user={user} size="sm" />
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-12 right-0 mt-3 w-80 card bg-base-100 border border-base-300/30 z-50"
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 pb-24">
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

      {/* Bottom Glass Navbar (mobile) */}
      <nav className="lg:hidden fixed bottom-3 left-0 right-0 z-40">
        <div className="mx-auto max-w-md px-3">
          <div className="grid grid-cols-5 gap-2 rounded-2xl border border-base-300/30 bg-base-100/60 backdrop-blur-xl shadow-xl">
            <Link to="games" className="flex flex-col items-center py-3 hover:bg-base-100/40 rounded-2xl">
              <Play className="w-5 h-5" />
              <span className="text-[10px]">Games</span>
            </Link>
            <Link to="activity" className="flex flex-col items-center py-3 hover:bg-base-100/40 rounded-2xl">
              <ClipboardList className="w-5 h-5" />
              <span className="text-[10px]">Activity</span>
            </Link>
            <Link to="achievements" className="flex flex-col items-center py-3 hover:bg-base-100/40 rounded-2xl">
              <Trophy className="w-5 h-5" />
              <span className="text-[10px]">Achievements</span>
            </Link>
            <Link to="notifications" className="flex flex-col items-center py-3 hover:bg-base-100/40 rounded-2xl">
              <Bell className="w-5 h-5" />
              <span className="text-[10px]">Alerts</span>
            </Link>
            <Link to={`profile/${user.get?.personalInfo?.uid}`} className="flex flex-col items-center py-3 hover:bg-base-100/40 rounded-2xl">
              <UserIcon className="w-5 h-5" />
              <span className="text-[10px]">Profile</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default ControlPanel;

