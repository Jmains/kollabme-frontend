import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import { nFormatter } from "../../utils/numFormatter";
import { ProfileStatsDetailTypes } from "../../constants/ProfileStatsDetailTypes";
import { Heart } from "../icons";

function LikeButton({ user, post }) {
  const [likePost] = useMutation(LIKE_POST, {
    variables: { postId: post.id },
    onError: (err) => {
      console.log("Failed to like post: ", err);
    },
  });
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && post.likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, post.likes]);

  return (
    <>
      {user ? (
        liked ? (
          <div className="flex">
            <button
              aria-label={`unlike button, ${post.likeCount} likes`}
              onClick={likePost}
              className="flex items-center hover:text-pink-800 cursor-pointer"
            >
              <Heart className="h-4 w-4 sm:w-5 sm:h-5 mr-1 fill-current text-pink-600 transform hover:scale-110 duration-150 ease-out" />
              <span
                tabIndex="-1"
                className="text-pink-600 text-xs sm:text-sm font-semibold cursor-pointer"
              >
                {nFormatter(post.likeCount)}
              </span>
            </button>
          </div>
        ) : (
          <div>
            <button
              aria-label={`like button, ${post.likeCount} likes`}
              onClick={likePost}
              className="flex items-center hover:fill-current hover:text-pink-800 cursor-pointer transition duration-300 ease-out"
            >
              <Heart className="h-4 w-4 sm:w-5 sm:h-5 mr-1 transform hover:scale-110" />
              <span tabIndex="-1" className="text-xs sm:text-sm font-semibold cursor-pointer">
                {nFormatter(post.likeCount)}
              </span>
            </button>
          </div>
        )
      ) : (
        <>
          <Link
            aria-label={`like button, ${post.likeCount} likes`}
            className="flex items-center hover:text-pink-800 cursor-pointer transition duration-300 ease-out"
            to="/login"
          >
            <Heart className="h-4 w-4 sm:w-5 sm:h-5 mr-1 " />
            <span tabIndex="-1" className="text-xs sm:text-sm font-semibold cursor-pointer">
              {nFormatter(post.likeCount)}
            </span>
          </Link>
        </>
      )}
    </>
  );
}

// Return post id so Apollo knows to update the post with id with new field automagically
const LIKE_POST = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;
