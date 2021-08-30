import { combineReducers } from "redux";
import postsReducer from "./posts-reducer";
import authReducer from "./auth-reducer";

export default combineReducers({
  posts: postsReducer,
  auth: authReducer,
});
