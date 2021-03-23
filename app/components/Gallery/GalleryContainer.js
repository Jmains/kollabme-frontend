import React, { useEffect, useState, useRef } from "react";
import GalleryCard from "./GalleryCard";
import LoadingSpinner from "../Shared/LoadingSpinner";
import AddTrackModal from "../Modals/AddTrackModal";
import Modal from "react-modal";
import { useLazyQuery } from "@apollo/client";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { AuthContext, useAuthState } from "../../context/auth";
import { useDebounce } from "../../utils/hooks";
import { QUERY_PAINTINGS, QUERY_PUBLIC_PAINTINGS } from "../../utils/graphql";
import AddPaintingModal from "../Modals/AddPaintingModal";

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

function GalleryContainer(props) {
  const { user } = useAuthState();

  const [paintings, setPaintings] = useState([]);
  const [endCursor, setEndCursor] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const debouncedSearchTerm = useDebounce(searchQuery, 350);
  const galleryContainerRef = useRef(null);
  const titleRef = useRef(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const QUERY = props.isPublic ? QUERY_PUBLIC_PAINTINGS : QUERY_PAINTINGS;

  const [getPaintings, { error, loading, data, fetchMore, networkStatus }] = useLazyQuery(
    QUERY,
    {
      variables: {
        username: props.username,
        first: props.first,
        searchQuery: searchQuery,
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
      onError: (err) => {
        console.log("Failed to retrieve paintings: ", err);
      },
    }
  );

  useEffect(() => {
    getPaintings();
    if (titleRef.current && !props.isPublic) {
      titleRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm.length === 0) {
      getPaintings();
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (data) {
      if (props.isPublic) {
        setPaintings(data.queryPublicPaintings.edges);
        setEndCursor(data.queryPublicPaintings.pageInfo.endCursor);
        setHasNextPage(data.queryPublicPaintings.pageInfo.hasNextPage);
      } else {
        setPaintings(data.queryPaintings.edges);
        setEndCursor(data.queryPaintings.pageInfo.endCursor);
        setHasNextPage(data.queryPaintings.pageInfo.hasNextPage);
      }
    } else {
      setPaintings([]);
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
        onAfterOpen={() => {
          document.body.style.overflow = "hidden";
        }}
        shouldCloseOnOverlayClick={false}
      >
        <AddPaintingModal
          setModalIsOpen={setModalIsOpen}
          searchQuery={searchQuery}
          username={props.username}
          isPublic={props.isPublic}
        />
      </Modal>
      <div className="flex justify-between items-center">
        <h1
          tabIndex="0"
          id="title"
          ref={titleRef}
          className="text-black font-bold text-base md:text-lg ml-2 focus:outline-none focus:shadow-outline"
        >
          Gallery
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
              if (galleryContainerRef.current) {
                galleryContainerRef.current.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            }}
            onClick={() => {
              if (galleryContainerRef.current) {
                galleryContainerRef.current.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            }}
            className="sm:w-72 w-40 text-xs sm:text-sm relative bg-white rounded-full h-8 pl-5 pr-10 py-1 text-gray-800 placeholder-gray-700 focus:outline-none"
            type="text"
            name="search gallery"
            id="searchGallery"
            placeholder="Search gallery..."
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
            onClick={() => {
              setModalIsOpen(true);
            }}
            className="text-teal-400 px-2 py-1 font-bold text-xs bg-gray-800 bg-opacity-25 rounded-md mr-2"
          >
            Add Painting +
          </button>
        )}
      </div>

      <div
        ref={galleryContainerRef}
        className="grid md:grid-cols-2 grid-cols-1 grid-flow-row mt-2 bg-pageBg rounded-lg"
      >
        {paintings &&
          paintings.map((painting) => {
            return (
              <div key={painting.node.id} className="col-span-1">
                <GalleryCard
                  user={user}
                  profileUsername={props.username}
                  painting={painting.node}
                  searchQuery={searchQuery}
                  isPublic={props.isPublic}
                />
              </div>
            );
          })}
      </div>

      {!loading &&
        user &&
        debouncedSearchTerm.length === 0 &&
        paintings.length === 0 &&
        props.username === user.username && (
          <h3 className="text-gray-500 text-center mt-5 mb-3 text-xs md:text-sm">
            You currently have no paintings on display...
          </h3>
        )}
      {!loading && !user && debouncedSearchTerm.length === 0 && paintings.length === 0 && (
        <h3 className="text-gray-500 text-center mt-5 mb-3 text-xs md:text-sm">
          {capitalizeFirstLetter(props.username)} currently have no paintings on display...
        </h3>
      )}

      {!loading && debouncedSearchTerm.length > 0 && paintings.length === 0 && (
        <h3 className="mt-5 mb-3 text-gray-500 text-center text-xs md:text-sm">
          No painting(s) found...
        </h3>
      )}

      {/* <div className="relative flex justify-center">
        {networkStatus === 1 && <LoadingSpinner />}
      </div> */}
      <div className="relative flex justify-center">
        {networkStatus === 3 && <LoadingSpinner />}
      </div>

      {data && hasNextPage && (
        <button
          onClick={() => {
            fetchMore({ variables: { after: endCursor } });
          }}
          aria-label="load more images"
          className="h-10 w-full bg-cardBg rounded-lg text-center mt-1 shadow-md"
        >
          <svg
            className="sm:w-10 sm:h-10 h-8 w-8 mt-1 sm:mt-0 fill-current text-gray-500 inline-block"
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

export default GalleryContainer;
