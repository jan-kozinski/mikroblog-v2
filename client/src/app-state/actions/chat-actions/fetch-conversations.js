import {
  CONVERSATIONS_LOADING,
  GET_CONVERSATIONS,
  GET_CONV_ERROR,
} from "../types";
import useApi from "../../../hooks/useApi";
import { conversationsEndpoint } from "../../../constants/api-endpoints";

export const fetchConversations = () => async (dispatch, getState) => {
  dispatch({ type: CONVERSATIONS_LOADING });
  const apiClient = useApi({ dispatch, getState });

  try {
    const response = await apiClient.get(conversationsEndpoint);
    dispatch({
      type: GET_CONVERSATIONS,
      payload: response.data.payload,
    });
  } catch (error) {
    console.error(error.data);
    dispatch({
      type: GET_CONV_ERROR,
    });
  }
};
