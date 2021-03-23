import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import moment from "moment"; // TODO: Never use momentjs again file pkg way too big. Switch to DayJS
import { useMutation, gql } from "@apollo/client";
import { QUERY_COMMENT_REPLIES } from "../../utils/graphql";
import LikeCommentReplyButton from "../Buttons/LikeCommentReplyButton";
import LoadingSpinner from "../Shared/LoadingSpinner";

function ReplyCard({ commentReply, user, commentId }) {
  function updateCommentRepliesCache(proxy) {
    const data = proxy.readQuery({
      query: QUERY_COMMENT_REPLIES,
      variables: { commentId: commentReply.commentId, searchQuery: null },
    });
    const filteredReplies = data.queryCommentReplies.edges.filter(
      (reply) => reply.node.id !== commentReply.id
    );
    if (filteredReplies.length === 0) {
      proxy.writeQuery({
        query: QUERY_COMMENT_REPLIES,
        variables: { commentId: commentReply.commentId, searchQuery: null },
        data: {
          queryCommentReplies: {
            edges: [...filteredReplies],
            pageInfo: {
              hasNextPage: false,
              endCursor: "",
            },
          },
        },
      });
    } else {
      proxy.writeQuery({
        query: QUERY_COMMENT_REPLIES,
        variables: { commentId: commentReply.commentId, searchQuery: null },
        data: {
          queryCommentReplies: {
            edges: [...filteredReplies],
            pageInfo: {
              hasNextPage: data.queryCommentReplies.pageInfo.hasNextPage,
              endCursor: data.queryCommentReplies.pageInfo.endCursor,
            },
          },
        },
      });
    }
  }

  const [showMoreCommentReplyOptions, setShowMoreCommentReplyOptions] = useState(false);

  const [deleteCommentReply, { loading }] = useMutation(DELETE_COMMENT_REPLY_MUTATION, {
    variables: { commentId: commentReply.commentId, commentReplyId: commentReply.id },
    update: (proxy, res) => {
      updateCommentRepliesCache(proxy);
    },
  });

  useEffect(() => {
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  function handleEscape(e) {
    if (e.key === "Esc" || e.key === "Escape") {
      setShowMoreCommentReplyOptions(false);
    }
  }

  function handleMoreOptionsClick() {
    setShowMoreCommentReplyOptions(true);
    document.addEventListener("keydown", handleEscape);
  }

  function handleDeleteCommentReplyItemClick() {
    deleteCommentReply();
    setShowMoreCommentReplyOptions(false);
    document.removeEventListener("keydown", handleEscape);
  }

  function handleReportCommentReplyItemClick() {
    // report()
    setShowMoreCommentReplyOptions(false);
    document.removeEventListener("keydown", handleEscape);
  }
  return (
    <>
      {loading ? (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex relative py-3 transition ease-out duration-300">
          {/* Post items container */}
          <div className="flex w-full mx-auto">
            <NavLink
              className="md:w-12 md:h-12 h-10 w-10 rounded-full focus:outline-none"
              to=""
            >
              <img
                className="shadow-sm cursor-pointer md:w-12 md:h-12 h-10 w-10 rounded-full object-cover object-center mr-4 "
                src={commentReply.author.profilePic}
                alt="avatar"
              />
            </NavLink>
            {/* Card data container */}
            <div className="w-full pl-3">
              <div className="flex w-full sm:flex-end items-baseline justify-between">
                <NavLink
                  to=""
                  className="text-xs sm:text-sm mb-1 tracking-wide focus:outline-none md:text-md cursor-pointer  font-bold text-teal-400 hover:underline"
                >
                  {commentReply.author.displayName
                    ? commentReply.author.displayName
                    : capitalizeFirstLetter(commentReply.author.username)}
                </NavLink>

                <NavLink to="" className="focus:outline-none">
                  <span className="inline-block sm:text-xs text-tiny text-gray-600 ">
                    {moment(commentReply.createdAt).fromNow(true)}
                  </span>
                </NavLink>
              </div>
              {/* TODO: Refactor, very hacky and ugly. Probably a better way to do this */}
              <div className="focus:outline-none mt-1 max-w-full">
                <div className="flex font-semibold text-tiny sm:text-xs">
                  {commentReply.author.mainPlatforms && commentReply.author.mainPlatforms[0] && (
                    <NavLink
                      to={`/${commentReply.author.username}`}
                      className="bg-gray-900  whitespace-no-wrap rounded-full shadow-md hover:bg-opacity-60 focus:outline-none transition duration-300 ease-out"
                    >
                      <h5 className="text-gray-100 py-1 px-2">
                        #{commentReply.author.mainPlatforms[0]}
                      </h5>
                    </NavLink>
                  )}
                  {commentReply.author.mainPlatforms && commentReply.author.mainPlatforms[1] && (
                    <NavLink
                      to={`/${commentReply.author.username}`}
                      className="ml-2 bg-gray-900  whitespace-no-wrap rounded-full shadow-md hover:bg-opacity-60 focus:outline-none transition duration-300 ease-out "
                    >
                      <h5 className="text-gray-100 py-1 px-2 ">
                        #{commentReply.author.mainPlatforms[1]}
                      </h5>
                    </NavLink>
                  )}
                  {commentReply.author.mainPlatforms && commentReply.author.mainPlatforms[2] && (
                    <NavLink
                      to={`/${commentReply.author.username}`}
                      className="ml-2 bg-gray-900  whitespace-no-wrap rounded-full shadow-md hover:bg-opacity-60 focus:outline-none transition duration-300 ease-out"
                    >
                      <h5 className="text-gray-100 py-1 px-2">
                        #{commentReply.author.mainPlatforms[2]}
                      </h5>
                    </NavLink>
                  )}
                </div>
              </div>

              <p
                style={{ overflowWrap: "break-word" }}
                className="mt-2 text-gray-800 text-xs sm:text-sm md:text-sm w-full"
              >
                {commentReply.body}
              </p>

              <div className="relative mt-4 flex items-center">
                <LikeCommentReplyButton
                  user={user}
                  commentReply={commentReply}
                  commentId={commentId}
                />

                <button
                  onClick={handleMoreOptionsClick}
                  aria-label="more comment options"
                  className="absolute right-0 top-0 text-gray-500 text-xs cursor-pointer md:text-base items-center flex justify-end"
                >
                  <svg
                    className="fill-current text-gray-500 h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>
                {showMoreCommentReplyOptions && (
                  <>
                    <button
                      tabIndex="-1"
                      onClick={() => {
                        setShowMoreCommentReplyOptions(false);
                        document.removeEventListener("keydown", handleEscape);
                      }}
                      aria-label="close popup"
                      className="fixed inset-0 h-full w-full z-50 cursor-default focus:outline-none bg-black bg-opacity-50"
                    ></button>
                    <div className="absolute top-0 right-0 mr-4 mt-6 w-48 rounded-md shadow-lg z-50">
                      <div
                        className="py-1 rounded-md h-auto bg-cardBg shadow-xs"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="commentReply-options"
                      >
                        {user &&
                          user.username &&
                          user.username === commentReply.author.username && (
                            <div>
                              <button
                                onClick={handleDeleteCommentReplyItemClick}
                                className="block text-left w-full px-4 py-2 text-xs sm:text-sm leading-5 text-red-700 hover:text-red-500 hover:bg-pageBg  focus:bg-pageBg transition duration-200 ease-in-out"
                                role="commentReplymenuitem"
                                aria-label="delete commentReply button"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        <div className="flex items-center text-left w-full cursor-pointer px-4 py-2 text-xs sm:text-sm leading-5 text-red-700 hover:text-red-500 hover:bg-pageBg focus:bg-pageBg focus:text-intreecatePri transition duration-200 ease-in-out">
                          <button
                            onClick={handleReportCommentReplyItemClick}
                            className=""
                            role="commentReplymenuitem"
                            aria-label="report comment button"
                          >
                            Report
                          </button>
                          <svg
                            className="h-4 w-4 ml-2 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {/* </div> */}
              </div>
              {/* End card data container */}
            </div>
            {/* End Post items container */}
          </div>
          {/* End Post card container */}
        </div>
      )}
    </>
  );
}

const DELETE_COMMENT_REPLY_MUTATION = gql`
  mutation deleteCommentReply($commentId: ID!, $commentReplyId: ID!) {
    deleteCommentReply(commentId: $commentId, commentReplyId: $commentReplyId)
  }
`;

export default ReplyCard;
