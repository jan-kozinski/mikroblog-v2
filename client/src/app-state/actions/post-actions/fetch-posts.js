import useApi from "../../../hooks/useApi";
import { postsEndpoint } from "../../../constants/api-endpoints";
import {
  FETCHING_ERROR,
  GET_POSTS,
  POSTS_LOADING,
  LAST_POST_REACHED,
} from "../types";
import dispatchError from "../dispatch-error";

export const fetchPosts =
  ({ sortBy = "newest", limit = "7" } = {}) =>
  async (dispatch, getState) => {
    dispatch({
      type: POSTS_LOADING,
    });
    try {
      const apiClient = useApi({ dispatch, getState });

      const fetchedPosts = getState().posts.posts;

      let query = `sortby=${sortBy}&limit=${limit}`;

      if (sortBy === "newest" && fetchedPosts.length > 0) {
        const lastPost = fetchedPosts[fetchedPosts.length - 1];
        query += `&before=${lastPost.createdAt}`;
      } else query += `&skip=${fetchedPosts.length}`;

      const response = await apiClient.get(`${postsEndpoint}?${query}`);

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
