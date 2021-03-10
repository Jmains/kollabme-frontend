import React, { useEffect } from "react";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { NavLink } from "react-router-dom";
import { Waypoint } from "react-waypoint";
import { useLazyQuery } from "@apollo/client";
import { ProfileStatsDetailTypes } from "../../constants/ProfileStatsDetailTypes";

function LikesDetailModal({ setModalIsOpen, query, type, contentId }) {
  let users = [];
  let endCursor = "";
  let hasNextPage = false;

  const [getLikes, { loading, data, fetchMore }] = useLazyQuery(query, {
    fetchPolicy: "network-only",
    onError: (err) => {
      console.log("Failed to get likes Info: ", err);
    },
  });

  // if (type === ProfileStatsDetailTypes.POST_LIKES) {
  //   getLikes({ variables: { postId: contentId } });
  // users = data.queryPostLikes.edges;
  // endCursor = data.queryPostLikes.pageInfo.endCursor;
  // hasNextPage = data.queryPostLikes.pageInfo.hasNextPage;
  // }
  // else if (type === ProfileStatsDetailTypes.COMMENT_LIKES) {
  //   getLikes({ variables: { commentId: contentId } });
  // } else if (type === ProfileStatsDetailTypes.COMMENT_REPLY_LIKES) {
  //   getLikes({ variables: { commentReplyId: contentId } });
  // } else if (type === ProfileStatsDetailTypes.TRACK_LIKES) {
  //   getLikes({ variables: { trackId: contentId } });
  // } else if (type === ProfileStatsDetailTypes.PAINTING_LIKES) {
  //   getLikes({ variables: { paintingId: contentId } });
  // } else if (type === ProfileStatsDetailTypes.ALBUM_LIKES) {
  //   getLikes({ variables: { albumId: contentId } });
  // } else if (type === ProfileStatsDetailTypes.VIDEO_LIKES) {
  //   getLikes({ variables: { videoId: contentId } });
  // }

  // if (data && type === ProfileStatsDetailTypes.POST_LIKES) {

  // } else if (data && type === ProfileStatsDetailTypes.COMMENT_LIKES) {
  //   users = data.queryCommentLikes.edges;
  //   endCursor = data.queryCommentLikes.pageInfo.endCursor;
  //   hasNextPage = data.queryCommentLikes.pageInfo.hasNextPage;
  // } else if (data && type === ProfileStatsDetailTypes.COMMENT_REPLY_LIKES) {
  //   users = data.queryCommentReplyLikes.edges;
  //   endCursor = data.queryCommentReplyLikes.pageInfo.endCursor;
  //   hasNextPage = data.queryCommentReplyLikes.pageInfo.hasNextPage;
  // } else if (data && type === ProfileStatsDetailTypes.TRACK_LIKES) {
  //   users = data.queryTrackLikes.edges;
  //   endCursor = data.queryTrackLikes.pageInfo.endCursor;
  //   hasNextPage = data.queryTrackLikes.pageInfo.hasNextPage;
  // } else if (data && type === ProfileStatsDetailTypes.PAINTING_LIKES) {
  //   users = data.queryPaintingLikes.edges;
  //   endCursor = data.queryPaintingLikes.pageInfo.endCursor;
  //   hasNextPage = data.queryPaintingLikes.pageInfo.hasNextPage;
  // } else if (data && type === ProfileStatsDetailTypes.ALBUM_LIKES) {
  //   users = data.queryAlbumLikes.edges;
  //   endCursor = data.queryAlbumLikes.pageInfo.endCursor;
  //   hasNextPage = data.queryAlbumLikes.pageInfo.hasNextPage;
  // } else if (data && type === ProfileStatsDetailTypes.VIDEO_LIKES) {
  //   users = data.queryVideoLikes.edges;
  //   endCursor = data.queryVideoLikes.pageInfo.endCursor;
  //   hasNextPage = data.queryVideoLikes.pageInfo.hasNextPage;
  // }

  return (
    <>
      {loading ? (
        <div className="flex justify-center mx-auto">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="bg-cardBg rounded-lg w-screen max-w-sm p-2">
          <h1 className="text-teal-400 text-xl font-bold tracking-wide m-2">Likes</h1>
          <div className=" w-full overflow-y-auto overflow-x-hidden h-64 rounded-lg">
            {data && users.length === 0 && (
              <h1 className="text-gray-500 text-center w-64 text-sm mt-24">
                You currently have no likes...
              </h1>
            )}
            {data &&
              users &&
              users.map((user, i) => {
                return (
                  <NavLink
                    to={`/${user.node.username}`}
                    key={user.node.id}
                    onClick={() => {
                      setModalIsOpen(false);
                    }}
                    className="w-full flex items-center bg-gray-800 bg-opacity-25 py-1 px-2 shadow-md border-t border-gray-700 cursor-pointer hover:bg-black hover:bg-opacity-75 transition duration-300 ease-in-out"
                  >
                    <img
                      className="m-2 rounded-full h-12 w-12 object-cover object-center cursor-pointer"
                      src={user.node.author.profilePic}
                      alt="Profile picture"
                    />
                    <div className="ml-1">
                      <h2 className="text-gray-400 font-semibold w-64 text-sm truncate">
                        {capitalizeFirstLetter(user.node.username)}
                      </h2>
                      <div className="flex pr-2">
                        {user.node.author.mainPlatforms &&
                          user.node.author.mainPlatforms.map((mp, i) => {
                            if (i === 2) {
                              return (
                                <p key={i} className="text-gray-600 font-normal text-xs">
                                  {`${mp}`}
                                </p>
                              );
                            } else {
                              return (
                                <p key={i} className="text-gray-600 font-normal text-xs">
                                  {`${mp},\u00A0`}
                                </p>
                              );
                            }
                          })}
                      </div>
                    </div>

                    {hasNextPage && i === users.length - 2 && (
                      <Waypoint
                        onEnter={() => {
                          fetchMore({
                            variables: { after: endCursor },
                          });
                        }}
                      />
                    )}
                  </NavLink>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
}

export default LikesDetailModal;
