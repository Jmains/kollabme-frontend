import React from "react";
import { NavLink, Link } from "react-router-dom";
import { nFormatter } from "../../utils/numFormatter";

function CommentButton({ user, commentCount, postId, author }) {
  return (
    <>
      {user ? (
        commentCount > 0 ? (
          <Link
            className="flex items-center focus:outline-none text-blue-500"
            to={`${author}/posts/${postId}`}
            aria-label={`comment button, ${commentCount} comments`}
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              className="h-4 w-4 sm:w-5 sm:h-5 mr-1"
              stroke="currentColor"
            >
              <path
                className=""
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
              />
            </svg>
            <span className="text-blue-500 text-xs sm:text-sm font-semibold">
              {nFormatter(commentCount)}
            </span>
          </Link>
        ) : (
          <Link
            className="flex items-center hover:text-blue-500 focus:outline-none transition duration-300 ease-out"
            to={`${author}/posts/${postId}`}
            aria-label={`comment button, ${commentCount} comments`}
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              className="h-4 w-4 sm:w-5 sm:h-5 mr-1"
              stroke="currentColor"
            >
              <path
                className=""
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
              />
            </svg>
            <span className="text-xs sm:text-sm font-semibold">
              {nFormatter(commentCount)}
            </span>
          </Link>
        )
      ) : (
        <Link
          to="/login"
          className="flex items-center hover:text-blue-500 focus:outline-none transition duration-300 ease-out"
          aria-label={`comment button, ${commentCount} comments`}
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            className="h-4 w-4 sm:w-5 sm:h-5 mr-1 "
            stroke="currentColor"
          >
            <path
              className=""
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
            />
          </svg>
          <span className="text-xs sm:text-sm font-semibold">{nFormatter(commentCount)}</span>
        </Link>
      )}
    </>
  );
}

export default CommentButton;
