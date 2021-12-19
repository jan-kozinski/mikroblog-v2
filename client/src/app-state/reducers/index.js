import { combineReducers } from "redux";
import postsReducer from "./posts-reducer";
import authReducer from "./auth-reducer";
import chatReducer from "./chat-reducer";

export default combineReducers({
  posts: postsReducer,
  auth: authReducer,
  chat: chatReducer,
});
