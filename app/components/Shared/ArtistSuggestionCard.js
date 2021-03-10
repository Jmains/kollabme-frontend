import React, { useEffect } from "react";

const buttonBg = {
  background:
    "linear-gradient(90deg, rgba(0, 121, 145, 0.5) 0%, rgba(120, 255, 214, 0.5) 100%)",
};

function ArtistSuggestionCard({ firstName, lastName, genre, profilePic }) {
  return (
    <div className="relative flex items-center bg-black bg-opacity-25 shadow-md rounded-full w-full py-2 mx-3 mt-3">
      <img
        className="w-10 h-10 object-cover object-center rounded-full ml-3"
        src={profilePic}
        alt="Profile Picture"
      />
      <h4 className="ml-6 text-gray-500 font-bold tracking-wider text-md">
        {`${firstName} ${lastName}`} <p className="block text-xs text-gray-600">{genre}</p>
      </h4>
      <button
        style={buttonBg}
        className="absolute inset-y-0 right-0 text-sm font-semibold text-gray-400 rounded-full my-3 mr-4 px-4 shadow-md hover:bg-teal-400 hover:text-black transition ease-out duration-200"
      >
        Follow
      </button>
    </div>
  );
}

export default ArtistSuggestionCard;
