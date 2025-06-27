import React, { useState, useEffect } from "react";
import StoryForm from "../components/StoryCreationForm/StoryCreationForm.jsx";
import Navbar from "../components/navbar/Navbar.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../../utils/ApiRequest.js";

/**
 * UpdateStory component renders the interface for updating a new story.
 *
 * Includes a navigation bar, a close (X) button, a header,
 * and the story form in "edit" mode.
 * The component also fetches the existing story data
 */
const UpdateStory = () => {
  const { storyId } = useParams();
  const [existingStory, setExistingStory] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const navigate = useNavigate();

  /**
 * Handles the click event to close the story and unlock it for further editing.
 * Sends a PUT request to unlock the story.
 */
  const handleCloseClick = async () => {
    try {
      await apiRequest(`unlockStory/${storyId}`, "PUT");
      console.log("Story unlocked successfully. Navigating to edit page...");
      navigate(`/Home`);
    } catch (error) {
      console.error("Error unlocking story:", error);
    }
  };

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await apiRequest(`viewStory/${storyId}`, "GET");
        const data = await response;
        console.log("Fetched story data:", data);
        setExistingStory(data.story);
      } catch (error) {
        console.error("Error fetching story:", error);
        setError("Failed to fetch story data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [storyId]);

  const styles = {
    h1: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "1px",
      textAlign: "center",
      marginTop: "40px",
    },
  };

  return (
    <div>
      <Navbar />
      <div className="pt-20">
        <button className='x-button' onClick={handleCloseClick}>
          X
          </button>
        <h1 style={styles.h1} >
          Update Story
          </h1>
          {loading ? (
            <p>Loading...</p> // Show loading message until the data is fetched
          ) : error ? (
            <p>{error}</p> // Display error message if there's an issue
          ) : existingStory ? (
          <StoryForm mode="edit" currentStory={existingStory} />
        ) : (
        <p>No story found!</p> // Handle case where no story is fetched
      )}
      </div>
    </div>
  );
};

export default UpdateStory;
