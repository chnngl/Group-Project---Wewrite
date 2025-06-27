import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import StoryCard from "../storyCard/StoryCard";
import { apiRequest } from "../../../utils/ApiRequest";

const StoryList = ({ selectedTags }) => {
  const [stories, setStories] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

/**
 * Handles the click event on a story card to view its log history.
 *
 * @param {string} storyId - The unique identifier of the story to view log history for.
 */  
const handleLogHistoryClick = async (storyId) => {
    console.log("Log history clicked for story:", storyId);
    // e.g., navigate to a desktop preview page:
    await navigate(`/loghistory/${storyId}`);
  };

  /**
 * Handles the click event on the "View" button for a story.
 *
 * @param {string} storyId - The unique identifier of the story to view.
 */
  const handleViewClick = (storyId) => {
    console.log("View button clicked for story:", storyId);
    navigate(`/viewStory/${storyId}`);
  };

  /**
 * Handles the click event on the "Edit" button for a story.
 *
 * Also Locks the story by making an API request before navigating
 * to the edit page.
 * @param {string} storyId - The unique identifier of the story to edit.
 */
  const handleEditClick = async (storyId) => {
    try {
      await apiRequest(`lockStory/${storyId}`, "PUT");
      console.log("Story locked successfully. Navigating to edit page...");
      navigate(`/UpdateStory/${storyId}`);
    } catch (error) {
      console.error("Error locking story:", error);
      alert("Failed to lock the story for editing. Please try again.");
    }
  };

  /**
 * Fetches stories from the server, optionally filtered by selected tags.
 *
 * Calls API endpoint based on selected tags and makes a GET request
 * to retrieve the stories. 
 */
  const fetchStories = async () => {
    let endpoint = "stories";
    if (selectedTags.length > 0) {
      endpoint += `?tags=${selectedTags.join(",")}`;
    }

    try {
      const res = await apiRequest(endpoint); // default method is "GET"
      setStories(res.story);
    } catch (err) {
      console.error("API request failed", err);
    }
  };

  /**
 * Handles the click event for deleting a story.
 *
 * Displays a confirmation dialog using SweetAlert2. If the user confirms,
 * sends a DELETE request to the server to remove the story.
 * @param {string} storyId - The unique identifier of the story to delete.
 */
  const handleDeleteClick = async (storyId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiRequest(`delete/${storyId}`, "DELETE");
          await fetchStories(); // re-fetch stories after deletion
          Swal.fire("Deleted!", "Your story has been deleted.", "success");
        } catch (err) {
          console.error("Error deleting story:", err);
          Swal.fire("Oops!", "Error deleting story. Please try again.", "error");
        }
      }
    });
  };

  useEffect(() => {
    fetchStories();
  }, [selectedTags]);

  return (
    <div className="container mt-4">
      {stories.map((story, index) => (
        <StoryCard
          key={index}
          title={story.title}
          tags={story.tags}
          storyId={story._id}
          isLocked={story.isLocked}
          onLogHistoryClick={handleLogHistoryClick}
          onViewClick={handleViewClick}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
      ))}
    </div>
  );
};

export default StoryList;
