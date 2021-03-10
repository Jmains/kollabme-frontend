import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import { Lock } from "../icons";

function LockPaintingButton({ user, painting }) {
  const [makePublic] = useMutation(MAKE_PAINTING_PUBLIC, {
    variables: { paintingId: painting.id },
    onError: (err) => {
      console.log(err);
    },
  });

  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    if (user && painting.isPublic === true) {
      setIsPublic(true);
    } else {
      setIsPublic(false);
    }
  }, [user, painting.isPublic]);

  const lockButton = user ? (
    isPublic ? (
      <button aria-label="hide from public" onClick={makePublic} className="cursor-pointer">
        <Lock className="h-5 w-5 fill-current text-yellow-700 hover:scale-110 transform transition duration-300 ease-in-out" />
      </button>
    ) : (
      <button aria-label="make public" onClick={makePublic} className="cursor-pointer">
        <Lock className="h-5 w-5 fill-current text-gray-600 hover:text-yellow-700 hover:scale-110 transform transition duration-300 ease-in-out" />
      </button>
    )
  ) : (
    <Link to="/login" className="cursor-pointer">
      <Lock className="h-5 w-5 fill-current text-gray-600 hover:text-yellow-700 hover:scale-110 transform transition duration-300 ease-in-out" />
    </Link>
  );

  return lockButton;
}

const MAKE_PAINTING_PUBLIC = gql`
  mutation makePaintingPublic($paintingId: ID!) {
    makePaintingPublic(paintingId: $paintingId) {
      id
      isPublic
    }
  }
`;

export default LockPaintingButton;
