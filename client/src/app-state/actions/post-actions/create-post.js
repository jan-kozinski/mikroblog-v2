import useApi from "../../../hooks/useApi";
import { postsEndpoint } from "../../../constants/api-endpoints";
import { POST_ADDED, ADD_POST_FAIL } from "../types";

export const createPost = (content) => async (dispatch, getState) => {
  try {
    const apiClient = useApi({ dispatch, getState });
    const response = await apiClient.post(postsEndpoint, { content });
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
