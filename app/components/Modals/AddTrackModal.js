import React, { useEffect, useRef, useState } from "react";
import { useForm } from "../../utils/hooks";
import { gql, useMutation } from "@apollo/client";
import ReactAudioPlayer from "../MediaPlayers/ReactAudioPlayer";
import ProjectImageUpload from "../Media/ProjectImageUpload";
import ProjectAudioUpload from "../Media/ProjectAudioUpload";
import { uploadToS3 } from "../../utils/UploadToS3";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { QUERY_TRACKS, QUERY_PUBLIC_TRACKS } from "../../utils/graphql";

function AddTrackModal(props) {
  const [imgFile, setImgFile] = useState(null);
  const [imgSignedReq, setImgSignedReq] = useState(null);
  const [imgPreview, setImgPreview] = useState(
    "https://images.unsplash.com/photo-1518401543587-7bf7a1f74e66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
  );
  // "https://images.unsplash.com/photo-1518401543587-7bf7a1f74e66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
  const [imgS3Url, setImgS3Url] = useState(null);
  const creatingTrackRef = useRef(null);

  const [audioFile, setAudioFile] = useState(null);
  const [audioSignedReq, setAudioSignedReq] = useState(null);
  const [audioPreview, setAudioPreview] = useState("");
  const [audioS3Url, setAudioS3Url] = useState(null);

  const [showTrackError, setShowTrackError] = useState(false);

  const [createTrackLoading, setCreateTrackLoading] = useState(false);

  const { onFieldChange, onSubmit, values } = useForm(addTrack, {
    title: "",
    artistName: "",
    isPublic: false,
  });

  function updatePublicTracksQueryCache(proxy, newTrack) {
    const data = proxy.readQuery({
      query: QUERY_PUBLIC_TRACKS,
      variables: {
        searchQuery: props.searchQuery,
        username: props.username,
      },
    });

    proxy.writeQuery({
      query: QUERY_PUBLIC_TRACKS,
      variables: {
        searchQuery: props.searchQuery,
        username: props.username,
      },
      data: {
        queryPublicTracks: {
          edges: [newTrack, ...data.queryPublicTracks.edges],
          pageInfo: {
            endCursor: data.queryPublicTracks.pageInfo.endCursor,
            hasNextPage: data.queryPublicTracks.pageInfo.hasNextPage,
          },
        },
      },
    });
  }

  function updateTracksQueryCache(proxy, newTrack) {
    const data = proxy.readQuery({
      query: QUERY_TRACKS,
      variables: {
        searchQuery: props.searchQuery,
        username: props.username,
      },
    });

    proxy.writeQuery({
      query: QUERY_TRACKS,
      variables: {
        searchQuery: props.searchQuery,
        username: props.username,
      },
      data: {
        queryTracks: {
          edges: [newTrack, ...data.queryTracks.edges],
          pageInfo: {
            endCursor: data.queryTracks.pageInfo.endCursor,
            hasNextPage: data.queryTracks.pageInfo.hasNextPage,
          },
        },
      },
    });
  }

  const [createTrack, { error, loading, data }] = useMutation(CREATE_TRACK_MUTATION, {
    variables: {
      trackInput: {
        title: values.title,
        artistName: values.artistName,
        imageUrl: imgS3Url,
        audioUrl: audioS3Url,
        isPublic: values.isPublic,
      },
    },
    update: (proxy, res) => {
      const newTrack = {
        __typename: "TrackEdge",
        node: res.data.createTrack,
        cursor: res.data.createTrack.cursor,
      };

      if (props.isPublic) {
        updatePublicTracksQueryCache(proxy, newTrack);
      } else {
        updateTracksQueryCache(proxy, newTrack);
      }

      values.title = "";
      values.artistName = "";
      values.isPublic = false;
    },
    onError: (err) => {
      console.log("Failed to create track: ", err);
    },
  });

  async function addTrack() {
    if (audioFile === null) {
      setShowTrackError(true);
      return;
    }
    try {
      if (audioFile !== null) {
        setCreateTrackLoading(true);
        await uploadToS3(audioFile, audioSignedReq);
        if (imgFile) {
          await uploadToS3(imgFile, imgSignedReq);
        }
        createTrack();
        if (creatingTrackRef.current) {
          creatingTrackRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
        setCreateTrackLoading(false);
        document.body.style.overflow = "";
        props.setModalIsOpen(false);
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
        <h1 className="text-teal-400 font-bold tracking-wide  py-2">Add Track</h1>
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
          placeholder="ex. HUMBLE"
          name="title"
          className="bg-gray-700 pl-2 mt-1 text-sm  border w-full border-gray-800 bg-opacity-25 rounded-lg h-8 text-gray-400 placeholder-gray-500 focus:outline-none focus:shadow-outline"
          type="text"
          required
        />

        <div className="mt-3">
          <label
            className="text-gray-300 text-sm sm:text-base font-semibold tracking-wider"
            htmlFor="artistName"
          >
            Artist
          </label>
          <input
            value={values.artistName}
            onChange={onFieldChange}
            placeholder="ex. Kendrick L."
            name="artistName"
            className="bg-gray-700 pl-2 mt-1 text-sm border w-full border-gray-800 bg-opacity-25 rounded-lg h-8 text-gray-400 placeholder-gray-500 focus:outline-none focus:shadow-outline"
            type="text"
            required
          />
        </div>

        <div className="mt-3 ">
          <label
            className="text-gray-300 text-sm sm:text-base font-semibold tracking-wider"
            htmlFor="image"
          >
            Image
          </label>
          <div className="mt-2">
            <ProjectImageUpload
              setImageFile={setImgFile}
              setImagePreview={setImgPreview}
              setImageS3Url={setImgS3Url}
              setSignedReq={setImgSignedReq}
              imagePreview={imgPreview}
            />
          </div>
        </div>
        <div className="mt-8">
          <label
            className="text-gray-300 text-sm sm:text-base font-semibold tracking-wider"
            htmlFor="image"
          >
            Audio
          </label>
          <div className="mt-2">
            <ProjectAudioUpload
              setAudioFile={setAudioFile}
              setAudioPreview={setAudioPreview}
              setAudioS3Url={setAudioS3Url}
              setSignedReq={setAudioSignedReq}
            />
          </div>
          {showTrackError && audioFile === null && (
            <p className="italic text-red-600 text-sm mt-1">Audio file is required</p>
          )}
          <div aria-label="audio player" className="mt-2 sm:w-64 w-24">
            <ReactAudioPlayer audioSource={audioPreview} />
          </div>
        </div>
      </div>

      <div className="flex relative items-center mt-3 border border-gray-600 bg-cardBg bg-opacity-25 p-1 my-1 shadow-md rounded-md hover:bg-black hover:bg-opacity-25 transition duration-300 ease-in-out">
        <img
          className="m-2 rounded-lg h-12 w-12 object-center object-cover shadow-md"
          src={imgPreview}
          alt="Profile Pic"
        />

        <div className="ml-1">
          <div className="block text-gray-400 w-24 sm:w-40 w text-xs sm:text-sm truncate font-extrabold tracking-wide hover:underline">
            {values.title}
          </div>
          <div className="block text-gray-600 font-medium text-xs sm:text-sm w-24 sm:w-40 truncate hover:underline">
            {values.artistName}
          </div>
        </div>

        <div aria-label="audio player" className="absolute right-0 mr-8 sm:w-64 w-24">
          <ReactAudioPlayer audioSource={audioPreview} />
        </div>
      </div>

      {createTrackLoading ? (
        <>
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
          <p ref={creatingTrackRef} className="text-gray-600 text-center italic">
            Creating track...
          </p>
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

const CREATE_TRACK_MUTATION = gql`
  mutation createTrack($trackInput: TrackInput!) {
    createTrack(trackInput: $trackInput) {
      id
      createdAt
      cursor
      title
      username
      author {
        id
        username
      }
      artistName
      audioUrl
      imageUrl
      isPublic
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default AddTrackModal;
