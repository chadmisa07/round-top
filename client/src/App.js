import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";

import Form from './pages/Form';
import Delivery from './pages/Delivery';
import SendSMS from './pages/SendSMS';
import BroadcastSMS from './pages/BroadcastSMS';



function App() {

  
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Form/>}/>        
        <Route exact path="/delivery" element={<Delivery/>}/>        
        <Route exact path="/sendSMS" element={<SendSMS/>}/>        
        <Route exact path="/broadcastSMS" element={<BroadcastSMS/>}/>
      </Routes>
    </Router>
  );
}

export default App