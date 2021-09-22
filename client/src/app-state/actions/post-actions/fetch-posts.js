import useApi from "../../../hooks/useApi";
import { postsEndpoint } from "../../../constants/api-endpoints";
import {
  FETCHING_ERROR,
  GET_POSTS,
  POSTS_LOADING,
  LAST_POST_REACHED,
} from "../types";
import dispatchError from "../dispatch-error";

export const fetchPosts = () => async (dispatch, getState) => {
  dispatch({
    type: POSTS_LOADING,
  });
  try {
    const apiClient = useApi({ dispatch, getState });

    const fetchedPosts = getState().posts.posts;
    const limit = 7;
    const sortBy = "newest";
    const response = await apiClient.get(
      `${postsEndpoint}?sortby=${sortBy}&limit=${limit}&skip=${fetchedPosts.length}`
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
    dispatchError(error, FETCHING_ERROR, dispatch);
  }
};
