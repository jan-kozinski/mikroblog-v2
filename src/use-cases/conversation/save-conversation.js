import makeConversation from "../../entities/conversation/index.js";

export default function makeSaveConversation({ conversationsDb, Id }) {
  return async function saveConversation(convData) {
    convData.id = convData.id || Id.genId();
    const conversation = makeConversation(convData);
    const idAlreadyTaken = !!(await conversationsDb.findById(
      conversation.getId()
    ));
    if (idAlreadyTaken)
      throw new Error("Comment with provided id already exists");

    return await conversationsDb.insert({
      id: conversation.getId(),
      membersIds: conversation.getMembersIds(),
      messages: conversation.getMessages(),
    });
  };
}
