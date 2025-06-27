const Log = require("../models/Log");
const Story = require("../models/Story");

/**
 * Fetches the logs of a specific story with pagination.
 * Retrieves log entries for a given story ID, sorted by timestamp in descending order.
 * Each log is enriched with the user's email and formatted for readability.
 *
 * @param {string} req.params.storyId - The ID of the story to fetch logs for.
 * @returns Sends a JSON response with story info, logs, and pagination metadata.
 */
const getStoryLogs = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const logs = await Log.find({ storyId })
      .populate("userId", "email")
      .sort({ timestamp: -1 }) // Sort logs in descending order (latest first)
      .skip(skip)
      .limit(limitNumber);

    // Format logs in a readable way
    const formattedLogs = logs.map((log) => ({
      email: log.userId?.email || "Unknown user",
      action: log.action,
      timestamp: new Date(log.timestamp).toLocaleString(),
    }));

    // Get total count for pagination metadata
    const totalLogs = await Log.countDocuments({ storyId });

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    res.status(200).json({
      storyTitle: story.title,
      storyTag: story.tags,
      isLocked: story.isLocked,
      logs: formattedLogs,
      pagination: {
        total: totalLogs,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalLogs / limitNumber),
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching logs", error: err.message });
  }
};

module.exports = { getStoryLogs };
