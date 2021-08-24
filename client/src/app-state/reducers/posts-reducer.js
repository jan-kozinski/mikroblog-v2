import { GET_POSTS, POSTS_LOADING } from "../actions/types";

const initialState = {
  posts: [],
  loading: false,
};

export default function postReducer(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      return {
        ...state,
        loading: false,
        posts: action.payload,
      };
    case POSTS_LOADING:
      return {
        ...state,
        loading: true,
        posts: [],
      };
    default:
      return state;
  }
}
