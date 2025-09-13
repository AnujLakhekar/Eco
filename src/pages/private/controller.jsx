import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  ClipboardList,
  Trophy,
  Bell,
  Settings,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../providers/AuthPrpvider";
import { GenLeaderBord } from "../../api/firebase";

const Controllter = () => {
  const { user, loader } = useAuth();
  const [rankers, setRankers] = useState([]);

  useEffect(() => {
    const fetchRankers = async () => {
      const data = await GenLeaderBord();
      setRankers(data);
    };

    fetchRankers();
  }, []);

  const widgets = [
    {
      name: "Games",
      label: "Find and Play Games",
      icon: <Play className="w-6 h-6 text-primary" />,
      color: "bg-primary text-primary-content",
      link: "Games",
    },
    {
      name: "Activity",
      label: "Track your daily works",
      icon: <ClipboardList className="w-6 h-6 text-success" />,
      color: "bg-success text-success-content",
      link: "Activity",
    },
    {
      name: "Achievements",
      label: "See your progress",
      icon: <Trophy className="w-6 h-6 text-warning" />,
      color: "bg-warning text-warning-content",
      link: "Achievements",
    },
    {
      name: "Notifications",
      label: "Stay updated",
      icon: <Bell className="w-6 h-6 text-secondary" />,
      color: "bg-secondary text-secondary-content",
      link: "Notifications",
    },
    {
      name: "Profile",
      label: "Manage your account",
      icon: <User className="w-6 h-6 text-accent" />,
      color: "bg-accent text-accent-content",
      link: `profile/${user.get.personalInfo.uid}`,
    },
    {
      name: "Settings",
      label: "Customize your experience",
      icon: <Settings className="w-6 h-6 text-white" />,
      color: "bg-neutral text-neutral-content",
      link: "Settings",
    },
  ];

  return (
    <div className="min-h-screen bg-base-200 flex flex-col md:flex-row">
      {/* Sidebar */}
      {loader || rankers.length === 0 ? (
        <div className="w-full md:w-64 skeleton  p-6 flex flex-col rounded-xl"></div>
      ) : (
        <aside className="w-full md:w-68 max-h-[550px] overflow-y-scroll bg-base-100 shadow-lg p-6 flex flex-col rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-primary">
            🏆 Leaderboard
          </h2>

          <nav className="grid grid-cols-2 md:grid-cols-1 md:flex md:flex-col gap-4">
            {rankers
              .filter((r) => r.personalInfo.role !== "teacher")
              .map((rank, i) => {
                const medalColors = [
                  "text-yellow-500",
                  "text-gray-400",
                  "text-orange-500",
                ];

                if (i > 4) return;

                return (
                  <motion.div
                    key={rank.id || i}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-base-200 transition"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {/* Avatar */}
                    <div className="avatar hidden md:block">
                      <div className="w-12 h-12  rounded-full ring ring-primary ring-offset-2">
                        <Link to={`profile/${rank.personalInfo.uid}`}>
                          <img
                            src={
                              rank?.personalInfo?.avatar ||
                              `https://ui-avatars.com/api/?name=${
                                rank?.personalInfo?.fullName || "?"
                              }`
                            }
                            alt={rank?.personalInfo?.fullName || "User"}
                          />
                        </Link>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <Link to={`profile/${rank.personalInfo.uid}`}>
                        <p
                          className={`font-semibold text-sm truncate ${
                            medalColors[i] || ""
                          }`}
                        >
                          {i + 1}.{" "}
                          {rank?.personalInfo?.fullName?.split(" ")?.[0] ||
                            "Unknown"}
                        </p>
                      </Link>
                      <div className="flex md:flex-col gap-1">
                        <span className="badge badge-sm badge-accent mt-1">
                          {rank?.gamification?.ecoRank.split(" ")[1] ||
                            "Learner"}
                        </span>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="hidden md:block text-right">
                      <p className="text-lg font-bold text-success">
                        {rank?.gamification?.points || 0}
                      </p>
                      <p className="text-xs text-gray-500">pts</p>
                    </div>
                  </motion.div>
                );
              })}
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-base-content">
            Welcome Back 👋
          </h1>
        </div>

        {/* Widgets Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {widgets.map((w, index) => (
            <motion.div
              key={w.name}
              className={`card shadow-xl cursor-pointer overflow-hidden ${w.color}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="card-body flex flex-row items-center gap-4">
                <div className="p-3 rounded-lg bg-base-100/70">{w.icon}</div>
                <div>
                  <Link className="card-title" to={w.link}>
                    {w.name}
                  </Link>
                  <p className="text-sm opacity-80">{w.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Controllter;
