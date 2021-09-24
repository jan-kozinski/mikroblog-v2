import useApi from "../../../hooks/useApi";
import { commentsEndpoint } from "../../../constants/api-endpoints";
import { COMM_FETCH_ERROR, GET_COMMENTS } from "../types";
import dispatchError from "../dispatch-error";

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
    dispatchError(error, COMM_FETCH_ERROR, dispatch, {
      postId: originalPostId,
    });
  }
};
