import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../app-state/actions/post-actions";
import LoadingPosts from "../LoadingPosts";
import ListPosts from "../ListPosts";
import AddPost from "../AddPost";
import InfiniteScroll from "react-infinite-scroll-component";

const Wall = () => {
  const posts = useSelector((state) => state.posts).posts;
  const lastPostReached = useSelector((state) => state.posts).lastPostReached;
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const error = useSelector((state) => state.posts.error);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (error && error.origin === "FETCHING") {
    return <>{error.message}</>;
  }
  return (
    <>
      {!posts.length && <LoadingPosts />}
      <InfiniteScroll
        dataLength={posts.length}
        next={() => dispatch(fetchPosts())}
        hasMore={!lastPostReached}
        loader={<LoadingPosts />}
        endMessage={<p>You have reached the bottom.</p>}
      >
        {isAuthenticated && <AddPost />}
        <ListPosts posts={posts} />
      </InfiniteScroll>
    </>
  );
};
export default Wall;
