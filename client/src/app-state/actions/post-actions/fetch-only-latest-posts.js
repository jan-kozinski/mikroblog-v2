import useApi from "../../../hooks/useApi";
import { postsEndpoint } from "../../../constants/api-endpoints";
import {
  FETCHING_ERROR,
  POSTS_LOADING,
  GET_POSTS_ADDED_SINCE_LAST_FETCH,
} from "../types";
import dispatchError from "../dispatch-error";

export const fetchOnlyLatestPosts = () => async (dispatch, getState) => {
  dispatch({
    type: POSTS_LOADING,
  });
  try {
    const apiClient = useApi({ dispatch, getState });

    const postsAddedSinceLastFetch = getState().posts.postsAddedSinceLastFetch;
    const firstPost = getState().posts.posts[0];
    const response = await apiClient.get(
      `${postsEndpoint}?sortby=newest&limit=${postsAddedSinceLastFetch}&after=${firstPost.createdAt}`
    );

    const { payload } = response.data;
    dispatch({
      type: GET_POSTS_ADDED_SINCE_LAST_FETCH,
      payload,
    });
  } catch (error) {
    dispatchError(error, FETCHING_ERROR, dispatch);
  }
};
