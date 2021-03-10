import React, { useEffect } from "react";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { NavLink } from "react-router-dom";
import { Waypoint } from "react-waypoint";

function UserContactCard({ user, cursor, fetchMore, networkStatus, loading }) {
  return (
    <NavLink
      to={`/${user.username}`}
      className="w-full relative flex items-center bg-cardBg p-1 shadow-md border-t border-gray-700 rounded-md hover:bg-black transition duration-200 ease-out"
    >
      <img
        className="m-2 rounded-full h-12 w-12 object-cover object-center cursor-pointer"
        src={user.profilePic}
        alt="Profile picture"
      />
      <div className="ml-1">
        <div className="flex items-baseline text-gray-400 font-semibold w-64 text-sm truncate">
          {user.displayName ? (
            <h1>{user.displayName}</h1>
          ) : (
            <h1>{capitalizeFirstLetter(user.username)}</h1>
          )}
          <span className="text-xs ml-2 font-semibold text-teal-400">@{user.username}</span>
        </div>
        <div className="flex pr-2">
          {user.mainPlatforms &&
            user.mainPlatforms.map((mp, i) => {
              if (user.mainPlatforms[i]) {
                if (i === 2 || i === 0) {
                  return (
                    <p key={i} className="text-gray-600 font-normal text-xs">
                      {`${mp}`}
                    </p>
                  );
                } else {
                  return (
                    <p key={i} className="text-gray-600 font-normal text-xs">
                      {`${mp},\u00A0`}
                    </p>
                  );
                }
              }
            })}
        </div>
      </div>
    </NavLink>
  );
}

export default UserContactCard;
