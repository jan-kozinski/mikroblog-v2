import {
  FETCHING_ERROR,
  GET_POSTS,
  POSTS_LOADING,
  POST_ADDED,
  ADD_POST_FAIL,
  POST_EDITED,
  EDIT_POST_FAIL,
  CLEAR_POST_ERROR,
  POST_LIKED,
  POST_LIKE_ERROR,
  POST_UNLIKED,
  POST_UNLIKE_ERROR,
  LAST_POST_REACHED,
  GET_COMMENTS,
  COMM_FETCH_ERROR,
  ADD_COMM_ERROR,
  ADD_COMMENT,
} from "../actions/types";

const initialState = {
  posts: [],
  loading: false,
  lastPostReached: false,
  error: null,
};

export default function postReducer(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      return {
        ...state,
        loading: false,
        error: null,
        posts: [...state.posts, ...action.payload],
      };
    case POSTS_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCHING_ERROR:
      return {
        ...state,
        loading: false,
        error: { ...action.payload, origin: "FETCHING" },
        posts: [],
      };
    case LAST_POST_REACHED:
      return {
        ...state,
        lastPostReached: true,
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
    case POST_LIKED:
    case POST_UNLIKED:
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id !== action.payload.postId) return post;
          else
            return {
              ...post,
              likesCount: action.payload.likesCount,
              likersIds: action.payload.likersIds,
            };
        }),
      };
    case POST_LIKE_ERROR:
    case POST_UNLIKE_ERROR:
      return {
        ...state,
        error: {
          ...action.payload,
          origin: "LIKE_POST",
        },
      };
    case GET_COMMENTS:
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id !== action.payload.postId) return post;
          else
            return {
              ...post,
              comments: action.payload.comments,
            };
        }),
      };
    case COMM_FETCH_ERROR:
    case ADD_COMM_ERROR:
      return {
        ...state,
        error: {
          ...action.payload,
          origin: "COMM",
        },
      };
    case ADD_COMMENT: {
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id !== action.payload.postId) return post;
          else
            return {
              ...post,
              comments: [...post.comments, action.payload.data],
            };
        }),
      };
    }
    default:
      return state;
  }
}
