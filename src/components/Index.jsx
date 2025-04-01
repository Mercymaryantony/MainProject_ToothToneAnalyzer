import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const shades = [
    "/Shades/1M_2.jpg", "/Shades/2L_1.5.jpg", "/Shades/2L_2.5.jpg", "/Shades/2M_1.jpg",
    "/Shades/2M_2.jpg", "/Shades/2M_3.jpg", "/Shades/2R_1.5.jpg", "/Shades/2R_2.5.jpg",
    "/Shades/3L_1.5.jpg", "/Shades/3L_2.5.jpg", "/Shades/3M_1.jpg", "/Shades/3M_2.jpg",
    "/Shades/3M_3.jpg", "/Shades/3R_2.5.jpg", "/Shades/4L_2.5.jpg", "/Shades/4M_1.jpg", "/Shades/4M_3.jpg"
  ];

  const [doctorName, setDoctorName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("Male");
  const [currentShade, setCurrentShade] = useState("");
  const [currentShadeName, setCurrentShadeName] = useState("");
  const [allMatches, setAllMatches] = useState({});
  const [loading, setLoading] = useState(false);
  const [reportFilename, setReportFilename] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setDoctorName(sessionStorage.getItem("doctorName") || "");
    setClinicName(sessionStorage.getItem("clinicName") || "");
  }, []);

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setAnimationIndex((prevIndex) => (prevIndex + 1) % shades.length);
      }, 150);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handlePredict = async () => {
    if (!selectedImage) {
      alert("Please upload an image first.");
      return;
    }
    if (!patientName || !age || !sex) {
      alert("Please fill out all patient details.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    const fileInput = document.getElementById("file");
    formData.append("image", fileInput.files[0]);
    formData.append("patient_name", patientName);
    formData.append("patient_id", age);
    formData.append("doctor_name", doctorName);
    formData.append("clinic_name", clinicName);
    formData.append("sex", sex);
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTimeout(() => {
        setLoading(false);
        setCurrentShade(`/Shades/${response.data.predicted_shade}.jpg`);
        setCurrentShadeName(response.data.predicted_shade);
        setAllMatches(response.data.confidence_scores);
        setReportFilename(response.data.report_filename);
      }, 3000);
    } catch (error) {
      console.error("Prediction error:", error);
      setLoading(false);
      alert("Error predicting shade. Please try again.");
    }
  };

  const handleDownloadReport = () => {
    if (!reportFilename) {
      alert("No report available to download.");
      return;
    }
    const reportUrl = `http://127.0.0.1:5000/download-report/${reportFilename}`;
    window.open(reportUrl, "_blank");
  };

  const handleSavePatientData = async () => {
    if (!patientName || !currentShadeName) {
      alert("No patient data to save!");
      return;
    }
    const today = new Date().toISOString().split("T")[0]; // Get today's date
    const doctorEmail = sessionStorage.getItem("doctorEmail"); // Fetch logged-in doctor's email
    if (!doctorEmail) {
      alert("No doctor email found. Please log in as a doctor.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/patients/save", {
        name: patientName,
        shade: currentShadeName,
        date: today,
        doctorEmail, // Save the associated doctor email
      });
      alert("Patient data saved successfully!");
    } catch (error) {
      console.error("Error saving patient data:", error);
      alert("Failed to save patient data.");
    }
  };

  const handleSendEmail = async () => {
    if (!reportFilename || !email) {
      alert("Enter a valid email and ensure a report is generated.");
      return;
    }
    try {
      await axios.post("http://127.0.0.1:5000/send-report", {
        email,
        report_filename: reportFilename,
      });
      alert("Report sent successfully!");
    } catch (error) {
      console.error("Email sending error:", error);
      alert("Error sending report.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="mb-3">
          <b>TOOTH TONE ANALYZER</b>
        </h1>
        <button className="btn btn-secondary" onClick={() => navigate("/doctors/dashboard")}>
          Back to Dashboard
        </button>
      </div>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Patient Name"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
      />
      <input
        type="number"
        className="form-control mb-3"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <select className="form-control mb-3" value={sex} onChange={(e) => setSex(e.target.value)}>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <input
        type="file"
        id="file"
        className="form-control mb-3"
        onChange={(e) => setSelectedImage(URL.createObjectURL(e.target.files[0]))}
      />
      <button className="btn btn-warning w-100 mb-3" onClick={handlePredict}>
        <b>Predict the shade</b>
      </button>
      {currentShadeName && (
        <button className="btn btn-primary mt-3" onClick={handleSavePatientData}>
          Save Patient Data
        </button>
      )}
      {selectedImage && (
        <div className="text-center">
          <div className="d-flex justify-content-center align-items-center gap-4">
            <div>
              <img
                src={selectedImage}
                alt="Uploaded"
                className="border border-dark"
                style={{ width: "200px", height: "200px" }}
              />
              <p className="mt-2 font-weight-bold">Uploaded Image</p>
            </div>
            <div>
              <img
                src={loading ? shades[animationIndex] : currentShade}
                alt="Predicted Shade"
                className="border border-dark"
                style={{ width: "200px", height: "200px" }}
              />
              <p className="mt-2 font-weight-bold">
                {loading ? "Analyzing..." : `${currentShadeName}`}
              </p>
            </div>
          </div>
          {Object.keys(allMatches).length > 0 && (
            <div className="mt-3">
              <h5>Shade Matching Percentages:</h5>
              <ul className="list-group">
                {Object.entries(allMatches).map(([shade, percentage]) => (
                  <li
                    key={shade}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {shade}
                    <span className="badge bg-primary">{percentage}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {reportFilename && (
            <div>
              <button className="btn btn-success mt-3" onClick={handleDownloadReport}>
                <b>Download Report</b>
              </button>
              <input
                type="email"
                className="form-control mt-3 mb-2"
                placeholder="Technician's Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn btn-info mt-2" onClick={handleSendEmail}>
                Send Report via Email
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Index;



