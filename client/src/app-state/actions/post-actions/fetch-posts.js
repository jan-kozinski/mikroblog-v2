import axios from "axios";
import { returnErrors } from "../error-actions";
import { postsEndpoint } from "../../../constants/api-endpoints";
import { GET_POSTS, POSTS_LOADING } from "../types";

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
    dispatch(returnErrors(error.response.data, error.response.status));
    dispatch({
      type: GET_POSTS,
      payload: [],
    });
  }
};
