import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { nFormatter } from "../../utils/numFormatter";

function LikeVideoButton({ user, video: { id, likeCount, likes } }) {
  const [likeVideo] = useMutation(LIKE_VIDEO, {
    variables: { videoId: id },
  });
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  const likeButton = user ? (
    liked ? (
      <button
        aria-label={`unlike video, ${likeCount} likes`}
        className="flex items-center text-purple-600 cursor-pointer"
        onClick={likeVideo}
      >
        <svg
          className="fill-current rounded-full h-5 w-5 hover:scale-110 transform transition duration-300 ease-in-out"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M24 24H0V0h24v24z" fill="none" />
          <path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z" />
        </svg>

        <span className="inline-block text-sm font-semibold ml-1">
          {nFormatter(likeCount)}
        </span>
      </button>
    ) : (
      <button
        aria-label={`like video, ${likeCount} likes`}
        onClick={likeVideo}
        className="text-gray-600 items-center hover:text-purple-600 transition duration-300 ease-in-out flex cursor-pointer"
      >
        <svg
          className="fill-current rounded-full h-5 w-5 hover:scale-110 transform transition duration-300 ease-in-out"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M24 24H0V0h24v24z" fill="none" />
          <path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z" />
        </svg>

        <span className="inline-block text-xs sm:text-sm font-semibold ml-1">
          {nFormatter(likeCount)}
        </span>
      </button>
    )
  ) : (
    <Link
      to="/login"
      aria-label={`like video, ${likeCount} likes`}
      className="text-gray-600 items-center hover:text-purple-600 transition duration-300 ease-in-out cursor-pointer flex"
    >
      <svg
        className="fill-current rounded-full h-5 w-5 hover:scale-110 transform transition duration-300 ease-in-out"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M24 24H0V0h24v24z" fill="none" />
        <path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z" />
      </svg>
      <span className="inline-block text-base font-semibold ml-1">
        {nFormatter(likeCount)}
      </span>
    </Link>
  );
  return likeButton;
}

const LIKE_VIDEO = gql`
  mutation likeVideo($videoId: ID!) {
    likeVideo(videoId: $videoId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeVideoButton;
