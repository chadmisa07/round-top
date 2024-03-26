import { Button } from "@mui/material";
import React from "react";

const Filters = ({
  doSetFilterByStatus,
  doSetFilterByRoute,
  doSetSortBy,
  routes,
}) => {
  return (
    <div className="flex items-center p-4 gap-x-4 filter-container">
      <div>
        <span className="mr-1">Filter By Status:</span>
        <select
          className="border p-1 rounded-md border-gray-400 min-w-28"
          onChange={(e) => doSetFilterByStatus(e.target.value)}
        >
          <option value="0">All</option>
          <option value="1">Active</option>
          <option value="2">Inactive</option>
        </select>
      </div>
      <div>
        <span className="mr-1">Filter By Route:</span>
        <select
          className="border p-1 rounded-md border-gray-400 min-w-28"
          onChange={(e) => doSetFilterByRoute(e.target.value)}
        >
          <option value="0">All</option>
          {routes.map((route) => (
            <option key={route.id} value={route.id}>
              {route.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <span className="mr-1">Sort By:</span>
        <select
          className="border p-1 rounded-md border-gray-400 min-w-28"
          onChange={(e) => doSetSortBy(e.target.value)}
        >
          <option value="id">Customer ID</option>
          <option value="name">Name</option>
          <option value="city">City</option>
          <option value="street">Street</option>
        </select>
      </div>
      <div>
        <Button
          type="button"
          variant="contained"
          onClick={() => window.print()}
        >
          Print
        </Button>
      </div>
    </div>
  );
};

export default Filters;
