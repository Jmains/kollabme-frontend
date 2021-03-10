import React, { useCallback } from "react";
import { useMutation, gql } from "@apollo/client";
import { useDropzone } from "react-dropzone";
import { formatFilename } from "../../utils/formatFilename";

function VideoUpload({ setVideoFile, setVideoPreview, setVideoS3Url, setSignedReq, icon }) {
  const uploadTypes = {
    image: "images",
    video: "videos",
  };

  const onDrop = useCallback((files) => {
    setVideoFile(files[0]);

    // Read file and provide preview
    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      setVideoPreview(reader.result);
    };
    reader.readAsDataURL(files[0]);

    getAWSsignedUrl(files[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const [
    getSignedRequest,
    { loading: getSignedReqLoading, error: getSignedReqError },
  ] = useMutation(S3_SIGN_MUTATION);

  async function getAWSsignedUrl(videoFile) {
    try {
      const signedReqResponse = await getSignedRequest({
        variables: {
          // Change uploadType variable here for other types of files
          filename: formatFilename(videoFile.name, uploadTypes.video),
          filetype: videoFile.type,
          filesize: videoFile.size,
          // Change uploadType here as well
          uploadType: uploadTypes.video,
        },
      });
      const { signedRequest, url } = signedReqResponse.data.signS3;
      setSignedReq(signedRequest);
      setVideoS3Url(url);
    } catch (error) {
      throw new Error(error);
    }
  }

  return (
    <div className="focus:outline-none focus:shadow-outline" {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? <p>Drop the files here ...</p> : icon}
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

export default VideoUpload;
