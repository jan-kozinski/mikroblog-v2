import axios from "axios";
import { postsEndpoint } from "../../../constants/api-endpoints";
import { POST_LIKED, POST_LIKE_ERROR } from "../types";

export const giveLike = (postId) => async (dispatch) => {
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
