  import React, { useState, useEffect } from "react";
  import { useAuth } from "../../providers/AuthPrpvider";
  import Loader from "../../components/Loader";
  import { Link, Links, useParams } from "react-router-dom";
  import { getColleges, getData, updateProfileData } from "../../api/firebase";
  import { roleStyles } from "../../constant";
  import UserSkeleton from "../../components/skeleton/UserSkeleTon";
  import ElectricBorder from "../../components/animated/ElectricBoard";
  import ProfileContainer from "../../components/common/profileContainer";

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
    const [Fetching, setFetching] = useState(false);
    const { id } = useParams();
    const [isTearcher, setIsTeacher] = useState(false);

    // Fetch user data
    useEffect(() => {
      const fetchUser = async () => {
        try {
          setFetching(true);
          const userFound = await getData(id);
          const clgs = await getColleges();

          setColleges(clgs);

          if (userFound?.personalInfo?.uid === AuthUser?.get?.personalInfo?.uid) {
            setIsAuthor(true);
          } else {
            setIsAuthor(false);
          }
          if (userFound) setUser(userFound);
        } catch (err) {
          console.error("Error fetching user:", err);
        } finally {
          setFetching(false);
          setIsTeacher(AuthUser.get.personalInfo.role === "teacher");
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

    if (Fetching) {
      return <UserSkeleton />;
    }

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

    // 🎨 Dynamic styling
    const level = user.gamification.level;
    const points = user.gamification.points;

    let profileTheme =
      "bg-white border-gray-300 text-black transition-all duration-500 ease-in-out";
    let avatarGlow = "";
    let cardGradient = "bg-black";
    let crown = null;
    let ecoTitle = "🌍 Eco Newbie";

    // 🌟 Color palette & rank logic (solid colors instead of gradients)
    if (points > 2000 || level >= 15) {
      profileTheme = "bg-[#222831] text-white -xl"; // Dark cool palette
      avatarGlow = "ring-8 ring-[#FFD369]  transition-transform duration-500";
      cardGradient = "bg-[#393E46] text-[#FFD369]"; // Accent color text
      crown = "👑";
      ecoTitle = "🔥 Eco Legend";
    } else if (points > 1000 || level >= 10) {
      profileTheme = "bg-[#222831] text-white "; // Dark cool palette
      avatarGlow = "ring-8 ring-[#FFD369]  transition-transform duration-500";
      cardGradient = "bg-[#393E46] text-[#FFD369]"; // Accent color text
      ecoTitle = "💎 Eco Master";
    } else if (points > 500 || level >= 5) {
      profileTheme = "bg-[#222831] text-white -xl"; // Dark cool palette
      avatarGlow = "ring-8 ring-[#FFD369]  transition-transform duration-500";
      cardGradient = "bg-[#393E46] text-[#FFD369]"; // Accent color text
      ecoTitle = "🌱 Eco Pro";
    } else {
      profileTheme = "bg-[#222831] text-white "; // Dark cool palette
      avatarGlow = "ring-8 ring-[#FFD369]  transition-transform duration-500";
      cardGradient = "bg-base-200 outline"; // Accent color text
      crown = "🌱";
      ecoTitle = "🌍 Eco Newbie";
    }

    // XP Progress
    const nextLevelPoints = (level + 1) * 200;
    const progressPercent = Math.min((points / nextLevelPoints) * 100, 100);

    return (
      <div
        className={"min-h-screen flex items-center justify-center  px-4 py-6 "}
      >
        <div className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl rounded-2xl p-4 sm:p-6 md:p-8">
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
                        <ProfileContainer size="md" user={user} />
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
                          <ul className="menu dropdown-content bg-accent text-base-100 rounded-box z-10 w-full p-2 max-h-64 overflow-y-auto">
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
                <div className={`w-full p-4 sm:p-6 md:p-8 rounded-2xl -xl`}>
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6">
                    <ProfileContainer size="lg" user={user} />
                    <div className="text-center  sm:text-left">
                      <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                        {user.personalInfo.fullName} {crown}
                      </h2>
                      <p className="text-gray-200">{user.personalInfo.email}</p>

                      <div className="flex justify-between items-center p-1 gap-3">
                        <div
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border m-2 ${
                            roleStyles[user.personalInfo.role]?.bg || "bg-black"
                          } ${
                            roleStyles[user.personalInfo.role]?.text ||
                            "text-white"
                          }`}
                        >
                          {user.personalInfo.role}
                        </div>

                        <div className="flex gap-2 bg-neutral p-1 rounded-2xl w-auto">
                          <div className="avatar-group -space-x-4">
                            {user.gamification?.badges?.slice(0,3).map((b, i) => (
                              <div key={i} className="avatar tooltip" data-tip={b}>
                                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(b)}&background=random&color=fff&bold=true`} alt={b} />
                                </div>
                              </div>
                            ))}
                            {user.gamification?.badges?.length > 3 && (
                              <div className="avatar placeholder">
                                <div className="w-10 rounded-full bg-base-300 text-base-content">
                                  <span>+{user.gamification.badges.length - 3}</span>
                                </div>
                              </div>
                            )}
                            {(!user.gamification?.badges || user.gamification.badges.length === 0) && (
                              <div className="text-xs px-2 py-1 opacity-70">No badges</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-400 my-4" />

                  {/* Stats */}
                  <div className="stats  w-full mb-4">
                    <div className="stat place-items-center">
                      <div className="stat-title">Points</div>
                      <div className="stat-value">{points}</div>
                      <div className="stat-desc">Eco Rank: {ecoTitle}</div>
                    </div>

                    <div className="stat place-items-center">
                      <div className="stat-title">Level</div>
                      <div className="stat-value text-secondary">{level}</div>
                      <div className="stat-desc text-secondary">
                        Progress {Math.floor(progressPercent)}%
                      </div>
                    </div>

                    <div className="stat place-items-center">
                      <div className="stat-title">Badges</div>
                      <div className="stat-value">
                        {user.gamification.badges?.length || 0}
                      </div>
                      <div className="stat-desc">Total earned</div>
                    </div>
                  </div>

                  {/* School & College mockup code block */}
                  <div className="mockup-code bg-primary text-primary-content w-full mb-4">
                    <pre>
                      <code>
                        School/College:{" "}
                        {user.personalInfo.schoolOrCollege || "Not set"}
                      </code>
                    </pre>
                    <pre>
                      <code>
                        Location: {user.personalInfo.location || "Not set"}
                      </code>
                    </pre>
                  </div>

                  {/* Profile Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white">
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
                    <div className="w-full m-2 bg-gray-800 rounded-full h-4">
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
                        className="px-6 py-2 bg-black hover:bg-gray-800 text-white rounded-lg -md"
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
            <div className={`w-full p-4 sm:p-6 md:p-8 rounded-2xl -xl `}>
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6">
                <ProfileContainer user={user} size="lg" className="ring-base-content ring-4" />
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                    {user.personalInfo.fullName} {crown}
                  </h2>
                  <p className="text-gray-200">{user.personalInfo.email}</p>

                  <div className="flex justify-between items-center p-1 gap-3 ">
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${
                        roleStyles[user.personalInfo.role]?.bg || "bg-black"
                      } ${
                        roleStyles[user.personalInfo.role]?.text || "text-white"
                      }`}
                    >
                      {user.personalInfo.role}
                    </div>

                    <div className="flex gap-2 bg-neutral p-1 rounded-2xl w-auto m-2">
                      <div className="avatar-group -space-x-4">
                        {user.gamification?.badges?.slice(0,3).map((b, i) => (
                          <div key={i} className="avatar tooltip" data-tip={b}>
                            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(b)}&background=random&color=fff&bold=true`} alt={b} />
                            </div>
                          </div>
                        ))}
                        {user.gamification?.badges?.length > 3 && (
                          <div className="avatar placeholder">
                            <div className="w-10 rounded-full bg-base-300 text-base-content">
                              <span>+{user.gamification.badges.length - 3}</span>
                            </div>
                          </div>
                        )}
                        {(!user.gamification?.badges || user.gamification.badges.length === 0) && (
                          <div className="text-xs px-2 py-1 opacity-70">No badges</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-gray-400 my-4" />

              {/* Stats */}
              <div className="stats  w-full mb-4">
                <div className="stat place-items-center">
                  <div className="stat-title">Points</div>
                  <div className="stat-value">{points}</div>
                  <div className="stat-desc">Eco Rank: {ecoTitle}</div>
                </div>

                <div className="stat place-items-center">
                  <div className="stat-title">Level</div>
                  <div className="stat-value text-secondary">{level}</div>
                  <div className="stat-desc text-secondary">
                    Progress {Math.floor(progressPercent)}%
                  </div>
                </div>

                <div className="stat place-items-center">
                  <div className="stat-title">Badges</div>
                  <div className="stat-value">
                    {user.gamification.badges?.length || 0}
                  </div>
                  <div className="stat-desc">Total earned</div>
                </div>
              </div>

              {/* School & College mockup code block */}
              <div className="mockup-code bg-primary text-primary-content w-full mb-4 p-2">
                <pre>
                  <code>
                    School/College:{" "}
                    {user.personalInfo.schoolOrCollege || "Not set"}
                  </code>
                </pre>
                <pre>
                  <code>Location: {user.personalInfo.location || "Not set"}</code>
                </pre>
              </div>

              {/* Profile Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white">
                <p>
                  <strong>Joined:</strong>{" "}
                  {new Date(user.personalInfo.joinedAt).toDateString()}
                </p>
              </div>

              {/* Progress bar */}
              <div className="group">
                <div className="mt-4">
                <div className="w-full bg-gray-800 rounded-full h-4">
                  <div
                    className="bg-primary h-4 rounded-full transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>
              <div className="hidden group-hover:block absolute rounded-2xl p-2 bg-base-100 text-base-content" style={{ left: `${progressPercent + 5}%` }}>
                progress {Math.floor(progressPercent)}%
              </div>
              </div>
            </div>
          )}

          <div>
            {isTearcher && !isAuthor ? (
              <>
                <div>
                  <Link
                    to={`/app/analytics/${user.personalInfo.uid}?accessBy=${AuthUser.get.personalInfo.email}&&Token=${AuthUser.get.personalInfo.uid}}`}
                  >
                    <button className="bg-slate-800 m-2 rounded-lg cursor-pointer p-2">
                      Analytics
                    </button>
                  </Link>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    );
  };

  export default Profile;
