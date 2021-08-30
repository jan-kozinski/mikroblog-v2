import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../app-state/actions/post-actions";
import LoadingPosts from "../LoadingPosts";
import ListPosts from "../ListPosts";
import AddPost from "../AddPost";

const Wall = (props) => {
  const isLoading = useSelector((state) => state.posts.loading);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const error = useSelector((state) => state.posts.error);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(fetchPosts());
    })();
  }, []);
  if (error && error.origin === "FETCHING") {
    return <>{error.message}</>;
  }
  return (
    <>
      {isLoading ? (
        <LoadingPosts />
      ) : (
        <>
          {isAuthenticated && <AddPost />}
          <ListPosts />{" "}
        </>
      )}
    </>
  );
};
export default Wall;
