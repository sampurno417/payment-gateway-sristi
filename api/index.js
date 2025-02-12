const express = require("express");
const cors = require("cors");
const dbConnect = require("./dbconnection.js");
const studentRouter = require("./studentController.js");
const razorpayRouter = require("./razorpay.js"); // Add Razorpay routes

const app = express();
const port = 4000;

// CORS Configuration
const corsOptions = {
  origin: [
    'https://sristi-registration-frontend.vercel.app',
    'http://127.0.0.1:5500',
    'http://192.168.152.132:56775/'
  ],
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
