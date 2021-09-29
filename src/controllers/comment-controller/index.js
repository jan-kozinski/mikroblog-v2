import {
  saveComment,
  listCommsByPost,
  editComment,
  removeComment,
} from "../../use-cases/index.js";
import makeAddComment from "./add-comm.js";
import makeGetComments from "./get-comments.js";
import makeUpdateComment from "./update-comment.js";
import makeDeleteComment from "./delete-comment.js";
import { token } from "../../drivers/index.js";

const addComment = makeAddComment({ saveComment, token });
const getComments = makeGetComments({ listComments: listCommsByPost });
const updateComment = makeUpdateComment({ editComment, token });
const deleteComment = makeDeleteComment({ removeComment, token });

const commentController = Object.freeze({
  addComment,
  getComments,
  updateComment,
  deleteComment,
});

export default commentController;
export { addComment, getComments, updateComment, deleteComment };
