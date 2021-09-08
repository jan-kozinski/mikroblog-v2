import makeUser from "../../entities/user/index.js";

export default function makeSaveUser({ dbGateway, Id, hasher }) {
  return async function saveUser(userData) {
    if (!userData.id) userData.id = Id.genId();

    const user = await makeUser(userData);

    const idAlreadyTaken = !!(await dbGateway.findById(user.getId()));
    const emailAlreadyTaken = !!(await dbGateway.findOne({
      email: user.getEmail(),
    }));
    const nameAlreadyTaken = !!(await dbGateway.findOne({
      name: user.getName(),
    }));

    if (idAlreadyTaken) throw new Error("User of provided id already exists");
    if (emailAlreadyTaken)
      throw new Error("User of provided email already exists");
    if (nameAlreadyTaken) throw new Error("Name already taken");

    await dbGateway.insert({
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      password: await hasher.hash(user.getPassword()),
      memberSince: user.getMemberSince(),
    });

    return {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      memberSince: user.getMemberSince(),
    };
  };
}
