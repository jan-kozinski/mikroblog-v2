import makeUser from "../entities/user/index.js";

export default function makeSaveUser({ dbGateway }) {
  return async function saveUser(userData) {
    const user = makeUser(userData);
    const idAlreadyTaken = !!(await dbGateway.findById(user.getId()));
    const emailAlreadyTaken = !!(await dbGateway.find({
      email: user.getEmail(),
    }));
    if (idAlreadyTaken) throw new Error("user of provided id already exists");
    if (emailAlreadyTaken)
      throw new Error("user of provided email already exists");
    dbGateway.insert({
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      password: user.getHashedPassword(),
      memberSince: user.getMemberSince(),
    });
  };
}
