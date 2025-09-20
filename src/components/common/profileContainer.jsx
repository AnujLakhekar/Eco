import React from "react";

const profileContainer = ({ user }) => {
  return (
    <div>
      <div className="rounded-full  overflow-hidden">
        <img
          src={`https://ui-avatars.com/api/?name=${user.get?.personalInfo?.fullName}`}
          alt="avatar"
        />
      </div>
    </div>
  );
};

export default profileContainer;
