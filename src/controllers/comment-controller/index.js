import { saveComment, listCommsByPost } from "../../use-cases/index.js";
import makeAddComment from "./add-comm.js";
import makeGetComments from "./get-comments.js";
import { token } from "../../drivers/index.js";

const addComment = makeAddComment({ saveComment, token });
const getComments = makeGetComments({ listComments: listCommsByPost });

const commentController = Object.freeze({
  addComment,
  getComments,
});

export default commentController;
export { addComment, getComments };
