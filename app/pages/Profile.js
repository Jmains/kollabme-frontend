import React, { useEffect, useRef, useState } from "react";
import { useQuery, useLazyQuery, gql } from "@apollo/client";
import Modal from "react-modal";
import { Waypoint } from "react-waypoint";

import Page from "../components/Shared/Page";
import PostCard from "../components/Shared/PostCard";
import FollowButton from "../components/Buttons/FollowButton";
import CollaborateButton from "../components/Buttons/CollaborateButton";
import ProfileInfo from "../components/Profile/ProfileInfo";
import ProfileStats from "../components/Profile/ProfileStats";
import ImageCrop from "../components/Media/ImageCrop";
import CoverCrop from "../components/Media/CoverCrop";
import EditProfileModal from "../components/Modals/EditProfileModal";
import LoadingSpinner from "../components/Shared/LoadingSpinner";
import TracksContainer from "../components/Track/TracksContainer";
import AlbumContainer from "../components/Album/AlbumsContainer";
import GalleryContainer from "../components/Gallery/GalleryContainer";

import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";

import moment from "moment";

import { useAuthState } from "../context/auth";
import { QUERY_POSTS } from "../utils/graphql";
import VideosContainer from "../components/Video/VideosContainer";

const coverPhotoStyle = {
  background: "linear-gradient(180deg, rgba(0, 0, 0, 0) 52.23%, rgba(0, 0, 0, 0.82) 100%)",
};

const statsBg = {
  background:
    "linear-gradient(360deg, rgba(0, 0, 0, 0.71) 0%, rgba(0, 0, 0, 0) 65.52%), rgba(51, 51, 51, 0.86)",
};

const profilePicUploadIcon = (
  <button aria-label="changed profile picture">
    <svg
      className="h-5 w-5 fill-current text-gray-400 cursor-pointer"
      enableBackground="new 0 0 24 24"
      viewBox="0 0 24 24"
    >
      <rect fill="none" className="h-5 w-5" />
      <path d="M3,4V1h2v3h3v2H5v3H3V6H0V4H3z M6,10V7h3V4h7l1.83,2H21c1.1,0,2,0.9,2,2v12c0,1.1-0.9,2-2,2H5c-1.1,0-2-0.9-2-2V10H6z M13,19c2.76,0,5-2.24,5-5s-2.24-5-5-5s-5,2.24-5,5S10.24,19,13,19z M9.8,14c0,1.77,1.43,3.2,3.2,3.2s3.2-1.43,3.2-3.2 s-1.43-3.2-3.2-3.2S9.8,12.23,9.8,14z" />
    </svg>
  </button>
);

const coverPhotoUploadIcon = (
  <button aria-label="changed cover photo">
    <svg className="fill-current text-gray-600 cursor-pointer h-6 w-6 " viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
  </button>
);
Modal.setAppElement("#app");
const modalStyles = {
  content: {
    top: "65%",
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
    background: "rgba(0,0,0,0.5)",
  },
};

