import { savePost } from "../../use-cases/index.js";
import { editPost } from "../../use-cases/index.js";
import { listPosts } from "../../use-cases/index.js";
import makeAddPost from "./add-post.js";
import makeUpdatePost from "./update-post.js";
import makeGetPosts from "./get-posts.js";
import { token } from "../../drivers/index.js";

const addPost = makeAddPost({ savePost, token });
const updatePost = makeUpdatePost({ editPost, token });
const getPosts = makeGetPosts({ listPosts });

const postController = Object.freeze({
  addPost,
  updatePost,
  getPosts,
});
export default postController;
export { addPost, updatePost, getPosts };
