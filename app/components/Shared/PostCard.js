import React, { useState } from "react";
import moment from "moment";
import { NavLink } from "react-router-dom";

import { useAuthState } from "../../context/auth";
import LikeButton from "../Buttons/LikeButton";
import CommentButton from "../Buttons/CommentButton";
import VideoPlayer from "../MediaPlayers/VideoPlayer";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import ReactAudioPlayer from "../MediaPlayers/ReactAudioPlayer";
import { useMutation, gql } from "@apollo/client";
import { QUERY_POSTS } from "../../utils/graphql";
import lozad from "lozad";

import Lightbox from "react-image-lightbox";
import LoadingSpinner from "./LoadingSpinner";

const playerWrapper = {
  position: "relative",
  paddingTop: "56.25%",
};

function PostCard({ post }) {
  const { user } = useAuthState();
  const [showMorePostOptions, setShowMorePostOptions] = useState(false);
  const [imgModalOpen, setImgModalOpen] = useState(false);

  const observer = lozad(); // lazy loads elements with default selector as '.lozad'
  observer.observe();

  let postId = "";
  if (post) {
    postId = post.id;
  }
  const [deletePostMutation, { data, error, loading }] = useMutation(DELETE_POST_MUTATION, {
    variables: { postId: postId },
    update: (proxy, res) => {
      const data = proxy.readQuery({
        query: QUERY_POSTS,
        variables: { searchQuery: null },
      });

      const filteredPosts = data.queryPosts.edges.filter((p) => p.node.id !== postId);
      if (filteredPosts.length === 0) {
        proxy.writeQuery({
          query: QUERY_POSTS,
          variables: { searchQuery: null },
          data: {
            queryPosts: {
              edges: [...filteredPosts],
              pageInfo: {
                hasNextPage: false,
                endCursor: "",
              },
            },
          },
        });
      } else {
        proxy.writeQuery({
          query: QUERY_POSTS,
          variables: { searchQuery: null },
          data: {
            queryPosts: {
              edges: [...filteredPosts],
              pageInfo: {
                hasNextPage: data.queryPosts.pageInfo.hasNextPage,
                endCursor: data.queryPosts.pageInfo.endCursor,
              },
            },
          },
        });
      }
    },
    onError: (err) => {
      console.log("Failed to delete post: ", err);
    },
  });

  function handleEscape(e) {
    if (e.key === "Esc" || e.key === "Escape") {
      setShowMorePostOptions(false);
    }
  }

  function handleMorePostOptionClick() {
    setShowMorePostOptions(true);
    document.addEventListener("keydown", handleEscape);
  }

  function handleDeletePostItemClick() {
    deletePostMutation();
    setShowMorePostOptions(false);
    document.removeEventListener("keydown", handleEscape);
  }

  function handleReportPostItemClick() {
    // report()
    setShowMorePostOptions(false);
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
          className="flex relative my-2 px-2 py-1 shadow-md rounded-sm transition ease-out duration-300 bg-white hover:bg-black hover:bg-opacity-10"
        >
          {/* Post items container */}
          <div className="flex w-full md:px-2 py-1 rounded-full mx-auto">
            <NavLink
              className="md:w-12 md:h-12 h-10 w-10 rounded-full focus:outline-none"
              to={`/${post.author.username}`}
            >
              <img
                className="shadow-sm cursor-pointer md:w-12 md:h-12 h-10 w-10 rounded-full object-cover object-center"
                src={post.author.profilePic}
                alt="profile picture"
              />
            </NavLink>
            {/* Card data container */}
            <div className="relative w-full max-w-full sm:px-3 px-1">
              <div className="relative">
                <div>
                  {/* Name */}
                  <NavLink
                    to={`/${post.author.username}`}
                    className=" sm:text-base mb-1 tracking-wide focus:outline-none md:text-lg cursor-pointer font-bold text-black"
                  >
                    {post.author.displayName ? (
                      <h2 className="hover:underline w-64 truncate">
                        {post.author.displayName}
                      </h2>
                    ) : (
                      <h2 className="hover:underline">
                        {capitalizeFirstLetter(post.author.username)}
                      </h2>
                    )}

                    {/* Tags */}
                    <div className="flex font-semibold text-tiny sm:text-xs mt-1">
                      {post.author.mainPlatforms && post.author.mainPlatforms[0] && (
                        <div className="bg-black whitespace-no-wrap rounded-full shadow-md hover:bg-blue-500 hover:bg-opacity-25 focus:outline-none transition duration-300 ease-out">
                          <h5 className="text-gray-50 py-1 px-2">
                            #{post.author.mainPlatforms[0]}
                          </h5>
                        </div>
                      )}
                      {post.author.mainPlatforms && post.author.mainPlatforms[1] && (
                        <div className="ml-2 bg-black whitespace-no-wrap rounded-full shadow-md hover:bg-blue-500 hover:bg-opacity-25 focus:outline-none transition duration-300 ease-out ">
                          <h5 className="text-gray-50 py-1 px-2 ">
                            #{post.author.mainPlatforms[1]}
                          </h5>
                        </div>
                      )}
                      {post.author.mainPlatforms && post.author.mainPlatforms[2] && (
                        <div className="ml-2 bg-black whitespace-no-wrap rounded-full shadow-md hover:bg-blue-500 hover:bg-opacity-25 focus:outline-none transition duration-300 ease-out">
                          <h5 className="text-gray-50 py-1 px-2">
                            #{post.author.mainPlatforms[2]}
                          </h5>
                        </div>
                      )}
                    </div>
                  </NavLink>
                </div>
              </div>

              <NavLink
                to={`${post.author.username}/posts/${post.id}`}
                className="focus:outline-none absolute right-0 top-0 sm:text-xs text-tiny text-gray-600 mt-1 "
              >
                {moment(post.createdAt).fromNow(true)}
              </NavLink>

              <p
                style={{ overflowWrap: "break-word" }}
                className="my-4 font-medium text-gray-800 text-sm sm:text-base md:text-md w-full"
              >
                {post.body}
              </p>

              {/* <PostEmbeddedTrack track={track} user={userl} profileUsername={profileUsername} /> */}

              {/* Image container */}
              {post.imageUrl && (
                <div
                  aria-label="enhance image"
                  onClick={() => {
                    setImgModalOpen(true);
                  }}
                  className="rounded-md overflow-hidden"
                >
                  <img
                    className="shadow-md rounded-md border-2 border-gray-700 mt-2 cursor-pointer inline-block h-64 w-full sm:h-64 object-cover object-center lozad"
                    data-src={post.imageUrl}
                    alt="Post Image"
                  />
                </div>
              )}

              {imgModalOpen && (
                <Lightbox
                  mainSrc={post.imageUrl}
                  onCloseRequest={() => setImgModalOpen(false)}
                />
              )}
              {/* End Image container  */}

              {/* Video container */}
              {post.videoUrl && (
                <div
                  style={playerWrapper}
                  className="block shadow-md mx-auto rounded-md h-48 sm:h-64 w-full border border-gray-700 mt-2 focus:outline-none cursor-pointer"
                >
                  <VideoPlayer videoSource={post.videoUrl} />
                </div>
              )}
              {/* End Video container  */}

              {/* Video container */}
              {post.audioUrl && (
                <div className="block mx-auto rounded-md w-full mt-2 focus:outline-none cursor-pointer">
                  <ReactAudioPlayer audioSource={post.audioUrl} />
                </div>
              )}
              {/* End Video container  */}

              <div className="relative mt-4 flex items-center">
                <div className="md:text-base items-center flex text-gray-500 text-xs focus:outline-none">
                  <LikeButton user={user} post={post} />
                </div>

                <div className="md:text-base text-gray-500 text-xs ml-8 focus:outline-none">
                  <CommentButton
                    user={user}
                    commentCount={post.commentCount}
                    postId={post.id}
                    author={post.author.username}
                  />
                </div>

                <button
                  onClick={handleMorePostOptionClick}
                  aria-label="more post options"
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
                {showMorePostOptions && (
                  <>
                    <button
                      tabIndex="-1"
                      onClick={() => {
                        setShowMorePostOptions(false);
                        document.removeEventListener("keydown", handleEscape);
                      }}
                      aria-label="close popup"
                      className="fixed inset-0 h-full w-full z-50 cursor-default focus:outline-none bg-black bg-opacity-50"
                    ></button>
                    <div className="absolute top-0 right-0 mr-4 mt-6 w-48 rounded-md shadow-lg z-50">
                      <div
                        className="py-1 rounded-md h-auto bg-cardBg shadow-xs"
                        role="menu"
                        aria-haspopup="true"
                        aria-orientation="vertical"
                        aria-labelledby="post-options"
                      >
                        {user && user.username && user.username === post.author.username && (
                          <div>
                            <button
                              onClick={handleDeletePostItemClick}
                              className="block text-left w-full px-4 py-2 text-xs sm:text-sm leading-5 text-red-700 hover:text-red-500 hover:bg-pageBg  focus:bg-pageBg transition duration-200 ease-in-out"
                              role="postmenuitem"
                              aria-label="delete post button"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                        <div className="flex items-center text-left w-full cursor-pointer px-4 py-2 text-xs sm:text-sm leading-5 text-red-700 hover:text-red-500 hover:bg-pageBg focus:bg-pageBg focus:text-intreecatePri transition duration-200 ease-in-out">
                          <button
                            onClick={handleReportPostItemClick}
                            className=""
                            role="postmenuitem"
                            aria-label="report post button"
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

// const GET_POST_LIKES = gql`
//   query queryPostLikes($postId: ID!, $first: Int, $after: String) {
//     queryPostLikes(postId: $postId, first: $first, after: $after) {
//       edges {
//         node {
//           id
//           username
//           author {
//             id
//             profilePic
//             mainPlatforms
//           }
//           cursor
//         }
//         cursor
//       }
//     }
//   }
// `;

export default PostCard;

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;
