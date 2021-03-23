import React, { useEffect, useState, useRef } from "react";
import TracksCard from "./TracksCard";
import Modal from "react-modal";
import AddTrackModal from "../Modals/AddTrackModal";
import { useLazyQuery } from "@apollo/client";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { useAuthState } from "../../context/auth";
import { useDebounce } from "../../utils/hooks";
import { QUERY_TRACKS, QUERY_PUBLIC_TRACKS } from "../../utils/graphql";
import { NavLink, Link } from "react-router-dom";

Modal.setAppElement("#app");

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    marginTop: "3rem",
    transform: "translate(-50%, -50%)",
    background: "rgba(0,0,0,0)",
    border: "none",
  },
  overlay: {
    zIndex: 999,
    overflowY: "scroll",
    background: "rgba(0,0,0,0.5)",
  },
};

function TracksContainer(props) {
  const { user } = useAuthState();

  const [tracks, setTracks] = useState([]);
  const [endCursor, setEndCursor] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const debouncedSearchTerm = useDebounce(searchQuery, 350);
  const titleRef = useRef(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const tracksContainerRef = useRef(null);

  const QUERY = props.isPublic ? QUERY_PUBLIC_TRACKS : QUERY_TRACKS;

  const [getTracks, { error, loading, data, fetchMore, networkStatus }] = useLazyQuery(QUERY, {
    variables: {
      username: props.username,
      first: props.first,
      searchQuery: searchQuery,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    onError: (err) => {
      console.log("Failed to retrieve tracks: ", err);
    },
  });

  useEffect(() => {
    getTracks();
    if (titleRef.current && !props.isPublic) {
      titleRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm.length === 0) {
      getTracks();
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (data) {
      if (props.isPublic) {
        setTracks(data.queryPublicTracks.edges);
        setEndCursor(data.queryPublicTracks.pageInfo.endCursor);
        setHasNextPage(data.queryPublicTracks.pageInfo.hasNextPage);
      } else {
        setTracks(data.queryTracks.edges);
        setEndCursor(data.queryTracks.pageInfo.endCursor);
        setHasNextPage(data.queryTracks.pageInfo.hasNextPage);
      }
    } else {
      setTracks([]);
      setEndCursor("");
      setHasNextPage(false);
    }
  }, [debouncedSearchTerm, data]);

  function handleModalClose() {
    document.body.style.overflow = "";
    setModalIsOpen(false);
  }

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleModalClose}
        style={modalStyles}
        shouldCloseOnOverlayClick={false}
        onAfterOpen={() => {
          document.body.style.overflow = "hidden";
        }}
      >
        <AddTrackModal
          setModalIsOpen={setModalIsOpen}
          searchQuery={searchQuery}
          username={props.username}
          isPublic={props.isPublic}
        />
      </Modal>

      <div className="flex justify-between items-center mx-auto rounded-lg">
        <h1
          tabIndex="0"
          id="title"
          ref={titleRef}
          className="text-black font-bold text-base md:text-lg ml-2 focus:outline-none focus:shadow-outline"
        >
          Tracks
        </h1>

        {/* Search bar */}
        <div className="relative p-1 rounded-md focus:outline-none">
          <input
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            onFocus={() => {
              if (tracksContainerRef.current) {
                tracksContainerRef.current.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            }}
            onClick={() => {
              if (tracksContainerRef.current) {
                tracksContainerRef.current.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            }}
            className="text-xs sm:text-sm sm:w-72 w-40 relative bg-white rounded-full h-8 pl-5 pr-10 py-1 text-gray-900 placeholder-gray-700 focus:outline-none"
            type="text"
            name="search track"
            id="searchTrack"
            placeholder="Search tracks..."
          />
          <svg
            className="absolute z-40 h-6 w-6 fill-current mt-2 right-0 inset-y-0 text-gray-500 mr-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </div>
        {/* End Search bar */}

        {props.username && user && props.username === user.username && (
          <button
            aria-label="add track button"
            onClick={() => {
              setModalIsOpen(true);
            }}
            className="text-teal-400 px-2 py-1 font-bold text-xs bg-gray-800 bg-opacity-25 rounded-md mr-2"
          >
            Add Track +
          </button>
        )}
      </div>

      {tracks && tracks.length !== 0 && (
        <div ref={tracksContainerRef} className="mt-2 mx-auto rounded-lg max-w-6xl">
          {tracks &&
            tracks.map((track) => {
              return (
                // <Link to={`/${props.username}/tracks/${track.node.id}`} key={track.node.id}>
                <div key={track.node.id}>
                  <TracksCard
                    searchQuery={searchQuery}
                    user={user}
                    profileUsername={props.username}
                    track={track.node}
                    isPublic={props.isPublic}
                  />
                </div>
                // </Link>
              );
            })}
        </div>
      )}

      {!loading &&
        user &&
        debouncedSearchTerm.length === 0 &&
        tracks.length === 0 &&
        props.username === user.username && (
          <h3 className="text-gray-500 text-center mt-5 mb-3 text-xs md:text-sm">
            You currently have no tracks on display...
          </h3>
        )}
      {!loading && !user && debouncedSearchTerm.length === 0 && tracks.length === 0 && (
        <h3 className="text-gray-500 text-center mt-5 mb-3 text-xs md:text-sm">
          {capitalizeFirstLetter(props.username)} currently have no tracks on display...
        </h3>
      )}

      {!loading && debouncedSearchTerm.length > 0 && tracks.length === 0 && (
        <h3 className="mt-5 mb-3 text-gray-500 text-center text-xs md:text-sm">
          No track(s) found...
        </h3>
      )}

      <div className="relative flex justify-center">
        {networkStatus === 3 && <LoadingSpinner />}
      </div>

      {data && hasNextPage && (
        <button
          onClick={() => {
            fetchMore({ variables: { after: endCursor } });
          }}
          aria-label="load more tracks"
          className="h-10 w-full bg-cardBg rounded-lg text-center shadow-md mx-auto max-w-lg md:max-w-2xl"
        >
          <svg
            className="h-8 w-8 mt-1 sm:mt-0 sm:w-10 sm:h-10 fill-current text-gray-500 inline-block"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default TracksContainer;
