import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, props }) => {
  return (
    <div>
      <Navbar {...props} />

      <div className="flex">
        <Sidebar />
        <div className="flex-grow p-10">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
