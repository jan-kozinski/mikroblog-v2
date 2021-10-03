//POST
export const GET_POSTS = "GET_POSTS";
export const POSTS_LOADING = "POSTS_LOADING";
export const FETCHING_ERROR = "FETCHING_ERROR";
export const LAST_POST_REACHED = "LAST_POST_REACHED";

export const POST_ADDED = "POST_ADDED";
export const ADD_POST_FAIL = "ADD_POST_FAIL";

export const POST_EDITED = "POST_EDITED";
export const EDIT_POST_FAIL = "EDIT_POST_FAIL";

export const POST_DELETED = "POST_DELETED";
export const DELETE_POST_FAIL = "DELETE_POST_FAIL";

export const CLEAR_POST_ERROR = "CLEAR_POST_ERROR";

export const POST_LIKED = "POST_LIKED";
export const POST_LIKE_ERROR = "POST_LIKE_ERROR";

export const POST_UNLIKED = "POST_UNLIKED";
export const POST_UNLIKE_ERROR = "POST_UNLIKE_ERROR";

//COMMENTS
export const GET_COMMENTS = "GET_COMMENTS";
export const COMM_FETCH_ERROR = "COMM_FETCH_ERROR";

export const ADD_COMMENT = "ADD_COMMENT";
export const ADD_COMM_ERROR = "ADD_COMM_ERROR";

export const COMM_EDITED = "COMM_EDITED";
export const EDIT_COMM_ERROR = "EDIT_COMM_ERROR";

export const COMM_LIKED = "COMM_LIKED";
export const COMM_LIKE_ERROR = "COMM_LIKE_ERROR";
export const COMM_UNLIKED = "COMM_UNLIKED";

export const COMM_DELETED = "COMM_DELETED";
export const COMM_DELETE_ERROR = "COMM_DELETE_ERROR";

//AUTH
export const USER_LOADED = "USER_LOADED";
export const USER_LOADING = "USER_LOADING";
export const AUTH_ERROR = "AUTH_ERROR";

export const SESSION_RETRIEVED = "SESSION_RETRIEVED";
export const SESSION_TIMED_OUT = "SESSION_TIMED_OUT";

export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";

export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";

export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAIL = "REGISTER_FAIL";
export const VALIDATION_ERROR = "VALIDATION_ERROR";
export const CLEAR_AUTH_ERROR = "CLEAR_AUTH_ERROR";
//CSRF
export const SET_CSRF_TOKEN = "SET_CSRF_TOKEN";
