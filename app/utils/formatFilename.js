export const formatFilename = (filename, uploadType) => {
  const date = Date.now().toString();
  const newFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, "-");
  return `${uploadType}/${newFileName}-${date}`;
};
