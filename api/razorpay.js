const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require('dotenv').config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a Razorpay order
router.post("/createOrder", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // Convert to paise
    //   currency,
    //   receipt,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Error creating order" });
  }
});

// Verify the payment
router.post("/verify-payment", async (req, res) => {
  try {
    const { formData } = req.body;

    const razorpay_payment_id=formData.paymentId;
    const razorpay_order_id=formData.orderId;
    const razorpay_signature=formData.razorpay_signature;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", `${process.env.RAZORPAY_KEY_SECRET}`)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
    //   const student = new Student(formData);
    //   await student.save();

      res.status(200).json({ success: true, message: "Payment verified and registration successful!" });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed!" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error during payment verification." });
  }
});

module.exports = router;
