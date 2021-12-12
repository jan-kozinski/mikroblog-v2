import {
  GET_CONVERSATIONS,
  GET_CONV_ERROR,
  CONVERSATIONS_LOADING,
  SEND_MSG,
  SEND_MSG_ERROR,
  CREATE_CONV_ERROR,
  CREATE_CONV,
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
    case CREATE_CONV:
      return {
        ...state,
        conversations: [action.payload, ...state.conversations],
      };
    case CREATE_CONV_ERROR:
      return {
        ...state,
        error: { ...action.payload, origin: "CREATE_CONV" },
      };

    case SEND_MSG:
      return {
        ...state,
        conversations: state.conversations.map((c) => {
          if (c.id === action.payload.chatId)
            return {
              ...c,
              messages: [...c.messages, action.payload.data],
            };
          else return c;
        }),
      };
    case SEND_MSG_ERROR:
      return {
        ...state,
        error: { ...action.payload, origin: "SEND_MSG" },
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
