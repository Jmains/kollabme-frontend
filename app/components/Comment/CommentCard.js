import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import ReplyCard from "./ReplyCard";
import CommentForm from "../Forms/CommentForm";
import { nFormatter } from "../../utils/numFormatter";
import moment from "moment"; // TODO: Never use momentjs again file pkg way too big. Switch to DayJS
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { useLazyQuery, useMutation, gql } from "@apollo/client";
import { QUERY_COMMENT_REPLIES, QUERY_COMMENTS } from "../../utils/graphql";
import LoadingSpinner from "../Shared/LoadingSpinner";
import LikeCommentButton from "../Buttons/LikeCommentButton";

// TODO: Refactor, file way too large

function CommentCard({ comment, user }) {
  let commentReplies = [];
  let commentRepliesEndCursor = "";
  let commentRepliesHasNextPage = false;
  const [showMoreCommentOptions, setShowMoreCommentOptions] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyToComment, setReplyToComment] = useState(false);
  const commentFormRef = useRef(null);

  function updateCommentsQueryCache(proxy) {
    const data = proxy.readQuery({
      query: QUERY_COMMENTS,
      variables: { postId: comment.postId, searchQuery: null },
    });

    const filteredComments = data.queryComments.edges.filter((c) => c.node.id !== comment.id);
    if (filteredComments.length === 0) {
      proxy.writeQuery({
        query: QUERY_COMMENTS,
        variables: { postId: comment.postId, searchQuery: null },
        data: {
          queryComments: {
            edges: [...filteredComments],
            pageInfo: {
              hasNextPage: false,
              endCursor: "",
            },
          },
        },
      });
    } else {
      proxy.writeQuery({
        query: QUERY_COMMENTS,
        variables: { postId: comment.postId, searchQuery: null },
        data: {
          queryComments: {
            edges: [...filteredComments],
            pageInfo: {
              hasNextPage: data.queryComments.pageInfo.hasNextPage,
              endCursor: data.queryComments.pageInfo.endCursor,
            },
          },
        },
      });
    }
  }

  const [
    getCommentReplies,
    { error, loading: repliesLoading, data: commentRepliesData, fetchMore, networkStatus },
  ] = useLazyQuery(QUERY_COMMENT_REPLIES, {
    variables: { commentId: comment.id, searchQuery: null, first: 5 },
    notifyOnNetworkStatusChange: true,
  });

  const [deleteCommentMutation, { loading }] = useMutation(DELETE_COMMENT_MUTATION, {
    variables: { commentId: comment.id, postId: comment.postId },
    update: (proxy, res) => {
      updateCommentsQueryCache(proxy);
    },
  });

  if (commentRepliesData) {
    commentReplies = commentRepliesData.queryCommentReplies.edges;
    commentRepliesEndCursor = commentRepliesData.queryCommentReplies.pageInfo.endCursor;
    commentRepliesHasNextPage = commentRepliesData.queryCommentReplies.pageInfo.hasNextPage;
  }

  useEffect(() => {
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  function handleEscape(e) {
    if (e.key === "Esc" || e.key === "Escape") {
      setShowMoreCommentOptions(false);
    }
  }

  function handleMoreOptionsClick() {
    setShowMoreCommentOptions(true);
    document.addEventListener("keydown", handleEscape);
  }

  function handleDeleteCommentItemClick() {
    deleteCommentMutation();
    setShowMoreCommentOptions(false);
    document.removeEventListener("keydown", handleEscape);
  }

  function handleReportCommentItemClick() {
    // report()
    setShowMoreCommentOptions(false);
    document.removeEventListener("keydown", handleEscape);
  }
  return (
    <>
      {loading ? (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div
          onClick={() => {
            // props.history.push(`/posts/${post.id}`);
          }}
          className="flex relative py-2 border-b border-gray-500 transition ease-out duration-300"
        >
          {/* Post items container */}
          <div className="flex w-full p-1 mx-auto">
            <NavLink
              className="md:w-12 md:h-12 h-10 w-10 rounded-full focus:outline-none"
              to={`/${comment.author.username}`}
            >
              <img
                className="shadow-sm cursor-pointer md:w-12 md:h-12 h-10 w-10 rounded-full object-cover object-center mr-4 "
                src={comment.author.profilePic}
                alt="avatar"
              />
            </NavLink>
            {/* Card data container */}
            <div className="w-full px-3">
              <div className="flex w-full sm:flex-end items-baseline justify-between">
                <NavLink
                  to={`/${comment.author.username}`}
                  className="text-xs sm:text-sm mb-1 tracking-wide focus:outline-none md:text-md cursor-pointer  font-bold text-teal-400 hover:underline"
                >
                  {comment.author.displayName
                    ? comment.author.displayName
                    : capitalizeFirstLetter(comment.author.username)}
                </NavLink>

                <NavLink to="" className="focus:outline-none">
                  <span className="inline-block sm:text-xs text-tiny text-gray-600 ">
                    {moment(comment.createdAt).fromNow(true)}
                  </span>
                </NavLink>
              </div>
              <div
                className="focus:outline-none mt-1 max-w-full"
                to={`/${comment.author.username}`}
              >
                {/* TODO: Refactor, very hacky and ugly */}
                <div className="flex font-semibold text-tiny sm:text-xs">
                  {comment.author.mainPlatforms && comment.author.mainPlatforms[0] && (
                    <NavLink
                      to=""
                      className="bg-gray-900 whitespace-no-wrap rounded-full shadow-md hover:bg-opacity-60 focus:outline-none transition duration-300 ease-out"
                    >
                      <h5 className="text-gray-100 py-1 px-2">
                        #{comment.author.mainPlatforms[0]}
                      </h5>
                    </NavLink>
                  )}
                  {comment.author.mainPlatforms && comment.author.mainPlatforms[1] && (
                    <NavLink
                      to=""
                      className="ml-2 bg-gray-900 whitespace-no-wrap rounded-full shadow-md hover:bg-opacity-60 focus:outline-none transition duration-300 ease-out "
                    >
                      <h5 className="text-gray-100 py-1 px-2 ">
                        #{comment.author.mainPlatforms[1]}
                      </h5>
                    </NavLink>
                  )}
                  {comment.author.mainPlatforms && comment.author.mainPlatforms[2] && (
                    <NavLink
                      to=""
                      className="ml-2 bg-gray-900 whitespace-no-wrap rounded-full shadow-md hover:bg-opacity-60 focus:outline-none transition duration-300 ease-out"
                    >
                      <h5 className="text-gray-100 py-1 px-2">
                        #{comment.author.mainPlatforms[2]}
                      </h5>
                    </NavLink>
                  )}
                </div>
              </div>

              <p
                style={{ overflowWrap: "break-word" }}
                className="mt-2 text-gray-800 text-xs sm:text-sm  w-full"
              >
                {comment.body}
              </p>

              <div className="relative mt-4 flex items-center">
                <LikeCommentButton user={user} comment={comment} />

                <div
                  onClick={() => {
                    setReplyToComment(!replyToComment);
                  }}
                  className="md:text-base text-gray-500 text-xs ml-8 focus:outline-none hover:text-blue-500 duration-300 transition ease-in-out"
                >
                  <button
                    onClick={() => {
                      if (commentFormRef.current) {
                        commentFormRef.current.focus();
                        commentFormRef.current.scrollIntoView();
                      }
                    }}
                    className="px-2 py-1 text-tiny sm:text-xs rounded-md "
                  >
                    REPLY
                  </button>
                </div>

                <div className="md:text-base text-gray-500 text-xs ml-8 focus:outline-none">
                  {comment.replyCount > 0 && (
                    <button
                      onClick={() => {
                        setShowReplies(!showReplies);
                      }}
                      className="flex items-center text-tiny sm:text-xs text-blue-500"
                    >
                      {!showReplies ? (
                        <div
                          onClick={() => {
                            getCommentReplies();
                          }}
                          className="flex items-center text-tiny sm:text-xs text-blue-500"
                        >
                          <svg
                            className="fill-current w-4 h-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                          </svg>
                          {`SHOW ${comment.replyCount} REPLIES`}
                        </div>
                      ) : (
                        <div className="flex items-center text-tiny sm:text-xs text-blue-500">
                          <svg
                            className="fill-current h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
                          </svg>
                          {`HIDE ${comment.replyCount} REPLIES`}
                        </div>
                      )}
                    </button>
                  )}
                </div>

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
                {showMoreCommentOptions && (
                  <>
                    <button
                      tabIndex="-1"
                      onClick={() => {
                        setShowMoreCommentOptions(false);
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
                        aria-labelledby="comment-options"
                      >
                        {user && user.username && user.username === comment.author.username && (
                          <div>
                            <button
                              onClick={handleDeleteCommentItemClick}
                              className="block text-left w-full px-4 py-2 text-xs sm:text-sm leading-5 text-red-700 hover:text-red-500 hover:bg-pageBg  focus:bg-pageBg transition duration-200 ease-in-out"
                              role="commentmenuitem"
                              aria-label="delete comment button"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                        <div className="flex items-center text-left w-full cursor-pointer px-4 py-2 text-xs sm:text-sm leading-5 text-red-700 hover:text-red-500 hover:bg-pageBg focus:bg-pageBg focus:text-intreecatePri transition duration-200 ease-in-out">
                          <button
                            onClick={handleReportCommentItemClick}
                            className=""
                            role="commentmenuitem"
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
              {replyToComment && comment && (
                <div
                  onClick={async () => {
                    await getCommentReplies();
                    setShowReplies(true);
                  }}
                  ref={commentFormRef}
                  className=" mx-auto rounded-lg max-w-xl sm:max-w-2xl lg:max-w-2xl"
                >
                  <CommentForm
                    setShowReplies={setShowReplies}
                    setReplyToComment={setReplyToComment}
                    commentId={comment.id}
                  />
                </div>
              )}

              {showReplies &&
                commentReplies &&
                commentReplies.length > 0 &&
                commentReplies.map((commentRep) => {
                  return (
                    <div
                      key={commentRep.node.id}
                      className=" mx-auto rounded-lg max-w-xl sm:max-w-2xl lg:max-w-2xl"
                    >
                      <ReplyCard
                        commentReply={commentRep.node}
                        user={user}
                        commentId={comment.id}
                      />
                    </div>
                  );
                })}

              {repliesLoading && networkStatus !== 3 && (
                <div className="flex justify-center">
                  <LoadingSpinner />
                </div>
              )}
              {commentRepliesHasNextPage && (
                <button
                  onClick={() => {
                    fetchMore({ variables: { after: commentRepliesEndCursor } });
                  }}
                  className="flex mx-auto px-2 py-1 text-gray-500 rounded-md text-xs"
                >
                  Load more replies...
                </button>
              )}

              {networkStatus === 3 && (
                <div className="flex justify-center">
                  <LoadingSpinner />
                </div>
              )}

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

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
    }
  }
`;

export default CommentCard;
