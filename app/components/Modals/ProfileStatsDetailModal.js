import React, { useEffect, useRef } from "react";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { NavLink } from "react-router-dom";
import { Waypoint } from "react-waypoint";
import { useQuery } from "@apollo/client";
import { ProfileStatsDetailTypes } from "../../constants/ProfileStatsDetailTypes";

function ProfileStatsDetailModal({ title, setModalIsOpen, query, type, username }) {
  let users = [];
  let endCursor = "";
  let hasNextPage = false;
  const titleRef = useRef(null);

  const { loading, data, fetchMore } = useQuery(query, {
    variables: { username: username, searchQuery: null },
    fetchPolicy: "network-only",
    onError: (err) => {
      console.log("Failed to get profile Info: ", err);
    },
  });

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  if (data && type === ProfileStatsDetailTypes.FOLLOWERS) {
    users = data.queryFollowers.edges;
    endCursor = data.queryFollowers.pageInfo.endCursor;
    hasNextPage = data.queryFollowers.pageInfo.hasNextPage;
  } else if (data && type === ProfileStatsDetailTypes.FOLLOWING) {
    users = data.queryFollowing.edges;
    endCursor = data.queryFollowing.pageInfo.endCursor;
    hasNextPage = data.queryFollowing.pageInfo.hasNextPage;
  } else if (data && type === ProfileStatsDetailTypes.COLLABORATORS) {
    users = data.queryCollaborators.edges;
    endCursor = data.queryCollaborators.pageInfo.endCursor;
    hasNextPage = data.queryCollaborators.pageInfo.hasNextPage;
  }

  return (
    <>
      {loading ? (
        <div className="flex justify-center mx-auto">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="bg-cardBg rounded-lg w-screen max-w-sm p-2">
          <div className="flex justify-between items-center">
            <h1
              ref={titleRef}
              tabIndex="0"
              id="title"
              className="text-teal-400 text-xl font-bold tracking-wide m-2"
            >
              {title}
            </h1>
            <button
              aria-label="close popup"
              onClick={() => {
                document.body.style.overflow = "";
                setModalIsOpen(false);
              }}
            >
              <svg
                className="fill-current h-6 w-6 text-gray-500 rounded-full bg-red-600 bg-opacity-50 hover:text-gray-300 hover:bg-opacity-100 transition duration-300 ease-in-out shadow-sm cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>

          <div className=" w-full overflow-y-auto overflow-x-hidden h-64 rounded-lg">
            {data && users.length === 0 && (
              <h1 className="text-gray-500 text-center w-64 text-sm mt-24">
                You currently have no {title}...
              </h1>
            )}
            {data &&
              users &&
              users.map((user, i) => {
                return (
                  <NavLink
                    to={`/${user.node.username}`}
                    key={user.node.id}
                    onClick={() => {
                      setModalIsOpen(false);
                    }}
                    className="w-full flex items-center bg-gray-800 bg-opacity-25 py-1 px-2 shadow-md border-t border-gray-700 cursor-pointer hover:bg-black hover:bg-opacity-75 transition duration-300 ease-in-out"
                  >
                    <img
                      className="m-2 rounded-full h-12 w-12 object-cover object-center cursor-pointer"
                      src={user.node.profilePic}
                      alt="Profile picture"
                    />
                    <div className="ml-1">
                      <h2 className="text-gray-400 font-semibold w-64 text-sm truncate">
                        {capitalizeFirstLetter(user.node.username)}
                      </h2>
                      <div className="flex pr-2">
                        {user.node.mainPlatforms &&
                          user.node.mainPlatforms.map((mp, i) => {
                            if (i === 2) {
                              return (
                                <>
                                  {mp && (
                                    <p key={i} className="text-gray-600 font-normal text-xs">
                                      {`${mp}`}
                                    </p>
                                  )}
                                </>
                              );
                            } else {
                              return (
                                <>
                                  {mp && (
                                    <p key={i} className="text-gray-600 font-normal text-xs">
                                      {`${mp},\u00A0`}
                                    </p>
                                  )}
                                </>
                              );
                            }
                          })}
                      </div>
                    </div>

                    {hasNextPage && i === users.length - 2 && (
                      <Waypoint
                        onEnter={() => {
                          fetchMore({
                            variables: { after: endCursor },
                          });
                        }}
                      />
                    )}
                  </NavLink>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
}

export default ProfileStatsDetailModal;
