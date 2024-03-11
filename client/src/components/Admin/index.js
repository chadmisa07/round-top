import React from "react";
import { useParams } from "react-router-dom";

import DashboardLayout from "./Layout";

import Customers from "../../pages/Customers";
import BroadcastSMS from "../../pages/BroadcastSMS";

const PAGES = Object.freeze([
  {
    link: "customer",
    component: Customers,
  },
  {
    link: "broadcast",
    component: BroadcastSMS,
  },
]);

const AdminPage = (props) => {
  const params = useParams();

  const Comp = params?.adminSection
    ? PAGES.find((page) => page.link === params?.adminSection).component
    : Customers;

  return (
    <div>
      <DashboardLayout props={props}>
        <Comp />
      </DashboardLayout>
    </div>
  );
};

export default AdminPage;
