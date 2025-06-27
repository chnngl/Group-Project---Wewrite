import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import { apiRequest } from "../../../utils/ApiRequest";

import XButton from '../../components/XButton/XButton';
import "./ViewStory.css";

const ViewStory = () => {
  const { storyId } = useParams(); // Retrieve story ID from the URL
  const [story, setStory] = useState(null); // Story data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    setLoading(true);
    // Fetch story details from the API
    const fetchStory = async () => {
      try {
        const response = await apiRequest(`viewStory/${storyId}`);
        console.log(response);
        setStory(response.story); // Set story data
      } catch (err) {
        console.error("Fetch Error:", err.message);
        setError("Failed to fetch the story");
      } finally {
        setLoading(false); // Ensure loading is set to false
      }
    };
    fetchStory();
  }, [storyId]);

  if (loading) {
    return <p>Loading story...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="view-story-page">
      <Navbar headerContent="We - Write" />
      <div className="view-story">
        <XButton />
        {/* Left Sidebar */}
        <div className="sidebar">
          <ul className="snapshot-list">
            {story.snapshots.map((snapshot, index) => (
              <li key={index} className="snapshot-item">
                <a href={`#snapshot-${index}`} className="snapshot-link">
                  {snapshot.heading}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {/* Main Content */}
        <div className="content">
          <h1>{story.title}</h1>
          <div className="storytags">
            <strong>Tags:</strong> {story.tags.join(", ")}
          </div>
          {story.snapshots.map((snapshot, index) => (
            <div
              key={snapshot._id}
              id={`snapshot-${index}`}
              className="story-section"
            >
              <h2 id={`snapshot-${index}`}>{snapshot.heading}</h2>
              <p>{snapshot.content}</p>
              <div className="row justify-content-center w-100 py-4">
                {snapshot.files.map((image, idx) => (
                  <div
                    key={idx}
                    className="col-12 col-md-6 col-lg-4 mb-4 d-flex justify-content-center"
                  >
                    {/* card with fixed height, flex‑centering, shadow and rounding */}
                    <div
                      className="shadow-lg rounded overflow-hidden d-flex justify-content-center align-items-center bg-white"
                      style={{
                        height: '300px',      /* same height for every card */
                        width: '100%',        /* fill the column */
                        maxWidth: '350px'     /* optional cap so very wide columns don’t blow it up */
                      }}
                    >
                      <img
                        src={`data:${image.imageType};base64,${image.imageData}`}
                        alt={image.imageName}
                        className="img-fluid"
                        style={{
                          maxHeight: '100%',
                          maxWidth: '100%',
                          objectFit: 'contain',  /* show whole image, letterboxed if needed */
                          display: 'block'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>


            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ViewStory;
