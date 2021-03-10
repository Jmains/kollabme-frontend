import React, { useEffect, useCallback } from "react";
import { useMutation, gql } from "@apollo/client";
import { useDropzone } from "react-dropzone";
import { formatFilename } from "../../utils/formatFilename";

const uploadTypes = {
  image: "images",
  video: "videos",
  track: "tracks",
  painting: "paintings",
};

function ProjectImageUpload({
  setImageFile,
  setImagePreview,
  setImageS3Url,
  setSignedReq,
  imagePreview,
}) {
  const [
    getSignedRequest,
    { loading: getSignedReqLoading, error: getSignedReqError },
  ] = useMutation(S3_SIGN_MUTATION);

  const onDrop = useCallback((files) => {
    setImageFile(files[0]);
    // Read file and provide preview
    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(files[0]);

    getAWSsignedUrl(files[0]);
    console.log(files[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  async function getAWSsignedUrl(file) {
    try {
      const signedReqResponse = await getSignedRequest({
        variables: {
          // Change uploadType variable here for other types of files
          filename: formatFilename(file.name, uploadTypes.image),
          filetype: file.type,
          filesize: file.size,
          // Change uploadType here as well
          uploadType: uploadTypes.image,
        },
      });
      const { signedRequest, url } = signedReqResponse.data.signS3;
      setSignedReq(signedRequest);
      setImageS3Url(url);
    } catch (error) {
      throw new Error(error);
    }
  }

  return (
    <>
      <div
        className="focus:outline-none focus:shadow-outline h-56 w-64 border mx-auto border-gray-600 border-dashed rounded-lg"
        {...getRootProps()}
      >
        <input className="rounded-lg" {...getInputProps()} />
        {imagePreview ? (
          <img
            className="h-56 w-64 rounded-lg object-center object-cover"
            src={imagePreview}
            alt="track image"
          />
        ) : (
          <p className="text-gray-600 text-xs mt-24 text-center">
            Drop file or click here to select a file...
          </p>
        )}
        <p className="italic mt-2 text-gray-500 text-xs text-center">
          Must be of type JPG, JPEG, or PNG.
        </p>
        {getSignedReqError && (
          <p className="italic mt-2 text-red-600 text-xs">
            {getSignedReqError.graphQLErrors[0].message}
          </p>
        )}
      </div>
    </>
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

export default ProjectImageUpload;
