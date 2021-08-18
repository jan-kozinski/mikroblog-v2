import makeUser from "../entities/user/index.js";

export default function makeSaveUser({ dbGateway, Id, hasher }) {
  return async function saveUser(userData) {
    if (!userData.id) userData.id = Id.genId();
    const user = await makeUser(userData);
    const idAlreadyTaken = !!(await dbGateway.findById(user.getId()));
    const emailAlreadyTaken = !!(await dbGateway.find({
      email: user.getEmail(),
    }));
    if (idAlreadyTaken) throw new Error("user of provided id already exists");
    if (emailAlreadyTaken)
      throw new Error("user of provided email already exists");
    return dbGateway.insert({
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      password: hasher.hash(user.getPassword()),
      memberSince: user.getMemberSince(),
    });
  };
}
