import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import StoryList from "../components/storyList/StoryList";
import Navbar from "../components/navbar/Navbar";

import { FaPlus, FaChevronDown } from "react-icons/fa"; // Import plus icon

const Home = () => {

  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Static list of tags
  const tags = ["adventure", "thriller", "science fiction", "time travel", "mystery", "creative", "world", "tech", "poetry", "fiction"];

  // Handle tag selection
  const handleTagChange = (tag) => {
    setSelectedTags(prevSelected =>
      prevSelected.includes(tag)
        ? prevSelected.filter(t => t !== tag)  // Remove tag if already selected
        : [...prevSelected, tag]  // Add tag if not selected
    );
  };

  return (
    <>
      <Navbar headerContent='Welcome to We - Write' />
      <div className="container mx-auto pt-22">
        {/* Header Section */}
        <div className="flex justify-end items-center">

          <div className="flex gap-4">
            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="border border-gray-400 flex items-center gap-2 px-3 py-1 rounded-3 shadow-md hover:bg-gray-200"
            >
              Filter by tag
              <FaChevronDown />
            </button>

            {/* Create Story Button */}
            <button
              onClick={() => navigate('/CreateStory')}
              className="border border-gray-400 flex items-center gap-2 px-3 py-1 rounded-3 shadow-md hover:bg-gray-200">
              <FaPlus />
              Create Story
            </button>
          </div>
        </div>

        {/* Filter Section */}
        {showFilters && (
          <div className="border p-3 rounded-lg mt-2 bg-white shadow-md">
            <h6>Select Tags:</h6>
            <div className="flex flex-wrap gap-6 justify-content-around">
              {tags.map(tag => (
                <label key={tag} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleTagChange(tag)}
                  />
                  {tag}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <StoryList selectedTags={selectedTags} />
    </>
  );
};

export default Home;
