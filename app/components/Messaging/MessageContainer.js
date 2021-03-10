import React, { useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";
import { NavLink } from "react-router-dom";
import { useQuery, useMutation, useApolloClient, gql } from "@apollo/client";
import { useAuthState } from "../../context/auth";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import ScrollToBottom from "react-scroll-to-bottom";
import Page from "../Shared/Page";
import { Waypoint } from "react-waypoint";
import { useForm } from "../../utils/hooks";

function MessageContainer(props) {
  const client = useApolloClient();
  let messages = [];
  let subscription = null;
  let hasNextPage = false;
  let endCursor = "";
  let username = "";
  const { user } = useAuthState();

  const userToChatWithId = props.match.params.userId;
  const chatId = props.match.params.chatId;

  const { onFieldChange, onSubmit, values } = useForm(sendMessage, {
    message: "",
  });

  // TODO: Should be get paginated chat messages on scroll to top
  const { loading, error, data, fetchMore } = useQuery(GET_CHAT_MESSAGES, {
    variables: { chatId: chatId, searchQuery: null, first: 50 },
    fetchPolicy: "network-only",
    onError: (err) => {
      console.log("Failed to get messages: ", err);
    },
  });
  const [createMessage, { loading: msgLoadig, error: msgError, data: msgData }] = useMutation(
    CREATE_MESSAGE,
    {
      variables: {
        chatId: chatId,
        userId: user.id,
        userToChatWithId: userToChatWithId,
        body: values.message,
      },
      update: (proxy, res) => {
        values.message = "";
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );
  if (data) {
    messages = data.queryMessages.edges;
    endCursor = data.queryMessages.pageInfo.endCursor;
    hasNextPage = data.queryMessages.pageInfo.hasNextPage;
    username =
      messages[0].node.sentBy.username === user.username
        ? messages[0].node.recipient.username
        : messages[0].node.sentBy.username;
  }
  useEffect(() => {
    const observer = client.subscribe({
      query: NEW_CHAT_MESSAGE_SUBSCRIPTION,
      variables: { chatId: chatId },
    });
    if (subscription === null) {
      subscription = observer.subscribe(({ data }) => {
        const newChatMessage = {
          __typename: "MessageEdge",
          node: data.newChatMessage,
        };
        const res = client.readQuery({
          query: GET_CHAT_MESSAGES,
          variables: { chatId: chatId, searchQuery: null },
        });

        client.writeQuery({
          query: GET_CHAT_MESSAGES,
          variables: { chatId: chatId, searchQuery: null },
          data: {
            queryMessages: {
              edges: [...res.queryMessages.edges, newChatMessage],
              pageInfo: {
                hasNextPage: res.queryMessages.pageInfo.hasNextPage,
                endCursor: res.queryMessages.pageInfo.endCursor,
              },
            },
          },
        });
      });
    }
    return () => {
      subscription.unsubscribe();
    };
  }, [chatId]);

  function sendMessage() {
    createMessage();
  }

  return (
    <Page title="Messages">
      <div className="relative mt-20 max-w-2xl mx-auto rounded-md">
        {/* Header Container */}
        <div className="relative w-full flex py-2 px-3 bg-cardBg bg-opacity-25 rounded-lg items-center">
          <NavLink
            className="bg-black bg-opacity-50 rounded-lg shadow-md px-1 py-1"
            to="/messages"
          >
            <svg
              className="w-8 h-8 fill-current text-teal-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </NavLink>
          {username && (
            <h1 className="ml-2 text-gray-300 font-bold text-2xl">
              {capitalizeFirstLetter(username)}
            </h1>
          )}
        </div>
        {/* End Header Container */}
      </div>

      <div className="relative max-w-2xl mx-auto rounded-md">
        {/* Message Container */}
        <div
          style={{ height: "77%" }}
          className="w-full overflow-y-auto border border-gray-800 rounded-md"
        >
          <ScrollToBottom className="absolute right-0 left-0 ">
            {user &&
              data &&
              messages &&
              messages.map((msg, i) => {
                return (
                  <div key={msg.node.id}>
                    {hasNextPage && (
                      <Waypoint
                        onEnter={() => {
                          fetchMore({
                            variables: { after: endCursor, searchQuery: null },
                          });
                        }}
                      />
                    )}
                    <MessageBubble
                      body={msg.node.body}
                      createdAt={msg.node.createdAt}
                      username={msg.node.sentBy.username}
                      profilePic={msg.node.sentBy.profilePic}
                    />
                  </div>
                );
              })}
          </ScrollToBottom>
        </div>
        {/* End Message Container */}

        {/* input container */}
        <form onSubmit={onSubmit} className="absolute inset-x-0 flex items-center">
          <textarea
            name="message"
            onChange={onFieldChange}
            value={values.message}
            rows="1"
            className="px-5 py-2 h-10 w-full border border-gray-600 rounded-full placeholder-gray-100 text-sm text-gray-300 break-all bg-black bg-opacity-25 resize-none focus:outline-none"
            type="text"
            placeholder="Enter message here..."
          ></textarea>

          <button type="submit" className="px-2 py-1 cursor-pointer">
            <svg
              className="h-6 w-6 fill-current text-teal-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
        {/* End Input container */}
      </div>
    </Page>
  );
}

const NEW_CHAT_MESSAGE_SUBSCRIPTION = gql`
  subscription newChatMessage($chatId: ID!) {
    newChatMessage(chatId: $chatId) {
      id
      createdAt
      sentBy {
        id
        username
        profilePic
      }
      recipient {
        id
        username
        profilePic
      }
      body
    }
  }
`;

const GET_CHAT_MESSAGES = gql`
  query queryMessages($chatId: ID, $searchQuery: String, $first: Int, $after: String) {
    queryMessages(chatId: $chatId, searchQuery: $searchQuery, first: $first, after: $after) {
      edges {
        node {
          id
          createdAt
          sentBy {
            id
            username
            profilePic
          }
          recipient {
            id
            username
            profilePic
          }
          body
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const CREATE_MESSAGE = gql`
  mutation createMessage($chatId: ID!, $userId: ID!, $userToChatWithId: ID!, $body: String!) {
    createMessage(
      chatId: $chatId
      userId: $userId
      userToChatWithId: $userToChatWithId
      body: $body
    ) {
      id
    }
  }
`;

export default MessageContainer;
