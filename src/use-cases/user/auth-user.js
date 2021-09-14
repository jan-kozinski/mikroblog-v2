import makeUser from "../../entities/user/index.js";

export default function makeAuthUser({ dbGateway, hasher }) {
  return async function authUser({ email, password }) {
    if (!email)
      throw new Error("Please provide with email in order to procede");

    if (!password)
      throw new Error("Please provide with password in order to procede");

    const userRecord = await dbGateway.findOne({ email });
    if (!userRecord) return null;

    const wrongPassword = !(await hasher.compare(
      password,
      userRecord.password
    ));
    if (wrongPassword) return null;

    const userEntity = await makeUser(userRecord);
    const userData = {
      id: userEntity.getId(),
      name: userEntity.getName(),
      email: userEntity.getEmail(),
      memberSince: userEntity.getMemberSince(),
    };

    return userData;
  };
}
