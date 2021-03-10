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

function ProjectAudioUpload({ setAudioFile, setAudioPreview, setAudioS3Url, setSignedReq }) {
  const [
    getSignedRequest,
    { loading: getSignedReqLoading, error: getSignedReqError },
  ] = useMutation(S3_SIGN_MUTATION);

  const onDrop = useCallback((files) => {
    setAudioFile(files[0]);
    // Read file and provide preview
    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      setAudioPreview(reader.result);
    };
    if (
      files[0].type === "audio/mpeg" ||
      files[0].type === "audio/x-m4a" ||
      files[0].type === "audio/flac"
    ) {
      reader.readAsDataURL(files[0]);
    } else {
      reader.readAsArrayBuffer(files[0]);
    }

    getAWSsignedUrl(files[0]);
    console.log(files[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  async function getAWSsignedUrl(file) {
    try {
      const signedReqResponse = await getSignedRequest({
        variables: {
          // Change uploadType variable here for other types of files
          filename: formatFilename(file.name, uploadTypes.track),
          filetype: file.type,
          filesize: file.size,
          // Change uploadType here as well
          uploadType: uploadTypes.track,
        },
      });
      const { signedRequest, url } = signedReqResponse.data.signS3;
      setSignedReq(signedRequest);
      setAudioS3Url(url);
    } catch (error) {
      throw new Error(error);
    }
  }

  return (
    <>
      <div
        className="focus:outline-none focus:shadow-outline h-10 border mx-auto border-gray-600 border-dashed rounded-lg"
        {...getRootProps()}
      >
        <input className="rounded-lg" {...getInputProps()} />

        <p className="text-gray-600 mt-2 text-xs text-center">
          Drop audio file or click here to select a file...
        </p>
      </div>
      <p className="italic mt-2 text-gray-500 text-xs">
        Currently we only support FLAC, MP4, and MP3 file formats.<br></br> We plan on adding
        support for WAV, AIFF, ALAC, OGG, AAC, and WMA very soon.
      </p>
      {getSignedReqError && (
        <p className="italic mt-2 text-red-600 text-xs">
          {getSignedReqError.graphQLErrors[0].message}
        </p>
      )}
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

export default ProjectAudioUpload;
