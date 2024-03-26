import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, props }) => {
  return (
    <>
      <Navbar {...props} />

      <div className="flex">
        <Sidebar />
        <div className="admin-container flex-grow p-10 w-full overflow-x-auto">
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
