import express from "express";
import makeCallback from "./make-express-callback.js";
import {
  postUser,
  signUser,
  sessionUser,
  getUsers,
} from "../../controllers/user-controller/index.js";
import {
  addPost,
  updatePost,
  getPosts,
  likePost,
  unlikePost,
  deletePost,
} from "../../controllers/post-controller/index.js";
import {
  addComment,
  getComments,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
} from "../../controllers/comment-controller/index.js";
import {
  sendMsg,
  createConv,
  getUserConvs,
} from "../../controllers/conversation-controller/index.js";

const router = express.Router();

router.post("/user", makeCallback(postUser));
router.get("/user", makeCallback(getUsers));
router.post("/user/auth", makeCallback(signUser));
router.post("/user/auth/session", makeCallback(sessionUser));

router.post("/post", makeCallback(addPost));
router.put("/post/:postId", makeCallback(updatePost));
router.get("/post", makeCallback(getPosts));
router.delete("/post/:postId", makeCallback(deletePost));

router.post("/post/:postId/likes", makeCallback(likePost));
router.delete("/post/:postId/likes", makeCallback(unlikePost));

router.post("/comment/:originalPostId", makeCallback(addComment));
router.get("/comment/:originalPostId", makeCallback(getComments));

router.put("/comment/:commentId", makeCallback(updateComment));
router.delete("/comment/:commentId", makeCallback(deleteComment));

router.post("/comment/:commentId/likes", makeCallback(likeComment));
router.delete("/comment/:commentId/likes", makeCallback(unlikeComment));

router.post("/conversation", makeCallback(createConv));
router.get("/conversation", makeCallback(getUserConvs));
router.post("/conversation/:conversationId", makeCallback(sendMsg));

export default router;
export { router };
