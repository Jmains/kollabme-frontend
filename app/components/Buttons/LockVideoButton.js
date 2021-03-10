import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";

function LockVideoButton({ user, video }) {
  const [makePublic] = useMutation(MAKE_VIDEO_PUBLIC, {
    variables: { videoId: video.id },
    onError: (err) => {
      console.log(err);
    },
  });

  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    if (user && video.isPublic === true) {
      setIsPublic(true);
    } else {
      setIsPublic(false);
    }
  }, [user, video.isPublic]);

  const lockButton = user ? (
    isPublic ? (
      <button aria-label="hide from public" onClick={makePublic} className="cursor-pointer">
        <svg
          className="h-5 w-5 fill-current text-yellow-700 hover:scale-110 transform transition duration-300 ease-in-out"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z" />
        </svg>
      </button>
    ) : (
      <button aria-label="make public" onClick={makePublic} className="cursor-pointer">
        <svg
          className="h-5 w-5 fill-current text-gray-600 hover:text-yellow-700 hover:scale-110 transform transition duration-300 ease-in-out"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
        </svg>
      </button>
    )
  ) : (
    <Link to="/login" className="cursor-pointer">
      <svg
        className="h-5 w-5 fill-current text-gray-600 hover:text-yellow-700 hover:scale-110 transform transition duration-300 ease-in-out"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
      </svg>
    </Link>
  );

  return lockButton;
}

const MAKE_VIDEO_PUBLIC = gql`
  mutation makeVideoPublic($videoId: ID!) {
    makeVideoPublic(videoId: $videoId) {
      id
      isPublic
    }
  }
`;

export default LockVideoButton;
