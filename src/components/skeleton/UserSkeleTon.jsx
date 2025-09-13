// components/skeleton/UserSkeleton.jsx
import React from "react";

const UserSkeleton = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base px-4 py-6">
      <div className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl rounded-2xl shadow-lg p-6 bg-[#222831] animate-pulse">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
          {/* Avatar */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-700"></div>

          {/* User Info */}
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div className="h-6 bg-gray-600 rounded w-40 mx-auto sm:mx-0"></div> {/* Full Name */}
            <div className="h-4 bg-gray-600 rounded w-32 mx-auto sm:mx-0"></div> {/* Email */}
            <div className="h-5 bg-gray-600 rounded w-20 mx-auto sm:mx-0"></div> {/* Role Badge */}
          </div>
        </div>

        <hr className="border-gray-700 my-4" />

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div> {/* School/College */}
          <div className="h-4 bg-gray-700 rounded w-2/3"></div> {/* Location */}
          <div className="h-4 bg-gray-700 rounded w-1/2"></div> {/* Level */}
          <div className="h-4 bg-gray-700 rounded w-1/3"></div> {/* Points */}
          <div className="h-4 bg-gray-700 rounded w-2/5"></div> {/* Eco Rank */}
          <div className="h-4 bg-gray-700 rounded w-1/4"></div> {/* Joined */}
        </div>

        {/* Progress bar */}
        <div className="mt-6 space-y-2">
          <div className="h-3 bg-gray-700 rounded-full w-1/3"></div> {/* Progress label */}
          <div className="h-4 bg-gray-700 rounded-full w-full"></div> {/* Progress bar */}
        </div>
      </div>
    </div>
  );
};

export default UserSkeleton;
