import makeConversation from "../../entities/conversation/index.js";
import makeMessage, { Message } from "../../entities/message/index.js";

export default function makeAddMessage({ conversationsDb, usersDb, Id }) {
  return async function addMessage(msgData) {
    msgData.id = msgData.id || Id.genId();

    const message = makeMessage(msgData);
    const author = await usersDb.findById(message.getAuthorId());
    if (!author) throw new Error("User not found");
    const convRecord = await conversationsDb.findById(
      message.getConversationId()
    );
    if (!convRecord) throw new Error("Conversation not found");
    const conversation = makeConversation(convRecord);
    conversation.addMessage(message);
    conversationsDb.update(convRecord, {
      id: conversation.getId(),
      membersIds: conversation.getMembersIds(),
      messages: conversation.getMessages(),
    });
  };
}
