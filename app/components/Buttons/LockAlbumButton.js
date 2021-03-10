import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import { Lock } from "../icons";

function LockAlbumButton({ user, album }) {
  const [makePublic] = useMutation(MAKE_ALBUM_PUBLIC, {
    variables: { albumId: album.id },
    onError: (err) => {
      console.log(err);
    },
  });

  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    if (user && album.isPublic === true) {
      setIsPublic(true);
    } else {
      setIsPublic(false);
    }
  }, [user, album.isPublic, album.tracks]);

  const lockButton = user ? (
    isPublic ? (
      <button onClick={makePublic} className="cursor-pointer">
        <Lock className="h-5 w-5 fill-current text-yellow-700 hover:scale-110 transform transition duration-300 ease-in-out" />
      </button>
    ) : (
      <button onClick={makePublic} className="cursor-pointer">
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

const MAKE_ALBUM_PUBLIC = gql`
  mutation makeAlbumPublic($albumId: ID!) {
    makeAlbumPublic(albumId: $albumId) {
      id
      isPublic
      tracks {
        id
        isPublic
      }
    }
  }
`;

export default LockAlbumButton;
