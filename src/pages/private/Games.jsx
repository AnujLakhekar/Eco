import React, { useState } from "react";
import { useAuth } from "../../providers/AuthPrpvider";
import Loader from "../../components/Loader";
import { motion } from "framer-motion";
import { Play, Star, Lock } from "lucide-react";
import { updateProfileData } from "../../api/firebase";

const Games = () => {
  const { user, setUser, loader } = useAuth();
  const [selectedGame, setSelectedGame] = useState(null);

  if (loader) return <Loader />;

  const { personalInfo, gamification } = user?.get || {};
  const isStudent = personalInfo?.role === "student";

  // Function to calculate ecoRank based on points
  const getEcoRank = (points) => {
    if (points >= 700) return "Eco Master 🌍";
    if (points >= 400) return "Eco Pro 🌱";
    if (points >= 100) return "Eco Learner 🍃";
    return "Newbie 🌸";
  };

  // Dynamic card colors based on level
  const getCardColors = (level) => {
    if (level >= 100) return "from-fuchsia-500 to-violet-600"; // royal futuristic
    if (level >= 50) return "from-emerald-400 to-teal-500"; // fresh & vibrant
    if (level >= 3) return "from-amber-400 to-orange-600"; // warm & energetic
    return "from-sky-400 to-cyan-600"; // cool & modern
  };

  // Each game has different reward points
  const gamesList = [
    {
      name: "Waste Sorting Game",
      description: "Sort recyclable and non-recyclable items correctly.",
      url: "https://www.turtlediary.com/game/recycling-waste.html",
      points: 15,
      level: 0,
    },
    {
      name: "Carbon Footprint Quiz",
      description:
        "Test your knowledge about carbon footprints and sustainability.",
      url: "https://footprintcalculator.org/",
      points: 20,
      level: 3,
    },
    {
      name: "Water Conservation Puzzle",
      description: "Solve puzzles to save water and learn conservation tips.",
      url: "https://kids.nationalgeographic.com/games/action/article/save-the-water",
      points: 25,
      level: 0,
    },
    {
      name: "Energy Saver Challenge",
      description: "Find ways to reduce energy waste in daily activities.",
      url: "https://climatekids.nasa.gov/energy-lab/",
      points: 30,
      level: 0,
    },
  ];

  const handlePlay = async (game) => {
    setSelectedGame(game);

    if (!isStudent) return;

    const currentPoints = user?.get?.gamification?.points || 0;
    const newPoints = currentPoints + game.points;
    const newLevel = Math.floor(newPoints / 50) + 1;
    const newEcoRank = getEcoRank(newPoints);

    const updatedUser = {
      ...user,
      get: {
        ...user.get,
        gamification: {
          ...user.get.gamification,
          points: newPoints,
          level: newLevel,
          ecoRank: newEcoRank,
        },
        miniGames: {
          ...user.get.miniGames,
          played: [...(user.get.miniGames?.played || []), game.name],
        },
      },
    };

    try {
      await updateProfileData(user?.get?.personalInfo?.uid, updatedUser.get);

      setUser(updatedUser);

      console.log("User updated:", updatedUser);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  const cardColors = getCardColors(gamification?.level || 1);

  return (
    <div className="min-h-screen bg-base-200 rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          Mini Games
        </h1>
        <div className="flex items-center gap-3 bg-base-300 px-4 py-2 rounded-lg shadow-md">
          <img
            src={personalInfo?.avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full border"
          />
          <div>
            <p className="font-semibold">{personalInfo?.fullName}</p>
            <p className="text-xs text-gray-500">{personalInfo?.role}</p>
          </div>
        </div>
      </div>

      {gamification.points > 1000 ? (
        <div className="m-5 p-2 bg-sky-300 rounded-2xl text-center">
          From now on you will get badges from poinst as you cross the limit For
          Ranks
        </div>
      ) : (
        ""
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          className={`bg-gradient-to-r ${cardColors} text-white p-4 rounded-xl shadow-lg`}
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-sm">Level</p>
          <h2 className="text-2xl font-bold">{gamification?.level}</h2>
        </motion.div>

        <motion.div
          className={`bg-gradient-to-r ${cardColors} text-white p-4 rounded-xl shadow-lg`}
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-sm">Points</p>
          <h2 className="text-2xl font-bold">{gamification?.points}</h2>
        </motion.div>

        <motion.div
          className={`bg-gradient-to-r ${cardColors} text-white p-4 rounded-xl shadow-lg`}
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-sm">Eco Rank</p>
          <h2 className="text-lg font-semibold">{gamification?.ecoRank}</h2>
        </motion.div>

        <motion.div
          className={`bg-gradient-to-r ${cardColors} text-white p-4 rounded-xl shadow-lg`}
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-sm">Badges</p>
          <h2 className="text-2xl font-bold">
            {gamification?.badges?.length || 0}
          </h2>
        </motion.div>
      </div>

      {/* Games List */}
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        Available Games
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gamesList.map((game, index) => (
          <motion.div
            key={index}
            className="card bg-base-100 shadow-md hover:shadow-xl transition rounded-xl"
            whileHover={{ scale: 1.05 }}
          >
            <div className="card-body">
              <h3 className="card-title text-lg">{game.name}</h3>
              <p className="text-sm text-base-content/70">{game.description}</p>

              <div className="mt-3 flex justify-between items-center">
                <span className="badge badge-success badge-outline">
                  +{game.points} pts
                </span>

                {isStudent ? (
                  <button
                    onClick={() => handlePlay(game)}
                    className="btn btn-sm btn-primary"
                  >
                    Play
                  </button>
                ) : (
                  <button
                    disabled
                    className="btn btn-sm btn-disabled flex items-center gap-1"
                  >
                    <Lock className="w-4 h-4" /> Locked
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Game Player */}
      {selectedGame && isStudent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] md:w-[70%] lg:w-[60%] h-[80%] rounded-xl shadow-lg overflow-hidden relative">
            <div className="flex justify-between items-center p-3 bg-gray-800 text-white">
              <h3 className="font-semibold">{selectedGame.name}</h3>
              <button
                onClick={() => setSelectedGame(null)}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded-md text-sm"
              >
                Close ✖
              </button>
            </div>
            <iframe
              src={selectedGame.url}
              title={selectedGame.name}
              className="w-full h-full border-0"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default Games;
