import {
  USER_LOADING,
  USER_LOADED,
  VALIDATION_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  CLEAR_AUTH_ERROR,
  SET_CSRF_TOKEN,
  SESSION_TIMED_OUT,
  SESSION_RETRIEVED,
} from "../actions/types";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  _csrf: "",
  user: null,
  error: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOADING: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
    case SESSION_RETRIEVED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
      };
    case VALIDATION_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: action.payload,
      };
    case SESSION_TIMED_OUT:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
      };
    case CLEAR_AUTH_ERROR: {
      return {
        ...state,
        error: null,
      };
    }
    case SET_CSRF_TOKEN: {
      return {
        ...state,
        _csrf: action.payload,
      };
    }
    default:
      return state;
  }
}
