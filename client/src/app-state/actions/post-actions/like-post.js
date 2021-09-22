import useApi from "../../../hooks/useApi";
import { postsEndpoint } from "../../../constants/api-endpoints";
import { POST_LIKED, POST_LIKE_ERROR } from "../types";
import dispatchError from "../dispatch-error";

export const giveLike = (postId) => async (dispatch, getState) => {
  try {
    const apiClient = useApi({ dispatch, getState });
    const response = await apiClient.post(`${postsEndpoint}/${postId}/likes`);

    const { payload } = response.data;
    dispatch({
      type: POST_LIKED,
      payload: {
        postId,
        ...payload,
      },
    });
  } catch (error) {
    dispatchError(error, POST_LIKE_ERROR, dispatch, { postId });
  }
};
