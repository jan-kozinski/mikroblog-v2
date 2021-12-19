export default function makeSearchUsersByName({ dbGateway }) {
  return async function searchUsers(search, options = {}) {
    const users = await dbGateway.find(
      { name: search },
      { ...options, treatAsPattern: true }
    );
    return users.map((u) => ({ id: u.id, name: u.name }));
  };
}
