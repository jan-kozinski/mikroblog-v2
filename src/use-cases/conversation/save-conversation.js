import makeConversation from "../../entities/conversation/index.js";

export default function makeSaveConversation({ conversationsDb, usersDb, Id }) {
  return async function saveConversation(convData) {
    convData.id = convData.id || Id.genId();
    const conversation = makeConversation(convData);

    const idAlreadyTaken = !!(await conversationsDb.findById(
      conversation.getId()
    ));
    if (idAlreadyTaken)
      throw new Error("Comment with provided id already exists");

    for (let id of convData.membersIds) {
      const member = await usersDb.findById(id);
      if (!member) throw new Error("User not found");
    }

    return await conversationsDb.insert({
      id: conversation.getId(),
      membersIds: conversation.getMembersIds(),
      messages: conversation.getMessages(),
    });
  };
}
