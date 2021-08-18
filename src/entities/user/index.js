export default function makeUser({
  id,
  name,
  email,
  password,
  memberSince = new Date(),
} = {}) {
  if (!id) throw new Error("User id must be provided");
  if (typeof id !== "string") throw new Error("User id must be a string");

  if (!name) throw new Error("User name must be provided");
  if (typeof name !== "string") throw new Error("User name must be a string");
  if (name.length < 3)
    throw new Error("User name must be at least 3 characters long");
  if (name.length > 32)
    throw new Error("User name can be at most 32 characters long");

  if (!email) throw new Error("User email must be provided");
  if (typeof email !== "string") throw new Error("User email must be a string");
  if (!isEmail(email)) throw new Error("User email is invalid");

  if (!password) throw new Error("User password must be provided");
  if (typeof password !== "string")
    throw new Error("User password must be a string");
  if (password.length < 8)
    throw new Error("User password must be at least 8 characters long");
  if (password.length > 128)
    throw new Error("User password can be at most 128 characters long");

  return Object.freeze({
    getId: () => id,
    getName: () => name,
    getEmail: () => email,
    getPassword: () => password,
    getMemberSince: () => memberSince,
  });
}

function isEmail(input) {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(input);
}
