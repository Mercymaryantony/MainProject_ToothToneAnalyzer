import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [doctorName, setDoctorName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [patients, setPatients] = useState([]);
  const [showPatients, setShowPatients] = useState(false);

  useEffect(() => {
    const storedDoctor = sessionStorage.getItem("doctorName");
    const storedClinic = sessionStorage.getItem("clinicName");
    const doctorEmail = sessionStorage.getItem("doctorEmail");

    if (!storedDoctor || !doctorEmail) {
      navigate("/doctors/signin");
    } else {
      setDoctorName(storedDoctor);
      setClinicName(storedClinic || "Your Clinic");
      fetchPatients(doctorEmail);
    }
  }, [navigate]);

  const fetchPatients = async (doctorEmail) => {
    try {
      if (!doctorEmail) {
        console.error("No doctor email found in session!");
        return;
      }
      const response = await axios.get(`http://localhost:5000/patients/history?doctorEmail=${doctorEmail}`);
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patient history:", error);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      sessionStorage.clear();
      navigate("/doctors/signin");
    }
  };

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div className="bg-dark text-white p-3" style={{ width: "250px" }}>
        <h4 className="text-center mb-4">{clinicName}</h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <button
              className={`btn w-100 text-start ${showPatients ? "btn-light" : "btn-outline-light"}`}
              onClick={() => setShowPatients(!showPatients)}
            >
              Patients
            </button>
          </li>
          <li className="nav-item mt-2">
            <Link to="/predict" className="btn btn-outline-light w-100 text-start">
              Prediction
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center">
          <h2>Welcome, Dr. {doctorName}!</h2>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {showPatients && (
          <div className="mt-4">
            <h4>Previous Patients</h4>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Shade</th>
                </tr>
              </thead>
              <tbody>
                {patients.length > 0 ? (
                  patients.map((patient, index) => (
                    <tr key={index}>
                      <td>{patient.name}</td>
                      <td>{patient.date}</td>
                      <td>{patient.shade}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">No patient history available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;


