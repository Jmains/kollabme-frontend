import React, { useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { useMutation, gql } from "@apollo/client";
import { useDropzone } from "react-dropzone";
import { useAuthState } from "../../context/auth";
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

function CoverCrop({
  userId,
  imageSrc,
  setEditorRef,
  scaleValue,
  onScaleChange,
  userCoverPic,
  setSelectedCoverPic,
  setUserCoverPic,
  userCoverEdit,
  setCoverModalIsOpen,
}) {
  const uploadTypes = {
    image: "images",
    video: "videos",
  };
  const { user } = useAuthState();

  const [signedReq, setSignedReq] = useState(null);
  const [imageS3Url, setImageS3Url] = useState(null);
  const [
    getSignedRequest,
    { loading: getSignedReqLoading, error: getSignedReqError },
  ] = useMutation(S3_SIGN_MUTATION);

  const [updateUserCover, { error, loading, data }] = useMutation(UPDATE_COVER_PIC, {
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

  async function getAWSsignedUrl(imageFile) {
    try {
      let myFile = new File([imageFile], "cover-name", { type: "image/jpeg" });
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
        await updateUserCover();
        return;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  function submitPic(e) {
    e.preventDefault();
    performUpload();
    setCoverModalIsOpen(false);
  }

  function coverImageChange(fileChangeEvent) {
    const file = fileChangeEvent.target.files[0];
    const { type } = file;
    if (type.endsWith("jpeg") || type.endsWith("png") || type.endsWith("jpg")) {
      setSelectedCoverPic(file);
    }
  }

  function onCrop() {
    if (userCoverEdit != null) {
      const url = userCoverEdit.getImageScaledToCanvas().toDataURL();
      setUserCoverPic(url);
      getAWSsignedUrl(url);
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
          <img src={userCoverPic}></img>
          <AvatarEditor
            image={imageSrc}
            border={50}
            height={100}
            width={355.56}
            scale={scaleValue}
            onImageChange={onCrop}
            onImageReady={onCrop}
            ref={setEditorRef}
            style={{ display: "none" }}
          />
        </div>
        <input
          type="file"
          id="btnFileUpload"
          accept="image/png, image/jpeg"
          style={{ display: "none" }}
          onChange={coverImageChange}
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
            Set Cover
          </button>
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

const UPDATE_COVER_PIC = gql`
  mutation($userId: ID!, $imageUrl: String!) {
    updateCoverPhoto(userId: $userId, imageUrl: $imageUrl) {
      id
      coverPhoto
    }
  }
`;

export default CoverCrop;
