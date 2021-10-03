import { inMemoryDb } from "../drivers/index.js";
import { MongoDb } from "../drivers/index.js";

import cuid from "cuid";
import bcrypt from "bcrypt";

import makeSaveUser from "./user/save-user.js";
import makeAuthUser from "./user/auth-user.js";

import makeSavePost from "./post/save-post.js";
import makeEditPost from "./post/edit-post.js";
import makeListPosts from "./post/list-posts.js";
import makeLikePost from "./post/give-like.js";
import makeUndoPostLike from "./post/undo-like.js";
import makeRemovePost from "./post/remove-post.js";

import makeSaveComment from "./comments/save-comment.js";
import makeListCommsByPost from "./comments/list-by-post.js";
import makeEditComment from "./comments/edit-comment.js";
import makeRemoveComment from "./comments/remove-comment.js";
import makeLikeComment from "./comments/like-comment.js";
import makeUndoCommentLike from "./comments/undo-like.js";

const hasher = {
  hash: async (password, saltRounds = 10) => {
    return await bcrypt.hash(password, saltRounds);
  },
  compare: async (provided, hashed) => {
    const result = await bcrypt.compare(provided, hashed);
    return result;
  },
};

let usersDb, postsDb, commentsDb;

if (process.env.NODE_ENV !== "test") {
  usersDb = new MongoDb("users");
  commentsDb = new MongoDb("comments");
  postsDb = new MongoDb("posts");
  await usersDb.connect();
  await postsDb.connect();
  await commentsDb.connect();

  process.on("uncaughtException", (err, origin) => {
    console.error("ERR:", err, "ORIGIN:", origin);
    process.exit(1);
  });

  process.on("SIGINT", () => {
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    process.exit(0);
  });

  process.on("exit", () => {
    closeDbConnections();
    process.exit();
  });
} else {
  usersDb = new inMemoryDb();
  commentsDb = new inMemoryDb();
  postsDb = new inMemoryDb();
}

const Id = { genId: () => cuid() };

//---USER-SERVICE---

const saveUser = makeSaveUser({
  dbGateway: usersDb,
  Id,
  hasher,
});

const authUser = makeAuthUser({ dbGateway: usersDb, hasher });

//---POST-SERVICE---

const savePost = makeSavePost({
  postsDb,
  usersDb,
  Id,
});

const editPost = makeEditPost({ dbGateway: postsDb });

const listPosts = makeListPosts({
  dbGateway: postsDb,
});

const likePost = makeLikePost({
  dbGateway: postsDb,
});

const undoLike = makeUndoPostLike({
  dbGateway: postsDb,
});

const removePost = makeRemovePost({ postsDb, commentsDb });
//---COMMENT-SERVICE---

const saveComment = makeSaveComment({
  commentsDb,
  postsDb,
  usersDb,
  Id,
});
const listCommsByPost = makeListCommsByPost({ dbGateway: commentsDb });
const editComment = makeEditComment({ dbGateway: commentsDb });
const removeComment = makeRemoveComment({ dbGateway: commentsDb });
const likeComment = makeLikeComment({ dbGateway: commentsDb });
const undoCommentLike = makeUndoCommentLike({ dbGateway: commentsDb });

function closeDbConnections() {
  usersDb.close();
  postsDb.close();
  commentsDb.close();
}

const service = Object.freeze({
  saveUser,
  authUser,
  savePost,
  editPost,
  listPosts,
  likePost,
  undoLike,
  removePost,
  saveComment,
  listCommsByPost,
  editComment,
  removeComment,
  likeComment,
  undoCommentLike,
});

export default service;
export {
  saveUser,
  authUser,
  savePost,
  editPost,
  listPosts,
  likePost,
  undoLike,
  removePost,
  saveComment,
  listCommsByPost,
  editComment,
  removeComment,
  likeComment,
  undoCommentLike,
};
