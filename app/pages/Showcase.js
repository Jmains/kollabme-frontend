import React, { useState } from "react";
import PublicTracksContainer from "../components/Showcase/PublicTracksContainer";
import PublicVideosContainer from "../components/Showcase/PublicVideosContainer";
import PublicPaintingsContainer from "../components/Showcase/PublicPaintingsContainer";
import PublicAlbumsContainer from "../components/Showcase/PublicAlbumsContainer";
import Page from "../components/Shared/Page";

function Showcase() {
  const [showTracks, setShowTracks] = useState(true);
  const [showAlbums, setShowAlbums] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const types = ["Tracks", "Gallery", "Albums", "Videos"];
  const [active, setActive] = useState(types[0]);

  return (
    <Page title="Showcase">
      <div className="mx-auto md:max-w-full">
        <div className="mx-auto">
          <div className="mt-10 mx-auto flex justify-evenly items-center  text-center tracking-wide max-w-lg md:max-w-xl">
            {/* TODO: Refactor code, looks hacky */}
            {types.map((type) => {
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
                        ? "text-sm md:text-base font-semibold text-gray-300 w-auto px-2 py-1 focus:outline-none focus:text-gray-300 transition duration-300 ease-in-out border-b tracking-wide"
                        : "text-sm md:text-base font-semibold text-gray-600 w-auto px-2 py-1 hover:text-gray-300 focus:outline-none focus:text-gray-300 transition duration-300 ease-in-out tracking-wide"
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
        <div className="max-w-full mx-auto mt-6">
          {showGallery && (
            <div>
              <PublicPaintingsContainer isPublic={true} first={6} />
            </div>
          )}
          {showTracks && (
            <div className="mt-4">
              <PublicTracksContainer isPublic={true} first={7} />
            </div>
          )}
          {showAlbums && (
            <div className="mt-4">
              <PublicAlbumsContainer isPublic={true} first={6} />
            </div>
          )}
          {showVideos && (
            <div className="mt-4">
              <PublicVideosContainer isPublic={true} first={6} />
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}

export default Showcase;
