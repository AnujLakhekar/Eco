import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-8">
      {/* Header Badge */}
      <div className="mb-4">
        <span className="badge badge-lg badge-success badge-outline">
          🌱 Smart India Hackathon 2025
        </span>
      </div>

      {/* Title */}
      <h1 className="text-5xl font-extrabold text-base-content mb-2">
        <span className="text-success">Eco</span>Quest
      </h1>
      <p className="text-lg text-base-content/70 mb-6 max-w-xl text-center">
        Transforming environmental education into an adventure. Engaging
        students through interactive challenges, games, and real-world impact.
      </p>

      {/* Actions + Card */}
      <div className="md:flex justify-between md:w-[660px] items-center gap-10">
        {/* Buttons */}
        <div className="flex md:flex-col gap-4 mb-10 md:mb-0">
          <button
            onClick={() => navigate("api/_auth/SignIn?redirect=explore")}
            className="btn btn-success btn-lg"
          >
            Explore the Idea
          </button>
          <button
            onClick={() => navigate("api/_auth/?redirect=mission")}
            className="btn btn-outline btn-success btn-lg"
          >
            Join the Mission
          </button>
        </div>

        {/* Card Mockup */}
        <div className="p-1.5 rounded-2xl bg-gradient-to-r from-primary via-info to-success shadow-xl">
          <div className="card w-80 bg-base-100 shadow-lg rounded-2xl">
            <div className="card-body">
              <h2 className="card-title text-lg font-semibold">EcoQuest</h2>
              <div className="space-y-3">
                <div className="alert alert-success">
                  <div>
                    <p className="font-medium">🌳 Plant a Tree</p>
                    <p className="text-sm opacity-80">
                      Complete to earn 50 points
                    </p>
                  </div>
                </div>
                <div className="alert alert-info">
                  <div>
                    <p className="font-medium">💧 Water Conservation</p>
                    <p className="text-sm opacity-80">Learn & Act Challenge</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-r from-success to-info text-white shadow-md">
                  <p className="font-bold">🏆 Level 5 Eco Warrior</p>
                  <p className="text-sm">2,350 points earned</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
