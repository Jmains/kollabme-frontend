import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { QUERY_USERS } from "../../utils/graphql";
import UserContactCard from "./UserContactCard";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { Waypoint } from "react-waypoint";
import { useDebounce } from "../../utils/hooks";

function UserSearchBar() {
  const [users, setUsers] = useState([]);
  const [endCursor, setEndCursor] = useState("");
  // TODO: Add debounce to searching
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchList, setShowSearchList] = useState(false);
  const debouncedSearchTerm = useDebounce(searchQuery, 450);

  const [getUsers, { loading, error, data, fetchMore, networkStatus }] = useLazyQuery(
    QUERY_USERS,
    {
      variables: {
        searchQuery: debouncedSearchTerm,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length > 0) {
      getUsers();
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (data) {
      setUsers(data.getPaginatedUsers.edges);
      setEndCursor(data.getPaginatedUsers.pageInfo.endCursor);
    } else {
      setUsers([]);
      setEndCursor("");
    }
  }, [debouncedSearchTerm, data]);

  return (
    <div className="relative p-1 rounded-md  focus:outline-none ">
      <input
        aria-label="searchbar"
        autoComplete="off"
        onFocus={() => {
          setShowSearchList(true);
        }}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        className="relative focus-within:fixed shadow-md focus-within:z-30 bg-white text-xs md:text-base rounded-full h-10 pl-5 pr-10 py-1 text-gray-900 placeholder-gray-500 w-full focus:outline-none"
        type="text"
        name="search"
        id="search"
        placeholder="Search users..."
      />
      <svg
        className="absolute z-30 h-6 w-6 fill-current mt-3 focus-within:z-30 focus-within:fixed right-0 inset-y-0 text-gray-500 mr-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
      </svg>
      {showSearchList && (
        <div>
          <button
            tabIndex="-1"
            aria-label="close search popup"
            onClick={() => {
              setShowSearchList(false);
            }}
            className="fixed inset-0 w-full z-20 cursor-default focus:outline-none bg-black bg-opacity-75"
          ></button>

          {data && (
            <div className="absolute inset-y-0 mt-12 z-30 h-64 overflow-y-auto w-full">
              {data && users.length === 0 && (
                <h1 className="relative h-16 pt-5 pl-2 text-gray-500 bg-cardBg rounded-md">
                  User(s) not found.
                </h1>
              )}
              {data &&
                users &&
                users.length !== 0 &&
                users.map((user, i) => {
                  return (
                    <div key={user.node.id}>
                      <UserContactCard user={user.node} />

                      {/* When scrolling down do infinity scroll */}
                      {data.getPaginatedUsers.pageInfo.hasNextPage && i === users.length - 3 && (
                        <Waypoint
                          onEnter={() => {
                            fetchMore({
                              variables: { after: endCursor },
                            });
                          }}
                        />
                      )}
                    </div>
                  );
                })}
            </div>
          )}

          {/* <div className="relative flex justify-center z-50 text-white text-xl">
            {networkStatus === 3 && <LoadingSpinner />}
          </div> */}
        </div>
      )}
      <div className="relative flex justify-center z-50">{loading && <LoadingSpinner />}</div>
    </div>
  );
}

export default UserSearchBar;
