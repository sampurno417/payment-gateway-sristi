require('dotenv').config();
const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    // Optimize connection options
    mongoose.set('strictQuery', true);
    const connect = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Database connected: ${connect.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

module.exports = dbConnect;