import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import Navbar from "../../components/navbar/Navbar";
import LogList from "../../components/log/LogList";
import StoryCard from "../../components/storyCard/StoryCard";
import XButton from '../../components/XButton/XButton';
import { apiRequest } from "../../../utils/ApiRequest";
import "./LogPage.css";

const LogHistory = () => {
  const { storyId } = useParams(); // Get storyId from URL
  const [logs, setLogs] = useState([]);
  const [storyTitle, setStoryTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  // New state: pageLimit (number of logs per page)
  const [pageLimit, setPageLimit] = useState(12); // default to 12 for large screens

  // Update the pageLimit value based on current window width
  useEffect(() => {
    const updatePageLimit = () => {
      const width = window.innerWidth;
      if (width < 640) {
        // Small devices: e.g., mobile phones
        setPageLimit(8);
      } else if (width >= 640 && width < 1024) {
        // Medium devices: e.g., tablets
        setPageLimit(12);
      } else {
        // Larger devices: desktops
        setPageLimit(14);
      }
    };

    // Run the function initially
    updatePageLimit();

    // Add event listener for window resize
    window.addEventListener("resize", updatePageLimit);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", updatePageLimit);
  }, []);

  // Update fetchLogs to use the dynamic pageLimit in the request URL
  const fetchLogs = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await apiRequest(
        `logs/${storyId}?page=${pageNum}&limit=${pageLimit}`
      );
      console.log(response);
      setLogs(response.logs || []); // Ensure it's always an array
      setStoryTitle(response.storyTitle);
      setTags(response.storyTag || []);
      setIsLocked(response.isLocked || false);
      setPage(response.pagination.page);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      console.error("Fetch logs error:", err.message);
      setError(`Failed to fetch logs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch logs when either the page number changes or the pageLimit changes (due to resize)
  useEffect(() => {
    fetchLogs(page);
  }, [page, pageLimit]);

  const onPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const navigate = useNavigate();

  /**
 * Handles the click event for the "View" button associated with a story.
 * navigates to the story view page.
 *
 * @param {string} storyId - The unique identifier of the story
 */
  const handleViewClick = (storyId) => {
    console.log("View button clicked for story:", storyId);
    navigate(`/viewStory/${storyId}`);
  };

  /**
 * Handles the click event for the "Edit" button associated with a story
 * Lock the story for editing and navigates to the story's update page.
 *
 * @param {string} storyId - The unique identifier of the story
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
 * Handles the click event for the "Delete" button associated with a story.
 * Displays a confirmation dialog, if the user confirms,deletes the story
 *  and navigates to Home page.
 *
 * @param {string} storyId - The unique identifier of the story
 */
  const handleDeleteClick = (storyId) => {
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
          Swal.fire("Deleted!", "Your story has been deleted.", "success");
          navigate(`/Home`);
        } catch (err) {
          console.error("Error deleting story:", err);
          Swal.fire("Oops!", "Error deleting story. Please try again.", "error");
        }
      }
    });
  };

  return (
    <div className="log-page pt-10">
      <Navbar headerContent="We - Write" />
      <div className="pt-10">
      <XButton/>
      </div>
      <div className="container mx-auto pt-5">
        <StoryCard
          title={storyTitle}
          tags={tags}
          storyId={storyId}
          showDesktopIcon={false}
          isLocked={isLocked}
          onViewClick={handleViewClick}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
        <h3 className="text-center text-lg my-3">
          {storyTitle || "Story"} Log History
        </h3>
        {loading && <p>Loading logs...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <LogList
            logs={logs}
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
        {/* Pagination Controls */}
        <div className="flex items-center justify-center gap-4 px-4 py-2 bg-white rounded">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="flex items-center gap-1 px-4 py-2 hover:bg-gray-100 disabled:opacity-70 rounded"
          >
            <FaArrowLeft />
            Previous
          </button>
          <span className="text-gray-700 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="flex items-center gap-1 px-4 py-2 hover:bg-gray-100 disabled:opacity-70 rounded"
          >
            Next
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogHistory;
