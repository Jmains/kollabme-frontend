import React, { useEffect } from "react";
import AudioPlayer from "../MediaPlayers/AudioPlayer";
import ReactAudioPlayer from "../MediaPlayers/ReactAudioPlayer";
import LikeTrackButton from "../Buttons/LikeTrackButton";
import LockTrackButton from "../Buttons/LockTrackButton";
import { Link, NavLink } from "react-router-dom";

function PostEmbeddedTrack({ track, user, profileUsername }) {
  return (
    <div className="bg-cardBg shadow-md rounded-md hover:bg-black hover:bg-opacity-25 transition duration-300 ease-in-out border border-gray-700 p-1 my-1">
      <NavLink
        to={`/${profileUsername}/tracks/${track.id}`}
        className="flex relative items-center  bg-opacity-25  p-1"
      >
        <img
          className="m-2 rounded-lg h-12 w-12 object-center object-cover shadow-md"
          src={track.imageUrl}
          alt="Profile Pic"
        />
        <div className="ml-1">
          <h1 className="text-gray-400 w-32 md:w-48 text-xs sm:text-sm truncate font-extrabold tracking-wide ">
            {track.title}
          </h1>
          <p className="text-gray-600 font-medium text-xs sm:text-sm w-32 md:w-48 truncate">
            {track.artistName}
          </p>
        </div>

        <div className="flex items-center sm:ml-8 ml-2">
          <LikeTrackButton user={user} track={track} />
        </div>

        <button className="absolute bottom-0 mb-6 right-0 mr-1 text-gray-500 text-xs cursor-pointer">
          <svg
            className="fill-current text-gray-500 h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </NavLink>
      <div className="w-full">
        <ReactAudioPlayer audioSource="https://intreecate.s3-us-west-1.amazonaws.com/videos/khoii-2nd-try-mp3-1598670331003" />
      </div>
    </div>
  );
}

export default PostEmbeddedTrack;
