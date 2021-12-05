export default function makeListUserConvs({ dbGateway }) {
  return async function listUserConvs(userId, options = {}) {
    if (!userId) throw new Error("User id must be provided");
    if (!options.matchAny) options.matchAny = ["membersIds"];
    else options.matchAny = [...options.matchAny, "membersIds"];
    const convs = await dbGateway.find(
      {
        membersIds: [userId],
      },
      options
    );
    if (!convs) return [];
    return convs.map((c) => ({
      id: c.id,
      members: c.members,
      messages: c.messages,
    }));
  };
}
