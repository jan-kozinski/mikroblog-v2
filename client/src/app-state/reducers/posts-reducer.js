import { FETCHING_ERROR, GET_POSTS, POSTS_LOADING } from "../actions/types";

const initialState = {
  posts: [],
  loading: false,
  error: null,
};

export default function postReducer(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      return {
        ...state,
        loading: false,
        error: null,
        posts: action.payload,
      };
    case POSTS_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
        posts: [],
      };
    case FETCHING_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        posts: [],
      };
    default:
      return state;
  }
}
