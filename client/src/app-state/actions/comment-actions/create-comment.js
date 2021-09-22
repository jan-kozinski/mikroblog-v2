import useApi from "../../../hooks/useApi";
import { commentsEndpoint } from "../../../constants/api-endpoints";
import { ADD_COMM_ERROR, ADD_COMMENT } from "../types";
import dispatchError from "../dispatch-error";

export const createComment =
  ({ originalPostId, content } = {}) =>
  async (dispatch, getSTate) => {
    try {
      const apiClient = useApi({ dispatch, getState });
      const response = await apiClient.post(
        `${commentsEndpoint}/${originalPostId}`,
        {
          content,
        }
      );

      const { payload } = response.data;
      dispatch({
        type: ADD_COMMENT,
        payload: {
          postId: originalPostId,
          data: payload,
        },
      });
    } catch (error) {
      dispatchError(error, ADD_COMM_ERROR, dispatch);
    }
  };
