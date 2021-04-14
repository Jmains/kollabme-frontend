import React from "react";
import App from "./App";
import Axios from "axios";
// Apollo
import {
  ApolloProvider,
  ApolloLink,
  HttpLink,
  ApolloClient,
  InMemoryCache,
  split,
  Observable,
} from "@apollo/client";

import { createUploadLink } from "apollo-upload-client";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition, relayStylePagination } from "@apollo/client/utilities";

//jwt
import jwtDecode from "jwt-decode";
import UniAudioPlayer from "./components/MediaPlayers/UniAudioPlayer";

/************************************
 * //TODO: Use environment variables!
 *  *********************************/

// const uri = "http://localhost:8080/graphql";
// const expressUri = "http://localhost:8080/api";
const uri = "https://kollabme.app/graphql";
const expressUri = "https://kollabme.app/api";

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

// const websocketLink = new WebSocketLink({
//   uri: `wss://intreecate-beta.herokuapp.com/graphql`,
// uri: "ws://localhost:8080/graphql",
// options: {
//   reconnect: true,
// connectionParams: {
//   authToken: getAccessToken() ? `Bearer ${getAccessToken()}` : "",
// },
//   },
// });

// From Apollo Migration Guide
const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle;
      Promise.resolve(operation)
        .then((operation) => {
          const accessToken = getAccessToken();
          if (accessToken) {
            operation.setContext({
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
          }
        })
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

// split takes two required parameters and one optional one.
// The first argument to split is a function which receives
// the operation and returns true for the first link and false
// for the second link. The second argument is the first
// link to be split between. The third argument is an
// optional second link to send the operation to if it doesn't match.
// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === "OperationDefinition" && definition.operation === "subscription"
//     );
//   },
//   websocketLink,
//   requestLink
// );

const client = new ApolloClient({
  uri,
  credentials: "include",
  link: ApolloLink.from([
    new TokenRefreshLink({
      accessTokenField: "accessToken", // What you named accessToken field in response
      isTokenValidOrUndefined: () => {
        const token = getAccessToken();
        if (!token) {
          return true;
        }
        try {
          const { exp } = jwtDecode(token);
          Date.now() >= exp * 1000 ? false : true;
        } catch (error) {
          return false;
        }
      },
      fetchAccessToken: () => {
        return fetch(`${expressUri}/refreshToken`, {
          method: "POST",
          credentials: "include",
          mode: "cors",
        });
      },
      handleFetch: (accessToken) => {
        localStorage.removeItem("accessToken");
        localStorage.setItem("accessToken", accessToken);
      },
      handleError: (err) => {
        // full control over handling token fetch Error
        console.warn("Your refresh token is invalid. Try to relogin");
        console.error(err);
      },
    }),
    requestLink,
    new HttpLink({ uri, credentials: "include" }),
  ]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getPaginatedUsers: relayStylePagination(["searchQuery"]),
          queryPosts: relayStylePagination(["searchQuery"]),
          queryTracks: relayStylePagination(["searchQuery"]),
          queryPaintings: relayStylePagination(["searchQuery"]),
          queryAlbums: relayStylePagination(["searchQuery"]),
          queryVideos: relayStylePagination(["searchQuery"]),
          queryPublicVideos: relayStylePagination(["searchQuery"]),
          queryPublicTracks: relayStylePagination(["searchQuery"]),
          queryPublicPaintings: relayStylePagination(["searchQuery"]),
          queryPublicAlbums: relayStylePagination(["searchQuery"]),
          queryFollowing: relayStylePagination(["searchQuery"]),
          queryFollowers: relayStylePagination(["searchQuery"]),
          queryCollaborators: relayStylePagination(["searchQuery"]),
          queryNotifications: relayStylePagination(["searchQuery"]),
          queryMessages: relayStylePagination(["searchQuery"]),
          queryComments: relayStylePagination(["searchQuery"]),
          queryCommentReplies: relayStylePagination(["searchQuery", "commentId"]),
        },
      },
    },
  }),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
