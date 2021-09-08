import useApi from "../../../hooks/useApi";
import { USER_LOADING, LOGIN_SUCCESS, LOGIN_FAIL } from "../types";

export const login =
  ({ email, password }) =>
  async (dispatch, getState) => {
    dispatch({ type: USER_LOADING });
    const apiClient = useApi({ dispatch, getState });

    const body = JSON.stringify({ email, password });
    try {
      const response = await apiClient.post("/api/user/auth", body);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: response.data.payload,
      });
    } catch (error) {
      const internalServerError =
        !error.response || !error.response.data || !error.response.data.error;
      dispatch({
        type: LOGIN_FAIL,
        payload: {
          message: internalServerError
            ? "Something went wrong..."
            : error.response.data.error,
        },
      });
    }
  };
