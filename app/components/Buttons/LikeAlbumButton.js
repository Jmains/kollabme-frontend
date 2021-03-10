import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { nFormatter } from "../../utils/numFormatter";

function LikeAlbumButton({ user, album: { id, likeCount, likes } }) {
  const [likeAlbum] = useMutation(LIKE_ALBUM, {
    variables: { albumId: id },
  });
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  const likeButton = user ? (
    liked ? (
      <button
        aria-label="unlike track"
        className="flex items-center text-orange-600 cursor-pointer"
        onClick={likeAlbum}
      >
        <svg
          className="fill-current rounded-full h-5 w-5 hover:scale-110 transform transition duration-300 ease-in-out"
          xmlns="http://www.w3.org/2000/svg"
          enableBackground="new 0 0 24 24"
          viewBox="0 0 24 24"
        >
          <g>
            <rect fill="none" height="24" width="24" y="0" />
          </g>
          <g>
            <path d="M19.48,12.35c-1.57-4.08-7.16-4.3-5.81-10.23c0.1-0.44-0.37-0.78-0.75-0.55C9.29,3.71,6.68,8,8.87,13.62 c0.18,0.46-0.36,0.89-0.75,0.59c-1.81-1.37-2-3.34-1.84-4.75c0.06-0.52-0.62-0.77-0.91-0.34C4.69,10.16,4,11.84,4,14.37 c0.38,5.6,5.11,7.32,6.81,7.54c2.43,0.31,5.06-0.14,6.95-1.87C19.84,18.11,20.6,15.03,19.48,12.35z M10.2,17.38 c1.44-0.35,2.18-1.39,2.38-2.31c0.33-1.43-0.96-2.83-0.09-5.09c0.33,1.87,3.27,3.04,3.27,5.08C15.84,17.59,13.1,19.76,10.2,17.38z" />
          </g>
        </svg>
        <span className="inline-block text-sm font-semibold ml-1">
          {nFormatter(likeCount)}
        </span>
      </button>
    ) : (
      <button
        aria-label="like track"
        onClick={likeAlbum}
        className="text-gray-600 items-center hover:text-orange-600 transition duration-300 ease-in-out flex cursor-pointer"
      >
        <svg
          className="fill-current rounded-full h-5 w-5 hover:scale-110 transform transition duration-300 ease-in-out"
          xmlns="http://www.w3.org/2000/svg"
          enableBackground="new 0 0 24 24"
          viewBox="0 0 24 24"
        >
          <g>
            <rect fill="none" height="24" width="24" y="0" />
          </g>
          <g>
            <path d="M19.48,12.35c-1.57-4.08-7.16-4.3-5.81-10.23c0.1-0.44-0.37-0.78-0.75-0.55C9.29,3.71,6.68,8,8.87,13.62 c0.18,0.46-0.36,0.89-0.75,0.59c-1.81-1.37-2-3.34-1.84-4.75c0.06-0.52-0.62-0.77-0.91-0.34C4.69,10.16,4,11.84,4,14.37 c0.38,5.6,5.11,7.32,6.81,7.54c2.43,0.31,5.06-0.14,6.95-1.87C19.84,18.11,20.6,15.03,19.48,12.35z M10.2,17.38 c1.44-0.35,2.18-1.39,2.38-2.31c0.33-1.43-0.96-2.83-0.09-5.09c0.33,1.87,3.27,3.04,3.27,5.08C15.84,17.59,13.1,19.76,10.2,17.38z" />
          </g>
        </svg>
        <span className="inline-block text-xs sm:text-sm font-semibold ml-1">
          {nFormatter(likeCount)}
        </span>
      </button>
    )
  ) : (
    <Link
      to="/login"
      aria-label="like track button. login to like track"
      className="text-gray-600 items-center hover:text-orange-600 transition duration-300 ease-in-out cursor-pointer flex"
    >
      <svg
        className="fill-current rounded-full h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        enableBackground="new 0 0 24 24"
        viewBox="0 0 24 24"
      >
        <g>
          <rect fill="none" height="24" width="24" y="0" />
        </g>
        <g>
          <path d="M19.48,12.35c-1.57-4.08-7.16-4.3-5.81-10.23c0.1-0.44-0.37-0.78-0.75-0.55C9.29,3.71,6.68,8,8.87,13.62 c0.18,0.46-0.36,0.89-0.75,0.59c-1.81-1.37-2-3.34-1.84-4.75c0.06-0.52-0.62-0.77-0.91-0.34C4.69,10.16,4,11.84,4,14.37 c0.38,5.6,5.11,7.32,6.81,7.54c2.43,0.31,5.06-0.14,6.95-1.87C19.84,18.11,20.6,15.03,19.48,12.35z M10.2,17.38 c1.44-0.35,2.18-1.39,2.38-2.31c0.33-1.43-0.96-2.83-0.09-5.09c0.33,1.87,3.27,3.04,3.27,5.08C15.84,17.59,13.1,19.76,10.2,17.38z" />
        </g>
      </svg>
      <span className="inline-block text-base font-semibold ml-1">
        {nFormatter(likeCount)}
      </span>
    </Link>
  );
  return likeButton;
}

const LIKE_ALBUM = gql`
  mutation likeAlbum($albumId: ID!) {
    likeAlbum(albumId: $albumId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeAlbumButton;
