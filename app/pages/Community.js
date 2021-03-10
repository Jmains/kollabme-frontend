import React, { useEffect, useRef } from "react";
// Apollo Client
import { useQuery } from "@apollo/client";
// GQL
import { QUERY_POSTS } from "../utils/graphql";
// Context
import { AuthContext, useAuthState } from "../context/auth";
// Components
import Page from "../components/Shared/Page";
import ArtistSuggestionCard from "../components/Shared/ArtistSuggestionCard";
import SearchBar from "../components/Search/UserSearchBar";
import TrendingPostCard from "../components/Shared/TrendingPostCard";
import PostForm from "../components/Forms/PostForm";
import PostCard from "../components/Shared/PostCard";
import LoadingSpinner from "../components/Shared/LoadingSpinner";
// Utils
import { Waypoint } from "react-waypoint";

function Community() {
  let posts = [];
  let endCursor = "";
  let hasNextPage = false;
  const { user } = useAuthState();
  const titleRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  const { loading, error, data, fetchMore, networkStatus } = useQuery(QUERY_POSTS, {
    variables: { searchQuery: null },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    onError: (err) => {
      console.log(err);
    },
  });

  if (error) return <p className="text-white">{error.message}</p>;

  if (data) {
    posts = data.queryPosts.edges;
    endCursor = data.queryPosts.pageInfo.endCursor;
    hasNextPage = data.queryPosts.pageInfo.hasNextPage;
  }

  return (
    <Page title="Community">
      {/* <div className="fixed ml-10 top-0 left-0 ">
            <h1 className=" hidden xl:block font-bold lg:text-lg tracking-wide text-teal-400">
              Trending Posts
            </h1>
            <TrendingPostCard />
          </div> */}

      {/* Post form and posts card container */}
      <div className="mt-10">
        <div>
          <div
            ref={titleRef}
            tabIndex="0"
            className="mx-auto max-w-lg sm:max-w-xl focus:outline-none"
          >
            <SearchBar />
          </div>
          <div id="postform" className="mx-auto max-w-lg sm:max-w-xl">
            {user && <PostForm user={user} />}
          </div>
          <div>
            {posts &&
              posts.map((post, i) => (
                <div key={post.node.id} className="mx-auto max-w-lg sm:max-w-xl">
                  <PostCard post={post.node} />
                  {/* TODO: Lazily load cards */}
                  {/* When scrolling down do infinity scroll */}
                  {hasNextPage && i === posts.length - 5 && (
                    <Waypoint
                      onEnter={() => {
                        fetchMore({
                          variables: { after: endCursor, searchQuery: null },
                        });
                      }}
                    />
                  )}
                  {/* End scrolling down infinity scroll */}
                </div>
              ))}
          </div>
          <div className="flex justify-center">
            {networkStatus === 3 && <LoadingSpinner />}
          </div>
        </div>
        {/* End post form and posts card container */}

        {/* Artist in your genre suggestions card */}
        <div className="fixed w-1/4 max-w-sm top-0 right-0 mr-10">
          <div className="mt-20 hidden xl:block">
            <h3 className="ml-3 mt-2 lg:text-lg md:text-sm text-teal-400 font-bold tracking-wide">
              Artists In Your Area (Coming soon...)
            </h3>
            {/* Test data */}
            <ArtistSuggestionCard
              firstName="Elton"
              lastName="J."
              genre="Rock"
              profilePic="https://images.unsplash.com/photo-1580635154775-fc15cb6e0595?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"
            />
            <ArtistSuggestionCard
              firstName="Jermaine"
              lastName="C."
              genre="Rap"
              profilePic="https://images.unsplash.com/photo-1578880711834-5cb67ff7bde3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80"
            />
            <ArtistSuggestionCard
              firstName="Kendrick"
              lastName="L."
              genre="Rap"
              profilePic="https://images.unsplash.com/photo-1509847950535-14e861e5191b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=938&q=80"
            />
            <ArtistSuggestionCard
              firstName="Billie"
              lastName="E."
              genre="Pop"
              profilePic="https://images.unsplash.com/photo-1462804993656-fac4ff489837?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
            />
            <ArtistSuggestionCard
              firstName="Drake"
              lastName=""
              genre="Rap"
              profilePic="https://images.unsplash.com/photo-1534205643743-6737932c79ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80"
            />
          </div>
        </div>
      </div>
    </Page>
  );
}

export default Community;
