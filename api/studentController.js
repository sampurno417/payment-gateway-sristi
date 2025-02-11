const express = require("express");
const router = express.Router();
const student = require("./students.models.js");
const sendMail = require("./confirmationMail.js");

// const generateStudentId = () => {
//   const timestamp = Date.now();
//   const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
//   return `${timestamp}-${randomPart}`;
// };

// Controller for registering a student
const registerStudent = async (req, res) => {
  try {
    //console.log("request is:", req);
    console.log("Incoming payload:", req.body); // Log the request payload

    // Create a new student record
    const findStudent = await student.findOne({ email: req.body.email })||
    await student.findOne({ phone: req.body.phone });
    if (findStudent)
      return res.status(400).json({ message: "student already exists" });
    
    const studentData = await student.create({
      name: req.body.name,
      roll: req.body.roll,
      dept: req.body.dept,
      year: req.body.year,
      phone: req.body.phone,
      email: req.body.email,
      event: req.body.event,
      payment: req.body.payment,
      amount: req.body.amount,
      college: req.body.college,
      collegeName: req.body.collegeName,
      isVerified: req.body.isVerified,
    });

        // Save the data and send a success response
        await studentData.save();
        res.status(200).json({
            message: 'Student registered successfully',
            id:studentData._id
        });
    } catch (error) {
        console.error('Error during registration:', error); // Log the error for debugging
        res.status(500).json({
            message: 'Server error',
        });
    }
};

// Define the POST route
router.route("/").post(registerStudent);
router.route("/sendmail/:id").post(sendMail);

module.exports = router;
