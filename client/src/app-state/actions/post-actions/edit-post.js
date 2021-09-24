import useApi from "../../../hooks/useApi";
import { postsEndpoint } from "../../../constants/api-endpoints";
import { POST_EDITED, EDIT_POST_FAIL } from "../types";
import dispatchError from "../dispatch-error";

export const editPost =
  ({ content, postId }) =>
  async (dispatch, getState) => {
    try {
      const apiClient = useApi({ dispatch, getState });
      const response = await apiClient.put(`${postsEndpoint}/${postId}`, {
        content,
      });
      const { payload } = response.data;
      dispatch({
        type: POST_EDITED,
        payload: {
          postId,
          ...payload,
        },
      });
    } catch (error) {
      dispatchError(error, EDIT_POST_FAIL, dispatch, { postId });
    }
  };
