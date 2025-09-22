import React from "react";
import { roleStyles } from "../../constant";
import { User as UserIcon } from "lucide-react";

// Reusable avatar component
const ProfileContainer = ({ user, size = "md", className = "" }) => {
  // Support both shapes: { get: { personalInfo: ... } } and { personalInfo: ... }
  const data = user?.get ? user.get : user || {};
  const pi = data?.personalInfo || {};

  const role = pi?.role?.toLowerCase() || "default";
  const roleTheme = roleStyles[role] || roleStyles.default;

  const sizeClasses =
    size === "sm"
      ? "w-10 h-10 text-base"
      : size === "lg"
      ? "w-16 h-16 text-2xl"
      : "w-12 h-12 text-lg"; // md default

  const letter =
    (pi?.fullName && pi.fullName.trim()[0]) ||
    (pi?.email && pi.email.trim()[0]) ||
    null;

  return (
    <div className={`rounded-full overflow-hidden ${className}`}>
      {false ? (
        <img
          src={pi.avatar}
          alt="avatar"
          className={`rounded-full object-cover ${sizeClasses}`}
        />
      ) : (
        <div
          className={`${sizeClasses} rounded-full flex items-center justify-center font-bold ${roleTheme.badge}`}
        >
          {letter ? (
            <span className="text-base-100">{letter.toUpperCase()}</span>
          ) : (
            <UserIcon className="w-5 h-5 text-base-100" />
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileContainer;
