import useApi from "../../../hooks/useApi";
import { postsEndpoint } from "../../../constants/api-endpoints";
import { POST_EDITED, EDIT_POST_FAIL } from "../types";

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
      const internalServerError =
        !error.response || !error.response.data || !error.response.data.error;
      dispatch({
        type: EDIT_POST_FAIL,
        payload: {
          postId,
          message: internalServerError
            ? "Something went wrong..."
            : error.response.data.error,
        },
      });
    }
  };
