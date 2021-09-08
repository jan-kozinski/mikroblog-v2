import useApi from "../../../hooks/useApi";
import { postsEndpoint } from "../../../constants/api-endpoints";
import { POST_UNLIKED, POST_UNLIKE_ERROR } from "../types";

export const removeLike = (postId) => async (dispatch, getState) => {
  try {
    const apiClient = useApi({ dispatch, getState });

    const response = await apiClient.delete(`${postsEndpoint}/${postId}/likes`);

    const { payload } = response.data;
    dispatch({
      type: POST_UNLIKED,
      payload: {
        postId,
        ...payload,
      },
    });
  } catch (error) {
    console.error(error);
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
