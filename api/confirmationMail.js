require("dotenv").config();
const nodemailer = require("nodemailer");
const qr = require("qrcode");
const fs = require("fs");
// require("dotenv").config();
// const nodemailer = require("nodemailer");
// const qr = require("qrcode");
// const fs = require('fs');

// Function to generate QR code as a Base64 string

// Function to generate QR code as a Base64 string
const generateQRCode = async (idl) => {
  try {
    const qrCodeDataURL = await qr.toDataURL(idl); // Generate QR as Base64
    return qrCodeDataURL;
  } catch (err) {
    console.error("QR Code generation failed:", err);
    return null;
  }
};

const SendMail = async (req, res) => {
  const id = req.body.id; // The ID for generating the QR code
  const email = req.params.id; // The recipient email

  // Generate the QR code as a Base64-encoded string
  const qrCodeDataURL = await generateQRCode(id);
  if (!qrCodeDataURL) {
    return res.status(500).json({ error: "QR code generation failed" });
  }

  // Convert the Base64 string to a buffer for attaching the QR code
  const qrCodeBuffer = Buffer.from(qrCodeDataURL.split(",")[1], "base64");

  // Create the email transport
  var transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SRISTI_EMAIL,
      pass: process.env.SRISTI_PASSWORD,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  // Define the email content
  var message = {
    from: `${process.env.SRISTI_EMAIL}`,
    to: `${email}`,
    subject: "Welcome to Sristi 2K25!",
    text: "",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Sristi 2K25 - Tech Fest Invitation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #000;
      color: white;
      margin: 0;
      padding: 0;
    }
    .email-container {
      width: 100%;
      max-width: 600px;
      margin: 20px auto;
      background-color: #222;
      border-radius: 15px;
      overflow: hidden;
    }
    .email-header {
      background-color:rgb(200, 3, 3);
      padding: 20px;
      text-align: center;
      position: relative;
    }
    .email-header h1 {
      font-size: 36px;
      margin: 0;
      color: #fff;
    }
    .email-body {
      padding: 20px;
      text-align: center;
    }
    .email-body h2 {
      font-size: 20px;
      color: #e74c3c;
    }
    .email-body p {
      line-height: 1.8;
      color: #ecf0f1;
      margin-bottom: 20px;
    }
    .qr-container {
      margin-top: 20px;
    }
    .qr-container img {
      width: 100%;
      max-width: 140px; /* Adjust this size for mobile responsiveness */
      height: auto;
      border: 3px solid #e74c3c;
      border-radius: 15px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    }
    .cta-btn {
      display: inline-block;
      background-color: #e74c3c;
      color: white;
      padding: 15px 30px;
      margin-top: 20px;
      font-size: 15px;
      text-decoration: none;
      border-radius: 10px;
      border: 2px solid #e74c3c;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
      cursor: pointer;
    }
    .cta-btn:hover {
      background-color: #c0392b;
      border-color: #c0392b;
    }
    .email-footer {
      background-color: #222;
      padding: 15px;
      text-align: center;
      font-size: 14px;
      color: #bdc3c7;
    }
  </style>
</head>
<body>

  <div class="email-container">
    <div class="email-header">
      <h1>Welcome to Sristi2k25 🏴‍☠️</h1>
    </div>
    <div class="email-body">
      <h2>Ahoy, Brave Tech Adventurer! ⚓️</h2>
      <p>Glad to have you onboard! <strong>This is your official confirmation to the event.</strong></p>
      <p>Ready to set sail on a journey of innovation, challenges, and pirate treasure? 🏴‍☠️ <strong>Sristi 2K25</strong> at <strong>Jalpaiguri Government Engineering College</strong> is back, and this year, it’s all about pirates and tech! 💻⚡️</p>
      <p><strong>Don’t share this QR code with anyone to embark on this thrilling adventure!🚨</strong></p>

      <!-- Display QR code inline in the email -->
      <div class="qr-container">
        <img src="cid:qrCode" alt="QR Code to Register">
      </div>

      <p>🌊 The seas are calling! Set sail with us and make Sristi 2K25 an unforgettable tech quest! 🏴‍☠️🗺️</p>

      <p> 🚢 While you wait to embark on this exciting journey, check out our official website to discover the treasure map of events and competitions waiting for you. 🏆🎮</p>

      <p>Don't miss the chance to navigate through mind-bending workshops, tech challenges, and opportunities to unlock your true potential! 💻⚡️</p>

<!-- Button linking to the official website -->
    <a href="https://sristi-registration-frontend.vercel.app/confirmation.html" class="cta-btn">Explore Events & Join the Adventure! 🌟</a>

    </div>

    <div class="email-footer">
      <p>&copy; Jalpaiguri Government Engineering College</p>
      <p><em>For inquiries, contact us at <a href="mailto:sristi@jgec.ac.in">sristi@jgec.ac.in</a></em></p>
      <p><em>For additional enquiries, contact our coordinator: <br><strong>Sampurno Sarkar (+91 7439135785)</strong></em></p>

    </div>
  </div>

</body>
</html>`,
    attachments: [
      {
        filename: "qrCode.png",
        content: qrCodeBuffer, // Attach the QR code as a buffer
        cid: "qrCode", // Ensure the CID matches the src in HTML
      },
      {
        filename: "qrcode.png",
        content: qrCodeDataURL.split("base64,")[1], // Remove data URI prefix
        encoding: "base64",
      },
    ],
  };

  try {
    const info = await transporter.sendMail(message);
    return res.status(200).json({ message: "Email sent", info });
  } catch (error) {
    console.error("Error details:", error); // Log the full error object
    return res.status(500).json({ error: error.message });
  }
};

module.exports = SendMail;
