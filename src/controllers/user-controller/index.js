import { saveUser } from "../../use-cases/index.js";
import makePostUser from "./post-user.js";

const postUser = makePostUser({ saveUser });

const userController = Object.freeze({
  postUser,
});
export default userController;
export { postUser };
