import React, { useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { NavLink } from "react-router-dom";
import { Message } from "../icons";

function NavChatButton({ user }) {
  let userInfo = null;
  const { error, loading, data } = useQuery(GET_USER, {
    variables: { username: user.username },
  });
  if (data) {
    userInfo = data.getUser;
  }
  return (
    <>
      {userInfo && userInfo.chats.length > 0 && (
        <h2 className="absolute top-0 right-0 bg-blue-500 text-white rounded-full px-1 font-extrabold text-tiny">
          {userInfo.chats.length}
        </h2>
      )}
      <Message className="h-5 w-5 sm:w-6 sm:h-6 fill-current text-teal-100" />
    </>
  );
}

const GET_USER = gql`
  query getUser($username: String) {
    getUser(username: $username) {
      id
      profilePic
      chats {
        id
      }
    }
  }
`;

export default NavChatButton;
