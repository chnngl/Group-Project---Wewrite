import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login";
import UpdatePasswordPage from "./pages/UpdatePassword/UpdatePasswordPage";
import AboutUs from "./pages/AboutUs";
import CreateStory from "./pages/CreateStory";
import UpdateStory from "./pages/UpdateStory";
import LogHistory from "./pages/Log/LogHistory";
import ViewStory from "./pages/ViewStory/ViewStory";
import ProfilePage from "./pages/ProfilePage";


/**
 * Defines the routing structure for the app
 */
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/AboutUs" element={<AboutUs />} />
      <Route path="/CreateStory" element={<CreateStory />} />
      <Route path="/UpdateStory/:storyId" element={<UpdateStory />} />
      <Route path="/Login" element={<Login key={window.location.pathname} />} />
      <Route path="/ViewStory/:storyId" element={<ViewStory />} />
      <Route path="/LogHistory/:storyId" element={<LogHistory />} />
      <Route path="/updatepwd" element={<UpdatePasswordPage />} />
      <Route path="/Profile" element={<ProfilePage />} />
    </Routes>
  );
};

export default App;
