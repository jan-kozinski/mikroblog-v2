export default function buildMakeUser({ validator, hasher }) {
  return function makeUser({
    id,
    name,
    email,
    password,
    memberSince = Date.now(),
  } = {}) {
    validator.validate({
      id,
      name,
      email,
      password,
    });
    const hashedPassword = hasher.hash(password);
    return Object.freeze({
      getId: () => id,
      getName: () => name,
      getEmail: () => email,
      getHashedPassword: () => hashedPassword,
      getMemberSince: () => memberSince,
    });
  };
}
