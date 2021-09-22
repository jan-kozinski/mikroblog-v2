import useApi from "../../../hooks/useApi";
import { postsEndpoint } from "../../../constants/api-endpoints";
import { POST_UNLIKED, POST_UNLIKE_ERROR } from "../types";
import dispatchError from "../dispatch-error";

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
    dispatchError(error, POST_UNLIKE_ERROR, dispatch, { postId });
  }
};
