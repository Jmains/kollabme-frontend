import React, { useEffect } from "react";
import moment from "moment";

function ContactCard({ profilePic, username, body, createdAt, isCollaborating }) {
  return (
    <div className="flex relative items-center bg-cardBg bg-opacity-25 p-1 my-1 shadow-md rounded-md hover:bg-black hover:bg-opacity-25 transition duration-300 ease-in-out">
      <img
        className="m-2 rounded-full h-12 w-12 object-cover object-center"
        src={profilePic}
        alt="Profile Pic"
      />
      <div className="ml-1">
        <div className="flex justify-start">
          <h1 className="text-teal-400 w-64 text-sm truncate font-extrabold tracking-wide flex">
            {username}
            {isCollaborating && (
              <svg
                className="h-5 w-5 ml-2 fill-current text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
            )}
          </h1>
        </div>

        <p className="text-gray-400 font-medium  text-sm w-64 truncate">{body}</p>
      </div>
      <p className="absolute inset-y-0 right-0 mt-3 mr-3 text-gray-500 text-xs ">
        {createdAt}
      </p>
    </div>
  );
}

export default ContactCard;
