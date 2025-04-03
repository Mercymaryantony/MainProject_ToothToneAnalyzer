const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shade: { type: String, required: true },
  date: { type: String, required: true },
  doctorEmail: { type: String, required: true }, // Associate patient with a doctor
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
