import React from "react";
import ReactPlayer from "react-player/lazy";

const reactPlayer = {
  position: "absolute",
  top: "0",
  left: "0",
};

function VideoPlayer({ videoSource }) {
  function onError() {
    console.log("Something went wrong. Unable to load video");
  }
  // Embed number of views in video

  return (
    <ReactPlayer
      className="focus:outline-none focus:shadow-outline"
      controls={true}
      style={reactPlayer}
      url={videoSource}
      height="100%"
      width="100%"
      onError={onError}
      config={{
        file: {
          attributes: {
            onContextMenu: (e) => e.preventDefault(),
            controlsList: "nodownload noremoteplayback",
            disablePictureInPicture: true,
          },
        },
      }}
    />
  );
}

export default VideoPlayer;
