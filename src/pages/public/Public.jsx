import React from "react";
import { Outlet } from "react-router-dom";
import Home from "../Home";

const Public = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Public;
