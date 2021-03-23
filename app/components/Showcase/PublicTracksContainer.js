import React, { useEffect, useState, useRef } from "react";
import TracksCard from "../../components/Track/TracksCard";
import { useLazyQuery } from "@apollo/client";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { AuthContext, useAuthState } from "../../context/auth";
import { useDebounce } from "../../utils/hooks";
import { QUERY_PUBLIC_TRACKS } from "../../utils/graphql";
import PublicTrackCard from "../Track/PublicTrackCard";

function PublicTracksContainer(props) {
  const { user } = useAuthState();

  const [tracks, setTracks] = useState([]);
  const [endCursor, setEndCursor] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const debouncedSearchTerm = useDebounce(searchQuery, 350);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const tracksContainerRef = useRef(null);
  const titleRef = useRef(null);

  const [getTracks, { error, loading, data, fetchMore, networkStatus }] = useLazyQuery(
    QUERY_PUBLIC_TRACKS,
    {
      variables: {
        first: props.first,
        searchQuery: searchQuery,
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
      onError: (err) => {
        console.log("Failed to retrieve tracks: ", err);
      },
    }
  );

  useEffect(() => {
    getTracks();
    if (titleRef.current) {
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
      }
    } else {
      setTracks([]);
      setEndCursor("");
      setHasNextPage(false);
    }
  }, [debouncedSearchTerm, data]);

  return (
    <div>
      <div className="flex justify-between items-center mx-auto">
        <h1
          tabIndex="0"
          id="title"
          ref={titleRef}
          className="text-black font-bold text-base md:text-lg focus:outline-none"
        >
          Tracks
        </h1>
        {/* <div className="flex items-baseline justify-around sm:justify-start sm:mx-0 w-full ">
          <button
            tabIndex="0"
            id="title"
            ref={titleRef}
            className="text-gray-300 rounded-lg px-2 py-1 text-sm md:text-base lg:text-lg  hover:text-gray-300 focus:text-gray-300 transition duration-300 ease-in-out focus:outline-none"
          >
            Recent
          </button>

          <button className="text-gray-600 rounded-lg px-2 py-1 text-sm md:text-base lg:text-lg sm:ml-3 md:ml-6 lg:ml-8 hover:text-gray-300 focus:text-gray-300 transition duration-300 ease-in-out focus:outline-none">
            Most Likes
          </button>
          <button className="text-gray-600 rounded-lg px-2 py-1 text-sm md:text-base lg:text-lg sm:ml-3 md:ml-6 lg:ml-8 hover:text-gray-300 focus:text-gray-300 transition duration-300 ease-in-out focus:outline-none">
            Most Listens
          </button>
          <button className="flex items-center px-2 py-1 sm:ml-3 md:ml-6 lg:ml-8 text-gray-600 hover:text-gray-300 focus:text-gray-300 transition duration-300 ease-in-out focus:outline-none">
            <span className="block rounded-lg text-sm md:text-base lg:text-lg">Genres</span>
            <svg
              className="fill-current h-5 w-5 pt-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
            </svg>
          </button>
        </div> */}

        {/* Search bar */}
        <div className="hidden sm:block relative p-1 mt-4 rounded-md focus:outline-none">
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
            className="text-xs sm:text-sm w-48 sm:w-72 relative z-40 bg-white rounded-full h-8 pl-3 pr-8 py-1 text-gray-900 placeholder-gray-500 focus:outline-none"
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
      </div>

      {/* Tracks List     */}
      {/* {fakeTracks && fakeTracks.length !== 0 && (
        <div className="mx-auto align-middle grid-flow-row grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 space-x-1 mt-2 sm:px-5">
          {fakeTracks.map((track, i) => {
            return (
              <div className="max-w-64" key={i}>
                <PublicTrackCard track={track} />
              </div>
            );
          })}
        </div>
      )} */}

      {/* <div className="overflow-x-auto scrollbars-hidden moz-scrollbars-hidden">
        {fakeTracks && fakeTracks.length !== 0 && (
          <div className="p-6 inline-flex space-x-4">
            {fakeTracks.map((track, i) => {
              return (
                <div className="max-w-64 w-64 whitespace-no-wrap" key={i}>
                  <PublicTrackCard track={track} />
                </div>
              );
            })}
          </div>
        )}
      </div> */}

      {tracks && tracks.length !== 0 && (
        <div ref={tracksContainerRef} className="mt-4 mx-auto rounded-lg max-w-3xl">
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

      {!loading && debouncedSearchTerm.length === 0 && tracks.length === 0 && (
        <h3 className="text-gray-500 text-center mt-5 mb-3 text-xs md:text-sm">
          There are currently have no tracks on display...
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
        <div
          onClick={() => {
            fetchMore({ variables: { after: endCursor } });
          }}
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
        </div>
      )}
    </div>
  );
}

const fakeTracks = [
  {
    img:
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80",
    title: "Box",
    author: "Jackson M.",
  },
  {
    img:
      "https://images.unsplash.com/photo-1520116468816-95b69f847357?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
    title: "Curtains",
    author: "Jackson M.",
  },
  {
    img:
      "https://images.unsplash.com/photo-1520443240718-fce21901db79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
    title: "Emily",
    author: "Jackson M.",
  },
  {
    img:
      "https://images.unsplash.com/photo-1537519646099-335112f03225?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80",
    title: "Compass",
    author: "Jackson M.",
  },
  {
    img:
      "https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80",
    title: "Lotus",
    author: "Jackson M.",
  },
  {
    img:
      "https://images.unsplash.com/photo-1531722569936-825d3dd91b15?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80",
    title: "Ferrari",
    author: "Jackson M.",
  },
  {
    img:
      "https://images.unsplash.com/photo-1414490929659-9a12b7e31907?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80",
    title: "You Da One",
    author: "Jackson M.",
  },
  {
    img:
      "https://images.unsplash.com/photo-1513569143478-b38b2c0ef97f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
    title: "Lies",
    author: "Jackson M.",
  },
  {
    img:
      "https://images.unsplash.com/photo-1528150177508-7cc0c36cda5c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
    title: "Tell Me",
    author: "Jackson M.",
  },
  {
    img:
      "https://images.unsplash.com/photo-1505459668311-8dfac7952bf0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80",
    title: "Why",
    author: "Jackson M.",
  },
  {
    img:
      "https://images.unsplash.com/photo-1526485856375-9110812fbf35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
    title: "Let Me Go",
    author: "Jackson M.",
  },
  {
    img:
      "https://images.unsplash.com/photo-1495819427834-1954f20ebb97?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80",
    title: "It's Me",
    author: "Jackson M.",
  },
  {
    img:
      "https://images.unsplash.com/photo-1510777554755-dd3dad5980ab?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80",
    title: "Not You",
    author: "Jackson M.",
  },
  {
    img:
      "https://images.unsplash.com/photo-1502933691298-84fc14542831?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80",
    title: "Please",
    author: "Jackson M.",
  },
];

export default PublicTracksContainer;
