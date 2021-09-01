import axios from "axios";
import { postsEndpoint } from "../../../constants/api-endpoints";
import {
  POST_LIKED,
  POST_LIKE_ERROR,
  POST_UNLIKED,
  POST_UNLIKE_ERROR,
} from "../types";

export const likePost = (postId) => async (dispatch) => {
  try {
    const response = await axios.post(`${postsEndpoint}/${postId}/likes`);

    const { payload } = response.data;
    dispatch({
      type: POST_LIKED,
      payload: {
        postId,
        ...payload,
      },
    });
  } catch (error) {
    const internalServerError =
      !error.response || !error.response.data || !error.response.data.error;
    dispatch({
      type: POST_LIKE_ERROR,
      payload: {
        postId,
        message: internalServerError
          ? "Something went wrong..."
          : error.response.data.error,
      },
    });
  }
};

export const unlikePost = (postId) => async (dispatch) => {
  try {
    const response = await axios.delete(`${postsEndpoint}/${postId}/likes`);

    const { payload } = response.data;
    dispatch({
      type: POST_UNLIKED,
      payload: {
        postId,
        ...payload,
      },
    });
  } catch (error) {
    const internalServerError =
      !error.response || !error.response.data || !error.response.data.error;
    dispatch({
      type: POST_UNLIKE_ERROR,
      payload: {
        postId,
        message: internalServerError
          ? "Something went wrong..."
          : error.response.data.error,
      },
    });
  }
};
