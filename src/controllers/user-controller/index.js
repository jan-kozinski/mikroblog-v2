import { token } from "../../drivers/index.js";
import { saveUser, authUser, searchUsers } from "../../use-cases/index.js";
import makePostUser from "./post-user.js";
import makeSignUser from "./sign-user.js";
import makeSessionUser from "./session-user.js";
import makeGetUsers from "./get-users.js";

const postUser = makePostUser({ saveUser, token });
const signUser = makeSignUser({ authUser, token });
const sessionUser = makeSessionUser({ token });
const getUsers = makeGetUsers({ searchUsers });

const userController = Object.freeze({
  postUser,
  getUsers,
  signUser,
  sessionUser,
});
export default userController;
export { postUser, getUsers, signUser, sessionUser };
