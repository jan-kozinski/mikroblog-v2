import {
  GET_CONVERSATIONS,
  GET_CONV_ERROR,
  CONVERSATIONS_LOADING,
} from "../actions/types";

const initialState = {
  conversations: [],
  loading: true,
  error: null,
};

export default function chatReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CONVERSATIONS:
      return {
        ...state,
        conversations: action.payload,
        error: null,
        loading: false,
      };
    case GET_CONV_ERROR:
      return {
        ...state,
        error: { ...action.payload, origin: "GET_CONV" },
        loading: false,
      };
    case CONVERSATIONS_LOADING:
      return {
        ...state,
        loadind: true,
      };
    default:
      return state;
  }
}
