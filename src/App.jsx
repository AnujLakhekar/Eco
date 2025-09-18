import React, { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Public from "./pages/public/Public";
import AuthLayOut from "./pages/public/AuthLayOut";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./providers/AuthPrpvider";
import ControlPanel from "./pages/private/Home";
import Controller from "./pages/private/controller";
import Profile from "./pages/private/Profile";
import Loader from "./components/Loader";
import Games from "./pages/private/Games";
import VerifyUser from "./pages/private/verify";
import Settings from "./pages/private/Settings";
import Activity from "./pages/private/Activity";
import GlitchText from "./components/animated/Glitch.jsx";

const App = () => {
  const navigate = useNavigate();
  const { user, setUser, loader } = useAuth();

  console.log(user);

  useEffect(() => {
    if (localStorage.getItem("theme")) {
      const theme = localStorage.getItem("theme");
      document.querySelector("html").setAttribute("data-theme", theme);
    }
  }, [loader]);

  if (loader) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <Toaster></Toaster>

      <Routes>
        {/* public */}
        <Route path="/" element={<Public />}>
          <Route path="" element={<Home />} />
          <Route
            path="api/_auth/SignUp"
            element={
              user.auth ? <Navigate to="/app" /> : <AuthLayOut type="SignUp" />
            }
          />
          <Route
            path="api/_auth/SignIn"
            element={
              user.auth ? <Navigate to="/app" /> : <AuthLayOut type="SignIn" />
            }
          />
          <Route path="api/_auth/" element={<AuthLayOut type={null} />} />
        </Route>

        {/*private*/}
        <Route
          path="/app/"
          element={user.auth ? <ControlPanel /> : <Navigate to="/" />}
        >
          <Route path="" element={<Controller />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="Games" element={<Games />} />
          <Route path="verification" element={<VerifyUser />} />
          <Route path="Settings" element={<Settings />} />
          <Route path="Activity" element={<Activity />} />
        </Route>

        <Route path="*" element={<div><GlitchText>404</GlitchText></div>} />
      </Routes>
    </div>
  );
};

export default App;
