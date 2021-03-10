import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import { nFormatter } from "../../utils/numFormatter";
import { Heart } from "../icons";

function LikeCommentReplyButton({ user, commentReply, commentId }) {
  const [likeCommentReply] = useMutation(LIKE_COMMENT_REPLY, {
    variables: { commentReplyId: commentReply.id, commentId: commentId },
    onError: (err) => {
      throw new Error("Failed to like commentReply: ", err);
    },
  });
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && commentReply.likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, commentReply.likes]);

  // TODO: Configure cool UI things later for when button is clicked
  const likeButton = user ? (
    liked ? (
      <button
        aria-label={`unlike comment reply, ${commentReply.likeCount} likes`}
        onClick={likeCommentReply}
        className="flex items-center hover:text-pink-800 cursor-pointer"
      >
        <Heart className="h-4 w-4 sm:w-5 sm:h-5 mr-1 fill-current text-pink-600 transform hover:scale-110 duration-150 ease-out" />
        <span className="text-pink-600 text-xs sm:text-sm font-semibold">
          {nFormatter(commentReply.likeCount)}
        </span>
      </button>
    ) : (
      <button
        aria-label={`like comment reply, ${commentReply.likeCount} likes`}
        onClick={likeCommentReply}
        className="flex items-center text-gray-600 hover:fill-current hover:text-pink-800 cursor-pointer transition duration-300 ease-out"
      >
        <Heart className="h-4 w-4 sm:w-5 sm:h-5 mr-1 transform hover:scale-110 duration-150 ease-out" />
        <span className="text-xs sm:text-sm font-semibold">
          {nFormatter(commentReply.likeCount)}
        </span>
      </button>
    )
  ) : (
    <>
      <Link
        aria-label={`like comment, ${commentReply.likeCount} likes`}
        className="flex items-center hover:text-pink-800 cursor-pointer transition duration-300 ease-out"
        to="/login"
      >
        <Heart className="h-4 w-4 sm:w-5 sm:h-5 mr-1" />
        <span className="text-xs sm:text-sm font-semibold">
          {nFormatter(commentReply.likeCount)}
        </span>
      </Link>
    </>
  );

  return likeButton;
}

// Return post id so Apollo knows to update the post with id with new field automagically
const LIKE_COMMENT_REPLY = gql`
  mutation likeCommentReply($commentReplyId: ID!, $commentId: ID!) {
    likeCommentReply(commentReplyId: $commentReplyId, commentId: $commentId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeCommentReplyButton;
