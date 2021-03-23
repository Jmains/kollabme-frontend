import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";

import { uploadToS3 } from "../../utils/UploadToS3";

import { QUERY_PUBLIC_TRACKS, QUERY_PUBLIC_PAINTINGS, QUERY_POSTS } from "../../utils/graphql";

import VideoPlayer from "../MediaPlayers/VideoPlayer";
import FileUploadButton from "../Media/FileUploadButton";
import VideoUpload from "../Media/VideoUpload";
import LoadingSpinner from "../Shared/LoadingSpinner";
import Modal from "react-modal";
import TracksContainer from "../Track/TracksContainer";
import PostEmbeddedTrack from "../Shared/PostEmbeddedTrack";
import ReactAudioPlayer from "../MediaPlayers/ReactAudioPlayer";

const postBg = {
  background: "rgba(255, 255, 255, 0.05)",
  mixBlendMode: "normal",
};

const formStyle = {
  resize: "none",
  background: "rgba(255, 255, 255, 0.07)",
};

Modal.setAppElement("#app");

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
    background: "rgba(0,0,0,0.7)",
  },
};

const imageUploadIcon = (
  <button aria-label="image upload">
    <svg
      tabIndex="-1"
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="cursor-pointer fill-current text-gray-600 hover:text-gray-500 w-5 h-5 sm:h-6 sm:w-6"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
    </svg>
  </button>
);

const audioUploadIcon = (
  <button aria-label="audio upload">
    <svg
      tabIndex="-1"
      aria-hidden="true"
      className="w-5 h-5 sm:h-6 sm:w-6 fill-current text-gray-600 hover:text-gray-500"
      viewBox="0 0 24 24"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z" />
    </svg>
  </button>
);

const videoUploadIcon = (
  <button aria-label="video upload">
    <svg
      tabIndex="-1"
      aria-hidden="true"
      className="h-5 w-5 sm:h-6 sm:w-6 fill-current text-gray-600 hover:text-gray-500"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
    </svg>
  </button>
);

