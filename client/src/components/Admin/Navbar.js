import React from "react";
import Icon from "./Icon";
import AccountButton from "./AccountButton";

const Navbar = (props) => {
  return (
    <nav className="navbar bg-slate-600 sticky min-w-full">
      <div className="mx-auto px-2 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4"></div>
            </div>
          </div>
          <div>
            <AccountButton {...props} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
