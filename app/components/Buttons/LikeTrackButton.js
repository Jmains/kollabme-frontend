import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { nFormatter } from "../../utils/numFormatter";
import { Fire } from "../icons";

function LikeTrackButton({ user, track: { id, likeCount, likes } }) {
  const [likeTrack] = useMutation(LIKE_TRACK, {
    variables: { trackId: id },
  });
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  return (
    <>
      {user ? (
        liked ? (
          <button
            aria-label={`unlike track, ${likeCount} likes`}
            className="flex items-center text-orange-600 cursor-pointer"
            onClick={likeTrack}
          >
            <Fire className="fill-current rounded-full h-5 w-5 hover:scale-110 transform transition duration-300 ease-in-out" />
            <span className="inline-block text-sm font-semibold ml-1">
              {nFormatter(likeCount)}
            </span>
          </button>
        ) : (
          <button
            aria-label={`like track, ${likeCount} likes`}
            onClick={likeTrack}
            className="text-gray-600 items-center hover:text-orange-600 transition duration-300 ease-in-out flex cursor-pointer"
          >
            <Fire className="fill-current rounded-full h-5 w-5 hover:scale-110 transform transition duration-300 ease-in-out" />
            <span className="inline-block text-xs sm:text-sm font-semibold ml-1">
              {nFormatter(likeCount)}
            </span>
          </button>
        )
      ) : (
        <Link
          to="/login"
          aria-label={`like track, ${likeCount} likes`}
          className="text-gray-600 items-center hover:text-orange-600 transition duration-300 ease-in-out cursor-pointer flex"
        >
          <Fire className="fill-current rounded-full h-5 w-5" />
          <span className="inline-block text-base font-semibold ml-1">
            {nFormatter(likeCount)}
          </span>
        </Link>
      )}
    </>
  );
}

const LIKE_TRACK = gql`
  mutation likeTrack($trackId: ID!) {
    likeTrack(trackId: $trackId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeTrackButton;
