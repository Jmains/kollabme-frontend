import React, { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import { Link } from "react-router-dom";

function CollaborateButton({ user, userToCollab }) {
  const [collabed, setCollabed] = useState(false);
  const [collabPending, setCollabPending] = useState(false);
  useEffect(() => {
    if (
      user &&
      userToCollab &&
      userToCollab.collaborators.find((collab) => collab.username === user.username)
    ) {
      setCollabed(true);
    } else if (
      user &&
      userToCollab &&
      userToCollab.pendingCollabs.find((pendingCol) => pendingCol.username === user.username)
    ) {
      setCollabPending(true);
    } else {
      setCollabed(false);
    }
  }, [user]);

  if (user && userToCollab) {
    const [collabWithUser] = useMutation(COLLAB_WITH_USER, {
      variables: { userId: user.id, userToCollabWithId: userToCollab.id },
    });

    let collabButton = null;
    if (collabed) {
      collabButton = (
        <button
          aria-label="uncollaborate"
          onClick={collabWithUser}
          className="ml-3 py-1 px-3 text-xs md:text-sm text-gray-900 font-semibold bg-white hover:bg-opacity-60 rounded-full tracking-wide shadow-md border-b border-gray-700 transition ease-out duration-500"
        >
          Uncollab
        </button>
      );
    } else if (collabPending) {
      collabButton = (
        <button
          aria-label="collaboration request pending"
          className="ml-3 py-1 px-3 text-xs md:text-sm text-gray-900 bg-white hover:bg-opacity-60 font-semibold rounded-full tracking-wide shadow-md border-b border-gray-700"
        >
          Pending
        </button>
      );
    } else {
      collabButton = (
        <button
          onClick={() => {
            collabWithUser();
            setCollabPending(true);
          }}
          aria-label="collaborate"
          className="ml-3 py-1 px-3 text-xs md:text-sm font-semibold bg-black text-white hover:text-gray-900 hover:bg-white rounded-full tracking-wide shadow-md border-b border-gray-700 transition ease-out duration-500"
        >
          Collaborate
        </button>
      );
    }

    return collabButton;
  }
  // TODO: If logged in and followed show followed button else show unfollow button. If not logged in show button but onClick redirect to home
  return (
    <Link to="/login">
      <button className="py-1 px-3 ml-3 bg-black text-gray-50 rounded-full hover:text-black hover:bg-white tracking-wide shadow-md border-b border-gray-700  transition ease-out duration-500">
        Collaborate
      </button>
    </Link>
  );
}

const COLLAB_WITH_USER = gql`
  mutation($userId: ID!, $userToCollabWithId: ID!) {
    collabWithUser(userId: $userId, userToCollabWithId: $userToCollabWithId) {
      id
      collaboratorCount
      collaborators {
        id
        username
      }
    }
  }
`;

export default CollaborateButton;
