import React from "react";
import LoadingSpinner from "../Shared/LoadingSpinner";

const bg = {
  background: "#1c1c1c",
  overflow: "hidden",
};

function ConfirmDeleteModal({ setModalIsOpen, confirmDelete, loading }) {
  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div style={bg} className="h-auto w-full bg-gray-600 rounded-lg text-center p-4">
          <p className="mb-6 text-gray-500 sm:text-lg font-thin tracking-wider">
            Are you sure you want to delete this post?
          </p>
          <div className="my-3 flex justify-center">
            <button
              onClick={() => setModalIsOpen(false)}
              className=" sm:text-lg px-4 py-1 text-gray-900 bg-gray-500 rounded-md hover:text-gray-700 hover:bg-gray-200 shadow-md transition ease-out duration-150"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="sm:text-lg ml-8 px-4 py-1 text-gray-400 bg-red-900 hover:text-white hover:bg-red-600 rounded-md shadow-md transition ease-out duration-150"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ConfirmDeleteModal;
