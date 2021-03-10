import { gql } from "@apollo/client";

export const QUERY_USERS = gql`
  query($searchQuery: String, $first: Int, $after: String) {
    getPaginatedUsers(searchQuery: $searchQuery, first: $first, after: $after) {
      edges {
        node {
          id
          username
          mainPlatforms
          profilePic
          displayName
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export const QUERY_POSTS = gql`
  query($username: String, $searchQuery: String, $first: Int, $after: String) {
    queryPosts(username: $username, searchQuery: $searchQuery, first: $first, after: $after) {
      edges {
        node {
          id
          body
          createdAt
          username
          likeCount
          videoUrl
          imageUrl
          audioUrl
          author {
            profilePic
            username
            mainPlatforms
            displayName
          }
          likes {
            id
            username
          }
          commentCount
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_USER_NOTIFICATIONS = gql`
  query getUserNotifications($userId: ID, $searchQuery: String, $first: Int, $after: String) {
    queryNotifications(
      userId: $userId
      searchQuery: $searchQuery
      first: $first
      after: $after
    ) {
      edges {
        node {
          id
          createdAt
          message

          sender {
            id
            username
            profilePic
          }
          recipient {
            id
            username
          }
          postId
          isRead
          type
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export const QUERY_TRACKS = gql`
  query queryTracks($username: String, $searchQuery: String, $first: Int, $after: String) {
    queryTracks(username: $username, searchQuery: $searchQuery, first: $first, after: $after) {
      edges {
        node {
          id
          title
          username
          author {
            displayName
            id
          }
          artistName
          audioUrl
          imageUrl
          isPublic
          createdAt
          likes {
            id
            username
          }
          likeCount
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const QUERY_PUBLIC_TRACKS = gql`
  query queryPublicTracks(
    $username: String
    $searchQuery: String
    $first: Int
    $after: String
  ) {
    queryPublicTracks(
      username: $username
      searchQuery: $searchQuery
      first: $first
      after: $after
    ) {
      edges {
        node {
          id
          title
          username
          author {
            displayName
            id
          }
          artistName
          audioUrl
          imageUrl
          isPublic
          createdAt
          likes {
            id
            username
          }
          likeCount
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const QUERY_ALBUMS = gql`
  query queryAlbums($username: String, $searchQuery: String, $first: Int, $after: String) {
    queryAlbums(username: $username, searchQuery: $searchQuery, first: $first, after: $after) {
      edges {
        node {
          id
          title
          coverImageUrl
          username
          author {
            displayName
            id
          }
          isPublic
          likes {
            id
            username
          }
          likeCount
          tracks {
            id
            title
            username
            artistName
            audioUrl
            imageUrl
            isPublic
            createdAt
            likes {
              id
              username
            }
            likeCount
          }
          cursor
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const QUERY_PUBLIC_ALBUMS = gql`
  query queryPublicAlbums(
    $username: String
    $searchQuery: String
    $first: Int
    $after: String
  ) {
    queryPublicAlbums(
      username: $username
      searchQuery: $searchQuery
      first: $first
      after: $after
    ) {
      edges {
        node {
          id
          isPublic
          title
          username
          coverImageUrl
          author {
            displayName
            id
          }
          likes {
            id
            username
          }
          likeCount
          tracks {
            id
            title
            username
            artistName
            audioUrl
            imageUrl
            isPublic
            createdAt
            likes {
              id
              username
            }
            likeCount
          }
          cursor
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const QUERY_PAINTINGS = gql`
  query queryPaintings($username: String, $searchQuery: String, $first: Int, $after: String) {
    queryPaintings(
      username: $username
      searchQuery: $searchQuery
      first: $first
      after: $after
    ) {
      edges {
        node {
          id
          author {
            displayName
            id
          }
          username
          title
          description
          imageUrl
          isPublic
          likes {
            id
            username
          }
          likeCount
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const QUERY_PUBLIC_PAINTINGS = gql`
  query queryPublicPaintings(
    $username: String
    $searchQuery: String
    $first: Int
    $after: String
  ) {
    queryPublicPaintings(
      username: $username
      searchQuery: $searchQuery
      first: $first
      after: $after
    ) {
      edges {
        node {
          id
          title
          author {
            displayName
            id
          }
          username
          description
          imageUrl
          isPublic
          likes {
            id
            username
          }
          likeCount
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const QUERY_VIDEOS = gql`
  query queryVideos($username: String, $searchQuery: String, $first: Int, $after: String) {
    queryVideos(username: $username, searchQuery: $searchQuery, first: $first, after: $after) {
      edges {
        node {
          id
          title
          author {
            displayName
            id
          }
          username
          description
          videoUrl
          isPublic
          likes {
            id
            username
          }
          likeCount
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const QUERY_PUBLIC_VIDEOS = gql`
  query queryPublicVideos(
    $username: String
    $searchQuery: String
    $first: Int
    $after: String
  ) {
    queryPublicVideos(
      username: $username
      searchQuery: $searchQuery
      first: $first
      after: $after
    ) {
      edges {
        node {
          id
          title
          author {
            displayName
            id
          }
          username
          description
          videoUrl
          isPublic
          likes {
            id
            username
          }
          likeCount
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const QUERY_COMMENTS = gql`
  query queryComments($postId: ID, $searchQuery: String, $first: Int, $after: String) {
    queryComments(postId: $postId, searchQuery: $searchQuery, first: $first, after: $after) {
      edges {
        node {
          id
          body
          replyCount
          username
          postId
          author {
            id
            username
            mainPlatforms
            profilePic
            displayName
          }
          createdAt
          likeCount
          likes {
            id
            username
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const QUERY_COMMENT_REPLIES = gql`
  query queryCommentReplies(
    $commentId: ID
    $searchQuery: String
    $first: Int
    $after: String
  ) {
    queryCommentReplies(
      commentId: $commentId
      searchQuery: $searchQuery
      first: $first
      after: $after
    ) {
      edges {
        node {
          id
          body
          commentId
          username
          author {
            id
            username
            mainPlatforms
            profilePic
            displayName
          }
          createdAt
          likeCount
          likes {
            id
            username
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const CREATE_COMMENT_REPLY_MUTATION = gql`
  mutation createCommentReply($commentId: ID!, $body: String!) {
    createCommentReply(commentId: $commentId, body: $body) {
      id
      commentId
      body
      username
      createdAt
      cursor
      author {
        id
        username
        profilePic
        mainPlatforms
        displayName
      }

      likes {
        id
        username
      }
      likeCount
    }
  }
`;
