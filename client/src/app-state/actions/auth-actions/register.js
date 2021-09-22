import useApi from "../../../hooks/useApi";
import { createUserEndpoint } from "../../../constants/api-endpoints";
import { REGISTER_SUCCESS, REGISTER_FAIL } from "../types";
import dispatchError from "../dispatch-error";

export const register =
  ({ name, email, password }) =>
  async (dispatch, getState) => {
    const apiClient = useApi({ dispatch, getState });

    const body = JSON.stringify({ name, email, password });

    try {
      const response = await apiClient.post(createUserEndpoint, body);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: response.data.payload,
      });
    } catch (error) {
      dispatchError(error, REGISTER_FAIL, dispatch);
    }
  };
