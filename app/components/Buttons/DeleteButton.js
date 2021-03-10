import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { QUERY_POSTS } from "../../utils/graphql";
import Modal from "react-modal";
import ConfirmDeleteModal from "../Modals/ConfirmDeleteModal";
import { AuthContext } from "../../context/auth";

Modal.setAppElement("#app");

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    background: "rgba(0,0,0,0)",
    border: "none",
  },
  overlay: {
    zIndex: 999,
    overflowY: "scroll",
    background: "rgba(0,0,0,0.65)",
  },
};

function DeleteButton({ postId, commentId, username, callback }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;
  const [deletePostOrCommentMutation, { data, loading, error }] = useMutation(mutation, {
    update: (proxy, res) => {
      // If not deleting a comment

      if (!commentId) {
        // if (username) {
        //   const data = proxy.readQuery({
        //     query: GET_PAGINATED_POSTS_QUERY,
        //     variables: { searchQuery: null, username: username },
        //   });
        //   const filteredPosts = data.queryPosts.edges.filter((p) => p.node.id !== postId);
        //   console.log(filteredPosts);
        //   proxy.writeQuery({
        //     query: GET_PAGINATED_POSTS_QUERY,
        //     variables: { searchQuery: null, username: username },
        //     data: {
        //       queryPosts: {
        //         edges: [...filteredPosts],
        //         pageInfo: {
        //           hasNextPage: data.queryPosts.pageInfo.hasNextPage,
        //           endCursor: data.queryPosts.pageInfo.endCursor,
        //         },
        //       },
        //     },
        //   });
        // }

        // Remove post from cache on home page
        const data = proxy.readQuery({
          query: QUERY_POSTS,
          variables: { searchQuery: null },
        });
        const filteredPosts = data.queryPosts.edges.filter((p) => p.node.id !== postId);
        if (filteredPosts.length === 0) {
          proxy.writeQuery({
            query: QUERY_POSTS,
            variables: { searchQuery: null },
            data: {
              queryPosts: {
                edges: [...filteredPosts],
                pageInfo: {
                  hasNextPage: false,
                  endCursor: "",
                },
              },
            },
          });
        } else {
          proxy.writeQuery({
            query: QUERY_POSTS,
            variables: { searchQuery: null },
            data: {
              queryPosts: {
                edges: [...filteredPosts],
                pageInfo: {
                  hasNextPage: data.queryPosts.pageInfo.hasNextPage,
                  endCursor: data.queryPosts.pageInfo.endCursor,
                },
              },
            },
          });
        }
      }
      if (callback) callback();
    },
    variables: {
      postId,
      commentId,
    },
  });

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={modalStyles}
      >
        <ConfirmDeleteModal
          setModalIsOpen={setModalIsOpen}
          loading={loading}
          confirmDelete={deletePostOrCommentMutation}
        />
      </Modal>

      <svg
        onClick={() => setModalIsOpen(true)}
        className="fill-current text-red-600 hover:text-red-800 h-4 w-4 cursor-pointer"
        viewBox="0 0 20 20"
      >
        <path d="M3.389 7.113L4.49 18.021c.061.461 2.287 1.977 5.51 1.979 3.225-.002 5.451-1.518 5.511-1.979l1.102-10.908C14.929 8.055 12.412 8.5 10 8.5c-2.41 0-4.928-.445-6.611-1.387zm9.779-5.603l-.859-.951C11.977.086 11.617 0 10.916 0H9.085c-.7 0-1.061.086-1.392.559l-.859.951C4.264 1.959 2.4 3.15 2.4 4.029v.17C2.4 5.746 5.803 7 10 7c4.198 0 7.601-1.254 7.601-2.801v-.17c0-.879-1.863-2.07-4.433-2.519zM12.07 4.34L11 3H9L7.932 4.34h-1.7s1.862-2.221 2.111-2.522c.19-.23.384-.318.636-.318h2.043c.253 0 .447.088.637.318.248.301 2.111 2.522 2.111 2.522h-1.7z" />
      </svg>
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;
