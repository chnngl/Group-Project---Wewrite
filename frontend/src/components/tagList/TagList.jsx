import React from "react";
import "./TagList.css";

const TagList = ({ genres }) => {
    {
        return (
            <div className="genre-container flex flex-wrap gap-2 mt-2">
                {genres.map((genre, index) => (
                    <div key={index} className="genre-box">
                        {genre}
                    </div>
                ))}
            </div>
        );
    }
};



export default TagList;
