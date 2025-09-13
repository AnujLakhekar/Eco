import React from "react";
import { useAuth } from "../../providers/AuthPrpvider";
import Loader from "../../components/Loader";
import { motion } from "framer-motion";
import { Award, Gamepad2, CheckCircle } from "lucide-react";

const Activity = () => {
  const { user, loader } = useAuth();

  if (loader) return <Loader />;

  const activities = user?.get?.miniGames?.played || [];
  const challenges = user?.get?.challenges?.completed || [];

  // Combine activities & challenges into one timeline
  const allActivities = [
    ...activities.map((game, i) => ({
      type: "Game",
      name: game,
      icon: <Gamepad2 className="w-5 h-5 text-primary" />,
      date: new Date().toLocaleDateString(), // replace with real timestamp if stored
      points: "+20 pts",
    })),
    ...challenges.map((task, i) => ({
      type: "Challenge",
      name: task,
      icon: <CheckCircle className="w-5 h-5 text-success" />,
      date: new Date().toLocaleDateString(),
      points: "+10 pts",
    })),
  ];

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Award className="w-7 h-7 text-warning" /> Activity Tracker
      </h1>

      {allActivities.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          No activities yet 🌱 <br /> Start playing games or attempting quizzes!
        </div>
      ) : (
        <div className="space-y-4">
          {allActivities.map((activity, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="card bg-base-100 shadow-md hover:shadow-xl transition rounded-xl"
            >
              <div className="card-body flex flex-col md:flex-row md:items-center md:justify-between">
                {/* Left: icon + name */}
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-base-300 rounded-full">
                    {activity.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{activity.name}</h3>
                    <p className="text-xs text-gray-500">{activity.type}</p>
                  </div>
                </div>

                {/* Right: points + date */}
                <div className="flex items-center gap-4 mt-3 md:mt-0">
                  <span className="badge badge-success">{activity.points}</span>
                  <span className="text-xs text-gray-400">{activity.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activity;
