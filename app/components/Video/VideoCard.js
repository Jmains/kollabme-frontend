import React, { useEffect, useState } from "react";
import LockVideoButton from "../Buttons/LockVideoButton";
import { useMutation, gql } from "@apollo/client";
import { QUERY_VIDEOS, QUERY_PUBLIC_VIDEOS } from "../../utils/graphql";
import LikeVideoButton from "../Buttons/LikeVideoButton";
import { Link } from "react-router-dom";
import VideoPlayer from "../MediaPlayers/VideoPlayer";
import LoadingSpinner from "../Shared/LoadingSpinner";

const playerWrapper = {
  position: "relative",
  paddingTop: "56.25%",
};

function VideoCard({ video, user, profileUsername, searchQuery, isPublic }) {
  const [showMoreVideoOptions, setShowMoreVideoOptions] = useState(false);

  const [deleteVideo, { data, error, loading }] = useMutation(DELETE_VIDEO_MUTATION, {
    variables: { videoId: video.id },
    onError: (err) => {
      console.log("Failed to delete video: ", err);
    },
    update: (proxy, res) => {
      if (isPublic) {
        const data = proxy.readQuery({
          query: QUERY_PUBLIC_VIDEOS,
          variables: { username: user.username, searchQuery: searchQuery },
        });

        const filteredVideos = data.queryPublicVideos.edges.filter(
          (p) => p.node.id !== video.id
        );

        if (filteredVideos.length === 0) {
          proxy.writeQuery({
            query: QUERY_PUBLIC_VIDEOS,
            variables: { username: user.username, searchQuery: searchQuery },
            data: {
              queryPublicVideos: {
                edges: [...filteredVideos],
                pageInfo: {
                  hasNextPage: false,
                  endCursor: "",
                },
              },
            },
          });
        } else {
          proxy.writeQuery({
            query: QUERY_PUBLIC_VIDEOS,
            variables: { username: user.username, searchQuery: searchQuery },
            data: {
              queryPublicVideos: {
                edges: [...filteredVideos],
                pageInfo: {
                  hasNextPage: data.queryPublicVideos.pageInfo.hasNextPage,
                  endCursor: data.queryPublicVideos.pageInfo.endCursor,
                },
              },
            },
          });
        }
      } else {
        const data = proxy.readQuery({
          query: QUERY_VIDEOS,
          variables: { username: user.username, searchQuery: searchQuery },
        });

        const filteredVideos = data.queryVideos.edges.filter((p) => p.node.id !== video.id);
        if (filteredVideos.length === 0) {
          proxy.writeQuery({
            query: QUERY_VIDEOS,
            variables: { username: user.username, searchQuery: searchQuery },
            data: {
              queryVideos: {
                edges: [...filteredVideos],
                pageInfo: {
                  hasNextPage: false,
                  endCursor: "",
                },
              },
            },
          });
        } else {
          proxy.writeQuery({
            query: QUERY_VIDEOS,
            variables: { username: user.username, searchQuery: searchQuery },
            data: {
              queryVideos: {
                edges: [...filteredVideos],
                pageInfo: {
                  hasNextPage: data.queryVideos.pageInfo.hasNextPage,
                  endCursor: data.queryVideos.pageInfo.endCursor,
                },
              },
            },
          });
        }
      }
    },
  });

  function handleEscape(e) {
    if (e.key === "Esc" || e.key === "Escape") {
      setShowMoreVideoOptions(false);
    }
  }

  useEffect(() => {
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  function handleMoreOptionsClick() {
    setShowMoreVideoOptions(true);
    document.addEventListener("keydown", handleEscape);
  }

  function handleEditVideoItemClick() {
    setShowMoreVideoOptions(false);
    document.removeEventListener("keydown", handleEscape);
    // setEditTrackModal(true)
  }

  function handleDeleteVideoItemClick() {
    deleteVideo();
    setShowMoreVideoOptions(false);
    document.removeEventListener("keydown", handleEscape);
  }

  function handleReportVideoItemClick() {
    // report()
    setShowMoreVideoOptions(false);
    document.removeEventListener("keydown", handleEscape);
  }

  return (
    <>
      {loading ? (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className=" relative px-6 bg-white text-center content-center my-1 rounded-lg hover:bg-black hover:bg-opacity-10 py-2 mr-2 shadow-md transition duration-300 ease-in-out">
          {/* <ModalImage
        className="mt-3 inline-block sm:h-48 sm:w-56 w-56 h-48 rounded-md object-center object-cover cursor-pointer shadow-lg"
        small={painting.imageUrl}
        medium={painting.imageUrl}
        large={painting.imageUrl}
        showRotate={true}
        hideDownload={true}
      /> */}

          {/* Video container */}
          {video.videoUrl && (
            <div
              style={playerWrapper}
              className="block shadow-lg mx-auto border-gray-400 border rounded-md px-5 w-full mt-2 focus:outline-none cursor-pointer"
            >
              <VideoPlayer videoSource={video.videoUrl} />
            </div>
          )}
          {/* End Video container  */}

          <div className="relative">
            {profileUsername && user && profileUsername === user.username && (
              <div className="absolute top-0 left-0 text-white m-0  ">
                <LockVideoButton user={user} video={video} />
              </div>
            )}
            <div className="absolute top-0 right-0 m-0">
              <div className="flex items-center">
                <LikeVideoButton user={user} video={video} />
              </div>
            </div>
            <Link to="">
              <h1 className="text-gray-900 text-xs sm:text-sm font-bold mt-2 cursor-pointer hover:underline w-40 mx-auto truncate">
                {video.title}
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm cursor-pointer w-40 mx-auto truncate">
                {video.description}
              </p>
            </Link>
            <Link to={`/${video.username}`}>
              <div className="flex justify-center items-center mx-auto w-40 mt-3">
                <svg
                  className="fill-current text-gray-500 -ml-3 h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                <p className="text-gray-500 text-xs sm:text-sm cursor-pointer ml-1 truncate">
                  {video.author.displayName}
                </p>
              </div>
            </Link>
          </div>

          <button
            onClick={handleMoreOptionsClick}
            aria-label="more video options"
            className="absolute top-0 right-0 mt-5 text-gray-500 text-xs cursor-pointer"
          >
            <svg
              className="fill-current text-gray-500 h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>

          {showMoreVideoOptions && (
            <>
              <button
                tabIndex="-1"
                onClick={() => {
                  setShowMoreVideoOptions(false);
                  document.removeEventListener("keydown", handleEscape);
                }}
                aria-label="close popup"
                className="fixed inset-0 h-full w-full z-50 cursor-default focus:outline-none bg-black bg-opacity-50"
              ></button>
              <div className="top-0 mr-4 absolute right-0 mt-12 w-48 rounded-md shadow-lg z-50 ">
                <div
                  className="py-1 rounded-md h-auto bg-cardBg shadow-xs"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="video-options"
                >
                  {user && profileUsername && user.username === profileUsername && (
                    <div>
                      <button
                        onClick={handleEditVideoItemClick}
                        className="block text-left w-full px-4 py-2 text-xs sm:text-sm leading-5 text-gray-500 hover:bg-pageBg hover:text-teal-400 focus:bg-pageBg focus:text-intreecatePri transition duration-200 ease-in-out"
                        role="videomenuitem"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDeleteVideoItemClick}
                        className="block text-left w-full px-4 py-2 text-xs sm:text-sm leading-5 text-red-700 hover:text-red-500 hover:bg-pageBg  focus:bg-pageBg transition duration-200 ease-in-out"
                        role="videomenuitem"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  <div className="flex items-center text-left w-full cursor-pointer px-4 py-2 text-xs sm:text-sm leading-5 text-red-700 hover:text-red-500 hover:bg-pageBg focus:bg-pageBg focus:text-intreecatePri transition duration-200 ease-in-out">
                    <button
                      onClick={handleReportVideoItemClick}
                      className=""
                      role="videomenuitem"
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
        </div>
      )}
    </>
  );
}

const DELETE_VIDEO_MUTATION = gql`
  mutation deleteVideo($videoId: ID!) {
    deleteVideo(videoId: $videoId)
  }
`;

export default VideoCard;
