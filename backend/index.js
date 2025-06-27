const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

//Load environment variables
dotenv.config();
//Connect to MongoDB
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://wewrite-ed0g.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

//Middleware to parse JSON data
app.use(express.json());

//Use the authentication routes
app.use("/api", require("./routes/authRoutes"));
app.use("/api", require("./routes/logRoutes"));

//Use the story routes
app.use("/api", require("./routes/storyRoutes"));

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Set the port from environment variable or default to 5000
//const port = process.env.PORT || 5000;

// Start server
app.listen(5000, () => console.log(`Server running on port 5000`));
