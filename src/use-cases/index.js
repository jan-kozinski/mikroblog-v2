import { inMemoryDb } from "../drivers/index.js";
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

const usersDb = new inMemoryDb();
const postsDb = new inMemoryDb();

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

export default service;
export { saveUser, authUser, savePost, editPost, listPosts };
