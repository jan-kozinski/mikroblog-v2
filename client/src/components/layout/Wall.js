import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../app-state/actions/post-actions";
import LoadingPosts from "../LoadingPosts";
import ListPosts from "../ListPosts";
import Wrapper from "./Wrapper";

const Wall = (props) => {
  const isLoading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(fetchPosts());
    })();
  }, []);
  if (error) {
    console.log(error);
    return <Wrapper>{error.message}</Wrapper>;
  }
  return <Wrapper>{isLoading ? <LoadingPosts /> : <ListPosts />}</Wrapper>;
};
export default Wall;
