import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { nFormatter } from "../../utils/numFormatter";
import { PaintBrush } from "../icons";

function LikePaintingButton({ user, painting: { id, likeCount, likes } }) {
  const [likePainting] = useMutation(LIKE_PAINTING, {
    variables: { paintingId: id },
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
        aria-label={`unlike painting, ${likeCount} likes`}
        className="flex items-center text-green-500 cursor-pointer"
        onClick={likePainting}
      >
        <PaintBrush className="fill-current rounded-full h-5 w-5 hover:scale-110 transform transition duration-300 ease-in-out" />
        <span className="inline-block text-sm font-semibold ml-1">
          {nFormatter(likeCount)}
        </span>
      </button>
    ) : (
      <button
        aria-label={`like painting, ${likeCount} likes`}
        onClick={likePainting}
        className="text-gray-600 items-center hover:text-green-500 transition duration-300 ease-in-out flex cursor-pointer"
      >
        <PaintBrush className="fill-current rounded-full h-5 w-5 hover:scale-110 transform transition duration-300 ease-in-out" />

        <span className="inline-block text-xs sm:text-sm font-semibold ml-1">
          {nFormatter(likeCount)}
        </span>
      </button>
    )
  ) : (
    <Link
      to="/login"
      aria-label={`like painting, ${likeCount} likes`}
      className="text-gray-600 items-center hover:text-green-500 transition duration-300 ease-in-out cursor-pointer flex"
    >
      <PaintBrush className="fill-current rounded-full h-5 w-5 hover:scale-110 transform transition duration-300 ease-in-out" />
      <span className="inline-block text-base font-semibold ml-1">
        {nFormatter(likeCount)}
      </span>
    </Link>
  );
  return likeButton;
}

const LIKE_PAINTING = gql`
  mutation likePainting($paintingId: ID!) {
    likePainting(paintingId: $paintingId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikePaintingButton;
