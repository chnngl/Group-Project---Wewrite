const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

//Load environment variables
dotenv.config();
//Connect to MongoDB
connectDB();

const app = express();

//Use CORS middleware before setting up routes
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from frontend on this port
    credentials: true, // Allow credentials (like cookies or authorization headers)
  })
);

//Middleware to parse JSON data
app.use(express.json());

//Use the authentication routes
app.use("/api", require("./routes/authRoutes"));
app.use("/api", require("./routes/logRoutes"));

//Use the story routes
app.use("/api", require("./routes/storyRoutes"));

// Set the port from environment variable or default to 5000
//const port = process.env.PORT || 5000;

// Start server
app.listen(5000, () => console.log(`Server running on port 5000`));
