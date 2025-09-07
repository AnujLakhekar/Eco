import React, { useState, useEffect } from "react";
import { useAuth } from "../../providers/AuthPrpvider";
import Loader from "../../components/Loader";
import { Link, useParams } from "react-router-dom";
import { getColleges, getData, updateProfileData } from "../../api/firebase";
import { roleStyles } from "../../constant";

const UserStructure = {
  get: {
    personalInfo: {
      fullName: "",
      email: "",
      avatar: "",
      verified: false,
      role: "student",
      schoolOrCollege: "",
      location: "",
      joinedAt: new Date().toISOString(),
      uid: "",
    },
    gamification: { level: 1, points: 0, badges: [], ecoRank: "Newbie" },
    challenges: { active: [], completed: [], streakDays: 0 },
    miniGames: { played: [], highScores: {} },
    settings: { language: "en", notifications: true, theme: "light" },
  },
};

const Profile = () => {
  const { user: AuthUser, setUser: setAuthUser, loader } = useAuth();
  const [user, setUser] = useState(AuthUser?.get || UserStructure.get);
  const [isAuthor, setIsAuthor] = useState(false);
  const [colleges, setColleges] = useState({});
  const [isEditing, setisEditing] = useState(false);
  const { id } = useParams();

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userFound = await getData(id);
        const clgs = await getColleges();
        console.log(clgs);

        setColleges(clgs);

        if (userFound?.personalInfo?.uid === AuthUser?.get?.personalInfo?.uid) {
          setIsAuthor(true);
        } else {
          setIsAuthor(false);
        }
        if (userFound) setUser(userFound);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [id, AuthUser]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value,
      },
    }));
  };

  const handleColleges = (name, lo) => {
    setUser((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        schoolOrCollege: name,
        location: lo,
      },
    }));
  };

  const HandleProfileApi = async (name) => {
    const newAvatar = `https://ui-avatars.com/api/?name=${name}`;

    setUser((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        avatar: newAvatar,
      },
    }));
  };

  // Submit updated profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setAuthUser((prev) => ({
        ...prev,
        get: {
          ...prev.get,
          personalInfo: user.personalInfo,
        },
      }));

      await updateProfileData(id, user);
      setisEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (loader) return <Loader />;

  // 🎨 Dynamic styling
  const level = user.gamification.level;
  const points = user.gamification.points;

  let profileTheme =
    "bg-white border-gray-300 text-black transition-all duration-500 ease-in-out";
  let avatarGlow = "";
  let cardGradient = "bg-black/10";
  let crown = null;
  let ecoTitle = "🌍 Eco Newbie";

  // 🌟 Color palette & rank logic (solid colors instead of gradients)
  if (points > 2000 || level >= 15) {
    profileTheme = "bg-[#222831] text-white shadow-xl"; // Dark cool palette
    avatarGlow = "ring-8 ring-[#FFD369]  transition-transform duration-500";
    cardGradient = "bg-[#393E46] text-[#FFD369]"; // Accent color text
    crown = "👑";
    ecoTitle = "🔥 Eco Legend";
  } else if (points > 1000 || level >= 10) {
    profileTheme = "bg-[#222831] text-white shadow-xl"; // Dark cool palette
    avatarGlow = "ring-8 ring-[#FFD369]  transition-transform duration-500";
    cardGradient = "bg-[#393E46] text-[#FFD369]"; // Accent color text
    ecoTitle = "💎 Eco Master";
  } else if (points > 500 || level >= 5) {
    profileTheme = "bg-[#222831] text-white shadow-xl"; // Dark cool palette
    avatarGlow = "ring-8 ring-[#FFD369]  transition-transform duration-500";
    cardGradient = "bg-[#393E46] text-[#FFD369]"; // Accent color text
    ecoTitle = "🌱 Eco Pro";
  } else {
    profileTheme = "bg-[#222831] text-white shadow-xl"; // Dark cool palette
    avatarGlow = "ring-8 ring-[#FFD369]  transition-transform duration-500";
    cardGradient = "bg-[#393E46] text-[#FFD369]"; // Accent color text
    crown = "🌱";
    ecoTitle = "🌍 Eco Newbie";
  }

  // XP Progress
  const nextLevelPoints = (level + 1) * 200;
  const progressPercent = Math.min((points / nextLevelPoints) * 100, 100);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base px-4 py-6">
      <div className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
        {isAuthor ? (
          <>
            {isEditing ? (
              <>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">
                  Edit Profile
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Avatar */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <label className="block mb-1 font-medium">Avatar</label>
                      <input
                        type="text"
                        name="avatar"
                        value={user.personalInfo.avatar.split("=")[1]}
                        onChange={(e) => HandleProfileApi(e.target.value)}
                        className="input w-full"
                        placeholder="Anuj Lakhekar"
                      />
                    </div>
                    {user.personalInfo.avatar && (
                      <img
                        src={user.personalInfo.avatar}
                        alt="Avatar Preview"
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border ${avatarGlow}`}
                      />
                    )}
                  </div>

                  {/* Full Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 font-medium">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={user.personalInfo.fullName}
                        onChange={handleChange}
                        className="input w-full"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">Email</label>
                      {user.personalInfo?.verified ? (
                        <input
                          type="email"
                          name="email"
                          value={user.personalInfo.email}
                          onChange={handleChange}
                          className="input w-full"
                        />
                      ) : (
                        <div className="flex flex-col gap-2">
                          <input
                            type="email"
                            name="email"
                            value={user.personalInfo.email}
                            onChange={handleChange}
                            className="input w-full disabled:bg-accent/30"
                            disabled
                          />
                          <Link
                            to="/app/verification"
                            className="btn btn-accent w-full text-center"
                          >
                            Verify Email
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* School/College & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="w-full">
                      <label className="block mb-1 font-medium">
                        School/College
                      </label>
                      <details className="dropdown w-full">
                        <summary className="btn w-full bg-accent text-base-100">
                          {user.personalInfo?.schoolOrCollege ||
                            "Select College"}
                        </summary>
                        <ul className="menu dropdown-content bg-accent text-base-100 rounded-box z-10 w-full p-2 shadow-sm max-h-64 overflow-y-auto">
                          {colleges.map((c, i) => (
                            <li
                              key={i}
                              onClick={() =>
                                handleColleges(
                                  c.college.name,
                                  c.college.location
                                )
                              }
                            >
                              <a>{c.college.name}</a>
                            </li>
                          ))}
                          <p className="p-2 bg-base-100/60 text-base-content rounded-md">
                            Click again to close
                          </p>
                        </ul>
                      </details>
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={user.personalInfo.location}
                        onChange={handleChange}
                        className="input w-full"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full btn btn-secondary mt-2 sm:mt-4"
                  >
                    Save Changes
                  </button>
                </form>
              </>
            ) : (
              <div
                className={`w-full p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl ${cardGradient}`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6">
                  <img
                    src={
                      user.personalInfo.avatar ||
                      `https://ui-avatars.com/api/?name=${user.personalInfo.fullName}`
                    }
                    alt="avatar"
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 ${avatarGlow}`}
                  />
                  <div className="text-center sm:text-left">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                      {user.personalInfo.fullName} {crown}
                    </h2>
                    <p className="text-gray-200">{user.personalInfo.email}</p>
                    <div
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold border ${
                        roleStyles[user.personalInfo.role]?.bg || "bg-black"
                      } ${
                        roleStyles[user.personalInfo.role]?.text || "text-white"
                      }`}
                    >
                      {user.personalInfo.role}
                    </div>
                  </div>
                </div>

                <hr className="border-gray-400 my-4" />

                {/* Profile Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white">
                  <p>
                    <strong>School/College:</strong>{" "}
                    {user.personalInfo.schoolOrCollege}
                  </p>
                  <p>
                    <strong>Location:</strong> {user.personalInfo.location}
                  </p>
                  <p>
                    <strong>Level:</strong> {level}
                  </p>
                  <p>
                    <strong>Points:</strong> {points}
                  </p>
                  <p>
                    <strong>Eco Rank:</strong> {ecoTitle}
                  </p>
                  <p>
                    <strong>Joined:</strong>{" "}
                    {new Date(user.personalInfo.joinedAt).toDateString()}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <p className="text-sm text-gray-200 mb-1">
                    Progress to next level
                  </p>
                  <div className="w-full bg-gray-800 rounded-full h-4">
                    <div
                      className="bg-yellow-400 h-4 rounded-full transition-all duration-700"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Edit Button */}
                {isAuthor && (
                  <div className="mt-4 sm:mt-6 flex justify-center sm:justify-end">
                    <button
                      onClick={() => setisEditing(true)}
                      className="px-6 py-2 bg-black hover:bg-gray-800 text-white rounded-lg shadow-md"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* Same structure for non-author view, also responsive */
          <div
            className={`w-full p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl ${cardGradient}`}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6">
              <img
                src={
                  user.personalInfo.avatar ||
                  `https://ui-avatars.com/api/?name=${user.personalInfo.fullName}`
                }
                alt="avatar"
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 ${avatarGlow}`}
              />
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                  {user.personalInfo.fullName} {crown}
                </h2>
                <p className="text-gray-200">{user.personalInfo.email}</p>
                <div
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold border ${
                    roleStyles[user.personalInfo.role]?.bg || "bg-black"
                  } ${
                    roleStyles[user.personalInfo.role]?.text || "text-white"
                  }`}
                >
                  {user.personalInfo.role}
                </div>
              </div>
            </div>

            <hr className="border-gray-400 my-4" />

            {/* Profile Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white">
              <p>
                <strong>School/College:</strong>{" "}
                {user.personalInfo.schoolOrCollege}
              </p>
              <p>
                <strong>Location:</strong> {user.personalInfo.location}
              </p>
              <p>
                <strong>Level:</strong> {level}
              </p>
              <p>
                <strong>Points:</strong> {points}
              </p>
              <p>
                <strong>Eco Rank:</strong> {ecoTitle}
              </p>
              <p>
                <strong>Joined:</strong>{" "}
                {new Date(user.personalInfo.joinedAt).toDateString()}
              </p>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <p className="text-sm text-gray-200 mb-1">
                Progress to next level
              </p>
              <div className="w-full bg-gray-800 rounded-full h-4">
                <div
                  className="bg-yellow-400 h-4 rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
