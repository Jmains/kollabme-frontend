import React, { useEffect, useState } from "react";

import Page from "../components/Shared/Page";
import GalleryContainer from "../components/Gallery/GalleryContainer";
import TracksContainer from "../components/Track/TracksContainer";
import AlbumsContainer from "../components/Album/AlbumsContainer";
import VideosContainer from "../components/Video/VideosContainer";

import { useAuthState } from "../context/auth";

function Projects() {
  const { user } = useAuthState();
  const [showGallery, setShowGallery] = useState(false);
  const [showTracks, setShowTracks] = useState(true);
  const [showAlbums, setShowAlbums] = useState(false);
  const [showVideos, setShowVideos] = useState(false);

  const types = ["Tracks", "Gallery", "Albums", "Videos"];
  const [active, setActive] = useState(types[0]);

  return (
    <Page title="Projects">
      <div className="mx-auto">
        <div className="mt-20 mx-auto flex justify-evenly items-center rounded-lg border-teal-400 border-b text-center tracking-wide max-w-lg md:max-w-xl">
          {types.map((type, i) => {
            return (
              <div key={type}>
                <button
                  aria-pressed={active === type ? true : false}
                  onClick={(e) => {
                    switch (e.currentTarget.textContent) {
                      case "Tracks":
                        setShowTracks(true);
                        setShowAlbums(false);
                        setShowGallery(false);
                        setShowVideos(false);
                        break;
                      case "Gallery":
                        setShowTracks(false);
                        setShowAlbums(false);
                        setShowGallery(true);
                        setShowVideos(false);

                        break;
                      case "Albums":
                        setShowTracks(false);
                        setShowAlbums(true);
                        setShowGallery(false);
                        setShowVideos(false);
                        break;
                      case "Videos":
                        setShowTracks(false);
                        setShowAlbums(false);
                        setShowGallery(false);
                        setShowVideos(true);
                        break;
                    }
                    setActive(type);
                  }}
                  className={
                    active === type
                      ? "text-sm md:text-base font-semibold text-teal-400 w-auto px-3 py-1"
                      : "text-sm md:text-base font-semibold text-gray-400 w-auto px-3 py-1  hover:text-teal-400 transition duration-300 ease-in-out"
                  }
                >
                  {type}
                </button>
                {/* {i !== types.length - 1 && (
                  <div className="bg-teal-400 border-teal-400 border rounded h-8"></div>
                )} */}
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-6">
        {showGallery && user && (
          <div>
            <GalleryContainer isPublic={false} username={user.username} first={4} />
          </div>
        )}
        {showTracks && user && (
          <div className="mt-4">
            <TracksContainer isPublic={false} username={user.username} first={7} />
          </div>
        )}
        {showAlbums && user && (
          <div className="mt-4">
            <AlbumsContainer isPublic={false} username={user.username} first={7} />
          </div>
        )}
        {showVideos && user && (
          <div className="mt-4">
            <VideosContainer isPublic={false} username={user.username} first={4} />
          </div>
        )}
      </div>
    </Page>
  );
}

export default Projects;
