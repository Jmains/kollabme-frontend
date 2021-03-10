import React from "react";
import ReactPlayer from "react-player/lazy";

const style = {
  borderRadius: "15px",
};

function ReactAudioPlayer({ audioSource }) {
  function onError() {
    console.log("Something went wrong. Unable to load media");
  }

  return (
    <ReactPlayer
      className="focus:outline-none"
      style={style}
      controls={true}
      url={audioSource}
      onError={onError}
      height="2.5rem"
      width="100%"
      config={{
        file: {
          forceAudio: true,
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

export default ReactAudioPlayer;
