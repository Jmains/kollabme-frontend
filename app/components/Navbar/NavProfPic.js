import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";

function NavProfPic({ user }) {
  let userInfo = null;

  const { error, loading, data } = useQuery(GET_USER, {
    variables: { username: user.username },
  });
  if (data) {
    userInfo = data.getUser;
  }
  return (
    <div className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-600 transition duration-200 ease-in-out">
      {userInfo && (
        <img
          className="h-8 w-8 rounded-full object-cover object-center focus:outline-none"
          src={userInfo.profilePic}
          alt="Profile Picture"
        />
      )}
    </div>
  );
}

const GET_USER = gql`
  query getUser($username: String) {
    getUser(username: $username) {
      id
      profilePic
    }
  }
`;

export default NavProfPic;
