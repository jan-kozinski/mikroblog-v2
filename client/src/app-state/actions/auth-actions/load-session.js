import { loadUserSessionEndpoint } from "../../../constants/api-endpoints";
import useApi from "../../../hooks/useApi";
import { USER_LOADING, SESSION_RETRIEVED, SESSION_TIMED_OUT } from "../types";

export const loadUserSession = () => async (dispatch, getState) => {
  dispatch({ type: USER_LOADING });
  const apiClient = useApi({ dispatch, getState });
  try {
    const response = await apiClient.post(loadUserSessionEndpoint);
    dispatch({
      type: SESSION_RETRIEVED,
      payload: response.data.payload,
    });
  } catch (error) {
    dispatch({
      type: SESSION_TIMED_OUT,
    });
  }
};
