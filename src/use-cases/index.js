import { inMemoryDb } from "../drivers/index.js";
import { MongoDb } from "../drivers/index.js";
import makeSaveUser from "./user/save-user.js";
import makeAuthUser from "./user/auth-user.js";
import makeSavePost from "./post/save-post.js";
import makeEditPost from "./post/edit-post.js";
import makeListPosts from "./post/list-posts.js";
import cuid from "cuid";
import bcrypt from "bcrypt";

const hasher = {
  hash: async (password, saltRounds = 10) => {
    return await bcrypt.hash(password, saltRounds);
  },
  compare: async (provided, hashed) => {
    const result = await bcrypt.compare(provided, hashed);
    return result;
  },
};

let usersDb, postsDb;

if (process.env.NODE_ENV !== "test") {
  usersDb = new MongoDb("users");
  postsDb = new MongoDb("posts");
  await usersDb.connect();
  await postsDb.connect();

  process.on("uncaughtException", () => {
    closeDbConnections();
    process.exit();
  });

  process.on("SIGINT", () => {
    closeDbConnections();
    process.exit();
  });

  process.on("SIGTERM", () => {
    closeDbConnections();
    process.exit();
  });

  process.on("exit", () => {
    closeDbConnections();
    process.exit();
  });
} else {
  console.log(process.env.NODE_ENV);
  usersDb = new inMemoryDb();
  postsDb = new inMemoryDb();
}

const saveUser = makeSaveUser({
  dbGateway: usersDb,
  Id: { genId: () => cuid() },
  hasher,
});

const authUser = makeAuthUser({ dbGateway: usersDb, hasher });

const savePost = makeSavePost({
  postsDb,
  usersDb,
  Id: { genId: () => cuid() },
});

const editPost = makeEditPost({ dbGateway: postsDb });

const listPosts = makeListPosts({
  dbGateway: postsDb,
});

const service = Object.freeze({
  saveUser,
  authUser,
  savePost,
  editPost,
  listPosts,
});

function closeDbConnections() {
  usersDb.close;
  postsDb.close;
}

export default service;
export { saveUser, authUser, savePost, editPost, listPosts };
