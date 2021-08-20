import { inMemoryDb } from "../drivers/index.js";
import makeSaveUser from "./save-user.js";
import makeSavePost from "./save-post.js";
import makeAuthUser from "./auth-user.js";
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

const saveUser = makeSaveUser({
  dbGateway: inMemoryDb,
  Id: { genId: () => cuid() },
  hasher,
});

const authUser = makeAuthUser({ dbGateway: inMemoryDb, hasher });

const savePost = makeSavePost({
  dbGateway: inMemoryDb,
  Id: { genId: () => cuid() },
});

const service = Object.freeze({
  saveUser,
  authUser,
  savePost,
});

export default service;
export { saveUser, authUser, savePost };
