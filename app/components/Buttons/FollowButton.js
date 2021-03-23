import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";

function FollowButton({ user, userToFollow }) {
  const [followed, setFollowed] = useState(false);
  useEffect(() => {
    if (user && userToFollow.followers.find((follow) => follow.username === user.username)) {
      setFollowed(true);
    } else {
      setFollowed(false);
    }
  }, [user]);

  if (user && userToFollow) {
    const [followUser] = useMutation(FOLLOW_USER, {
      variables: { userId: user.id, userToFollowId: userToFollow.id },
    });
    const followButton = followed ? (
      <button
        onClick={() => {
          followUser();
          setFollowed(false);
        }}
        aria-label="unfollow"
        className="py-1 px-3 text-xs md:text-sm text-black font-semibold bg-white bg-opacity-25 hover:bg-gradient-to-r hover:bg-black hover:text-white rounded-full tracking-wide shadow-md border-b border-gray-700 transition ease-in-out duration-500"
      >
        Unfollow
      </button>
    ) : (
      <button
        onClick={() => {
          followUser();
          setFollowed(true);
        }}
        aria-label="follow"
        className="py-1 px-3 text-xs md:text-sm font-semibold bg-black text-white hover:text-black hover:bg-white  rounded-full tracking-wide shadow-md border-b border-gray-700  transition ease-in-out duration-500"
      >
        Follow
      </button>
    );
    return followButton;
  }

  return (
    <Link to="/login">
      <button
        aria-label="follow"
        className="py-1 px-3 text-xs md:text-sm  bg-black text-white hover:text-black hover:bg-white  rounded-full tracking-wide shadow-md border-b border-gray-700 transition ease-in-out duration-500"
      >
        Follow
      </button>
    </Link>
  );
}

// Return post id so Apollo knows to update the post with id with new field automagically
const FOLLOW_USER = gql`
  mutation followUser($userId: ID!, $userToFollowId: ID!) {
    followUser(userId: $userId, userToFollowId: $userToFollowId) {
      id
      followingCount
      followerCount
      followers {
        id
        username
      }
      following {
        id
        username
      }
    }
  }
`;

export default FollowButton;
