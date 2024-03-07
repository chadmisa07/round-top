import React, { useState } from "react";

const AccountButton = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Implement logout logic here
    localStorage.removeItem("brt-jwt");
    window.location.reload();
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center translate-x-0 text-white font-semibold px-4 py-2 rounded-md shadow-"
      >
        <span className="mr-2 font-normal text-xs">Hi, {user?.username}</span>
      </button>
      {isOpen && (
        <div className="absolute right-6 bg-white rounded-md hover:bg-gray-100 shadow-lg z-10">
          <button
            onClick={handleLogout}
            className="block px-4 py-2 text-sm text-gray-700 w-full text-left"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountButton;
