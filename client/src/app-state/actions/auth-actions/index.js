import axios from "axios";

import {
  USER_LOADING,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
} from "../types";

const httpReqConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const login =
  ({ email, password }) =>
  async (dispatch, getState) => {
    dispatch({ type: USER_LOADING });

    const body = JSON.stringify({ email, password });
    try {
      const response = await axios.post("/api/user/auth", body, httpReqConfig);
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

export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    const body = JSON.stringify({ name, email, password });

    try {
      const response = await axios.post("/api/user", body, httpReqConfig);
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
