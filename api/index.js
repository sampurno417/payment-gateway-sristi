const express = require("express");
const cors = require("cors");
const dbConnect = require("./dbconnection.js");
const studentRouter = require("./studentController.js");
const razorpayRouter = require("./razorpay.js"); // Add Razorpay routes

const app = express();
const port = 4000;

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    console.log("Request Origin:", origin);
    const allowedOrigins = [
      'https://sristi-registration-frontend.vercel.app', // Frontend's origin
      'https://sristi-registration-frontend.vercel.app/', // Frontend's origin
      'http://127.0.0.1:5500', // For local testing
      'http://127.0.0.1:5500/frontend/index.html',
      'http://localhost:4000/'
    ];
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

dbConnect();

app.use("/", studentRouter);
app.use("/payment", razorpayRouter); // Add payment routes

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
