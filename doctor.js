const Mongoose = require("mongoose");

const doctorSchema = new Mongoose.Schema({
  doctorName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures unique email
  },
  password: {
    type: String,
    required: true,
  },
  clinicName: {
    type: String,
    required: true,
  },
});

const doctorModel = Mongoose.model("Doctor", doctorSchema);
module.exports = doctorModel;
