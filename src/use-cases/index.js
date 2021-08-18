import { inMemoryDb } from "../data-access/index.js";
import makeSaveUser from "./save-user.js";
import cuid from "cuid";
const saveUser = makeSaveUser({
  dbGateway: inMemoryDb,
  Id: { genId: () => cuid() },
});

const userService = Object.freeze({
  saveUser,
});

export default userService;
export { saveUser };
