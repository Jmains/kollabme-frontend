import React, { useEffect, useRef, useState } from "react";
import LikeTrackButton from "../Buttons/LikeTrackButton";

function PublicTrackCard({ track }) {
  const [showPlayButton, setShowPlayButton] = useState(false);
  const imgRef = useRef(null);
  return (
    <div className="bg-cardBg h-70 w-full max-w-64 rounded-lg shadow-md hover:bg-black hover:bg-opacity-50 transition duration-300 ease-in-out cursor-pointer">
      <div className="p-3 px-3 justify-center">
        <div
          onMouseOver={() => {
            setShowPlayButton(true);
            if (imgRef.current) {
              imgRef.current.style.opacity = "0.5";
            }
          }}
          onMouseLeave={() => {
            setShowPlayButton(false);
            if (imgRef.current) {
              imgRef.current.style.opacity = "1";
            }
          }}
          className="relative duration-300 transition ease-in-out"
        >
          <img
            ref={imgRef}
            className="object-center hover:opacity-50 object-cover rounded-lg shadow-md h-48 w-full  cursor-pointer"
            src={track.img}
            alt="track image"
          />
          {showPlayButton && (
            <button className="absolute inset-0 mx-auto flex justify-center focus:outline-none">
              <svg
                className="fill-current text-gray-300 h-20 w-20 "
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between w-full mt-1">
          <div className="truncate">
            <h3
              aria-label="track title"
              className="text-xs sm:text-sm w-auto max-w-32 text-gray-400 font-bold mt-1 hover:underline"
            >
              {track.title}
            </h3>
            <h4
              aria-label="track author"
              className="text-xs sm:text-sm w-auto max-w-32 truncate text-gray-600 font-medium hover:underline"
            >
              {track.author}
            </h4>
          </div>
          {/* <LikeTrackButton /> */}

          <button
            // aria-label={`unlike track, ${likeCount} likes`}
            className="flex items-center text-orange-600 cursor-pointer mt-1"
            // onClick={likeTrack}
          >
            <svg
              className="fill-current rounded-full h-5 w-5 hover:scale-110 transform transition duration-300 ease-in-out"
              xmlns="http://www.w3.org/2000/svg"
              enableBackground="new 0 0 24 24"
              viewBox="0 0 24 24"
            >
              <g>
                <rect fill="none" height="24" width="24" y="0" />
              </g>
              <g>
                <path d="M19.48,12.35c-1.57-4.08-7.16-4.3-5.81-10.23c0.1-0.44-0.37-0.78-0.75-0.55C9.29,3.71,6.68,8,8.87,13.62 c0.18,0.46-0.36,0.89-0.75,0.59c-1.81-1.37-2-3.34-1.84-4.75c0.06-0.52-0.62-0.77-0.91-0.34C4.69,10.16,4,11.84,4,14.37 c0.38,5.6,5.11,7.32,6.81,7.54c2.43,0.31,5.06-0.14,6.95-1.87C19.84,18.11,20.6,15.03,19.48,12.35z M10.2,17.38 c1.44-0.35,2.18-1.39,2.38-2.31c0.33-1.43-0.96-2.83-0.09-5.09c0.33,1.87,3.27,3.04,3.27,5.08C15.84,17.59,13.1,19.76,10.2,17.38z" />
              </g>
            </svg>
            <span className="inline-block text-xs font-semibold ml-1">
              42{/* {nFormatter(likeCount)} */}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PublicTrackCard;
