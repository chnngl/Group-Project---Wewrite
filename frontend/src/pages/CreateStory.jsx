import React from "react";
import StoryForm from "../components/StoryCreationForm/StoryCreationForm";
import Navbar from "../components/navbar/Navbar";
import XButton from '../components/XButton/XButton';

/**
 * CreateStory component renders the interface for creating a new story.
 *
 * Includes a navigation bar, a close (X) button, a header,
 * and the story form in "create" mode.
 */
const CreateStory = () => {
  const h1Style = {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "1px",
    textAlign: "center",
    marginTop: "20px",
  };

  return (
    <>
      <Navbar />
      <div className="pt-20">
      <XButton/>
      <h1 style={h1Style}>Create New Story</h1>
        <br></br>
        <StoryForm mode="create" />
      </div>
    </>
  );
};

export default CreateStory;
