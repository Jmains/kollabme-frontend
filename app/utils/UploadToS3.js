import Axios from "axios";

export const uploadToS3 = async (file, signedReq) => {
  const options = {
    headers: {
      "Content-Type": file.type,
    },
  };
  try {
    await Axios.put(signedReq, file, options);
  } catch (error) {
    throw new Error("UploadToS3: ", error);
  }
};
