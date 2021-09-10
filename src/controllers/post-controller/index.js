import {
  savePost,
  listPosts,
  editPost,
  giveLike,
  undoLike,
} from "../../use-cases/index.js";
import makeAddPost from "./add-post.js";
import makeUpdatePost from "./update-post.js";
import makeGetPosts from "./get-posts.js";
import makeLikePost from "./like-post.js";
import makeUnlikePost from "./unlike-post.js";
import { token } from "../../drivers/redis-sessions.js";

const addPost = makeAddPost({ savePost, token });
const updatePost = makeUpdatePost({ editPost, token });
const getPosts = makeGetPosts({ listPosts });
const likePost = makeLikePost({ giveLike, token });
const unlikePost = makeUnlikePost({ undoLike, token });

const postController = Object.freeze({
  addPost,
  updatePost,
  getPosts,
  likePost,
  unlikePost,
});
export default postController;
export { addPost, updatePost, getPosts, likePost, unlikePost };
