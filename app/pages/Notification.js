import React, { useEffect, useRef } from "react";
// Apollo Client
import { useQuery } from "@apollo/client";
// Context
import { useAuthState } from "../context/auth";
// Components
import NotificationCard from "../components/Notification/NotificationCard";
import Page from "../components/Shared/Page";
// GQL
import { GET_USER_NOTIFICATIONS } from "../utils/graphql";
import { Waypoint } from "react-waypoint";
import LoadingSpinner from "../components/Shared/LoadingSpinner";

function Notification() {
  let notifications = [];
  let endCursor = "";
  let hasNextPage = false;
  const { user } = useAuthState();
  const notifRef = useRef([]);
  const { loading, data, error, fetchMore, networkStatus } = useQuery(GET_USER_NOTIFICATIONS, {
    variables: { userId: user.id, searchQuery: null },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });
  if (data) {
    notifications = data.queryNotifications.edges;
    endCursor = data.queryNotifications.pageInfo.endCursor;
    hasNextPage = data.queryNotifications.pageInfo.hasNextPage;
    notifRef.current = new Array(notifications.length);
  }
  if (error) return <h1>{error}</h1>;

  useEffect(() => {
    if (notifRef.current) {
      if (notifications && notifications.length > 0) {
        notifRef.current[0].focus();
      }
    }
  }, []);

  return (
    <Page title="Notifications">
      <div className="mt-20 mx-auto max-w-xl sm:max-w-xl lg:max-w-2xl ">
        {notifications && notifications.length === 0 && (
          <div className="text-center">
            <svg
              className="h-64 w-64 inline-block"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                className="fill-stroke text-gray-700"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <h2 className="text-gray-600 text-center text-lg mt-5">
              You currently have no notifications...
            </h2>
          </div>
        )}
        {notifications &&
          notifications.map((notif, i) => {
            return (
              <div
                tabIndex="0"
                id="notifcardid"
                ref={(card) => {
                  notifRef.current[i] = card;
                }}
                key={notif.node.id}
              >
                <NotificationCard
                  notifId={notif.node.id}
                  myId={user.id}
                  senderId={notif.node.sender.id}
                  postId={notif.node.postId}
                  username={notif.node.sender.username}
                  message={notif.node.message}
                  type={notif.node.type}
                  isRead={notif.node.isRead}
                  createdAt={notif.node.createdAt}
                  profilePic={notif.node.sender.profilePic}
                />
                {hasNextPage && i === notifications.length - 1 && (
                  <Waypoint
                    onEnter={() => {
                      fetchMore({
                        variables: { userId: user.id, searchQuery: null, after: endCursor },
                      });
                    }}
                  />
                )}
              </div>
            );
          })}
        <div className="flex justify-center">{networkStatus === 3 && <LoadingSpinner />}</div>
      </div>
    </Page>
  );
}

export default Notification;
