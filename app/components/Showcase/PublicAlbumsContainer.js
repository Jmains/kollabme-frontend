import React, { useEffect, useState, useRef } from "react";
import AlbumCard from "../../components/Album/AlbumCard";
import { QUERY_PUBLIC_ALBUMS } from "../../utils/graphql";
import { useAuthState } from "../../context/auth";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { useDebounce } from "../../utils/hooks";
import { useLazyQuery } from "@apollo/client";

function PublicAlbumsContainer(props) {
  const { user } = useAuthState();

  const [albums, setAlbums] = useState([]);
  const [endCursor, setEndCursor] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const debouncedSearchTerm = useDebounce(searchQuery, 350);

  const albumContainerRef = useRef(null);

  const [getAlbums, { error, loading, data, fetchMore, networkStatus }] = useLazyQuery(
    QUERY_PUBLIC_ALBUMS,
    {
      variables: {
        first: props.first,
        searchQuery: searchQuery,
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
      onError: (err) => {
        console.log("Failed to retrieve albums: ", err);
      },
    }
  );

  useEffect(() => {
    getAlbums();
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm.length === 0) {
      getAlbums();
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (data) {
      if (props.isPublic) {
        setAlbums(data.queryPublicAlbums.edges);
        setEndCursor(data.queryPublicAlbums.pageInfo.endCursor);
        setHasNextPage(data.queryPublicAlbums.pageInfo.hasNextPage);
      }
    } else {
      setAlbums([]);
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
      <div className="flex justify-between items-center px-4">
        <h2 className="text-black font-bold text-base md:text-lg lg:text-3xl focus:outline-none">
          Albums
        </h2>

        {/* Search bar */}
        <div className="relative p-1 rounded-md focus:outline-none">
          <input
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (albumContainerRef.current) {
                albumContainerRef.current.scrollIntoView({
                  behavior: "smooth",
                  block: "end",
                });
              }
            }}
            onFocus={() => {
              if (albumContainerRef.current) {
                albumContainerRef.current.scrollIntoView({
                  behavior: "smooth",
                  block: "end",
                });
              }
            }}
            onClick={() => {
              if (albumContainerRef.current) {
                albumContainerRef.current.scrollIntoView({
                  behavior: "smooth",
                  block: "end",
                });
              }
            }}
            className="text-xs sm:text-sm sm:w-72 w-40 relative bg-white rounded-full h-8 pl-5 pr-10 py-1 text-gray-900 placeholder-gray-500 focus:outline-none"
            type="text"
            name="search track"
            id="searchTrack"
            placeholder="Search albums..."
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

      <div
        ref={albumContainerRef}
        className="grid grid-cols-2 md:grid-cols-3 grid-flow-row mt-2 bg-pageBg rounded-lg"
      >
        {albums &&
          albums.map((album) => {
            return (
              <div key={album.node.id} className="col-span-1">
                <AlbumCard
                  album={album.node}
                  user={user}
                  searchQuery={searchQuery}
                  profileUsername={props.username}
                  isPublic={props.isPublic}
                />
              </div>
            );
          })}
      </div>

      {!loading && debouncedSearchTerm.length === 0 && albums.length === 0 && (
        <h3 className="text-gray-500 text-center mt-5 mb-3 text-xs md:text-sm">
          There are currently have no albums on display...
        </h3>
      )}

      {!loading && debouncedSearchTerm.length > 0 && albums.length === 0 && (
        <h3 className="mt-5 mb-3 text-gray-500 text-center text-xs md:text-sm">
          No album(s) found...
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

export default PublicAlbumsContainer;
