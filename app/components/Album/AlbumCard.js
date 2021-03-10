import React, { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import LockAlbumButton from "../../components/Buttons/LockAlbumButton";
import LikeAlbumButton from "../Buttons/LikeAlbumButton";
import { useMutation, gql } from "@apollo/client";
import { QUERY_ALBUMS, QUERY_PUBLIC_ALBUMS, QUERY_TRACKS } from "../../utils/graphql";

function AlbumCard({ album, user, profileUsername, searchQuery, isPublic }) {
  const [showMoreAlbumOptions, setShowMoreAlbumOptions] = useState(false);

  const [deleteAlbum, { data, error, loading }] = useMutation(DELETE_ALBUM_MUTATION, {
    variables: { albumId: album.id },
    onError: (err) => {
      console.log("Failed to delete album: ", err);
    },
    update: (proxy, res) => {
      if (isPublic) {
        updatePublicAlbumsQueryCache(proxy);
      } else {
        updateAlbumsQueryCache(proxy);
      }
    },
  });

  function updateAlbumsQueryCache(proxy) {
    const data = proxy.readQuery({
      query: QUERY_ALBUMS,
      variables: { username: user.username, searchQuery: searchQuery },
    });

    const filteredAlbums = data.queryAlbums.edges.filter((a) => a.node.id !== album.id);
    if (filteredAlbums.length === 0) {
      proxy.writeQuery({
        query: QUERY_ALBUMS,
        variables: { username: user.username, searchQuery: searchQuery },
        data: {
          queryAlbums: {
            edges: [...filteredAlbums],
            pageInfo: {
              hasNextPage: false,
              endCursor: "",
            },
          },
        },
      });
    } else {
      proxy.writeQuery({
        query: QUERY_ALBUMS,
        variables: { username: user.username, searchQuery: searchQuery },
        data: {
          queryAlbums: {
            edges: [...filteredAlbums],
            pageInfo: {
              hasNextPage: data.queryAlbums.pageInfo.hasNextPage,
              endCursor: data.queryAlbums.pageInfo.endCursor,
            },
          },
        },
      });
    }
  }

  function updatePublicAlbumsQueryCache(proxy) {
    const data = proxy.readQuery({
      query: QUERY_PUBLIC_ALBUMS,
      variables: { username: user.username, searchQuery: searchQuery },
    });

    const filteredAlbums = data.queryPublicAlbums.edges.filter((a) => a.node.id !== album.id);
    if (filteredAlbums.length === 0) {
      proxy.writeQuery({
        query: QUERY_PUBLIC_ALBUMS,
        variables: { username: user.username, searchQuery: searchQuery },
        data: {
          queryPublicAlbums: {
            edges: [...filteredAlbums],
            pageInfo: {
              hasNextPage: false,
              endCursor: "",
            },
          },
        },
      });
    } else {
      proxy.writeQuery({
        query: QUERY_PUBLIC_ALBUMS,
        variables: { username: user.username, searchQuery: searchQuery },
        data: {
          queryPublicAlbums: {
            edges: [...filteredAlbums],
            pageInfo: {
              hasNextPage: data.queryPublicAlbums.pageInfo.hasNextPage,
              endCursor: data.queryPublicAlbums.pageInfo.endCursor,
            },
          },
        },
      });
    }
  }

  function handleEscape(e) {
    if (e.key === "Esc" || e.key === "Escape") {
      setShowMoreAlbumOptions(false);
    }
  }

  useEffect(() => {
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  function handleMoreOptionsClick() {
    setShowMoreAlbumOptions(true);
    document.addEventListener("keydown", handleEscape);
  }

  function handleEditAlbumItemClick() {
    setShowMoreAlbumOptions(false);
    document.removeEventListener("keydown", handleEscape);
    // setEditTrackModal(true)
  }

  function handleDeleteAlbumItemClick() {
    deleteAlbum();
    setShowMoreAlbumOptions(false);
    document.removeEventListener("keydown", handleEscape);
  }

  function handleReportAlbumItemClick() {
    // report()
    setShowMoreAlbumOptions(false);
    document.removeEventListener("keydown", handleEscape);
  }

  return (
    <div className="">
      <div className="relative h-auto bg-cardBg text-center content-center my-1 rounded-lg hover:bg-black hover:bg-opacity-50 px-2 py-3 mr-2 shadow-md transition duration-300 ease-in-out">
        <img
          className="inline-block h-24 w-24 rounded-md object-center object-cover cursor-pointer shadow-lg"
          src={album.coverImageUrl}
          alt="Album cover"
        />
        <h1 className="text-gray-400 text-xs sm:text-sm font-bold mt-2 cursor-pointer">
          {album.title}
        </h1>
        <p className="text-gray-600 text-xs sm:text-sm font-thin cursor-pointer">
          {capitalizeFirstLetter(album.author)}
        </p>
        <div className="mt-2 flex justify-center">
          <LikeAlbumButton user={user} album={album} />
        </div>
        <div className="mt-2">
          <LockAlbumButton user={user} album={album} />
        </div>

        <button
          onClick={handleMoreOptionsClick}
          aria-label="more track options"
          className="absolute top-0 right-0 mt-2 text-gray-500 text-xs cursor-pointer"
        >
          <svg
            className=" fill-current text-gray-500 h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>

        {showMoreAlbumOptions && (
          <>
            <button
              tabIndex="-1"
              onClick={() => {
                setShowMoreAlbumOptions(false);
                document.removeEventListener("keydown", handleEscape);
              }}
              className="fixed inset-0 max-h-full h-auto w-full z-50 cursor-default focus:outline-none bg-black bg-opacity-50"
            ></button>
            <div className="top-0 mr-4 absolute right-0 mt-8 w-48 rounded-md shadow-lg z-50 ">
              <div
                className="py-1 rounded-md h-auto bg-cardBg shadow-xs"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="track-options"
              >
                {user && profileUsername && user.username === profileUsername && (
                  <div>
                    <button
                      onClick={handleEditAlbumItemClick}
                      className="block text-left w-full px-4 py-2 text-xs sm:text-sm leading-5 text-gray-500 hover:bg-pageBg hover:text-teal-400 focus:bg-pageBg focus:text-intreecatePri transition duration-200 ease-in-out"
                      role="trackmenuitem"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDeleteAlbumItemClick}
                      className="block text-left w-full px-4 py-2 text-xs sm:text-sm leading-5 text-red-700 hover:text-red-500 hover:bg-pageBg  focus:bg-pageBg transition duration-200 ease-in-out"
                      role="trackmenuitem"
                    >
                      Delete
                    </button>
                  </div>
                )}
                <div className="flex items-center text-left w-full cursor-pointer px-4 py-2 text-xs sm:text-sm leading-5 text-red-700 hover:text-red-500 hover:bg-pageBg focus:bg-pageBg focus:text-intreecatePri transition duration-200 ease-in-out">
                  <button
                    onClick={handleReportAlbumItemClick}
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
    </div>
  );
}

const DELETE_ALBUM_MUTATION = gql`
  mutation deleteAlbum($albumId: ID!) {
    deleteAlbum(albumId: $albumId)
  }
`;

export default AlbumCard;
