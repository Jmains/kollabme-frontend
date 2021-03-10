// React imports
import React from "react";
// Context
import { useAuthState } from "../context/auth";
// Apollo
import { useQuery, gql } from "@apollo/client";

// Components
import DeleteButton from "../components/Buttons/DeleteButton";
import PostCard from "../components/Shared/PostCard";
import CommentForm from "../components/Forms/CommentForm";
import CommentCard from "../components/Comment/CommentCard";
import { useParams } from "react-router-dom";
import { QUERY_COMMENTS } from "../utils/graphql";
import Page from "../components/Shared/Page";

function SinglePost() {
  let post = null;
  let comments = [];
  let hasNextPage = false;
  let endCursor = "";
  const { postId, username } = useParams();
  const { user } = useAuthState();

  const { loading: postLoading, error: postErr, data: postData } = useQuery(GET_POST, {
    variables: { postId },
    onError: (err) => {
      console.log(err);
    },
  });

  const { loading: commentLoading, error: commentErr, data: commentData } = useQuery(
    QUERY_COMMENTS,
    {
      variables: { postId: postId, searchQuery: null },
      onError: (err) => {
        console.log(err);
      },
      fetchPolicy: "cache-and-network",
    }
  );

  if (postData) {
    post = postData.getPost;
  }

  if (commentData) {
    comments = commentData.queryComments.edges;
    endCursor = commentData.queryComments.pageInfo.endCursor;
    hasNextPage = commentData.queryComments.pageInfo.hasNextPage;
  }

  return (
    <Page title={`${username}'s post`}>
      <div className="mt-20">
        <div className="mx-auto max-w-xl sm:max-w-2xl lg:max-w-2xl">
          {post ? <PostCard post={post} /> : <h1>Post not found...</h1>}
        </div>
      </div>

      <div className="mx-auto max-w-xl sm:max-w-2xl">
        {user && <CommentForm postId={postId} user={user} />}
      </div>
      {/* End of comment form container */}

      <div className="flex-start mx-auto rounded-lg max-w-xl sm:max-w-2xl lg:max-w-2xl">
        {comments &&
          comments.length > 0 &&
          comments.map((comment) => {
            return (
              <div key={comment.node.id}>
                <CommentCard comment={comment.node} user={user} />
              </div>
            );
          })}
      </div>
      {/* End comments card container */}
    </Page>
  );
}

const GET_POST = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      author {
        id
        username
        mainPlatforms
        profilePic
      }
      likeCount
      videoUrl
      audioUrl
      imageUrl
      likes {
        username
      }
      commentCount
    }
  }
`;

export default SinglePost;
