import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const DoctorSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/doctors/signin", { email, password });
      alert(response.data.message);

      // Store the necessary info in sessionStorage
      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("doctorName", response.data.name);
      sessionStorage.setItem("clinicName", response.data.clinic);
      sessionStorage.setItem("doctorEmail", response.data.email); // Store doctor email

      navigate("/doctors/dashboard"); // Redirect to Dashboard
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Doctor Sign In</h2>
        <form onSubmit={handleSubmit}>
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
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Sign In
          </button>
        </form>
        <p className="mt-3 text-center">
          Don't have an account? <Link to="/doctors/signup" className="text-success">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default DoctorSignIn;


