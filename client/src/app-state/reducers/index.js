import { combineReducers } from "redux";
import postsReducer from "./posts-reducer";
import errorsReducer from "./errors-reducer";

export default combineReducers({
  posts: postsReducer,
  errors: errorsReducer,
});
