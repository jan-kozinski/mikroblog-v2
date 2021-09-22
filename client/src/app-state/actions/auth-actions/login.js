import { authUserEndpoint } from "../../../constants/api-endpoints";
import useApi from "../../../hooks/useApi";
import dispatchError from "../dispatch-error";
import { USER_LOADING, LOGIN_SUCCESS, LOGIN_FAIL } from "../types";

export const login =
  ({ email, password }) =>
  async (dispatch, getState) => {
    dispatch({ type: USER_LOADING });
    const apiClient = useApi({ dispatch, getState });

    const body = JSON.stringify({ email, password });
    try {
      const response = await apiClient.post(authUserEndpoint, body);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: response.data.payload,
      });
    } catch (error) {
      dispatchError(error, LOGIN_FAIL, dispatch);
    }
  };
