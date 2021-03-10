import React, { useEffect } from "react";

function UniAudioPlayer() {
  return (
    // Player Container
    <div className="bg-pageBg shadow-lg h-20 relative">
      {/* Inner container */}
      <div className="p-2">
        <div className="flex items-center">
          <div className="flex items-center">
            <img
              className="h-16 w-16 rounded-lg object-cover object-center"
              src="https://images.unsplash.com/photo-1446840959065-353c3a3731a9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80"
              alt=""
            />
            <div className="ml-4 text-sm">
              <p className="font-bold mb-1 text-gray-300">Untouched</p>
              <p className="text-gray-500 ">Jackson M.</p>
            </div>
          </div>

          <button
            // aria-label={`unlike track, ${likeCount} likes`}
            className="ml-10 flex items-center text-orange-600 cursor-pointer"
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
            <span className="inline-block text-sm font-semibold ml-1">
              28 {/* {nFormatter(likeCount)} */}
            </span>
          </button>
          <div className="flex items-center ml-8">
            {/* Shuffle */}
            <button className="mx-4">
              <svg
                className="h-6 w-6 fill-current text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
              </svg>
            </button>
            {/* Previous Track */}
            <button className="mr-1 ml-2">
              <svg
                className="h-8 w-8 fill-current text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>
            {/* Play */}
            <button className="mx-1">
              <svg
                className="h-8 w-8 fill-current text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            {/* Next Track */}
            <button className="ml-1 mr-2">
              <svg
                className="h-8 w-8 fill-current text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
            {/* Loop */}
            <button className="mx-4">
              <svg
                className="h-6 w-6 fill-current text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
              </svg>
            </button>
            <div className="ml-10 py-4 hidden md:block">
              <div className="flex items-center text-gray-500 text-xs">
                <p>0:40</p>
                <div className="mx-4">
                  <div className="h-1 bg-gradient-to-r from-gray-900 via-gray-400 to-teal-400 rounded-full">
                    <div className="w-seeker h-1 rounded-full relative">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        // onChange={(e) => {
                        //   setCurrTime(e.target.value);
                        // }}
                        // value={currTime}
                        className="w-seeker h-1 rounded-full relative bg-teal-400"
                        // className="w-3 h-3 bg-teal-400 rounded-full shadow"
                      />
                    </div>
                  </div>
                </div>
                <p>4:20</p>
              </div>
            </div>

            <div className="absolute right-0 flex items-center mx-6">
              <button className="ml-10">
                <svg
                  className="fill-current text-gray-400 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              </button>
              <div>
                <div className="ml-1 h-1 bg-gradient-to-r from-gray-900 via-gray-400 to-teal-400 rounded-full">
                  <div className="w-32 h-1 rounded-full relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      // onChange={(e) => {
                      //   setCurrTime(e.target.value);
                      // }}
                      // value={currTime}
                      className="w-32 h-1 rounded-full relative"
                      // className="w-3 h-3 bg-teal-400 rounded-full shadow"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UniAudioPlayer;
