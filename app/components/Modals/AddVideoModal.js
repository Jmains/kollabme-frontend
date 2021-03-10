import React, { useEffect, useState } from "react";
import { useForm } from "../../utils/hooks";
import { gql, useMutation } from "@apollo/client";
import { uploadToS3 } from "../../utils/UploadToS3";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { QUERY_VIDEOS, QUERY_PUBLIC_VIDEOS } from "../../utils/graphql";
import VideoPlayer from "../MediaPlayers/VideoPlayer";
import ProjectVideoUpload from "../Media/ProjectVideoUpload";

const playerWrapper = {
  position: "relative",
  paddingTop: "56.25%",
};

function AddVideoModal(props) {
  const [vidFile, setVidFile] = useState(null);
  const [vidSignedReq, setVidSignedReq] = useState(null);
  const [vidPreview, setVidPreview] = useState(null);
  const [vidS3Url, setVidS3Url] = useState(null);
  const [showVidFileError, setShowVidFileError] = useState(false);

  const [createVideoLoading, setCreateVideoLoading] = useState(false);

  const { onFieldChange, onSubmit, values } = useForm(addVideo, {
    title: "",
    description: "",
    isPublic: false,
  });

  function updatePublicVideosQueryCache(proxy, newVideo) {
    const data = proxy.readQuery({
      query: QUERY_PUBLIC_VIDEOS,
      variables: {
        searchQuery: props.searchQuery,
        username: props.username,
      },
    });

    proxy.writeQuery({
      query: QUERY_PUBLIC_VIDEOS,
      variables: {
        searchQuery: props.searchQuery,
        username: props.username,
      },
      data: {
        queryPublicVideos: {
          edges: [newVideo, ...data.queryPublicVideos.edges],
          pageInfo: {
            endCursor: data.queryPublicVideos.pageInfo.endCursor,
            hasNextPage: data.queryPublicVideos.pageInfo.hasNextPage,
          },
        },
      },
    });
  }

  function updateVideosQueryCache(proxy, newVideo) {
    const data = proxy.readQuery({
      query: QUERY_VIDEOS,
      variables: {
        searchQuery: props.searchQuery,
        username: props.username,
      },
    });

    proxy.writeQuery({
      query: QUERY_VIDEOS,
      variables: {
        searchQuery: props.searchQuery,
        username: props.username,
      },
      data: {
        queryVideos: {
          edges: [newVideo, ...data.queryVideos.edges],
          pageInfo: {
            endCursor: data.queryVideos.pageInfo.endCursor,
            hasNextPage: data.queryVideos.pageInfo.hasNextPage,
          },
        },
      },
    });
  }

  const [createVideo, { error, loading, data }] = useMutation(CREATE_VIDEO_MUTATION, {
    variables: {
      videoInput: {
        title: values.title,
        description: values.description,
        videoUrl: vidS3Url,
        isPublic: values.isPublic,
      },
    },
    update: (proxy, res) => {
      const newVideo = {
        __typename: "VideoEdge",
        node: res.data.createVideo,
        cursor: res.data.createVideo.cursor,
      };

      if (props.isPublic) {
        updatePublicVideosQueryCache(proxy, newVideo);
      } else {
        updateVideosQueryCache(proxy, newVideo);
      }

      values.title = "";
      values.description = "";
      values.isPublic = false;
    },
    onError: (err) => {
      console.log("Failed to create video: ", err);
    },
  });

  async function addVideo() {
    try {
      if (vidFile !== null) {
        setCreateVideoLoading(true);
        await uploadToS3(vidFile, vidSignedReq);
        createVideo();
        setCreateVideoLoading(false);
        document.body.style.overflow = "";
        props.setModalIsOpen(false);
      } else {
        setShowVidFileError(true);
        return;
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-cardBg mt-32 md:mt-20 rounded-lg p-2 mx-auto w-full md:w-screen max-w-lg md:max-w-2xl"
    >
      <div className="flex justify-between items-center border-b border-gray-700">
        <h1 className="text-teal-400 font-bold tracking-wide  py-2">Add Video</h1>
        <button
          aria-label="close popup"
          onClick={() => {
            document.body.style.overflow = "";
            props.setModalIsOpen(false);
          }}
        >
          <svg
            className="fill-current h-6 w-6 text-gray-500 rounded-full bg-red-600 bg-opacity-50 hover:text-gray-300 hover:bg-opacity-100 transition duration-300 ease-in-out shadow-sm cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>

      <div className="w-64 mt-3 mx-auto">
        <label
          className="text-gray-300 text-sm sm:text-base font-semibold tracking-wider"
          htmlFor="title"
        >
          Title
        </label>
        <input
          value={values.title}
          onChange={onFieldChange}
          placeholder="ex. Dope Tech"
          name="title"
          className="bg-gray-700 pl-2 mt-1 text-sm  border w-full border-gray-800 bg-opacity-25 rounded-lg h-8 text-gray-400 placeholder-gray-500 focus:outline-none focus:shadow-outline"
          type="text"
          maxLength="75"
          required
        />

        <div className="mt-3">
          <label
            className="text-gray-300 text-sm sm:text-base font-semibold tracking-wider"
            htmlFor="description"
          >
            Description
          </label>
          <input
            value={values.description}
            onChange={onFieldChange}
            placeholder="ex. Somewhere over the rainbow"
            name="description"
            className="bg-gray-700 pl-2 mt-1 text-sm border w-full border-gray-800 bg-opacity-25 rounded-lg h-8 text-gray-400 placeholder-gray-500 focus:outline-none focus:shadow-outline"
            type="text"
            maxLength="500"
          />
        </div>

        <div className="mt-3 ">
          <label
            className="text-gray-300 text-sm sm:text-base font-semibold tracking-wider"
            htmlFor="video"
          >
            Video
          </label>
          <div className="mt-2">
            <ProjectVideoUpload
              setVideoFile={setVidFile}
              setVideoPreview={setVidPreview}
              setVideoS3Url={setVidS3Url}
              setSignedReq={setVidSignedReq}
              videoPreview={vidPreview}
            />
          </div>
        </div>
        {showVidFileError && vidFile === null && (
          <p className="italic text-red-600 text-sm mt-1">Video file is required</p>
        )}
      </div>
      <h1 className="text-gray-300 font-bold">Preview</h1>
      <div className=" relative mt-3 border border-gray-600 bg-cardBg bg-opacity-25 p-1 my-1 shadow-md rounded-md hover:bg-black hover:bg-opacity-25 transition duration-300 ease-in-out">
        {vidPreview && (
          <div
            style={playerWrapper}
            aria-label="video player"
            className="block shadow-lg mx-auto rounded-md h-48 sm:h-64 w-full mt-2 focus:outline-none cursor-pointer"
          >
            <VideoPlayer videoSource={vidPreview} />
          </div>
        )}
        <div className="ml-1">
          <div className="block text-gray-400 w-24 sm:w-40 w text-xs sm:text-sm truncate font-extrabold tracking-wide hover:underline">
            {values.title}
          </div>
          <div className="block text-gray-600 font-medium text-xs sm:text-sm w-24 sm:w-40 truncate hover:underline">
            {values.description}
          </div>
        </div>
      </div>

      {createVideoLoading ? (
        <>
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
          <p className="text-gray-600 text-center italic">Creating video...</p>
        </>
      ) : (
        <div className="flex justify-end items-baseline mt-2">
          <button
            type="submit"
            className="text-gray-900 shadow-md font-bold rounded-md text-sm px-2 py-1 bg-gradient-to-r from-teal-400 to-teal-700 hover:bg-gradient-to-r hover:from-teal-600 hover:to-teal-800"
          >
            Add +
          </button>
        </div>
      )}
    </form>
  );
}

const CREATE_VIDEO_MUTATION = gql`
  mutation createVideo($videoInput: VideoInput!) {
    createVideo(videoInput: $videoInput) {
      id
      createdAt
      cursor
      title
      description
      username
      videoUrl
      author {
        id
      }
      isPublic
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default AddVideoModal;
