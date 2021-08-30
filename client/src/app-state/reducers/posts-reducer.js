import {
  FETCHING_ERROR,
  GET_POSTS,
  POSTS_LOADING,
  POST_ADDED,
  ADD_POST_FAIL,
  POST_EDITED,
  EDIT_POST_FAIL,
  CLEAR_POST_ERROR,
} from "../actions/types";

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
        error: { ...action.payload, origin: "FETCHING" },
        posts: [],
      };
    case POST_ADDED:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      };
    case ADD_POST_FAIL:
      return {
        ...state,
        error: { ...action.payload, origin: "ADD_POST" },
      };
    case POST_EDITED:
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id !== action.payload.postId) return post;
          else
            return {
              ...post,
              content: action.payload.content,
              modifiedAt: action.payload.modifiedAt,
            };
        }),
      };
    case EDIT_POST_FAIL:
      return {
        ...state,
        error: { ...action.payload, origin: "EDIT_POST" },
      };
    case CLEAR_POST_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}
