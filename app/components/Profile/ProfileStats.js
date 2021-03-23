import React, { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { gql, useLazyQuery } from "@apollo/client";
// Modals
import Modal from "react-modal";
import ProfileStatsDetailModal from "../Modals/ProfileStatsDetailModal";
import { ProfileStatsDetailTypes } from "../../constants/ProfileStatsDetailTypes";
import { nFormatter } from "../../utils/numFormatter";

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    marginTop: "3rem",
    transform: "translate(-50%, -50%)",
    background: "rgba(0,0,0,0)",
    border: "none",
  },
  overlay: {
    zIndex: 999,
    overflowY: "scroll",
    background: "rgba(0,0,0,0.6)",
  },
};

const statsBg = {
  background:
    "linear-gradient(360deg, rgba(0, 0, 0, 0.71) 0%, rgba(0, 0, 0, 0) 65.52%), rgba(51, 51, 51, 0.86)",
};

function handleModalClose() {}

function ProfileStats({ followerCount, followingCount, collaboratorCount }) {
  const { username } = useParams();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setModalIsOpen(false);
        }}
        style={modalStyles}
        shouldCloseOnOverlayClick={true}
      >
        <ProfileStatsDetailModal
          title={title}
          query={query}
          type={type}
          username={username}
          setModalIsOpen={setModalIsOpen}
        />
      </Modal>

      <div className="flex rounded-full relative" style={statsBg}>
        <button
          aria-label={`show followers, ${followerCount} followers`}
          onClick={() => {
            setTitle("Followers");
            setQuery(GET_USER_FOLLOWERS);
            setType(ProfileStatsDetailTypes.FOLLOWERS);
            setModalIsOpen(!modalIsOpen);
          }}
          className="py-1 px-2 md:text-xs sm:px-5 md:px-6 border-r-2 border-gray-600 text-center cursor-pointer hover:bg-black hover:bg-opacity-50 transition duration-300 ease-in-out rounded-l-full"
        >
          <div tabIndex="-1">
            <p className="text-tiny sm:text-xs font-bold tracking-wide text-teal-400">
              {nFormatter(followerCount)}
            </p>
            <p className="text-tiny sm:text-xs text-gray-400 font-medium">Followers</p>
          </div>
        </button>
        <button
          aria-label={`show following, ${followingCount} following`}
          onClick={() => {
            setTitle("Following");
            setQuery(GET_USER_FOLLOWING);
            setType(ProfileStatsDetailTypes.FOLLOWING);
            setModalIsOpen(!modalIsOpen);
          }}
          className="md:text-xs py-1 px-1 sm:px-4 text-center cursor-pointer hover:bg-black hover:bg-opacity-50 transition duration-300 ease-in-out"
        >
          <div tabIndex="-1">
            <span className="text-tiny sm:text-xs font-bold tracking-wide text-teal-400">
              {nFormatter(followingCount)}
            </span>
            <p className="text-tiny sm:text-xs text-gray-400 font-medium">Following</p>
          </div>
        </button>
        <button
          aria-label={`show collaborators, ${collaboratorCount} collaborators`}
          onClick={() => {
            setTitle("Collaborators");
            setQuery(GET_USER_COLLABORATORS);
            setType(ProfileStatsDetailTypes.COLLABORATORS);
            setModalIsOpen(!modalIsOpen);
          }}
          className="text-tiny sm:text-xs py-1 px-2 sm:px-3 md:px-6 border-l-2 border-gray-600 text-center cursor-pointer hover:bg-black hover:bg-opacity-50 transition duration-300 ease-in-out rounded-r-full"
        >
          <p className="text-tiny sm:text-xs font-bold tracking-wide text-teal-400">
            {nFormatter(collaboratorCount)}
          </p>
          <p className=" text-gray-400 font-medium">Collaborators</p>
        </button>
      </div>
    </>
  );
}

export default ProfileStats;

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
          displayName
          id
          mainPlatforms
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

const GET_USER_FOLLOWING = gql`
  query queryFollowing($username: String, $searchQuery: String, $first: Int, $after: String) {
    queryFollowing(
      username: $username
      searchQuery: $searchQuery
      first: $first
      after: $after
    ) {
      edges {
        node {
          username
          id
          displayName
          mainPlatforms
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

const GET_USER_FOLLOWERS = gql`
  query queryFollowers($username: String, $searchQuery: String, $first: Int, $after: String) {
    queryFollowers(
      username: $username
      searchQuery: $searchQuery
      first: $first
      after: $after
    ) {
      edges {
        node {
          username
          id
          displayName
          mainPlatforms
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
