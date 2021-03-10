import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { GET_USER_NOTIFICATIONS } from "../../utils/graphql";
import moment from "moment";
import { NavLink } from "react-router-dom";
import Cross from "../icons/Cross";

// types = comment , new follow, new collab,
const postBg = {
  background: "rgba(255, 255, 255, 0.07)",
  mixBlendMode: "normal",
};
function NotificationCard({
  notifId,
  myId,
  senderId,
  postId,
  username,
  message,
  type,
  isRead,
  createdAt,
  profilePic,
  history,
}) {
  const [acceptOrDeclineMutation, setAcceptOrDeclineMutation] = useState(
    DECLINE_COLLAB_REQUEST
  );
  const [
    execCollabMutation,
    { loading: decLoading, error: decError, data: decData },
  ] = useMutation(acceptOrDeclineMutation, {
    variables: { userId: senderId, userToCollabWithId: myId },
    update: (proxy, _) => {
      const data = proxy.readQuery({
        query: GET_USER_NOTIFICATIONS,
        variables: { userId: myId, searchQuery: null },
      });
      const filteredNotifs = data.queryNotifications.edges.filter(
        (notif) => notif.node.id !== notifId
      );
      if (filteredNotifs.length === 0) {
        proxy.writeQuery({
          query: GET_USER_NOTIFICATIONS,
          variables: { userId: myId, searchQuery: null },
          data: {
            queryNotifications: {
              edges: [...filteredNotifs],
              pageInfo: {
                hasNextPage: false,
                endCursor: "",
              },
            },
          },
        });
      } else {
        proxy.writeQuery({
          query: GET_USER_NOTIFICATIONS,
          variables: { userId: myId, searchQuery: null },
          data: {
            queryNotifications: {
              edges: [...filteredNotifs],
              pageInfo: {
                hasNextPage: data.queryNotifications.pageInfo.hasNextPage,
                endCursor: data.queryNotifications.pageInfo.endCursor,
              },
            },
          },
        });
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const [
    removeNotification,
    { loading: deleteNotifLoading, error: deleteNotifError, data: deleteNotifData },
  ] = useMutation(REMOVE_NOTIFICATION, {
    update: (proxy, _) => {
      const data = proxy.readQuery({
        query: GET_USER_NOTIFICATIONS,
        variables: { userId: myId, searchQuery: null },
      });
      const filteredNotifs = data.queryNotifications.edges.filter(
        (notif) => notif.node.id !== notifId
      );
      if (filteredNotifs.length === 0) {
        proxy.writeQuery({
          query: GET_USER_NOTIFICATIONS,
          variables: { userId: myId, searchQuery: null },
          data: {
            queryNotifications: {
              edges: [...filteredNotifs],
              pageInfo: {
                hasNextPage: false,
                endCursor: "",
              },
            },
          },
        });
      } else {
        proxy.writeQuery({
          query: GET_USER_NOTIFICATIONS,
          variables: { userId: myId, searchQuery: null },
          data: {
            queryNotifications: {
              edges: [...filteredNotifs],
              pageInfo: {
                hasNextPage: data.queryNotifications.pageInfo.hasNextPage,
                endCursor: data.queryNotifications.pageInfo.endCursor,
              },
            },
          },
        });
      }
    },
    variables: { notificationId: notifId },
    onError: (err) => {
      console.log(err);
    },
  });

  async function acceptOrDeclineCollab(mutation) {
    try {
      await setAcceptOrDeclineMutation(mutation);
      execCollabMutation();
      removeNotification();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div
      style={postBg}
      className="relative mt-3 w-full rounded-md p-3 hover:bg-black hover:bg-opacity-50 transition duration-300 ease-in-out"
    >
      <div className="flex items-center">
        <div className="flex">
          <NavLink to={`/${username}`}>
            <img
              src={profilePic}
              className="h-10 w-10 rounded-full object-cover object-center"
              alt="Profile picture"
            />
          </NavLink>

          <NavLink to={`/${username}`}>
            <p className="ml-5 text-gray-500 text-sm md:text-base">{message}</p>

            <span className="block ml-5 text-gray-700 text-xs">
              {moment(createdAt).fromNow()}
            </span>
          </NavLink>
        </div>

        {type && type === "NEW_LIKE" && (
          <NavLink
            to={`/${username}/posts/${postId}`}
            className="hover:text-blue-300 text-blue-500 px-2 py-1 text-sm mx-5"
          >
            Go to post
          </NavLink>
        )}

        {type && type === "NEW_COLLAB" && (
          <div className="hidden lg:block">
            {/* TODO: Add decline collab request in backend */}
            <button
              onClick={() => {
                acceptOrDeclineCollab(DECLINE_COLLAB_REQUEST);
              }}
              className="absolute right-0 top-0 h-8 mt-4 shadow-md text-sm mr-24 px-2 m-2 bg-opacity-50 hover:bg-opacity-100 hover:text-gray-200 text-gray-400 font-bold bg-red-600 rounded-md transition duration-200 ease-out"
            >
              Decline
            </button>
            <button
              onClick={() => {
                acceptOrDeclineCollab(ACCEPT_COLLAB_REQUEST);
              }}
              className="absolute font-bold shadow-md right-0 h-8 top-0 mt-4 text-sm px-2 m-2 bg-gradient-to-r from-teal-400 to-teal-700 hover:bg-gradient-to-r hover:from-teal-300 hover:to-teal-600 rounded-md transition duration-200 ease-out"
            >
              Accept
            </button>
          </div>
        )}
        {type && type !== "NEW_COLLAB" && (
          <button
            aria-label="delete notification"
            onClick={removeNotification}
            className="absolute right-0 top-0 mt-6 mb-4 rounded-full mr-2 cursor-pointer hover:bg-gray-400 transition duration-200 ease-out"
          >
            <Cross className="h-6 w-6 fill-current text-red-500" />
          </button>
        )}
      </div>
      {type && type === "NEW_COLLAB" && (
        <div className="flex items-baseline justify-center mt-2 lg:hidden">
          <button
            onClick={() => {
              acceptOrDeclineCollab(DECLINE_COLLAB_REQUEST);
            }}
            className="shadow-md text-sm mr-5 py-1 px-2 bg-opacity-50 text-gray-400 hover:bg-opacity-100 hover:text-gray-200 font-bold bg-red-600 rounded-md transition duration-300 ease-out"
          >
            Decline
          </button>
          <button
            onClick={() => {
              acceptOrDeclineCollab(ACCEPT_COLLAB_REQUEST);
            }}
            className="h-auto shadow-md text-sm py-1 px-2 font-bold rounded-md bg-gradient-to-r from-teal-400 to-teal-700 hover:bg-gradient-to-r hover:from-teal-300 hover:to-teal-600 transition duration-300 ease-out"
          >
            Accept
          </button>
        </div>
      )}
    </div>
  );
}

const DECLINE_COLLAB_REQUEST = gql`
  mutation($userId: ID!, $userToCollabWithId: ID!) {
    declineCollabRequest(userId: $userId, userToCollabWithId: $userToCollabWithId) {
      id
      collaborators {
        id
        username
      }
    }
  }
`;

const ACCEPT_COLLAB_REQUEST = gql`
  mutation acceptCollabRequest($userId: ID!, $userToCollabWithId: ID!) {
    acceptCollabRequest(userId: $userId, userToCollabWithId: $userToCollabWithId) {
      id
      collaborators {
        id
        username
      }
    }
  }
`;

const REMOVE_NOTIFICATION = gql`
  mutation removeNotification($notificationId: ID!) {
    removeNotification(notificationId: $notificationId) {
      id
    }
  }
`;

export default NotificationCard;
