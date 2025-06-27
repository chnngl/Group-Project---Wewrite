const mongoose = require("mongoose");

require("dotenv").config();

/** Establishes MongoDB database connection using the MONGO_URI environment variable */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {});
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
