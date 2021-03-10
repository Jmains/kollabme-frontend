import React, { useEffect, useState } from "react";
import ReactAudioPlayer from "../MediaPlayers/ReactAudioPlayer";
import LikeTrackButton from "../Buttons/LikeTrackButton";
import LockTrackButton from "../Buttons/LockTrackButton";
import { useMutation, gql } from "@apollo/client";
import { QUERY_TRACKS, QUERY_PUBLIC_TRACKS } from "../../utils/graphql";
import { Link } from "react-router-dom";
import LoadingSpinner from "../Shared/LoadingSpinner";

function TracksCard({ track, user, profileUsername, searchQuery, isPublic }) {
  const [showMoreTrackOptions, setShowMoreTrackOptions] = useState(false);

  const [deleteTrack, { data, error, loading }] = useMutation(DELETE_TRACK_MUTATION, {
    variables: { trackId: track.id },
    onError: (err) => {
      console.log("Failed to delete track: ", err);
    },
    update: (proxy, res) => {
      if (isPublic) {
        updatePublicTracksQueryCache(proxy);
      } else {
        updateTracksQueryCache(proxy);
      }
    },
  });

  function updateTracksQueryCache(proxy) {
    const data = proxy.readQuery({
      query: QUERY_TRACKS,
      variables: { username: user.username, searchQuery: searchQuery },
    });

    const filteredTracks = data.queryTracks.edges.filter((t) => t.node.id !== track.id);
    if (filteredTracks.length === 0) {
      proxy.writeQuery({
        query: QUERY_TRACKS,
        variables: { username: user.username, searchQuery: searchQuery },
        data: {
          queryTracks: {
            edges: [...filteredTracks],
            pageInfo: {
              hasNextPage: false,
              endCursor: "",
            },
          },
        },
      });
    } else {
      proxy.writeQuery({
        query: QUERY_TRACKS,
        variables: { username: user.username, searchQuery: searchQuery },
        data: {
          queryTracks: {
            edges: [...filteredTracks],
            pageInfo: {
              hasNextPage: data.queryTracks.pageInfo.hasNextPage,
              endCursor: data.queryTracks.pageInfo.endCursor,
            },
          },
        },
      });
    }
  }

  function updatePublicTracksQueryCache(proxy) {
    const data = proxy.readQuery({
      query: QUERY_PUBLIC_TRACKS,
      variables: { username: user.username, searchQuery: searchQuery },
    });

    const filteredTracks = data.queryPublicTracks.edges.filter((t) => t.node.id !== track.id);
    if (filteredTracks.length === 0) {
      proxy.writeQuery({
        query: QUERY_PUBLIC_TRACKS,
        variables: { username: user.username, searchQuery: searchQuery },
        data: {
          queryPublicTracks: {
            edges: [...filteredTracks],
            pageInfo: {
              hasNextPage: false,
              endCursor: "",
            },
          },
        },
      });
    } else {
      proxy.writeQuery({
        query: QUERY_PUBLIC_TRACKS,
        variables: { username: user.username, searchQuery: searchQuery },
        data: {
          queryPublicTracks: {
            edges: [...filteredTracks],
            pageInfo: {
              hasNextPage: data.queryPublicTracks.pageInfo.hasNextPage,
              endCursor: data.queryPublicTracks.pageInfo.endCursor,
            },
          },
        },
      });
    }
  }

  function handleEscape(e) {
    if (e.key === "Esc" || e.key === "Escape") {
      setShowMoreTrackOptions(false);
    }
  }

  useEffect(() => {
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  function handleMoreOptionsClick() {
    setShowMoreTrackOptions(true);
    document.addEventListener("keydown", handleEscape);
  }

  function handleEditTrackItemClick() {
    setShowMoreTrackOptions(false);
    document.removeEventListener("keydown", handleEscape);
    // setEditTrackModal(true)
  }

  function handleDeleteTrackItemClick() {
    deleteTrack();
    setShowMoreTrackOptions(false);
    document.removeEventListener("keydown", handleEscape);
  }

  function handleReportTrackItemClick() {
    // report()
    setShowMoreTrackOptions(false);
    document.removeEventListener("keydown", handleEscape);
  }

  return (
    <>
      {loading ? (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex relative items-center w-full bg-cardBg bg-opacity-25 p-1 my-1 shadow-md rounded-md hover:bg-black hover:bg-opacity-25 transition duration-300 ease-in-out">
          <Link to={`/${track.username}/tracks/${track.id}`} className="cursor-pointer">
            <img
              className="m-2 rounded-lg h-12 w-12 object-center object-cover shadow-md"
              src={track.imageUrl}
              alt="Track Image"
            />
          </Link>

          <div className="ml-1">
            <Link
              to={`/${track.username}/tracks/${track.id}`}
              className="block text-gray-400 w-24 sm:w-40 w text-xs sm:text-sm truncate font-extrabold tracking-wide hover:underline"
            >
              {track.title}
            </Link>
            <Link
              to={`/${track.username}`}
              className="block text-gray-600 font-medium text-xs sm:text-sm w-24 sm:w-40 truncate hover:underline"
            >
              {track.artistName}
            </Link>
          </div>
          {profileUsername && user && profileUsername === user.username && (
            <div className="mr-3 sm:ml-4 ml-2">
              <LockTrackButton user={user} track={track} />
            </div>
          )}
          <div className="flex items-center md:ml-0 focus:outline-none focus:shadow-outline">
            <LikeTrackButton user={user} track={track} />
          </div>
          <div
            aria-label="audio player"
            className="absolute right-0 mr-8 md:w-56 sm:w-32 w-12"
          >
            <ReactAudioPlayer audioSource={track.audioUrl} />
          </div>

          <button
            onClick={handleMoreOptionsClick}
            aria-label="more track options"
            className="absolute bottom-0 mb-6 right-0 mr-1 text-gray-500 text-xs cursor-pointer"
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

          {showMoreTrackOptions && (
            <>
              <button
                tabIndex="-1"
                onClick={() => {
                  setShowMoreTrackOptions(false);
                  document.removeEventListener("keydown", handleEscape);
                }}
                aria-label="close popup"
                className="fixed inset-0 max-h-full h-auto w-full z-50 cursor-default focus:outline-none bg-black bg-opacity-50"
              ></button>
              <div className="top-0 mr-4 absolute right-0 mt-12 w-48 rounded-md shadow-lg z-50 ">
                <div
                  className="py-1 rounded-md h-auto bg-cardBg shadow-xs"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="track-options"
                >
                  {user && profileUsername && user.username === track.username && (
                    <div>
                      <button
                        onClick={handleEditTrackItemClick}
                        className="block text-left w-full px-4 py-2 text-xs sm:text-sm leading-5 text-gray-500 hover:bg-pageBg hover:text-teal-400 focus:bg-pageBg focus:text-intreecatePri transition duration-200 ease-in-out"
                        role="trackmenuitem"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDeleteTrackItemClick}
                        className="block text-left w-full px-4 py-2 text-xs sm:text-sm leading-5 text-red-700 hover:text-red-500 hover:bg-pageBg  focus:bg-pageBg transition duration-200 ease-in-out"
                        role="trackmenuitem"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  <div className="flex items-center text-left w-full cursor-pointer px-4 py-2 text-xs sm:text-sm leading-5 text-red-700 hover:text-red-500 hover:bg-pageBg focus:bg-pageBg focus:text-intreecatePri transition duration-200 ease-in-out">
                    <button
                      onClick={handleReportTrackItemClick}
                      className=""
                      role="trackmenuitem"
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

const DELETE_TRACK_MUTATION = gql`
  mutation deleteTrack($trackId: ID!) {
    deleteTrack(trackId: $trackId)
  }
`;

export default TracksCard;
