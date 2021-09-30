import {
  saveComment,
  listCommsByPost,
  editComment,
  removeComment,
  likeComment as giveLike,
  undoCommentLike as undoLike,
} from "../../use-cases/index.js";
import makeAddComment from "./add-comm.js";
import makeGetComments from "./get-comments.js";
import makeUpdateComment from "./update-comment.js";
import makeDeleteComment from "./delete-comment.js";
import makeLikeComment from "./like-comment.js";
import makeUnlikeComment from "./unlike-comment.js";
import { token } from "../../drivers/index.js";

const addComment = makeAddComment({ saveComment, token });
const getComments = makeGetComments({ listComments: listCommsByPost });
const updateComment = makeUpdateComment({ editComment, token });
const deleteComment = makeDeleteComment({ removeComment, token });
const likeComment = makeLikeComment({ giveLike, token });
const unlikeComment = makeUnlikeComment({ undoLike, token });

const commentController = Object.freeze({
  addComment,
  getComments,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
});

export default commentController;
export {
  addComment,
  getComments,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
};
