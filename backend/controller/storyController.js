const Story = require("../models/Story");
const Log = require("../models/Log");
const mongoose = require("mongoose");

/**
 * Fetch a story from the collection using the story id and save the view logs
 *
 * @param {string} req.params.storyId - The ID of the story
 * @returns JSON response with the story details and view log
 */
exports.viewStoryById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!validateObjectId(id, res)) return;

        const story = await Story.findById(id);

        if (!story) {
            return res.status(404).json({ message: "Story not found" });
        }

        const storyObj = story.toObject();

        // Convert image Buffers to base64 Data URIs
        storyObj.snapshots.forEach(snapshot => {
          if (snapshot.files && snapshot.files.length > 0) {
            snapshot.files = snapshot.files.map(image => ({
              name: image.name,
              imageType: image.imageType,
              imageData: image.imageData?.toString('base64') || null
            }));
          }
        });    

         //Add view logs
        const logEntry = new Log({
            storyId: id,
            userId: req.user || 'unknown', 
            action: "VIEWED",
            timestamp: new Date()
        });

        await logEntry.save();

        res.status(200).json({
            message: "Story retrieved successfully",
            story: storyObj,
            log: logEntry
        });
    } catch (error) {
        console.error("Error retrieving story:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


/**
 * Create a new story and save the document in Story collection. Also adds a create log.
 *
 * @param {Object} req - The request body contains story details - title, tags, snapshots(can contain images)
 * @returns JSON response with the created story details and create log
 */
    exports.createStory = async (req, res) => {
    
      const { title, tags, snapshots } = req.body;
      try {
          const authorId = req.user || 'unknown';
  
          let parsedSnapshots = snapshots;
  
          if (req.files && req.files.length > 0) {
            parsedSnapshots.forEach((snap, i) => {
                const filesForSnapshot = req.files.filter(file => 
                    file.fieldname === `snapshots[${i}][files]`
                );
                // Map the files to include the image details
                snap.files = filesForSnapshot.map(file => ({
                    name: file.originalname,
                    imageData: file.buffer,
                    imageType: file.mimetype
                }));
            });
        }
        const newStory = new Story({
              title,
              tags,
              authorId,
              snapshots: parsedSnapshots
          });
  
          await newStory.save();
  
          // Story creation log
          const logEntry = new Log({
              storyId: newStory.id,
              userId: req.user,
              action: "CREATED",
              timestamp: new Date()
          });
  
          await logEntry.save();
  
          res.status(201).json({
              msg: "Story created successfully!",
              story: {
                  id: newStory._id,
                  title: newStory.title,
                  tags: newStory.tags,
                  authorId: newStory.authorId,
                  snapshots: newStory.snapshots,
                  createdAt: newStory.createdAt
              },
              log: logEntry
          });
  
      } catch (error) {
          console.error("Database Error:", error);
          res.status(500).json({ msg: "Server error", error: error.message });
      }
  };
  


/**
 * Fetch all the stories based on tag list filter.If tags list is empty all stories are retrieved
 * 
 * @param {[strings]} req.params.tagsArray - Contain the list of tags, can be empty
 * @returns JSON response with the list of filtered stories
 */
exports.getStories = async (req, res) => {
    try {
        const { tags } = req.query;

        let stories;
        if (!tags || tags.length === 0) {
            // fetch all stories
            stories = await Story.find({},'title tags isLocked');
        } else {
            // Tags provided, filter stories by tags
            const tagsArray = tags.split(',');  
            stories = await Story.find({ tags: { $in: tagsArray } }, 'title tags isLocked');
        }
        console.log(stories)
        res.status(200).json({
            message: "Story retrieved successfully",
            story : stories,
        });
    } catch (error) {
        console.error("Error fetching stories:", error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};

// Search stories by title pattern
exports.searchByTitle = async (req, res) => {
    try {
        const { titlePattern } = req.params;
        
        const stories = await Story.find({ title: { $regex: titlePattern, $options: "i" } });

        if (stories.length === 0) {
            return res.status(404).json({ msg: "No stories found" });
        }

        res.json(stories);
    } catch (error) {
        console.error("Error searching stories by title:", error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};

/**
 *  Edit an existing story and update the document in Story collection. Also adds an edit log.
 *
 * @param {string} req.params.storyId - The ID of the story
 * @param {Object} req - The request body contains updated story details
 * @returns JSON response with the updated story details and edit log
 */
exports.editStoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id, res)) return;

    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    story.title = req.body.title || story.title;
    story.tags = req.body.tags || story.tags;
    story.isLocked = false;
    story.lockedBy = null;
    story.updatedAt = Date.now();

    // Parse snapshots
    let parsedSnapshots = [];
    if (req.body.snapshots) {
      try {
        parsedSnapshots = typeof req.body.snapshots === 'string' 
          ? JSON.parse(req.body.snapshots) 
          : req.body.snapshots;
      } catch (error) {
        return res.status(400).json({ msg: "Invalid JSON format in snapshots." });
      }
    }
    story.snapshots = [];
    for (const [i, snapshot] of parsedSnapshots.entries()) {
      const newSnapshot = {
        heading: snapshot.heading,
        content: snapshot.content,
        files: []
      };
      if (Array.isArray(snapshot.files)) {
        newSnapshot.files = snapshot.files.map(file => ({
          name: file.name,
          imageData: file.imageData ? Buffer.from(file.imageData) : undefined,
          imageType: file.imageType
        })).filter(file => file.imageData);
      }
      if (req.files) {
        const filesForSnapshot = req.files.filter(file => 
          file.fieldname.startsWith(`snapshots[${i}][files]`)
        );

        filesForSnapshot.forEach(file => {
          newSnapshot.files.push({
            name: file.originalname,
            imageData: file.buffer,
            imageType: file.mimetype
          });
        });
      }

      story.snapshots.push(newSnapshot);
    }
    await story.validate();
    const updatedStory = await story.save();

    // Log the edit action
    const logEntry = new Log({
      storyId: id,
      userId: req.user || 'unknown',
      action: "EDITED",
      timestamp: new Date(),
    });
    await logEntry.save();

    res.status(200).json({
      message: "Story updated successfully",
      story: updatedStory,
      log: logEntry,
    });
  } catch (error) {
    console.error("Error updating story:", error);
    res.status
  }
};
  

/**
 * Locks a story by updating the isLocked and lockedBy parameter
 *
 * @param {string} req.params.storyId - The ID of the story
 * @returns JSON response with the message and story details 
 */
exports.lockStory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!validateObjectId(id, res)) return;
        const story = await Story.findById(id);
        if (!story) {
            return res.status(404).json({ message: "Story not found" });
        }

        // Check if the story is already locked
        if (story.isLocked) {
            return res.status(400).json({ message: "Story is already locked" });
        }
        const updatedStory = await Story.findByIdAndUpdate(
            id,
            {
                $set: {
                    isLocked: true,
                    lockedBy: req.user || 'unknown'
                }
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: "Story locked successfully",
            story: updatedStory,
        });
    } catch (error) {
        console.error("Error locking story:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Unlocks a story by updating the isLocked and lockedBy parameter
 *
 * @param {string} req.params.storyId - The ID of the story
 * @returns JSON response with the message 
 */
exports.unlockStory = async (req, res) => {
  try {
      const { id } = req.params;

      if (!validateObjectId(id, res)) return;
      // Find the story by ID
      const story = await Story.findById(id);
      if (!story) {
          return res.status(404).json({ message: "Story not found" });
      }

      // Check if the story is already locked
      if (story.isLocked) {
          // UnLock the story by updating it
        updatedStory = await Story.findByIdAndUpdate(
        id,
        {
            $set: {
                isLocked: false,
                lockedBy: null
            }
        },
        { new: true, runValidators: true }
        );
      } else {
        return res.status(400).json({ message: "Story is already unlocked" });
      }
      res.status(200).json({
          message: "Story unlocked successfully"
      });
  } catch (error) {
      console.error("Error unlocking story:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Deletes a story given its id
 * @param {string} req.params.storyId - The ID of the story
 * @returns JSON response with the message
 */
exports.deleteStory = async (req, res) => {
    const storyId = req.params.id;
    if (!validateObjectId(storyId, res)) return;
  
    try {
      const story = await Story.findById(storyId);
  
      if (!story) {
        return res.status(404).json({ msg: "Story not found" });
      }
  
      await story.deleteOne();

    res.json({
        msg: "Story deleted successfully"
    });

    } catch (error) {
      console.error("Error deleting story:", error);
      res.status(500).json({ msg: "Server error" });
    }
  };

//Validate the id obtained
const validateObjectId = (id, res) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid ID format" });
        return false;
    }
    return true;
};