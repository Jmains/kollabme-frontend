import React, { useEffect, useState } from "react";
import { useForm } from "../../utils/hooks";
import { gql, useMutation } from "@apollo/client";
import ProjectImageUpload from "../Media/ProjectImageUpload";
import { uploadToS3 } from "../../utils/UploadToS3";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { QUERY_PAINTINGS, QUERY_PUBLIC_PAINTINGS } from "../../utils/graphql";

function AddPaintingModal(props) {
  const [imgFile, setImgFile] = useState(null);
  const [imgSignedReq, setImgSignedReq] = useState(null);
  const [imgPreview, setImgPreview] = useState("");
  const [imgS3Url, setImgS3Url] = useState(null);
  const [showImgFileError, setShowImgFileError] = useState(false);

  const [createPaintingLoading, setCreatePaintingLoading] = useState(false);

  const { onFieldChange, onSubmit, values } = useForm(addPainting, {
    title: "",
    description: "",
    isPublic: false,
  });

  function updatePublicPaintingsQueryCache(proxy, newPainting) {
    const data = proxy.readQuery({
      query: QUERY_PUBLIC_PAINTINGS,
      variables: {
        searchQuery: props.searchQuery,
        username: props.username,
      },
    });

    proxy.writeQuery({
      query: QUERY_PUBLIC_PAINTINGS,
      variables: {
        searchQuery: props.searchQuery,
        username: props.username,
      },
      data: {
        queryPublicPaintings: {
          edges: [newPainting, ...data.queryPublicPaintings.edges],
          pageInfo: {
            endCursor: data.queryPublicPaintings.pageInfo.endCursor,
            hasNextPage: data.queryPublicPaintings.pageInfo.hasNextPage,
          },
        },
      },
    });
  }

  function updatePaintingsQueryCache(proxy, newPainting) {
    const data = proxy.readQuery({
      query: QUERY_PAINTINGS,
      variables: {
        searchQuery: props.searchQuery,
        username: props.username,
      },
    });

    proxy.writeQuery({
      query: QUERY_PAINTINGS,
      variables: {
        searchQuery: props.searchQuery,
        username: props.username,
      },
      data: {
        queryPaintings: {
          edges: [newPainting, ...data.queryPaintings.edges],
          pageInfo: {
            endCursor: data.queryPaintings.pageInfo.endCursor,
            hasNextPage: data.queryPaintings.pageInfo.hasNextPage,
          },
        },
      },
    });
  }

  const [createPainting, { error, loading, data }] = useMutation(CREATE_PAINTING_MUTATION, {
    variables: {
      paintingInput: {
        title: values.title,
        description: values.description,
        imageUrl: imgS3Url,
        isPublic: values.isPublic,
      },
    },
    update: (proxy, res) => {
      const newPainting = {
        __typename: "PaintingEdge",
        node: res.data.createPainting,
      };

      if (props.isPublic) {
        updatePublicPaintingsQueryCache(proxy, newPainting);
      } else {
        updatePaintingsQueryCache(proxy, newPainting);
      }

      values.title = "";
      values.description = "";
      values.isPublic = false;
    },
    onError: (err) => {
      console.log("Failed to create painting: ", err.graphQLErrors[0]);
    },
  });

  async function addPainting() {
    try {
      if (imgFile !== null) {
        setCreatePaintingLoading(true);
        await uploadToS3(imgFile, imgSignedReq);
        createPainting();
        setCreatePaintingLoading(false);
        document.body.style.overflow = "";
        props.setModalIsOpen(false);
      } else {
        setShowImgFileError(true);
        return;
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-cardBg mt-32 md:mt-20 rounded-lg p-4 mx-auto w-full md:w-screen max-w-lg md:max-w-2xl"
    >
      <div className="flex justify-between items-center border-b border-gray-700">
        <h1 className="text-gray-50 font-bold tracking-wide py-2">Add Painting</h1>
        <button
          aria-label="close popup"
          onClick={() => {
            document.body.style.overflow = "";
            props.setModalIsOpen(false);
          }}
        >
          <svg
            className="fill-current h-6 w-6 text-gray-500 rounded-full bg-red-600 bg-opacity-50 shadow-sm hover:text-gray-300 hover:bg-opacity-100 transition duration-300 ease-in-out cursor-pointer"
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
          placeholder="ex. Sky Blue"
          name="title"
          className="bg-gray-700 pl-2 mt-1 text-sm border w-full border-gray-800 bg-opacity-25 rounded-md h-8 text-gray-400 placeholder-gray-500 focus:outline-none focus:shadow-outline"
          type="text"
          required
        />

        <div className="mt-3">
          <label
            className="text-gray-300 text-sm sm:text-base font-semibold tracking-wider"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            value={values.description}
            onChange={onFieldChange}
            placeholder="ex. Great things comes to those that wait."
            name="description"
            rows="10"
            cols="2"
            id="description"
            maxLength="250"
            className="bg-gray-700 h-20 px-2 mt-1 text-sm border resize-none w-full border-gray-800 bg-opacity-25 rounded-md text-gray-400 placeholder-gray-500 focus:outline-none focus:shadow-outline"
            type="text"
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
        {showImgFileError && imgFile === null && (
          <p className="italic text-red-600 text-sm mt-1">Image file is required</p>
        )}
      </div>

      <div className="mt-3">
        <label
          className="text-gray-300 text-sm sm:text-base font-semibold tracking-wider"
          htmlFor="paintingpreview"
        >
          Preview
        </label>
        <div
          id="paintingpreview"
          className=" relative bg-cardBg text-center content-center my-3 rounded-lg hover:bg-black hover:bg-opacity-50 px-2 py-2 mr-2 shadow-md transition duration-300 ease-in-out"
        >
          <img
            className=" mt-3 inline-block h-80 rounded-md object-center object-cover cursor-pointer shadow-lg"
            src={imgPreview}
            alt="Painting image"
          />
          <div className="relative">
            <h1 className="text-gray-400 text-xs sm:text-sm font-bold mt-2 cursor-pointer hover:underline w-40 mx-auto truncate">
              {values.title}
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm font-thin cursor-pointer hover:underline w-40 mx-auto truncate">
              {values.description}
            </p>
          </div>

          <button
            aria-label="more image options preview button"
            className="absolute top-0 right-0 mt-5 mr-3 lg:mr-1 text-gray-500 text-xs cursor-pointer"
          >
            <svg
              className="fill-current text-gray-500 h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
        </div>
      </div>

      {createPaintingLoading ? (
        <>
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
          <p className="text-gray-600 text-center italic">Creating painting...</p>
        </>
      ) : (
        <div className="flex justify-end items-baseline mt-2">
          <button
            type="submit"
            className="text-gray-50 shadow-md font-bold rounded-md text-sm px-2 py-1 md:text-base bg-black"
          >
            Add Painting +
          </button>
        </div>
      )}
    </form>
  );
}

const CREATE_PAINTING_MUTATION = gql`
  mutation createPainting($paintingInput: PaintingInput!) {
    createPainting(paintingInput: $paintingInput) {
      id
      createdAt
      cursor
      title
      username
      description
      imageUrl
      isPublic
      likes {
        username
        id
      }
      likeCount
    }
  }
`;

export default AddPaintingModal;
