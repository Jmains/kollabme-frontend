import React, { useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useAuthState } from "../../context/auth";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { Waypoint } from "react-waypoint";

function NewConvoModal({ setModalIsOpen }) {
  const { user } = useAuthState();
  let collabs = [];
  let endCursor = "";
  let hasNextPage = false;
  const {
    error: collabsError,
    loading: collabsLoading,
    data: collabsData,
    fetchMore,
  } = useQuery(GET_USER_COLLABORATORS, {
    variables: { username: user.username, searchQuery: null },
    onError: (err) => {
      console.log("failed to get collabs: ", err);
    },
  });

  const [createNewChat, { error, loading, data }] = useMutation(CREATE_NEW_CHAT, {
    update: (proxy, res) => {
      const newChat = res.data.createNewChat;
      const data = proxy.readQuery({
        query: GET_USER_CHATS,
        variables: { userId: user.id },
      });
      proxy.writeQuery({
        query: GET_USER_CHATS,
        variables: { userId: user.id },
        data: {
          getUserChats: [...data.getUserChats, newChat],
        },
      });
    },
    onError: (err) => {
      console.log("Failed to update chat: ", err);
    },
  });

  if (collabsData) {
    collabs = collabsData.queryCollaborators.edges;
    endCursor = collabsData.queryCollaborators.pageInfo.endCursor;
    hasNextPage = collabsData.queryCollaborators.pageInfo.hasNextPage;
  }

  return (
    <>
      {collabsLoading ? (
        <div className="flex justify-center mx-auto">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="bg-cardBg rounded-lg w-full p-2">
          <h1 className="text-teal-400 text-xl font-bold tracking-wide m-2">Collaborators</h1>
          <div className=" w-full overflow-y-auto h-64 rounded-lg">
            {collabs === [] && (
              <h1 className="text-gray-500 w-full">You have no collaborators</h1>
            )}
            {collabsData &&
              collabs &&
              collabs.map((collab, i) => {
                return (
                  <div
                    key={collab.node.id}
                    onClick={() => {
                      createNewChat({
                        variables: { userId: user.id, userToChatWithId: collab.node.id },
                      });
                      setModalIsOpen(false);
                    }}
                    className="w-full flex items-center bg-gray-800 bg-opacity-25 p-1 shadow-md border-t border-gray-700 cursor-pointer hover:bg-black hover:bg-opacity-50 transition duration-300 ease-in-out"
                  >
                    <img
                      className="m-2 rounded-full h-12 w-12 object-cover object-center cursor-pointer"
                      src={collab.node.profilePic}
                      alt="Profile picture"
                    />
                    <div className="ml-1">
                      <h2 className="text-gray-400 font-semibold w-64 text-sm truncate">
                        {capitalizeFirstLetter(collab.node.username)}
                      </h2>
                      <div className="flex pr-2">
                        {collab.node.mainPlatform &&
                          collab.node.mainPlatform.map((mp, i) => {
                            if (i === 2) {
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
                          })}
                      </div>
                    </div>
                    {hasNextPage && i === collabs.length - 3 && (
                      <Waypoint
                        onEnter={() => {
                          fetchMore({
                            variables: { after: endCursor, searchQuery: null },
                          });
                        }}
                      />
                    )}
                  </div>
                );
              })}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setModalIsOpen(false)}
              className="text-gray-300 px-2 py-1 rounded-md bg-red-600 text-sm font-bold m-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const CREATE_NEW_CHAT = gql`
  mutation createNewChat($userId: ID!, $userToChatWithId: ID!) {
    createNewChat(userId: $userId, userToChatWithId: $userToChatWithId) {
      id
      owner {
        username
      }
      sendTo {
        username
      }
      messages {
        id
        body
      }
      createdAt
      id
    }
  }
`;

const GET_USER_COLLABORATORS = gql`
  query queryCollaborators(
    $username: String
    $searchQuery: String
    $first: Int
    $after: String
  ) {
    queryCollaborators(
      username: $username
      searchQuery: $searchQuery
      first: $first
      after: $after
    ) {
      edges {
        node {
          username
          id
          mainPlatform
          profilePic
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const GET_USER_CHATS = gql`
  query getUserChats($userId: ID!) {
    getUserChats(userId: $userId) {
      createdAt
      owner {
        id
        username
        profilePic
      }
      id
      sendTo {
        id
        username
        profilePic
      }
      messages {
        id
        createdAt
        body
      }
    }
  }
`;

export default NewConvoModal;
