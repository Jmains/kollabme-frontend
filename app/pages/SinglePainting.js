import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import LockPaintingButton from "../components/Buttons/LockPaintingButton";
import LikePaintingButton from "../components/Buttons/LikePaintingButton";
import { useAuthState } from "../context/auth";
import Lightbox from "react-image-lightbox";

function handleEscape(e) {
  if (e.key === "Esc" || e.key === "Escape") {
    setShowMorePaintingOptions(false);
  }
}

function SinglePainting() {
  let painting = null;
  const { user } = useAuthState();
  const [showMorePaintingOptions, setShowMorePaintingOptions] = useState(false);
  const { username, paintingId } = useParams();
  const [imgModalOpen, setImgModalOpen] = useState(false);
  const { error, loading, data } = useQuery(GET_PAINTING, {
    variables: { paintingId },
  });

  if (data) {
    painting = data.getPainting;
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
      {painting && (
        <div className="sm:mt-40 mt-64 relative bg-cardBg max-w-2xl mx-auto text-center content-center my-1 rounded-lg hover:bg-black hover:bg-opacity-50 px-2 py-2 shadow-md transition duration-300 ease-in-out">
          <button
            onClick={() => {
              setImgModalOpen(true);
            }}
            aria-label="enhance image button"
          >
            <img
              className="mt-3 inline-block h-48 w-56 md:w-72 md:h-72 rounded-md object-center object-cover cursor-pointer shadow-lg"
              src={painting.imageUrl}
            />
          </button>

          {imgModalOpen && (
            <Lightbox
              mainSrc={painting.imageUrl}
              onCloseRequest={() => setImgModalOpen(false)}
            />
          )}

          <div className="relative">
            {username && user && username === user.username && (
              <div className="absolute top-0 left-0 text-white md:ml-6 ml-10 mt-2">
                <LockPaintingButton user={user} painting={painting} />
              </div>
            )}
            <div className="absolute top-0 right-0 md:mr-6 md:ml-6 mr-10 mt-2">
              <div className="flex items-center">
                <LikePaintingButton user={user} painting={painting} />
              </div>
            </div>
            <Link to={`/${username}/gallery/${painting.id}`}>
              <h1 className="text-gray-300 text-xs sm:text-sm md:text-base font-bold mt-2 cursor-pointer hover:underline w-40 mx-auto truncate">
                {painting.title}
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm font-thin cursor-pointer w-40 sm:w-72 mx-auto h-auto">
                {painting.description}
              </p>
            </Link>
            <Link to={`/${painting.username}`}>
              <div className="flex justify-center items-center mx-auto w-40 mt-3">
                <svg
                  className="fill-current text-teal-400 -ml-3 h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                <p className="text-teal-400 text-xs sm:text-sm cursor-pointer ml-1 truncate">
                  {painting.author.displayName}
                </p>
              </div>
            </Link>
          </div>

          <button
            onClick={() => {
              setShowMorePaintingOptions(true);
            }}
            aria-label="more track options"
            className="absolute top-0 right-0 mt-5 mr-3 lg:mr-1 text-gray-500 text-xs cursor-pointer"
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
                className="fixed inset-0 h-full w-full z-50 cursor-default focus:outline-none bg-black bg-opacity-50"
              ></button>
              <div className="top-0 mr-4 absolute right-0 mt-12 w-48 rounded-md shadow-lg z-50 ">
                <div
                  className="py-1 rounded-md h-auto bg-cardBg shadow-xs"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="painting-options"
                >
                  {user && username && user.username === username && (
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

const GET_PAINTING = gql`
  query($paintingId: ID!) {
    getPainting(paintingId: $paintingId) {
      imageUrl
      id
      description
      username
      title
      likes {
        id
        username
      }
      likeCount
      isPublic
      author {
        displayName
        id
      }
    }
  }
`;

export default SinglePainting;
