import React, { useRef, useState, useEffect } from "react";
import { useForm } from "../../utils/hooks";
import { useMutation, gql, useLazyQuery } from "@apollo/client";
import { NavLink } from "react-router-dom";
import {
  QUERY_COMMENTS,
  QUERY_COMMENT_REPLIES,
  CREATE_COMMENT_REPLY_MUTATION,
} from "../../utils/graphql";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";

const loadingSpinner = (
  <div className="lds-ripple">
    <div></div>
    <div></div>
  </div>
);

function CommentForm({ postId, commentId, setReplyToComment, setShowReplies, user }) {
  let userData = null;
  const { onFieldChange, onSubmit, values } = useForm(submitComment, {
    commentBody: "",
  });

  const [postingSpinner, setPostingSpinner] = useState(null);

  function updateCommentReplyQueryCache(proxy, newCommentReply) {
    const data = proxy.readQuery({
      query: QUERY_COMMENT_REPLIES,
      variables: { commentId, searchQuery: null },
    });

    proxy.writeQuery({
      query: QUERY_COMMENT_REPLIES,
      variables: { commentId, searchQuery: null },
      data: {
        queryCommentReplies: {
          edges: [newCommentReply, ...data.queryCommentReplies.edges],
          pageInfo: {
            hasNextPage: data.queryCommentReplies.pageInfo.hasNextPage,
            endCursor: data.queryCommentReplies.pageInfo.endCursor,
          },
        },
      },
    });
  }

  const [createReply] = useMutation(CREATE_COMMENT_REPLY_MUTATION, {
    update: async (proxy, res) => {
      const newCommentReply = {
        __typename: "CommentReplyEdge",
        node: res.data.createCommentReply,
        cursor: res.data.createCommentReply.cursor,
      };
      updateCommentReplyQueryCache(proxy, newCommentReply);
      setShowReplies(true);

      values.commentBody = "";
    },
  });

  const [getUserInfo, { data: userInfo, loading: userLoading }] = useLazyQuery(GET_USER, {
    onError: (err) => {
      console.log("Failed to get user: ", err);
    },
  });

  useEffect(() => {
    if (user) {
      getUserInfo({
        variables: { username: user.username },
      });
    }
  }, []);

  if (userInfo) {
    userData = userInfo.getUser;
  }

  const [postComment, { error, loading }] = useMutation(CREATE_COMMENT_MUTATION, {
    update: async (proxy, res) => {
      const newComment = {
        __typename: "CommentEdge",
        node: res.data.createComment,
        cursor: res.data.createComment.cursor,
      };
      const data = proxy.readQuery({
        query: QUERY_COMMENTS,
        variables: { postId: postId, searchQuery: null },
      });

      proxy.writeQuery({
        query: QUERY_COMMENTS,
        variables: { postId: postId, searchQuery: null },
        data: {
          queryComments: {
            edges: [newComment, ...data.queryComments.edges],
            pageInfo: {
              hasNextPage: data.queryComments.pageInfo.hasNextPage,
              endCursor: data.queryComments.pageInfo.endCursor,
            },
          },
        },
      });
      values.commentBody = "";
    },
    onError: (e) => {
      console.log(e);
    },
    variables: { postId, body: values.commentBody },
  });

  async function submitComment() {
    try {
      if (commentId) {
        setPostingSpinner(true);
        await createReply({
          variables: { commentId, body: values.commentBody },
        });
        setPostingSpinner(false);
      } else {
        setPostingSpinner(true);
        await postComment();
        setPostingSpinner(false);
      }
      setReplyToComment(false);
    } catch (error) {
      setPostingSpinner(false);

      console.log(error);
    }
  }

  return (
    <div>
      <div className="flex relative my-2 py-1 px-1 border-b border-gray-700 transition ease-out duration-300">
        {/* Post items container */}
        <div className="flex w-full py-1 mx-auto">
          {userData && (
            <NavLink className="h-10 focus:outline-none" to="">
              <img
                className="shadow-sm cursor-pointer md:w-12 md:h-12 h-10 w-10 rounded-full object-cover object-center mr-4 "
                src={userData.profilePic}
                alt="avatar"
              />
            </NavLink>
          )}
          {/* Card data container */}
          <div className="w-full pr-2">
            <div className="flex w-full sm:flex-end items-baseline justify-between">
              {userData && (
                <NavLink
                  to=""
                  className="text-xs sm:text-sm mb-1 tracking-wide focus:outline-none md:text-md cursor-pointer  font-bold text-teal-400 hover:underline"
                >
                  {userData.displayName
                    ? userData.displayName
                    : capitalizeFirstLetter(userData.username)}
                </NavLink>
              )}
            </div>
            <div className="focus:outline-none mt-1 max-w-full">
              <div className="flex font-semibold text-tiny sm:text-xs">
                {userData && userData.mainPlatforms && userData.mainPlatforms[0] && (
                  <NavLink
                    to=""
                    className="bg-blue-800 bg-opacity-25 whitespace-no-wrap rounded-full shadow-md hover:bg-blue-500 hover:bg-opacity-25 focus:outline-none transition duration-300 ease-out"
                  >
                    <h5 className="text-gray-500 py-1 px-2">#{userData.mainPlatforms[0]}</h5>
                  </NavLink>
                )}
                {userData && userData.mainPlatforms && userData.mainPlatforms[1] && (
                  <NavLink
                    to=""
                    className="ml-2 bg-blue-800 bg-opacity-25 whitespace-no-wrap rounded-full shadow-md hover:bg-blue-500 hover:bg-opacity-25 focus:outline-none transition duration-300 ease-out "
                  >
                    <h5 className="text-gray-500 py-1 px-2 ">#{userData.mainPlatforms[1]}</h5>
                  </NavLink>
                )}
                {userData && userData.mainPlatforms && userData.mainPlatforms[2] && (
                  <NavLink
                    to=""
                    className="ml-2 bg-blue-800 bg-opacity-25 whitespace-no-wrap rounded-full shadow-md hover:bg-blue-500 hover:bg-opacity-25 focus:outline-none transition duration-300 ease-out"
                  >
                    <h5 className="text-gray-500 py-1 px-2">#{userData.mainPlatforms[2]}</h5>
                  </NavLink>
                )}
              </div>
            </div>

            {!postingSpinner ? (
              <form onSubmit={onSubmit} className=" my-1 rounded-md">
                <div className="my-3">
                  {/* Post body container */}
                  <textarea
                    autoFocus
                    name="commentBody"
                    type="text"
                    rows="2"
                    maxLength="900"
                    value={values.commentBody}
                    onChange={onFieldChange}
                    className="text-xs sm:text-sm h-auto border border-gray-700 rounded-md resize-none bg-transparent w-full py-1 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="What do you think?..."
                  ></textarea>
                  {/* End post body container */}
                </div>
                {/* Icons container */}

                <div className="flex justify-end">
                  <button
                    // disabled={values.commentBody.trim() === ""}
                    className="py-1 border-b border-gray-700 tracking-wide text-xs sm:text-sm bg-black bg-opacity-75 shadow-md hover:bg-teal-400 hover:text-gray-900 text-teal-400 font-bold px-4 rounded-md focus:outline-none transition duration-200 ease-out"
                    type="submit"
                  >
                    Comment
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex justify-center">{loadingSpinner}</div>
            )}
            {/* End card data container */}
          </div>
          {/* End Post items container */}
        </div>
        {/* End Post card container */}
      </div>
    </div>
  );
}

const GET_USER = gql`
  query getUser($username: String!) {
    getUser(username: $username) {
      username
      displayName
      id
      mainPlatforms
      profilePic
    }
  }
`;

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      author {
        id
        username
        displayName
        mainPlatforms
        profilePic
      }
      cursor
      body

      createdAt
    }
  }
`;

export default CommentForm;
