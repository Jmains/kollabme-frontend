import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import moment from "moment";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { useAuthState } from "../../context/auth";

function MessageBubble({ body, createdAt, username, profilePic }) {
  const { user } = useAuthState();
  const author = user.username === username ? user.username : username;
  return (
    <div className="flex p-2">
      <NavLink to={`/${username}`} className="h-10 flex-none">
        <img
          className="h-10 w-10 rounded-full object-cover object-center "
          src={profilePic}
          alt="Profile Picture"
        />
      </NavLink>

      <div className="ml-2">
        <div className="flex items-baseline">
          <h1 className="text-teal-400 font-extrabold tracking-wide text-sm">
            {capitalizeFirstLetter(author)}
          </h1>
          <p className="ml-3 text-gray-600 text-xs">{moment(createdAt).fromNow(false)}</p>
        </div>

        <p className="text-gray-300 font-normal text-sm">{body}</p>
      </div>
    </div>
  );
}

export default MessageBubble;
