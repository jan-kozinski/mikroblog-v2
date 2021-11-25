export default function makeListUserConvs({ dbGateway }) {
  return async function listUserConvs(userId, options = {}) {
    if (!userId) throw new Error("User id must be provided");
    if (!options.matchAny) options.matchAny = ["membersIds"];
    else options.matchAny = [...options.matchAny, "membersIds"];
    return await dbGateway.find(
      {
        membersIds: [userId],
      },
      options
    );
  };
}
