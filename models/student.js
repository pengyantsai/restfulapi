const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    default: 18,
    max: [80, "too old"],
  },
  scholarship: {
    merit: { type: Number, min: 0, max: [5000, "too much"] },
    other: { type: Number, min: 0 },
  },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
