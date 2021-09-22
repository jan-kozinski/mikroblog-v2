import useApi from "../../../hooks/useApi";
import { commentsEndpoint } from "../../../constants/api-endpoints";
import { COMM_FETCH_ERROR, GET_COMMENTS } from "../types";

export const fetchComments = (originalPostId) => async (dispatch, getState) => {
  try {
    const apiClient = useApi({ dispatch, getState });
    const response = await apiClient.get(
      `${commentsEndpoint}/${originalPostId}?sortby=newest`
    );

    const { payload } = response.data;
    dispatch({
      type: GET_COMMENTS,
      payload: {
        postId: originalPostId,
        comments: payload,
      },
    });
  } catch (error) {
    const internalServerError =
      !error.response || !error.response.data || !error.response.data.error;
    dispatch({
      type: COMM_FETCH_ERROR,
      payload: {
        message: internalServerError
          ? "Something went wrong..."
          : error.response.data.error,
      },
    });
  }
};
