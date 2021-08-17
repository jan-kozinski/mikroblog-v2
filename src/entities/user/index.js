import buildMakeUser from "./user.js";
//TODO: choose a hasher, inject it to buildMakeUser
const hasherMock = {
  hash: () => {
    console.error(
      "HASHER IS NOT YET IMPLEMENTED, THE APP IS CURRENTLY USING JUST THE HASHER MOCKUP"
    );
    return "HASHER IS NOT YET IMPLEMENTED, THE APP IS CURRENTLY USING JUST THE HASHER MOCKUP";
  },
};

const makeUser = buildMakeUser({ hasher: hasherMock });

export default makeUser;
