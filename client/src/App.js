import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Subscribe from "./pages/Subscribe";
// import Customers from "./pages/Customers";
// import SendSMS from "./pages/SendSMS";
// import BroadcastSMS from "./pages/BroadcastSMS";
import Admin from "./pages/Admin";

function App() {
  return (
    <Router basename={process.env.REACT_APP_BASENAME || null}>
      <Routes>
        <Route path="/">
          <Route exact path="/:session_id?" element={<Subscribe />} />
          {/* <Route exact path="/customers" element={<Customers />} />
          <Route exact path="/sendSMS" element={<SendSMS />} />
          <Route exact path="/broadcastSMS" element={<BroadcastSMS />} /> */}
          <Route exact path="/__admin/:adminSection?" element={<Admin />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
