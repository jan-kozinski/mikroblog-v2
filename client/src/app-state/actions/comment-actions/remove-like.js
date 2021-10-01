import useApi from "../../../hooks/useApi";
import { commentsEndpoint } from "../../../constants/api-endpoints";
import { COMM_UNLIKED, COMM_LIKE_ERROR } from "../types";
import dispatchError from "../dispatch-error";

export const removeLikeFromComm = (commentId) => async (dispatch, getState) => {
  try {
    const apiClient = useApi({ dispatch, getState });
    const response = await apiClient.delete(
      `${commentsEndpoint}/${commentId}/likes`
    );
    const { payload } = response.data;
    dispatch({ type: COMM_UNLIKED, commentId, payload });
  } catch (error) {
    dispatchError(error, COMM_LIKE_ERROR, dispatch, { commentId });
  }
};
