import useApi from "../../../hooks/useApi";
import { commentsEndpoint } from "../../../constants/api-endpoints";
import { COMM_LIKED, COMM_LIKE_ERROR } from "../types";
import dispatchError from "../dispatch-error";

export const likeComment = (commentId) => async (dispatch, getState) => {
  try {
    const apiClient = useApi({ dispatch, getState });
    const response = await apiClient.post(
      `${commentsEndpoint}/${commentId}/likes`
    );

    const { payload } = response.data;
    dispatch({
      type: COMM_LIKED,
      commentId,
      payload: {
        ...payload,
      },
    });
  } catch (error) {
    dispatchError(error, COMM_LIKE_ERROR, dispatch, { commentId });
  }
};