function Profile(props) {
  let profileData = null;
  let posts = null;
  let endCursor = "";
  let hasNextPage = false;
  const usernameParam = props.match.params.username;
  const { user } = useAuthState();
  const types = ["Projects", "Posts", "Likes"];
  const [active, setActive] = useState(types[0]);
  const headingRef = useRef(null);

  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, []);

  const { loading, error, data: profileInfo } = useQuery(GET_USER_QUERY, {
    variables: { username: usernameParam },
    fetchPolicy: "network-only",
  });

  const [
    loadPosts,
    { loading: postsLoading, error: postsError, data: postsData, fetchMore, networkStatus },
  ] = useLazyQuery(QUERY_POSTS, {
    variables: { username: usernameParam, searchQuery: null },

    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",

    onError: (err) => {
      console.log(err);
    },
  });

  const [showProjects, setShowProjects] = useState(true);
  const [showPosts, setShowPosts] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const [profilePicFile, setProfilePicFile] = useState(null);
  const [ProfilePicPreview, setProfilePicPreview] = useState(null);
  const [ProfilePicSignedReq, setProfilePicSignedReq] = useState(null);
  const [profilePicS3Url, setProfilePicS3Url] = useState(null);

  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
  const [coverPhotoSignedReq, setCoverPhotoSignedReq] = useState(null);
  const [coverPhotoS3Url, setCoverPhotoS3Url] = useState(null);

  // modal hooks
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [picModalIsOpen, setPicModalIsOpen] = useState(false);
  const [coverModalIsOpen, setCoverModalIsOpen] = useState(false);

  // profile picture hooks
  const [userProfilePic, setUserProfilePic] = useState("");
  const [selectedPic, setSelectedPic] = useState("");
  const [userProfileEdit, setUserProfileEdit] = useState(null);
  const [userProfileScaleValue, setUserProfileScaleValue] = useState(1);

  // cover photo hooks
  const [userCoverPic, setUserCoverPic] = useState("");
  const [selectedCoverPic, setSelectedCoverPic] = useState("");
  const [userCoverEdit, setUserCoverEdit] = useState(null);
  const [userCoverScaleValue, setUserCoverScaleValue] = useState(1);

  let hideFollowAndCollabButton = "flex text-sm my-3 lg:mt-5 sm:mt-5 md:mt-4 items-center";
  if (user && user.username === usernameParam) {
    hideFollowAndCollabButton = "hidden";
  }

  if (profileInfo) {
    profileData = profileInfo.getUser;
  }

  if (postsData) {
    posts = postsData.queryPosts.edges;
    endCursor = postsData.queryPosts.pageInfo.endCursor;
    hasNextPage = postsData.queryPosts.pageInfo.hasNextPage;
  }

  function onScaleChange(scaleValueEvent) {
    const scaleValue = parseFloat(scaleValueEvent.target.value);
    setUserProfileScaleValue(scaleValue);
  }
  function onCoverScaleChange(scaleValueEvent) {
    const scaleValue = parseFloat(scaleValueEvent.target.value);
    setUserCoverScaleValue(scaleValue);
  }

  function forceUpdateHandler() {
    forceUpdate();
  }

  function handleModalClose() {
    setModalIsOpen(false);
    document.body.style.overflow = "";
  }

  return (
    <Page title={usernameParam ? usernameParam : "Profile"}>
      {/* Cover Photo Container */}
      <div className="mx-auto shadow-lg rounded-b-lg sm:mx-auto md:mx-auto max-w-full sm:max-w-full md:max-w-6xl relative overflow-hidden">
        <div style={coverPhotoStyle} className="md:h-covPhoto h-64 w-full absolute"></div>
        {profileData && (
          <img
            className="w-full md:h-covPhoto h-64 rounded-b-lg shadow-md object-cover object-center"
            src={profileData.coverPhoto}
            alt="cover photo"
          />
        )}

        {/* Edit cover photo icon */}
        {user && profileData && user.username === profileData.username ? (
          <div
            className="m-4 z-3 absolute top-0 right-0 focus:outline-none"
            onClick={() => {
              setCoverModalIsOpen(true);
            }}
          >
            {coverPhotoUploadIcon}
            {/* <ImageUpload
                setImageFile={setCoverPhotoFile}
                setImagePreview={setCoverPhotoPreview}
                setSignedReq={setCoverPhotoSignedReq}
                setImageS3Url={setCoverPhotoS3Url}
                icon={coverPhotoUploadIcon}
              /> */}
          </div>
        ) : (
          ""
        )}
        {/* End Edit cover photo icon */}

        <Modal
          className="z-4 relative"
          isOpen={picModalIsOpen}
          onRequestClose={() => setPicModalIsOpen(false)}
          style={{
            overlay: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,.5)",
              zIndex: 999,
            },
            content: {
              outline: "none",
              backgroundColor: "#rgba(255, 255, 255, 0.07)",
            },
          }}
        >
          <div className="lg:container lg:mx-auto lg:px-6">
            <div className="lg:grid lg:grid-cols-12 lg:gap-2">
              <div className="lg:col-span-11">
                <div className="mt-20 lg:-mr-32">
                  {profileData && (
                    <div className="mx-auto max-w-xl sm:max-w-2xl lg:max-w-2x1">
                      <ImageCrop
                        userId={profileData.id}
                        imageSrc={selectedPic}
                        setEditorRef={setUserProfileEdit}
                        scaleValue={userProfileScaleValue}
                        onScaleChange={onScaleChange}
                        userProfilePic={profileData.profilePic}
                        forceUpdateHandler={forceUpdateHandler}
                        setSelectedPic={setSelectedPic}
                        setUserProfilePic={setUserProfilePic}
                        userProfileEdit={userProfileEdit}
                        setPicModalIsOpen={setPicModalIsOpen}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal>

        {/* cover modal */}
        <Modal
          className="z-4 relative"
          isOpen={coverModalIsOpen}
          onRequestClose={() => setCoverModalIsOpen(false)}
          style={{
            overlay: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,.5)",
              zIndex: 999,
            },
            content: {
              outline: "none",
              backgroundColor: "#rgba(255, 255, 255, 0.07)",
            },
          }}
        >
          <div className="lg:container lg:mx-auto lg:px-6">
            <div className="lg:grid lg:grid-cols-12 lg:gap-2">
              <div className="lg:col-span-11">
                <div className="mt-20 lg:-mr-32">
                  <div className="mx-auto max-w-xl sm:max-w-2xl ">
                    {profileData && (
                      <CoverCrop
                        userId={profileData.id}
                        imageSrc={selectedCoverPic}
                        setEditorRef={setUserCoverEdit}
                        scaleValue={userCoverScaleValue}
                        onScaleChange={onCoverScaleChange}
                        userCoverPic={userCoverPic}
                        forceUpdateHandler={forceUpdateHandler}
                        setSelectedCoverPic={setSelectedCoverPic}
                        setUserCoverPic={setUserCoverPic}
                        userCoverEdit={userCoverEdit}
                        setCoverModalIsOpen={setCoverModalIsOpen}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        {/* Stats container */}
        <div className="md:flex hidden md:text-gray-300 md:bg-teal-700 md:bg-opacity-50 md:max-w-sm md:items-center md:mx-auto md:justify-evenly md:rounded-full md:absolute md:right-0 md:-mt-16 md:mr-5 sm:flex sm:text-tiny sm:text-gray-300 sm:bg-teal-700 sm:bg-opacity-50 sm:max-w-sm sm:items-center sm:mx-auto sm:justify-evenly sm:rounded-full sm:absolute sm:right-0 sm:-mt-12 sm:mr-3">
          {profileData && (
            <ProfileStats
              followerCount={profileData.followerCount}
              followingCount={profileData.followingCount}
              collaboratorCount={profileData.collaboratorCount}
            />
          )}
        </div>
        {/* End Stats container */}
      </div>
      {/* End Cover Photo Container */}
      {/* Profile Image Container */}
      <div className="flex max-w-full sm:mx-auto md:mx-auto sm:max-w-full md:max-w-5xl relative">
        {profileData && (
          <img
            className="rounded-full border-gray-700 border-2 -mt-24 ml-5 sm:ml-8 lg:ml-16 object-cover object-center h-32 w-32 shadow-md z-3"
            src={profileData.profilePic}
            alt="profile picture"
          />
        )}
        {/* Edit Profile Image Icon */}

        {user && profileData && user.username === profileData.username ? (
          <div
            className="ml-8 mt-2 md:ml-32 lg:ml-40 absolute focus:outline-none"
            onClick={() => {
              setPicModalIsOpen(true);
            }}
          >
            {profilePicUploadIcon}
            {/* <ImageUpload
                setImageFile={setProfilePicFile}
                setImagePreview={setProfilePicPreview}
                setSignedReq={setProfilePicSignedReq}
                setImageS3Url={setProfilePicS3Url}
                imageFile={profilePicFile}
                icon={profilePicUploadIcon}
              /> */}
          </div>
        ) : (
          ""
        )}

        {/* End Edit Profile Image Icon */}

        {profileData && (
          <div className="text-lg md:text-2xl lg:text-2xl text-gray-300 ml-3 lg:ml-6 -mt-16 font-bold tracking-wide z-30">
            <div ref={headingRef} id="heading" tabIndex="0" className="flex items-baseline">
              {profileData.displayName ? (
                <h1>{profileData.displayName}</h1>
              ) : (
                <h1>{capitalizeFirstLetter(profileData.username)}</h1>
              )}
              <span className="text-sm ml-2 font-semibold text-teal-400">
                @{profileData.username}
              </span>
            </div>
            <p className="text-sm lg:text-sm text-gray-500 font-normal">
              {`Joined ${moment(profileData.createdAt).format("MMMM DD, YYYY")}`}
            </p>
            {/* Small Screen Stats container */}
            {profileData && (
              <div className="block sm:hidden mt-6 -ml-4">
                <ProfileStats
                  followerCount={profileData.followerCount}
                  followingCount={profileData.followingCount}
                  collaboratorCount={profileData.collaboratorCount}
                />
              </div>
            )}
            {/* <div
                style={statsBg}
                className="text-white text-xs flex items-center mt-6 -ml-3 sm:hidden rounded-full bg-cardBg shadow-md w-auto"
              >
                <div className="ml-2 px-1 text-center border-gray-300 border-r py-1">
                  <p className="text-teal-400">{profileData.followingCount}</p>
                  <h4 className="text-gray-500 font-normal text-tiny">following</h4>
                </div>
                <div className=" px-1 text-center py-1">
                  <p className="text-teal-400">{profileData.followerCount}</p>
                  <h4 className="text-gray-500 font-normal text-tiny">followers</h4>
                </div>
                <div className=" px-1 text-center border-gray-300 border-l py-1">
                  <p className="text-teal-400">{profileData.collaboratorCount}</p>
                  <h4 className="text-gray-500 font-normal text-tiny">Collaborators</h4>
                </div>
              </div> */}
            {/* End Small Screen Stats container */}

            <div className={hideFollowAndCollabButton}>
              {profileData && user ? (
                <FollowButton user={user} userToFollow={profileData} />
              ) : (
                <FollowButton />
              )}
              {user && profileData ? (
                <CollaborateButton user={user} userToCollab={profileData} />
              ) : (
                <CollaborateButton />
              )}
            </div>
          </div>
        )}
      </div>
      {/* End Profile Image Container */}
      {/* Post button, Live Reel button, and post card container */}
      <div className="lg:flex lg:justify-between lg:my-1 lg:mx-auto md:max-w-6xl">
        {/* Profile Info Card Container */}
        <div className="lg:w-64 rounded-md mx-auto mt-2 lg:h-full max-h h-1/2 sm:mx-auto max-w-lg md:max-w-2xl lg:mx-0">
          {profileData && (
            <ProfileInfo
              user={user}
              profileData={profileData}
              setModalIsOpen={setModalIsOpen}
            />
          )}
        </div>

        {/* End Profile Info Card Container */}
        <div className="lg:block lg:w-5/6 ">
          {/* Posts button container */}

          {profileData && (
            <div className="flex justify-evenly items-center rounded-lg border-teal-400 border-b lg:mt-0 text-center my-6 tracking-wide mx-auto max-w-lg md:max-w-xl">
              {types.map((type, i) => {
                return (
                  <div key={type}>
                    <button
                      aria-pressed={active === type ? true : false}
                      onClick={(e) => {
                        switch (e.currentTarget.textContent) {
                          case "Projects":
                            setShowPosts(false);
                            setShowLikes(false);
                            setShowProjects(true);
                            break;
                          case "Posts":
                            setShowPosts(true);
                            setShowLikes(false);
                            setShowProjects(false);
                            loadPosts();
                            break;
                          case "Likes":
                            setShowPosts(false);
                            setShowLikes(true);
                            setShowProjects(false);
                            break;
                        }
                        setActive(type);
                      }}
                      className={
                        active === type
                          ? "text-sm md:text-base font-semibold text-teal-400 w-auto px-3 py-1"
                          : "text-sm md:text-base font-semibold text-gray-400 w-auto px-3 py-1  hover:text-teal-400 transition duration-300 ease-in-out"
                      }
                    >
                      {type}
                    </button>
                    {/* {i !== types.length - 1 && (
                  <div className="bg-teal-400 border-teal-400 border rounded h-8"></div>
                )} */}
                  </div>
                );
              })}
            </div>
          )}

          {/* End Post Button Container */}

          {showProjects && profileData && (
            <div className="mx-auto rounded-lg max-w-lg md:max-w-4xl lg:ml-10">
              <GalleryContainer isPublic={true} username={profileData.username} first={2} />
              <div className="mt-3">
                <TracksContainer isPublic={true} username={profileData.username} first={3} />
              </div>
              <div className="mt-3">
                <AlbumContainer isPublic={true} username={profileData.username} first={6} />
              </div>
              <div className="mt-3">
                <VideosContainer isPublic={true} username={profileData.username} first={2} />
              </div>
            </div>
          )}
          {showLikes && (
            <div className="mx-auto shadow-lg rounded-lg max-w-lg md:max-w-2xl lg:ml-10">
              <h1 className="text-teal-400 bg-cardBg h-16 text-center my-auto rounded-lg">
                Viewing user likes is under construction...
              </h1>
            </div>
          )}
          {/* Posts container */}

          <div>
            {showPosts &&
              posts &&
              posts.map((post, i) => (
                <div
                  key={post.node.id}
                  className="mx-auto shadow-lg rounded-lg max-w-lg md:max-w-xl "
                >
                  <PostCard post={post.node} />
                  {/* TODO: Implement infinite scroll for scrolling up */}
                  {/* When scrolling down do infinity scroll */}
                  {hasNextPage && i === posts.length - 2 && (
                    <Waypoint
                      onEnter={() => {
                        console.log(i);
                        fetchMore({
                          variables: { after: endCursor, searchQuery: null },
                        });
                      }}
                    />
                  )}
                  {/* End scrolling down infinity scroll */}
                </div>
              ))}
          </div>
          <div className="flex justify-center">
            {networkStatus === 3 && <LoadingSpinner />}
          </div>
        </div>
      </div>
      {/* End Post button, Live Reel button, and post card container 2*/}

      {profileData && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={handleModalClose}
          style={modalStyles}
          shouldCloseOnOverlayClick={false}
          onAfterOpen={() => (document.body.style.overflow = "hidden")}
        >
          <EditProfileModal
            userId={profileData.id}
            userInfo={profileData}
            setModalIsOpen={setModalIsOpen}
          />
        </Modal>
      )}
    </Page>
  );
}

const GET_USER_QUERY = gql`
  query($username: String!) {
    getUser(username: $username) {
      id
      username
      firstName
      lastName
      displayName
      createdAt
      mainPlatforms
      genres
      age
      city
      state
      gender
      businessEmail
      inspiration
      bio
      profilePic
      coverPhoto
      favChildhoodSong
      currentFavSong
      collaborators {
        id
        username
      }
      collaboratorCount
      followers {
        id
        username
      }
      followingCount
      following {
        id
        username
      }
      followerCount
      pendingCollabs {
        id
        username
      }
      createdPosts {
        id
      }
    }
  }
`;

export default Profile;
