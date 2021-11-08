import {
  FETCHING_ERROR,
  LAST_POST_REACHED,
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
  POST_DELETED,
  DELETE_POST_FAIL,
  GET_COMMENTS,
  GET_POSTS_ADDED_SINCE_LAST_FETCH,
  COMM_FETCH_ERROR,
  ADD_COMM_ERROR,
  ADD_COMMENT,
  COMM_EDITED,
  EDIT_COMM_ERROR,
  COMM_DELETED,
  COMM_DELETE_ERROR,
  COMM_LIKED,
  COMM_LIKE_ERROR,
  COMM_UNLIKED,
  SOCKET_RECEIVED_NEW_POST_INFO,
} from "../actions/types";

const initialState = {
  posts: [],
  loading: true,
  lastPostReached: false,
  error: null,
  postsAddedSinceLastFetch: 0,
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
    case GET_POSTS_ADDED_SINCE_LAST_FETCH: {
      return {
        ...state,
        loading: false,
        error: null,
        postsAddedSinceLastFetch: 0,
        posts: [...action.payload, ...state.posts],
      };
    }
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
    case POST_LIKED:
    case POST_UNLIKED:
    case GET_COMMENTS:
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id !== action.payload.postId) return post;
          else
            return {
              ...post,
              ...action.payload,
            };
        }),
      };
    case EDIT_POST_FAIL:
    case DELETE_POST_FAIL:
      return {
        ...state,
        error: { ...action.payload, origin: "EDIT_POST" },
      };
    case POST_DELETED: {
      return {
        ...state,
        posts: state.posts.filter((p) => p.id !== action.payload.postId),
      };
    }
    case CLEAR_POST_ERROR:
      return {
        ...state,
        error: null,
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
    case COMM_FETCH_ERROR:
    case ADD_COMM_ERROR:
    case EDIT_COMM_ERROR:
    case COMM_DELETE_ERROR:
    case COMM_LIKE_ERROR:
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
    case COMM_EDITED:
    case COMM_DELETED:
    case COMM_LIKED:
    case COMM_UNLIKED: {
      return {
        ...state,
        posts: state.posts.map((post) => ({
          ...post,
          comments: post.comments.map((comm) => {
            if (comm.id !== action.commentId) return comm;
            else return { ...comm, ...action.payload };
          }),
        })),
      };
    }
    case SOCKET_RECEIVED_NEW_POST_INFO:
      return {
        ...state,
        postsAddedSinceLastFetch: state.postsAddedSinceLastFetch + 1,
      };
    default:
      return state;
  }
}
