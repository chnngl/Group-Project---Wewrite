const express = require("express");
const router = express.Router();
const storyController = require("../controller/storyController");
const authMiddleware = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");

// View a story by id, to display the story when a user clicks a particular story
router.get("/viewStory/:id", authMiddleware, storyController.viewStoryById);

//Story Creation
router.post("/create", authMiddleware, uploadMiddleware, storyController.createStory);

// Filter stories by tags, if empty return all stories
router.get("/stories", authMiddleware, storyController.getStories);

// Search stories by title
router.get("/search/title/:titlePattern", authMiddleware, storyController.searchByTitle);

// Edit a story given its id
router.put("/edit/:id", authMiddleware, uploadMiddleware, storyController.editStoryById);

//Lock a story when a user starts editing
router.put("/lockStory/:id", authMiddleware, storyController.lockStory);

//UnLock a story when a user starts editing
router.put("/unlockStory/:id", authMiddleware, storyController.unlockStory);

//Delete a story
router.delete("/delete/:id", authMiddleware, storyController.deleteStory);

module.exports = router;