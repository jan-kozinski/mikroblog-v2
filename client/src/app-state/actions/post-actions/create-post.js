import useApi from "../../../hooks/useApi";
import { postsEndpoint } from "../../../constants/api-endpoints";
import { POST_ADDED, ADD_POST_FAIL } from "../types";
import dispatchError from "../dispatch-error";

export const createPost = (content) => async (dispatch, getState) => {
  try {
    const apiClient = useApi({ dispatch, getState });
    const response = await apiClient.post(postsEndpoint, { content });
    const { payload } = response.data;
    dispatch({
      type: POST_ADDED,
      payload,
    });
  } catch (error) {
    dispatchError(error, ADD_POST_FAIL, dispatch);
  }
};
