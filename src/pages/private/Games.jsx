import React, { useState } from "react";
import { useAuth } from "../../providers/AuthPrpvider";
import Loader from "../../components/Loader";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { updateProfileData } from "../../api/firebase";
import toast, { Toaster } from "react-hot-toast";

const Games = () => {
  const { user, setUser, loader } = useAuth();
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [playStart, setPlayStart] = useState(null);
  const [answers, setAnswers] = useState({});

  if (loader) return <Loader />;

  const { personalInfo, gamification } = user?.get || {};
  const isStudent = personalInfo?.role === "student";

  // Calculate eco rank
  const getEcoRank = (points) => {
    if (points >= 700) return "Eco Master 🌍";
    if (points >= 400) return "Eco Pro 🌱";
    if (points >= 100) return "Eco Learner 🍃";
    return "Newbie 🌸";
  };

  // Dynamic card colors
  const getCardColors = (level) => {
    if (level >= 100) return "from-fuchsia-500 to-violet-600";
    if (level >= 50) return "from-emerald-400 to-teal-500";
    if (level >= 3) return "from-amber-400 to-orange-600";
    return "from-sky-400 to-cyan-600";
  };

  const gamesList = [
    {
      name: "Eco-Cycle Sorting",
      description: "Sort the waste into the right bins.",
      url: "https://eco-cycleco.recycle.game/",
      points: 25,
    },
    {
      name: "Energy City",
      description: "Explore energy-saving strategies in a virtual city.",
      url: "https://phet.colorado.edu/sims/html/energy-forms-and-changes/latest/energy-forms-and-changes_en.html",
      points: 30,
    },
  ];

  const quizzesList = [
    {
      name: "Carbon Footprint Quiz",
      description:
        "Test your knowledge about carbon footprints and sustainability.",
      points: 20,
      questions: [
        {
          q: "Which transport option has the lowest carbon footprint?",
          options: ["Car", "Bicycle", "Bus", "Motorbike"],
          answer: "Bicycle",
        },
        {
          q: "Which energy source is renewable?",
          options: ["Coal", "Oil", "Solar", "Natural Gas"],
          answer: "Solar",
        },
        {
          q: "Which daily activity reduces carbon emissions?",
          options: [
            "Using a reusable water bottle",
            "Buying bottled water",
            "Driving short distances",
            "Using single-use plastic bags",
          ],
          answer: "Using a reusable water bottle",
        },
      ],
    },
    {
      name: "Waste Management Quiz",
      description: "Learn how to sort and reduce waste effectively.",
      points: 20,
      questions: [
        {
          q: "Which of these items can be composted?",
          options: [
            "Plastic bottle",
            "Banana peel",
            "Glass jar",
            "Aluminum can",
          ],
          answer: "Banana peel",
        },
        {
          q: "Which bin should glass bottles go into?",
          options: [
            "Recycle bin",
            "Compost bin",
            "General waste",
            "E-waste bin",
          ],
          answer: "Recycle bin",
        },
        {
          q: "Which practice reduces waste the most?",
          options: ["Recycling", "Reusing", "Composting", "Reducing"],
          answer: "Reducing",
        },
      ],
    },
    {
      name: "Water Conservation Quiz",
      description: "Check how much you know about saving water.",
      points: 20,
      questions: [
        {
          q: "How many liters of water can be saved by turning off the tap while brushing teeth?",
          options: ["1 liter", "5 liters", "10 liters", "15 liters"],
          answer: "10 liters",
        },
        {
          q: "What is the best time to water plants?",
          options: ["Afternoon", "Morning", "Midnight", "Evening"],
          answer: "Morning",
        },
        {
          q: "Which method saves more water for irrigation?",
          options: [
            "Sprinkler irrigation",
            "Drip irrigation",
            "Flood irrigation",
            "Manual watering",
          ],
          answer: "Drip irrigation",
        },
      ],
    },
    {
      name: "Energy Saving Quiz",
      description: "Find out how to reduce electricity usage at home.",
      points: 20,
      questions: [
        {
          q: "Which light bulb is the most energy efficient?",
          options: ["Incandescent", "Halogen", "LED", "CFL"],
          answer: "LED",
        },
        {
          q: "What should you do with appliances when not in use?",
          options: [
            "Keep them on standby",
            "Unplug them",
            "Leave them running",
            "Switch to high power mode",
          ],
          answer: "Unplug them",
        },
        {
          q: "Which renewable source can be used for household electricity?",
          options: ["Coal", "Solar", "Diesel", "Nuclear"],
          answer: "Solar",
        },
      ],
    },
    {
      name: "Biodiversity & Nature Quiz",
      description: "Explore your knowledge about ecosystems and wildlife.",
      points: 20,
      questions: [
        {
          q: "Which of these is a keystone species?",
          options: ["Tiger", "Deer", "Elephant", "Bee"],
          answer: "Bee",
        },
        {
          q: "What is the main cause of deforestation?",
          options: [
            "Planting trees",
            "Urbanization",
            "Forest conservation",
            "Wildlife protection",
          ],
          answer: "Urbanization",
        },
        {
          q: "Which action helps protect biodiversity?",
          options: [
            "Using pesticides freely",
            "Planting native trees",
            "Overfishing",
            "Deforestation",
          ],
          answer: "Planting native trees",
        },
      ],
    },
  ];

  // ---------- Game Logic ----------
  const startGame = (game) => {
    setSelectedGame(game);
    setPlayStart(Date.now());

    toast.loading("⏳ Play for 60s to earn points!", {
      id: "game-timer",
      duration: 60000,
    });
  };

  const closeGame = async () => {
    if (!isStudent || !selectedGame) {
      setSelectedGame(null);
      return;
    }

    const playDuration = (Date.now() - playStart) / 1000;

    if (playDuration >= 60) {
      await awardPoints(selectedGame.name, selectedGame.points);
      toast.dismiss("game-timer");
      toast.success(`🎉 You earned +${selectedGame.points} points!`);
    } else {
      toast.dismiss("game-timer");
      toast.error("❌ Closed too early, no points awarded");
    }

    setSelectedGame(null);
    setPlayStart(null);
  };

  // ---------- Quiz Logic ----------
  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setAnswers({});
  };

  const submitQuiz = async () => {
    if (!isStudent || !selectedQuiz) return;

    let score = 0;
    selectedQuiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) score++;
    });

    if (score === selectedQuiz.questions.length) {
      await awardPoints(selectedQuiz.name, selectedQuiz.points);
      toast.success(`🎉 Perfect! You earned +${selectedQuiz.points} points`);
    } else {
      toast(`You got ${score}/${selectedQuiz.questions.length} correct`, {
        icon: "📝",
      });
    }

    setSelectedQuiz(null);
    setAnswers({});
  };

  // ---------- Award Points Helper ----------
  const awardPoints = async (activityName, pts) => {
    const currentPoints = user?.get?.gamification?.points || 0;
    const newPoints = currentPoints + pts;
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
          played: [...(user.get.miniGames?.played || []), activityName],
        },
      },
    };

    try {
      await updateProfileData(user?.get?.personalInfo?.uid, updatedUser.get);
      setUser(updatedUser);
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("⚠️ Failed to save progress");
    }
  };

  const cardColors = getCardColors(gamification?.level || 1);

  return (
    <div className="min-h-screen bg-base-200 rounded-lg p-6">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mini Games & Quizzes</h1>
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

      {/* Quizzes List */}
      <h2 className="text-2xl font-semibold mb-4">Available Quizzes</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {quizzesList.map((quiz, index) => (
          <motion.div
            key={index}
            className="card bg-base-100 shadow-md hover:shadow-xl transition overflow-hidden rounded-xl"
            whileHover={{ scale: 1.05 }}
          >
            <div className="card-body">
              <h3 className="card-title text-lg">{quiz.name}</h3>
              <p className="text-sm text-base-content/70">{quiz.description}</p>
              <div className="mt-3 flex justify-between items-center">
                <span className="badge badge-info">+{quiz.points} pts</span>
                {isStudent ? (
                  <button
                    onClick={() => startQuiz(quiz)}
                    className="btn btn-sm btn-accent"
                  >
                    Start Quiz
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

      {/* Games List */}
      <h2 className="text-2xl font-semibold mb-4">Available Games</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gamesList.map((game, index) => (
          <motion.div
            key={index}
            className="card bg-base-100 shadow-md hover:shadow-xl transition overflow-hidden rounded-xl"
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
                    onClick={() => startGame(game)}
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

      {/* Quiz Modal */}
      {selectedQuiz && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-base-100 w-[90%] md:w-[70%] lg:w-[60%] rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">{selectedQuiz.name}</h3>
            {selectedQuiz.questions.map((q, idx) => (
              <div key={idx} className="mb-4">
                <p className="font-semibold">{q.q}</p>
                <div className="mt-2 space-y-1">
                  {q.options.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`q-${idx}`}
                        value={opt}
                        checked={answers[idx] === opt}
                        onChange={(e) =>
                          setAnswers((prev) => ({
                            ...prev,
                            [idx]: e.target.value,
                          }))
                        }
                        className="radio radio-sm"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setSelectedQuiz(null)}
                className="btn btn-sm btn-ghost"
              >
                Cancel
              </button>
              <button onClick={submitQuiz} className="btn btn-sm btn-accent">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Player Modal */}
      {selectedGame && isStudent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] md:w-[70%] lg:w-[60%] h-[80%] rounded-xl shadow-lg overflow-hidden relative">
            <div className="flex justify-between items-center p-3 bg-gray-800 text-white">
              <h3 className="font-semibold">{selectedGame.name}</h3>
              <button
                onClick={closeGame}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded-md text-sm"
              >
                ✖
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
