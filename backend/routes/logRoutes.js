const express = require("express");
const router = express.Router();
const logController = require("../controller/logController");
const authMiddleware = require("../middleware/authMiddleware");

//Fetch logs of a specific story
router.get("/logs/:storyId", authMiddleware, logController.getStoryLogs);

module.exports = router;
