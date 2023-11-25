import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";

import Form from './pages/Form';
import Delivery from './pages/Delivery';
import SendSMS from './pages/SendSMS';
import BroadcastSMS from './pages/BroadcastSMS';

function App() {

  
  return (
    <Router basename={process.env.REACT_APP_BASENAME || null}>
      <Routes>
        <Route path="/">
          <Route index element={<Form/>}/>
          <Route exact path="/delivery" element={<Delivery/>}/>
          <Route exact path="/sendSMS" element={<SendSMS/>}/>
          <Route exact path="/broadcastSMS" element={<BroadcastSMS/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App