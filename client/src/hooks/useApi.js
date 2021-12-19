import axios from "axios";
import { SET_CSRF_TOKEN } from "../app-state/actions/types";

function useApi({ dispatch, getState }) {
  if (process.env.NODE_ENV === "test") return axios;
  let csrfToken = getState().auth._csrf;

  const apiClient = axios.create({
    baseURL: process.env.BASE_URL,
    headers: {
      "xsrf-token": csrfToken,
      "Content-Type": "application/json",
    },
  });

  apiClient.interceptors.response.use(
    (res) => {
      dispatch({
        type: SET_CSRF_TOKEN,
        payload: res.data.csrfToken,
      });
      return res;
    },
    (err) => {
      dispatch({
        type: SET_CSRF_TOKEN,
        payload: err.response.data.csrfToken,
      });
      throw err;
    }
  );

  return apiClient;
}

export default useApi;
