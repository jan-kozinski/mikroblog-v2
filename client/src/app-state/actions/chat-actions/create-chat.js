import { CREATE_CONV, CREATE_CONV_ERROR } from "../types";
import useApi from "../../../hooks/useApi";
import { conversationsEndpoint } from "../../../constants/api-endpoints";
import dispatchError from "../dispatch-error";

export const createChat =
  ({ membersIds, message }) =>
  async (dispatch, getState) => {
    try {
      const apiClient = useApi({ dispatch, getState });
      const user = getState().auth.user;
      membersIds.push(user.id);
      const response = await apiClient.post(conversationsEndpoint, {
        membersIds,
        message,
      });
      const { payload } = response.data;
      dispatch({
        type: CREATE_CONV,
        payload,
      });
    } catch (error) {
      console.error(error);
      dispatchError(error, CREATE_CONV_ERROR, dispatch);
    }
  };
