import useApi from "../../../hooks/useApi";
import { postsEndpoint } from "../../../constants/api-endpoints";
import { POST_DELETED, DELETE_POST_FAIL } from "../types";
import dispatchError from "../dispatch-error";

export const deletePost = (postId) => async (dispatch, getState) => {
  try {
    const apiClient = useApi({ dispatch, getState });
    await apiClient.delete(`${postsEndpoint}/${postId}`);
    dispatch({
      type: POST_DELETED,
      payload: {
        postId,
      },
    });
  } catch (error) {
    dispatchError(error, DELETE_POST_FAIL, dispatch, { postId });
  }
};
