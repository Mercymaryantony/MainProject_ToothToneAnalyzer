import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Ui from './components/Ui';
import Index from './components/Index';  // Ensure the file is in the correct location
import DoctorSignIn from './components/DoctorSignIn';
import DoctorSignUp from './components/DoctorSignUp';
import DoctorDashboard from './components/DoctorDashbaord';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Ui />} />
        <Route path="/predict" element={<Index />} />
        <Route path="/doctors/signin" element={<DoctorSignIn />} />
        <Route path="doctors/signup" element={<DoctorSignUp />} />
        <Route path="/doctors/dashboard" element={<DoctorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
