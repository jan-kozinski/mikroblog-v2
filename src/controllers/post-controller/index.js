import { savePost } from "../../use-cases/index.js";
import makeAddPost from "./add-post.js";
import { token } from "../../drivers/index.js";

const addPost = makeAddPost({ savePost, token });

const postController = Object.freeze({
  addPost,
});
export default postController;
export { addPost };
