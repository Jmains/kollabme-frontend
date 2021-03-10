import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { useAuthState } from "../context/auth";
import ReactAudioPlayer from "../components/MediaPlayers/ReactAudioPlayer";
import LikeTrackButton from "../components/Buttons/LikeTrackButton";

function SingleTrack() {
  let track = null;
  const { user } = useAuthState();
  const { username, trackId } = useParams();
  const { error, loading, data } = useQuery(GET_TRACK, {
    variables: { trackId },
  });

  if (data) {
    track = data.getTrack;
  }

  return (
    <div className="bg-cardBg mx-auto max-w-lg md:max-w-2xl rounded-lg mt-48 sm:mt-32 text-center">
      {track && (
        <div className="">
          <div className="py-5 px-10 md:px-40">
            <img
              className="inline-block h-72 w-72 object-center object-cover rounded-lg"
              src={track.imageUrl}
              alt="track image"
            />

            <h1 className="text-gray-300 mt-2 font-bold truncate">{track.title}</h1>
            <h2 className="text-gray-500 font-normal truncate">{track.artistName}</h2>

            <div className="justify-center flex mt-2">
              <LikeTrackButton user={user} track={track} />
            </div>
            <div className="mt-3">
              <ReactAudioPlayer audioSource={track.audioUrl} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const GET_TRACK = gql`
  query($trackId: ID!) {
    getTrack(trackId: $trackId) {
      imageUrl
      id
      artistName
      audioUrl
      title
      likes {
        id
        username
      }
      likeCount
      isPublic
    }
  }
`;

export default SingleTrack;
