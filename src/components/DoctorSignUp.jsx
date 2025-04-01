import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const DoctorSignUp = () => {
  const [doctorName, setDoctorName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clinicName, setClinicName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/doctors/signup", {
        doctorName,
        email,
        password,
        clinicName
      });

      if (response.status === 200) {
        alert(response.data.message);
        navigate("/doctors/signin"); // Redirect after successful sign-up
      }
    } catch (error) {
      alert(error.response?.data?.message || "Sign-up failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Doctor Sign Up</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="mb-3">
            <label className="form-label">Doctor's Name</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Enter your name" 
              value={doctorName} 
              onChange={(e) => setDoctorName(e.target.value)} 
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email ID</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Enter password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Confirm password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Clinic Name</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Enter clinic name" 
              value={clinicName} 
              onChange={(e) => setClinicName(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn btn-success w-100">Sign Up</button>
        </form>

        <p className="mt-3 text-center">
          Already have an account? <Link to="/doctors/signin" className="text-success">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default DoctorSignUp;
