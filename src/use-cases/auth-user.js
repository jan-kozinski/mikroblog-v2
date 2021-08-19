export default function makeAuthUser({ dbGateway, hasher }) {
  return async function authUser({ email, password }) {
    if (!email)
      throw new Error("Please provide with an email in order to procede");

    if (!password)
      throw new Error("Please provide with a password in order to procede");

    const user = dbGateway.findOne({ email });
    if (!user) return false;
    const result = await hasher.compare(password, user.password);
    console.log(result);
    return result;
  };
}
