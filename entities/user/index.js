import buildMakeUser from "./user.js";
//TODO: choose validator and a hasher, inject it to buildMakeUser
const validator = () => {
  throw new Error("validator not yet implemented");
};

const hasher = () => {
  throw new Error("hasher not yet implemented");
};

const makeUser = buildMakeUser({ validator, hasher });

export default makeUser;
