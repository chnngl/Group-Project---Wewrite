import React from "react";
import { motion } from "motion/react";
import { FaEye, FaEdit, FaTrash, FaDesktop } from "react-icons/fa";

import TagList from "../tagList/TagList";


const StoryCard = ({
  title,
  tags,
  storyId,
  showDesktopIcon = true,
  isLocked = false,
  onLogHistoryClick,
  onViewClick,
  onEditClick,
  onDeleteClick
}) => {

  return (
    <motion.div
      className="bg-gray-100 p-2 m-2.5 rounded-lg shadow-md flex justify-between items-center transition-all"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      style={{ backgroundColor: "rgb(202, 205, 202)" }}
    >
      <div>
        <h6 className="font-bold">{title}</h6>
        <TagList genres={tags} />
      </div>

      {/* Icons */}
      <div className="flex gap-3 text-gray-500 flex-wrap">
        {showDesktopIcon && (
          <FaDesktop
            className="hover:text-black cursor-pointer"
            title={"View Logs"}
            onClick={() => onLogHistoryClick?.(storyId)}
          />
        )}
        <FaEye
          className="hover:text-black cursor-pointer"
          title={"View story"}
          onClick={() => onViewClick?.(storyId)}
        />
        <FaEdit
          className={`${isLocked
            ? "opacity-50 cursor-not-allowed"
            : "hover:text-blue-500 cursor-pointer"
            }`}
          title={
            isLocked
              ? "STORY is locked since someone is editing it"
              : "Edit story"
          }
          onClick={() => {
            if (!isLocked) {
              onEditClick?.(storyId);
            }
          }}
        />
        <FaTrash
          className={`${isLocked
            ? "opacity-50 cursor-not-allowed"
            : "hover:text-red-500 cursor-pointer"
            }`}
          title={
            isLocked
              ? "STORY can't be deleted since someone is editing it"
              : "Delete story"
          }
          onClick={() => {
            if (!isLocked) {
              onDeleteClick?.(storyId);
            }
          }}
        />
      </div>
    </motion.div>
  );
};

export default StoryCard;
