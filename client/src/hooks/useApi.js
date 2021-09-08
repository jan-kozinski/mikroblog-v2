import axios from "axios";
import { SET_CSRF_TOKEN } from "../app-state/actions/types";

function useApi({ dispatch, getState }) {
  if (process.env.NODE_ENV === "test") return axios;
  const csrfToken = getState().auth._csrf;

  const apiClient = axios.create({
    baseURL: process.env.BASE_URL,
    headers: {
      "xsrf-token": csrfToken,
    },
  });
  apiClient.defaults.headers.post["Content-Type"] = "application/json";
  apiClient.defaults.headers.put["Content-Type"] = "application/json";

  apiClient.defaults.headers.post["xsrf-token"] = csrfToken;
  apiClient.defaults.headers.put["xsrf-token"] = csrfToken;
  apiClient.defaults.headers.delete["xsrf-token"] = csrfToken;

  apiClient.interceptors.response.use((res) => {
    dispatch({
      type: SET_CSRF_TOKEN,
      payload: res.data.csrfToken,
    });
    return res;
  });

  return apiClient;
}

export default useApi;
