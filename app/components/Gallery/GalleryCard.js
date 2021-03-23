import "react-image-lightbox/style.css";
import React, { useEffect, useState } from "react";
import LockPaintingButton from "../Buttons/LockPaintingButton";
import { useMutation, gql } from "@apollo/client";
import { QUERY_PAINTINGS, QUERY_PUBLIC_PAINTINGS } from "../../utils/graphql";
import LikePaintingButton from "../Buttons/LikePaintingButton";
import { Link } from "react-router-dom";
import LoadingSpinner from "../Shared/LoadingSpinner";
import Lightbox from "react-image-lightbox";
import lozad from "lozad";

function GalleryCard({ painting, user, profileUsername, searchQuery, isPublic }) {
  const [showMorePaintingOptions, setShowMorePaintingOptions] = useState(false);
  const [imgModalOpen, setImgModalOpen] = useState(false);
  const observer = lozad(); // lazy loads elements with default selector as '.lozad'
  observer.observe();

  const [deletePainting, { data, error, loading }] = useMutation(DELETE_PAINTING_MUTATION, {
    variables: { paintingId: painting.id },
    onError: (err) => {
      console.log("Failed to delete painting: ", err);
    },
    update: (proxy, res) => {
      if (isPublic) {
        const data = proxy.readQuery({
          query: QUERY_PUBLIC_PAINTINGS,
          variables: { username: user.username, searchQuery: searchQuery },
        });

        const filteredPaintings = data.queryPublicPaintings.edges.filter(
          (p) => p.node.id !== painting.id
        );

        if (filteredPaintings.length === 0) {
          proxy.writeQuery({
            query: QUERY_PUBLIC_PAINTINGS,
            variables: { username: user.username, searchQuery: searchQuery },
            data: {
              queryPublicPaintings: {
                edges: [...filteredPaintings],
                pageInfo: {
                  hasNextPage: false,
                  endCursor: "",
                },
              },
            },
          });
        } else {
          proxy.writeQuery({
            query: QUERY_PUBLIC_PAINTINGS,
            variables: { username: user.username, searchQuery: searchQuery },
            data: {
              queryPublicPaintings: {
                edges: [...filteredPaintings],
                pageInfo: {
                  hasNextPage: data.queryPublicPaintings.pageInfo.hasNextPage,
                  endCursor: data.queryPublicPaintings.pageInfo.endCursor,
                },
              },
            },
          });
        }
      } else {
        const data = proxy.readQuery({
          query: QUERY_PAINTINGS,
          variables: { username: user.username, searchQuery: searchQuery },
        });

        const filteredPaintings = data.queryPaintings.edges.filter(
          (p) => p.node.id !== painting.id
        );
        if (filteredPaintings.length === 0) {
          proxy.writeQuery({
            query: QUERY_PAINTINGS,
            variables: { username: user.username, searchQuery: searchQuery },
            data: {
              queryPaintings: {
                edges: [...filteredPaintings],
                pageInfo: {
                  hasNextPage: false,
                  endCursor: "",
                },
              },
            },
          });
        } else {
          proxy.writeQuery({
            query: QUERY_PAINTINGS,
            variables: { username: user.username, searchQuery: searchQuery },
            data: {
              queryPaintings: {
                edges: [...filteredPaintings],
                pageInfo: {
                  hasNextPage: data.queryPaintings.pageInfo.hasNextPage,
                  endCursor: data.queryPaintings.pageInfo.endCursor,
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
      setShowMorePaintingOptions(false);
    }
  }

  useEffect(() => {
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  function handleMoreOptionsClick() {
    setShowMorePaintingOptions(true);
    document.addEventListener("keydown", handleEscape);
  }

  function handleEditPaintingItemClick() {
    setShowMorePaintingOptions(false);
    document.removeEventListener("keydown", handleEscape);
    // setEditTrackModal(true)
  }

  function handleDeletePaintingItemClick() {
    deletePainting();
    setShowMorePaintingOptions(false);
    document.removeEventListener("keydown", handleEscape);
  }

  function handleReportPaintingItemClick() {
    // report()
    setShowMorePaintingOptions(false);
    document.removeEventListener("keydown", handleEscape);
  }

  return (
    <>
      {loading ? (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="relative bg-white text-center my-1 rounded-sm hover:bg-black hover:bg-opacity-10 px-2 py-2 mr-2 shadow-md transition duration-300 ease-in-out">
          <button
            onClick={() => {
              setImgModalOpen(true);
            }}
            aria-label="enhance image button"
          >
            <img
              className="mt-3 inline-block rounded-sm object-center object-cover cursor-pointer shadow-lg lozad max-h-80"
              data-src={painting.imageUrl}
              alt="Painting image"
            />
          </button>

          {imgModalOpen && (
            <Lightbox
              mainSrc={painting.imageUrl}
              onCloseRequest={() => setImgModalOpen(false)}
            />
          )}
          <div className="relative">
            {painting.username && user && painting.username === user.username && (
              <div className="absolute top-0 left-0 text-white md:ml-6 ml-10 mt-2">
                <LockPaintingButton user={user} painting={painting} />
              </div>
            )}
            <div className="absolute top-0 right-0 md:mr-6 md:ml-6 mr-10 mt-2">
              <div className="flex items-center">
                <LikePaintingButton user={user} painting={painting} />
              </div>
            </div>
            <Link to={`/${painting.username}/gallery/${painting.id}`}>
              <h1 className="text-gray-900 text-xs sm:text-sm font-bold mt-2 cursor-pointer hover:underline w-40 mx-auto truncate">
                {painting.title}
              </h1>
              <p className="text-gray-700 text-xs sm:text-sm cursor-pointer w-40 mx-auto truncate">
                {painting.description}
              </p>
            </Link>
            <Link to={`/${painting.username}`}>
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
                  {painting.author.displayName}
                </p>
              </div>
            </Link>
          </div>

          <button
            onClick={handleMoreOptionsClick}
            aria-label="more track options"
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

          {showMorePaintingOptions && (
            <>
              <button
                tabIndex="-1"
                onClick={() => {
                  setShowMorePaintingOptions(false);
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
                  aria-labelledby="painting-options"
                >
                  {user && painting.username && user.username === painting.username && (
                    <div>
                      <button
                        onClick={handleEditPaintingItemClick}
                        className="block text-left w-full px-4 py-2 text-xs sm:text-sm leading-5 text-gray-500 hover:bg-pageBg hover:text-teal-400 focus:bg-pageBg focus:text-intreecatePri transition duration-200 ease-in-out"
                        role="paintingmenuitem"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDeletePaintingItemClick}
                        className="block text-left w-full px-4 py-2 text-xs sm:text-sm leading-5 text-red-700 hover:text-red-500 hover:bg-pageBg  focus:bg-pageBg transition duration-200 ease-in-out"
                        role="paintingmenuitem"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  <div className="flex items-center text-left w-full cursor-pointer px-4 py-2 text-xs sm:text-sm leading-5 text-red-700 hover:text-red-500 hover:bg-pageBg focus:bg-pageBg focus:text-intreecatePri transition duration-200 ease-in-out">
                    <button
                      onClick={handleReportPaintingItemClick}
                      className=""
                      role="paintingmenuitem"
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

const DELETE_PAINTING_MUTATION = gql`
  mutation deletePainting($paintingId: ID!) {
    deletePainting(paintingId: $paintingId)
  }
`;

export default GalleryCard;
