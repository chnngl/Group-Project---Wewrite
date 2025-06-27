/**
 * Log schema tracks user interactions with stories.
 * Represents a log entry for a user action on a story.
 */
const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Story",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: {
    type: String,
    enum: ["CREATED", "VIEWED", "EDITED"],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Log", LogSchema);
