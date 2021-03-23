import React from "react";
import { gql, useQuery } from "@apollo/client";
import { NavLink } from "react-router-dom";
import { Bell } from "../icons";

function NavNotifButton({ user }) {
  let notifications = [];
  const { loading: notifLoading, error: notifError, data: notifData } = useQuery(
    GET_NOTIFICATIONS,
    {
      variables: { userId: user.id },
      // TODO: Use subscriptions instead of polling you noob
      pollInterval: 400000,
    }
  );

  if (notifData) {
    notifications = notifData.getUserNotifications;
  }

  return (
    <NavLink
      aria-label={`Notifications, ${notifications && notifications.length} new`}
      to="/notifications"
    >
      {notifications && notifications.length > 0 && (
        <span className=" absolute top-0 right-0 bg-red-600 text-gray-300 rounded-full px-1 font-extrabold text-tiny">
          {notifications.length}
        </span>
      )}
      <Bell className="h-5 w-5 sm:w-6 sm:h-6 fill-current text-gray-500 hover:text-white" />
    </NavLink>
  );
}

const GET_NOTIFICATIONS = gql`
  query getUserNotifications($userId: ID) {
    getUserNotifications(userId: $userId) {
      id
      createdAt
      message
      sender {
        id
        username
      }
      recipient {
        id
        username
      }
      postId
      isRead
      type
    }
  }
`;

export default NavNotifButton;
