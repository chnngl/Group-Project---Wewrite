import React from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const ProfileCard = ({ name, id, description, image, social }) => {
  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl px-10 py-8 flex flex-col md:flex-row items-center gap-8 min-h-[280px] md:min-h-[300px]">
      {/* Left: Text */}
      <div className="flex-1 text-left flex flex-col justify-center">
        <h2 className="text-4xl font-bold mb-1">{name}</h2>
        <p className="text-sm font-semibold text-gray-500 mb-2">ID: {id}</p>
        <p className="text-gray-700 text-lg mb-4">{description}</p>
        <div className="flex gap-5 text-3xl text-blue-600">
          {social?.linkedin && (
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
              <FaLinkedin />
            </a>
          )}
          {social?.github && (
            <a href={social.github} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
              <FaGithub />
            </a>
          )}
        </div>
      </div>

      {/* Right: Image */}
      <div className="flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-74 h-58 object-cover rounded-xl shadow-md"
        />
      </div>
    </div>
  );
};

export default ProfileCard;
