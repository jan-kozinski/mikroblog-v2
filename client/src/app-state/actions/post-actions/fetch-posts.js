import useApi from "../../../hooks/useApi";
import { postsEndpoint } from "../../../constants/api-endpoints";
import {
  FETCHING_ERROR,
  GET_POSTS,
  POSTS_LOADING,
  LAST_POST_REACHED,
} from "../types";

export const fetchPosts = () => async (dispatch, getState) => {
  dispatch({
    type: POSTS_LOADING,
  });
  try {
    const apiClient = useApi({ dispatch, getState });

    const fetchedPosts = getState().posts.posts;
    const lastPost = fetchedPosts
      ? fetchedPosts[fetchedPosts.length - 1]
      : null;
    const limit = 7;
    const response = await apiClient.get(
      `${postsEndpoint}?sortby=newest&limit=${limit}${
        lastPost ? "&before=" + lastPost.createdAt : ""
      }`
    );

    const { payload } = response.data;
    if (payload.length < limit)
      dispatch({
        type: LAST_POST_REACHED,
      });
    dispatch({
      type: GET_POSTS,
      payload,
    });
  } catch (error) {
    const internalServerError =
      !error.response || !error.response.data || !error.response.data.error;
    dispatch({
      type: FETCHING_ERROR,
      payload: {
        message: internalServerError
          ? "Something went wrong..."
          : error.response.data.error,
      },
    });
  }
};
