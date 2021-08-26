import { combineReducers } from "redux";
import postsReducer from "./posts-reducer";
import errorsReducer from "./errors-reducer";
import authReducer from "./auth-reducer";

export default combineReducers({
  posts: postsReducer,
  error: errorsReducer,
  auth: authReducer,
});
