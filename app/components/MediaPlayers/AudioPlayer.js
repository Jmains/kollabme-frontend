import React, { useEffect, useState } from "react";

function AudioPlayer() {
  const [currTime, setCurrTime] = useState(0);
  return (
    <>
      <audio src="https://intreecate.s3-us-west-1.amazonaws.com/videos/khoii-2nd-try-mp3-1598670331003"></audio>
      <button className="rounded-full cursor-pointer focus:outline-none">
        <div className="flex items-center">
          {/* Play button */}
          <svg
            className="h-10 w-10 fill-current rounded-full bg-gradient-to-r from-gray-900 via-gray-400 to-teal-400 shadow-md"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
          {/* End Play Button */}

          <div className="ml-3 py-4 hidden md:block">
            <div className="flex justify-between text-gray-500 text-xs">
              <p>0:40</p>
              <p>4:20</p>
            </div>
            <div className="mt-1">
              <div className="h-1 bg-gradient-to-r from-gray-900 via-gray-400 to-teal-400 rounded-full">
                <div className=" w-64 lg:w-48 h-1 rounded-full relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    onChange={(e) => {
                      setCurrTime(e.target.value);
                    }}
                    value={currTime}
                    className=" w-64 lg:w-48 h-1 rounded-full relative"
                    // className="w-3 h-3 bg-teal-400 rounded-full shadow"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </button>
    </>
  );
}

export default AudioPlayer;
