import { token } from "../../drivers/index.js";
import { saveUser, authUser } from "../../use-cases/index.js";
import makePostUser from "./post-user.js";
import makeSignUser from "./sign-user.js";

const postUser = makePostUser({ saveUser, token });
const signUser = makeSignUser({ authUser, token });

const userController = Object.freeze({
  postUser,
  signUser,
});
export default userController;
export { postUser, signUser };
