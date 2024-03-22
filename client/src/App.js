import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Subscribe from "./pages/Subscribe";
import Success from "./pages/Success";
import Admin from "./pages/Admin";

function App() {
  return (
    <Router basename={process.env.REACT_APP_BASENAME || null}>
      <Routes>
        <Route path="/">
          <Route exact path="/" element={<Subscribe />} />
          <Route exact path="/success/:session_id?" element={<Success />} />
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
