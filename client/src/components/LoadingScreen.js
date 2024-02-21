import React from "react";

const LoadingScreen = () => {
  return (
    <div className="bg-slate-300 h-screen flex items-center justify-center">
      <div className="flex flex-col items-center text-white">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-500 h-12 w-12"></div>
          <div className="rounded-full bg-gray-500 h-12 w-12"></div>
          <div className="rounded-full bg-gray-500 h-12 w-12"></div>
        </div>
        {/* <svg
          className="animate-spin h-24 w-24 text-white mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 0112 4.472v3.087a4 4 0 00-4 4h3.087zm8-9.835A8.001 8.001 0 0112 19.528v-3.087a4 4 0 004-4h-3.087zm-9.835 8A8.001 8.001 0 014.472 12h-3.09a4 4 0 004 4v-3.088zM12 20.528a8.001 8.001 0 008-8h-3.087a4 4 0 01-4 4v3.087zM20.528 12a8.001 8.001 0 01-8 8v-3.087a4 4 0 014-4h3.087zM4.472 12a8.001 8.001 0 008-8v3.09a4 4 0 00-4 4H4.472z"
          ></path>
        </svg> */}
        <h1 className="text-3xl font-semibold mt-4 text-gray-500">
          Loading...
        </h1>
      </div>
    </div>
  );
};

export default LoadingScreen;
