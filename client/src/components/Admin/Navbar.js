import React from "react";
import Icon from "./Icon";
import AccountButton from "./AccountButton";

const Navbar = (props) => {
  return (
    <nav className="bg-gray-900 sticky min-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
