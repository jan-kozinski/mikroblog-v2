import axios from "axios";
import { returnErrors } from "../error-actions";
import { postsEndpoint } from "../../../constants/api-endpoints";
import { FETCHING_ERROR, GET_POSTS, POSTS_LOADING } from "../types";

export const fetchPosts = () => async (dispatch) => {
  dispatch({
    type: POSTS_LOADING,
  });
  try {
    const response = await axios.get(postsEndpoint);
    const { payload } = response.data;
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
