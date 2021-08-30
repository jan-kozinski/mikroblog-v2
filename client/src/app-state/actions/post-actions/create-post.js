import axios from "axios";
import { postsEndpoint } from "../../../constants/api-endpoints";
import { POST_ADDED, ADD_POST_FAIL } from "../types";

export const createPost = (content) => async (dispatch) => {
  try {
    const response = await axios.post(postsEndpoint, { content });
    const { payload } = response.data;
    dispatch({
      type: POST_ADDED,
      payload,
    });
  } catch (error) {
    const internalServerError =
      !error.response || !error.response.data || !error.response.data.error;
    dispatch({
      type: ADD_POST_FAIL,
      payload: {
        message: internalServerError
          ? "Something went wrong..."
          : error.response.data.error,
      },
    });
  }
};