function PostForm({ user }) {
  // Remove cursor from post form after posting
  //const postInputRef = useRef(null);
  const [signedReq, setSignedReq] = useState(null);
  const [showEmptyBodyError, setShowEmptyBodyError] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageS3Url, setImageS3Url] = useState(null);

  const [videoS3Url, setVideoS3Url] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const [audioS3Url, setAudioS3Url] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);

  const [hideForm, setHideForm] = useState(false);
  const [postingSpinner, setPostingSpinner] = useState(false);

  const [disableImageIcon, setDisableImageIcon] = useState(false);
  const [disableMusicIcon, setDisableMusicIcon] = useState(false);

  const [embeddedTracks, setEmbeddedTracks] = useState([]);
  const [embeddedPainting, setEmbeddedPainting] = useState(null);
  const [embeddedVideo, setEmbeddedVideo] = useState(null);
  const [embeddedAlbum, setEmbeddedAlbum] = useState(null);

  const [body, setBody] = useState("");

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [createPost, { error, loading, data }] = useMutation(CREATE_POST, {
    update: (proxy, res) => {
      const newPost = {
        __typename: "PostEdge",
        node: res.data.createPost,
        cursor: res.data.createPost.cursor,
      };

      const data = proxy.readQuery({
        query: QUERY_POSTS,
        variables: { searchQuery: null },
      });

      proxy.writeQuery({
        query: QUERY_POSTS,
        variables: { searchQuery: null },
        data: {
          queryPosts: {
            edges: [newPost, ...data.queryPosts.edges],
            pageInfo: {
              endCursor: data.queryPosts.pageInfo.endCursor,
              hasNextPage: data.queryPosts.pageInfo.hasNextPage,
            },
          },
        },
      });
      setBody("");
      //postInputRef.current.blur();
    },
    variables: {
      body: body,
      userId: user.id,
      imageUrl: imageS3Url,
      videoUrl: videoS3Url,
      audioUrl: audioS3Url,
    },
  });

  function resetFields() {
    setVideoFile(null);
    setVideoPreview(null);

    setAudioFile(null);
    setAudioPreview(null);

    setImageFile(null);
    setImagePreview(null);

    setImageS3Url(null);
    setVideoS3Url(null);
    setAudioS3Url(null);
  }

  async function performUpload() {
    if (!body) {
      setShowEmptyBodyError(true);
      return;
    }
    try {
      if (imageFile === null && videoFile === null && audioFile === null) {
        setPostingSpinner(true);
        await createPost();
        setPostingSpinner(false);
        resetFields();
        return;
      } else if (imageFile && videoFile === null && audioFile === null) {
        setPostingSpinner(true);
        await uploadToS3(imageFile, signedReq);
        await createPost();
        setPostingSpinner(false);
        resetFields();
        return;
      } else if (videoFile && imageFile === null && audioFile === null) {
        setPostingSpinner(true);

        await uploadToS3(videoFile, signedReq);
        await createPost();
        setPostingSpinner(false);
        resetFields();
        return;
      } else if (audioFile && imageFile === null && videoFile === null) {
        setPostingSpinner(true);
        await uploadToS3(audioFile, signedReq);
        await createPost();
        setPostingSpinner(false);
        resetFields();
        return;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  /* This function uploads the file to graphql via the uploadFile mutation
  which returns a signedRequest for aws and a url for the image. Then it 
  uploads the image to aws using an axios put request. After that it updates
  the user profile pic in the db with the new url and graphql returns the working
  image url */
  function submitPost(e) {
    e.preventDefault();
    performUpload();
  }

  return (
    <>
      {/* {user && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          style={modalStyles}
          shouldCloseOnOverlayClick={true}
        >
          <div className="w-screen bg-cardBg">
            <TracksContainer
              username={user.username}
              isPublic={true}
              first={7}
              setEmbeddedTracks={setEmbeddedTracks}
              selectEmbedded={true}
            />
          </div>
        </Modal>
      )} */}
      {!postingSpinner ? (
        <form
          onSubmit={(e) => {
            submitPost(e);
          }}
          className="my-2 p-4 shadow-lg rounded-sm bg-white"
        >
          <div className="mb-3">
            {/* Post body container */}

            <textarea
              id="body"
              type="text"
              name="body"
              // ref={postInputRef}
              cols="2"
              rows="3"
              style={postBg}
              maxLength="280"
              style={formStyle}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="shadow mb-3 text-sm sm:text-base border-gray-200 h-24 rounded w-full py-2 px-3 placeholder-gray-500 text-gray-900 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-gray-600"
              required
              placeholder="What's your latest creation?..."
              aria-label="body"
            ></textarea>
            {/* End post body container */}
            {showEmptyBodyError && (
              <p className="italic text-red-500 text-xs my-1">Please provide a caption.</p>
            )}

            {error && (
              <p className="text-red-500 text-xs italic">{error.graphQLErrors[0].message}</p>
            )}

            <p className="text-red-500 text-xs italic">
              Only mp3 files for audio for now please :)
            </p>

            {/* {user && embeddedTracks.length > 0 && (
              <PostEmbeddedTrack
                track={embeddedTracks[0]}
                profileUsername={user.username}
                user={user}
              />
            )} */}

            {/* Image Preview Container */}

            {imagePreview && (
              <div className="relative">
                <img
                  className="shadow-lg mx-auto rounded-md h-64 w-full object-cover object-center"
                  src={imagePreview}
                />
                <div
                  onClick={() => resetFields()}
                  className="fill-current bg-gray-200 rounded-full text-red-500 absolute top-0 right-0 m-2 shadow-md cursor-pointer"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z" />
                  </svg>
                </div>
              </div>
            )}
            {/* End Image Preview Container */}

            {/* Video Preview Container */}
            {videoPreview && (
              <div className="relative">
                <div className="shadow-lg mx-auto rounded-md h-64 w-full object-cover object-center focus:outline-none focus:shadow-outline">
                  <VideoPlayer videoSource={videoPreview} />
                </div>

                <div
                  onClick={() => resetFields()}
                  className="fill-current bg-gray-200 rounded-full text-red-500 absolute top-0 right-0 m-2 shadow-md cursor-pointer"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z" />
                  </svg>
                </div>
              </div>
            )}
            {/* End Video Preview Container */}
            {/* Audio Preview Container */}
            {audioPreview && (
              <div className="relative">
                <div className="shadow-lg mx-auto rounded-md w-full object-cover object-center focus:outline-none focus:shadow-outline">
                  <ReactAudioPlayer audioSource={audioPreview} />
                </div>

                <div
                  onClick={() => resetFields()}
                  className="fill-current bg-gray-200 rounded-full text-red-500 absolute top-0 right-0 m-2 shadow-md cursor-pointer"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z" />
                  </svg>
                </div>
              </div>
            )}
            {/* End Audio Preview Container */}
          </div>
          {/* Icons container */}
          <div className="relative flex items-baseline">
            <div
              onClick={(e) => {
                e.preventDefault();
                setVideoFile(null);
                setVideoPreview(null);
                setAudioFile(null);
                setAudioPreview(null);
              }}
              className="focus:outline-none focus:shadow-outline"
            >
              <FileUploadButton
                setFile={setImageFile}
                setFilePreview={setImagePreview}
                setS3Url={setImageS3Url}
                setSignedReq={setSignedReq}
                icon={imageUploadIcon}
                uploadType="images"
              />
            </div>

            <div
              onClick={(e) => {
                e.preventDefault();
                setImageFile(null);
                setImagePreview(null);
                setVideoFile(null);
                setVideoPreview(null);
              }}
              className="cursor-pointer ml-6 focus:outline-none focus:shadow-outline"
            >
              <FileUploadButton
                setFile={setAudioFile}
                setFilePreview={setAudioPreview}
                setS3Url={setAudioS3Url}
                setSignedReq={setSignedReq}
                icon={audioUploadIcon}
                uploadType="tracks"
              />
            </div>

            <div
              onClick={(e) => {
                e.preventDefault();
                setImageFile(null);
                setImagePreview(null);
                setAudioFile(null);
                setAudioPreview(null);
              }}
              className="cursor-pointer ml-6 focus:outline-none focus:shadow-outline"
            >
              <FileUploadButton
                setFile={setVideoFile}
                setFilePreview={setVideoPreview}
                setS3Url={setVideoS3Url}
                setSignedReq={setSignedReq}
                icon={videoUploadIcon}
                uploadType="videos"
              />
            </div>

            {/* Post from tracks library */}
            {/* <button
              aria-label="post from tracks library"
              onClick={() => {
                setModalIsOpen(!modalIsOpen);
              }}
              className="ml-6 text-gray-600 hover:text-gray-500 transition duration-300 ease-in-out cursor-pointer focus:outline-none focus:shadow-outline"
            >
              <svg
                className="fill-current h-5 w-5 sm:h-6 sm:w-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 5h-3v5.5c0 1.38-1.12 2.5-2.5 2.5S10 13.88 10 12.5s1.12-2.5 2.5-2.5c.57 0 1.08.19 1.5.51V5h4v2zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z" />
              </svg>
            </button> */}

            {/* Post from paintings library */}
            {/* <button
              aria-label="post from gallery library"
              className="ml-6 text-gray-600 hover:text-gray-500 transition duration-300 ease-in-out cursor-pointer focus:outline-none focus:shadow-outline"
            >
              <svg
                className="fill-current h-5 w-5 sm:h-6 sm:w-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" />
              </svg>
            </button> */}

            {/* Post from videos library */}
            {/* <button
              aria-label="post from videos library"
              className="ml-6 text-gray-600 hover:text-gray-500 transition duration-300 ease-in-out cursor-pointer focus:outline-none focus:shadow-outline"
            >
              <svg
                className="fill-current h-5 w-5 sm:h-6 sm:w-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z" />
              </svg>
            </button> */}

            <button
              type="submit"
              className="absolute font-bold h-8 inset-y-0 right-0 px-4 text-base md:text-lg md:w-20 shadow-md rounded-full bg-black text-white hover:bg-opacity-70 tracking-wide focus:outline-none transition ease-in-out duration-200"
            >
              Post
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
          <p className="text-gray-600 text-center italic">Posting...</p>
        </>
      )}
    </>
  );
}

const CREATE_POST = gql`
  mutation createPost(
    $userId: ID!
    $body: String!
    $imageUrl: String
    $videoUrl: String
    $audioUrl: String
  ) {
    createPost(
      userId: $userId
      body: $body
      imageUrl: $imageUrl
      videoUrl: $videoUrl
      audioUrl: $audioUrl
    ) {
      id
      body
      createdAt
      imageUrl
      username
      videoUrl
      audioUrl
      cursor
      author {
        username
        profilePic
        mainPlatforms
      }
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
