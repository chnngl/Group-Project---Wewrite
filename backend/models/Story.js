/**
 * Story schema
 * Represents a story structure.
 */
const mongoose = require("mongoose");

const SnapshotSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  content: { type: String, required: true },
  files: [
    {
      name: String,
      imageData: Buffer,
      imageType: String
    }
  ]
});

const StorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  tags: [{ type: String }],
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  snapshots: [SnapshotSchema], // Embedded array of snapshot objects
  isLocked: { type: Boolean, default: false },
  lockedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Story", StorySchema);
