const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String },
  registrationNumber: { type: String },
  semester: { type: String },
  branch: { type: String },
  section: { type: String },
  batch: { type: String },
  rollNumber: { type: String },
  password: { type: String, required: true },
  role: { type: String, required: true },
  session: { type: String }, // Added session field
  academicyear: { type: String }, // Added academicYear field
  isApproved: { type: Boolean, default: false },
  electives: [{ type: String }] // Added electives field to store student elective subjects
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 10);
  }
  next();
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
