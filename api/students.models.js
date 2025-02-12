const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    roll: {
      type: Number,
      required: true,
    },
    college: {
      type: String,
      enum: ["jgec", "other"],
      required: true,
    },
    dept: {
      type: String,
      enum: ["other", "civil", "mechanical", "electrical", "ece", "cse", "it"],
      required: true,
    },
    year: {
      type: String,
      enum: ["1st", "2nd", "3rd", "4th"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    event: {
      type: String,
      enum: ["event1", "event2", "both", "selected"],
    },
    payment: {
      //image
      type: String,
      // required: true,
    },
    collegeName: {
      type: String,
      required: true,
    },
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("sristipiratestesting", studentSchema);
