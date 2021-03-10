import React, { useState } from "react";
import { saveAs } from "file-saver";
import { canvasToImage } from "canvas-to-image";
import AvatarEditor from "react-avatar-editor";
import { useMutation, gql } from "@apollo/client";
import { useDropzone } from "react-dropzone";
import Axios from "axios";

const bg = {
  background: "#1c1c1c",
};

const formStyle = {
  resize: "none",
  background: "rgba(255, 255, 255, 0.07)",
};

const centerSingleStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const loadingSpinner = (
  <div className="lds-ripple">
    <div></div>
    <div></div>
  </div>
);

function ImageCrop({
  userId,
  imageSrc,
  setEditorRef,
  scaleValue,
  onScaleChange,
  userProfilePic,
  forceUpdateHandler,
  setSelectedPic,
  setUserProfilePic,
  userProfileEdit,
  setPicModalIsOpen,
}) {
  const uploadTypes = {
    image: "images",
    video: "videos",
  };

  const [postingSpinner, setPostingSpinner] = useState(false);
  const [signedReq, setSignedReq] = useState(null);
  const [imageS3Url, setImageS3Url] = useState(null);
  const [
    getSignedRequest,
    { loading: getSignedReqLoading, error: getSignedReqError },
  ] = useMutation(S3_SIGN_MUTATION);

  const [updateUserProfile, { error, loading, data }] = useMutation(UPDATE_PROFILE_PIC, {
    variables: {
      userId: userId,
      imageUrl: imageS3Url,
    },
  });
  if (error) {
    console.log("error", error.graphQLErrors[0]);
  }

  async function uploadToS3(file, signedRequest) {
    const options = {
      headers: {
        "Content-Type": file.type,
      },
    };
    try {
      await Axios.put(signedRequest, file, options);
    } catch (error) {
      throw new Error(error);
    }
  }

  function formatFilename(filename, uploadType) {
    const date = Date.now().toString();
    const newFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, "-");
    return `${uploadType}/${newFileName}-${date}`;
  }

  function onCrop() {
    if (userProfileEdit != null) {
      const url = userProfileEdit.getImageScaledToCanvas().toDataURL();
      setUserProfilePic(url);
      getAWSsignedUrl(url);
    }
  }

  async function getAWSsignedUrl(imageFile) {
    try {
      let myFile = new File([imageFile], "file-name", { type: "image/jpeg" });
      const signedReqResponse = await getSignedRequest({
        variables: {
          filename: formatFilename(myFile.name, uploadTypes.image),
          filetype: myFile.type,
          filesize: myFile.size,
          uploadType: uploadTypes.image,
        },
      });
      const { signedRequest, url } = signedReqResponse.data.signS3;
      await setSignedReq(signedRequest);
      await setImageS3Url(url);
    } catch (error) {
      throw new Error(error);
    }
  }

  async function performUpload() {
    try {
      if (imageS3Url) {
        await uploadToS3(imageSrc, signedReq);
        await updateUserProfile();
        return;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  function submitPic(e) {
    e.preventDefault();
    performUpload();
    setPicModalIsOpen(false);
  }

  function profileImageChange(fileChangeEvent) {
    const file = fileChangeEvent.target.files[0];
    const { type } = file;
    if (type.endsWith("jpeg") || type.endsWith("png") || type.endsWith("jpg")) {
      setSelectedPic(file);
    }
  }

  return (
    <div style={bg}>
      <div
        style={formStyle}
        className="rounded-md shadow-lg text-sm md:text-base px-10 lg:px-5 py-5 text-teal-400 font-bold tracking-wide"
      >
        <label htmlFor="editor">Edit Photo</label>
        <div style={centerSingleStyle}>
          <img src={userProfilePic} style={{ borderRadius: "50%" }}></img>
          <AvatarEditor
            image={imageSrc}
            border={50}
            borderRadius={100}
            scale={scaleValue}
            ref={setEditorRef}
            onImageChange={onCrop}
            onImageReady={onCrop}
            style={{ display: "none" }}
          />
        </div>
        <input
          className=".cursor-pointer"
          type="file"
          id="btnFileUpload"
          accept="image/png, image/jpeg"
          style={{ display: "none" }}
          onChange={profileImageChange}
        />
        <div style={centerSingleStyle} className="mt-4">
          <label
            htmlFor="btnFileUpload"
            style={{ fontWeight: "normal" }}
            className="py-1 px-3 ml-1 text-intreecatePri bg-black rounded-full tracking-wide shadow-md border-b border-gray-600 hover:bg-intreecatePri hover:text-black transition ease-out duration-300 .cursor-pointer"
          >
            Choose Photo
          </label>

          <button
            className="py-1 px-3 ml-1 text-intreecatePri bg-black rounded-full tracking-wide shadow-md border-b border-gray-600 hover:bg-intreecatePri hover:text-black transition ease-out duration-300 .cursor-pointer"
            onClick={submitPic}
          >
            Set Picture
          </button>
          <button onClick={onCrop}></button>
        </div>
      </div>
    </div>
  );
}

const S3_SIGN_MUTATION = gql`
  mutation($filename: String!, $filetype: String!, $filesize: Int!, $uploadType: String!) {
    signS3(
      filename: $filename
      filetype: $filetype
      filesize: $filesize
      uploadType: $uploadType
    ) {
      url
      signedRequest
    }
  }
`;

const UPDATE_PROFILE_PIC = gql`
  mutation($userId: ID!, $imageUrl: String!) {
    updateProfilePic(userId: $userId, imageUrl: $imageUrl) {
      id
      profilePic
    }
  }
`;

export default ImageCrop;
