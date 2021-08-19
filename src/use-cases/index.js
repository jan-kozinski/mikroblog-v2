import { inMemoryDb } from "../drivers/index.js";
import makeSaveUser from "./save-user.js";
import cuid from "cuid";
import bcrypt from "bcrypt";
import makeAuthUser from "./auth-user.js";

const hasher = {
  hash: async (password, saltRounds = 10) => {
    return await bcrypt.hash(password, saltRounds);
  },
  compare: async (provided, hashed) => {
    const result = await bcrypt.compare(provided, hashed);
    console.log(result);
    return result;
  },
};

const saveUser = makeSaveUser({
  dbGateway: inMemoryDb,
  Id: { genId: () => cuid() },
  hasher,
});

const authUser = makeAuthUser({ dbGateway: inMemoryDb, hasher });

const userService = Object.freeze({
  saveUser,
  authUser,
});

export default userService;
export { saveUser, authUser };
