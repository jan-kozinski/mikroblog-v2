import {
  savePost,
  listPosts,
  listCommsByPost,
  editPost,
  likePost as giveLike,
  undoLike,
  removePost,
} from "../../use-cases/index.js";
import makeAddPost from "./add-post.js";
import makeUpdatePost from "./update-post.js";
import makeGetPosts from "./get-posts.js";
import makeLikePost from "./like-post.js";
import makeUnlikePost from "./unlike-post.js";
import makeDeletePost from "./delete-post.js";
import { token } from "../../drivers/index.js";

const addPost = makeAddPost({ savePost, token });
const updatePost = makeUpdatePost({ editPost, token });
const getPosts = makeGetPosts({ listPosts, listComments: listCommsByPost });
const likePost = makeLikePost({ giveLike, token });
const unlikePost = makeUnlikePost({ undoLike, token });
const deletePost = makeDeletePost({ removePost, token });

const postController = Object.freeze({
  addPost,
  updatePost,
  getPosts,
  likePost,
  unlikePost,
  deletePost,
});
export default postController;
export { addPost, updatePost, getPosts, likePost, unlikePost, deletePost };
