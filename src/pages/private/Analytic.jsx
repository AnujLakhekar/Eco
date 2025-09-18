import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { getData, report } from "../../api/firebase";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useAuth } from "../../providers/AuthPrpvider";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Analytic = () => {
  const { id } = useParams();
  const [userFound, setUserFound] = useState(null);
  const {user: authUser} = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getData(id);
        setUserFound(data);
      } catch (e) {
        toast.error(`Error: ${e.message}`);
      }
    };
    fetchUser();
  }, [id]);

  if (!userFound) return <div className="p-6">Loading...</div>;

  // Gamification
  const { level, points, ecoRank } = userFound.gamification || {};
  const nextLevelPoints = (level + 1) * 200;
  const progressPercent = Math.min((points / nextLevelPoints) * 100, 100);

  // MiniGames played stats
  const gameCounts = {};
  userFound.miniGames?.played?.forEach((game) => {
    gameCounts[game] = (gameCounts[game] || 0) + 1;
  });

  const gameData = Object.keys(gameCounts).map((key) => ({
    name: key,
    value: gameCounts[key],
  }));

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* User Overview */}
        <div className="bg-base-100 rounded-xl p-6 shadow">
          <div className="flex items-center gap-4">
            <img
              src={userFound.personalInfo.avatar}
              alt="avatar"
              className="w-20 h-20 rounded-full border-4 border-accent"
            />
            <div>
              <h2 className="text-2xl font-bold">
                {userFound.personalInfo.fullName}
              </h2>
              <p>{userFound.personalInfo.email}</p>
              <p className="badge badge-secondary mt-1">
                {userFound.personalInfo.role}
              </p>
            </div>
          </div>
        </div>

        {/* Gamification */}
        <div className="bg-base-100 rounded-xl p-6 shadow grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-bold mb-2">Level</h3>
            <p className="text-2xl font-bold">{level}</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Points</h3>
            <p className="text-2xl font-bold">{points}</p>
            <div className="w-full bg-gray-300 rounded-full h-3 mt-2">
              <div
                className="bg-accent h-3 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Eco Rank</h3>
            <p className="text-xl">{ecoRank}</p>
          </div>
        </div>

        {/* MiniGames Chart */}
        <div className="bg-base-100 rounded-xl p-6 shadow">
          <h3 className="text-lg font-bold mb-4">MiniGames Played</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={gameData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={120}
                dataKey="value"
              >
                {gameData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Challenges */}
        <div className="bg-base-100 rounded-xl p-6 shadow grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-bold">Active Challenges</h3>
            <p className="text-2xl">
              {userFound.challenges?.active?.length || 0}
            </p>
          </div>
          <div>
            <h3 className="font-bold">Completed Challenges</h3>
            <p className="text-2xl">
              {userFound.challenges?.completed?.length || 0}
            </p>
          </div>
          <div>
            <h3 className="font-bold">Streak Days</h3>
            <p className="text-2xl">{userFound.challenges?.streakDays || 0}</p>
          </div>
        </div>

        <h1>Actions</h1>

        <div>
          {/* Open the modal using document.getElementById('ID').showModal() method */}
          <button
            className="btn bg-error text-error-content"
            onClick={() => document.getElementById("my_modal_5").showModal()}
          >
            Report
          </button>
          <dialog
            id="my_modal_5"
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box">
              <h3 className="font-bold text-lg">Reason</h3>
              <div className="py-4">
                <input className="input" id="report" placeholder="Reason ?" />
              </div>
              <div>
                <button onClick={(e) => {  
                report(authUser, document.getElementById("report").value, userFound);
                   document.getElementById("closeBtn").click();
                }} className="btn">Submit Request</button>
              </div>
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn " id="closeBtn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
};

export default Analytic;
