const Express = require("express");
const Cors = require("cors");
const Mongoose = require("mongoose");
const Bcrypt = require("bcrypt");
const Jsonwebtoken = require("jsonwebtoken");
const doctorModel = require("./doctor");
const Patient = require("./patient"); // Import patient model

const app = Express();
app.use(Express.json());
app.use(Cors());

const JWT_SECRET = "your_secret_key"; // Change this to a secure key

// Connect to MongoDB
Mongoose.connect(
  "mongodb+srv://mercy1112:mercy1112@cluster0.8x8j3ya.mongodb.net/Toothtoneanalyzer?retryWrites=true&w=majority&appName=Cluster0",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Doctor Sign-Up Route
app.post("/doctors/signup", async (req, res) => {
  try {
    const { doctorName, email, password, clinicName } = req.body;
    const existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Email already registered!" });
    }
    const hashedPassword = await Bcrypt.hash(password, 10);
    const newDoctor = new doctorModel({
      doctorName,
      email,
      password: hashedPassword,
      clinicName,
    });
    await newDoctor.save();
    res.status(200).json({ message: "Doctor registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Sign-In Route – returns doctor email along with other info
app.post("/doctors/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.status(400).json({ message: "Doctor not found!" });
    }
    const isPasswordValid = await Bcrypt.compare(password, doctor.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }
    const token = Jsonwebtoken.sign(
      { id: doctor._id, email: doctor.email, name: doctor.doctorName, clinic: doctor.clinicName },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ 
      message: "Login successful!", 
      token, 
      name: doctor.doctorName, 
      clinic: doctor.clinicName,
      email: doctor.email  // Return the email so it can be stored on the client
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Save patient data associated with a specific doctor
app.post("/patients/save", async (req, res) => {
  try {
    const { name, shade, date, doctorEmail } = req.body;
    if (!doctorEmail) {
      return res.status(400).json({ message: "Doctor email is required" });
    }
    const newPatient = new Patient({
      name,
      shade,
      date,
      doctorEmail, // Associate the patient with the logged-in doctor's email
    });
    await newPatient.save();
    res.status(200).json({ message: "Patient data saved successfully!" });
  } catch (error) {
    console.error("Error saving patient data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Fetch patient history for a specific doctor
app.get("/patients/history", async (req, res) => {
  try {
    const { doctorEmail } = req.query;
    if (!doctorEmail) {
      return res.status(400).json({ message: "Doctor email is required" });
    }
    // Find patients where doctorEmail matches
    const patients = await Patient.find({ doctorEmail });
    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patient history:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
