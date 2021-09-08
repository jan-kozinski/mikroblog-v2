import useApi from "../../../hooks/useApi";

import { REGISTER_SUCCESS, REGISTER_FAIL } from "../types";

export const register =
  ({ name, email, password }) =>
  async (dispatch, getState) => {
    const apiClient = useApi({ dispatch, getState });

    const body = JSON.stringify({ name, email, password });

    try {
      const response = await apiClient.post("/api/user", body);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: response.data.payload,
      });
    } catch (error) {
      const internalServerError =
        !error.response || !error.response.data || !error.response.data.error;
      dispatch({
        type: REGISTER_FAIL,
        payload: {
          message: internalServerError
            ? "Something went wrong..."
            : error.response.data.error,
        },
      });
    }
  };
