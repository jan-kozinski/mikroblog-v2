import { inMemoryDb } from "../data-access/index.js";
import makeSaveUser from "./save-user.js";
import cuid from "cuid";
import bcrypt from "bcrypt";

const hasher = {
  hash: async (password, saltRounds = 10) => {
    return await bcrypt.hash(password, saltRounds);
  },
  compare: async (provided, hashed) => {
    return await bcrypt.compare(provided, hashed);
  },
};

const saveUser = makeSaveUser({
  dbGateway: inMemoryDb,
  Id: { genId: () => cuid() },
  hasher,
});

const userService = Object.freeze({
  saveUser,
});

export default userService;
export { saveUser };
