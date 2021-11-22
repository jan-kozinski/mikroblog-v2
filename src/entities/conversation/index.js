import { Message } from "../message";

export default function makeConversation({
  id,
  membersIds = [],
  messages = [],
} = {}) {
  return new Conversation(id, membersIds, messages);
}

class Conversation {
  #id;
  #membersIds;
  #messages;
  constructor(id, membersIds, messages) {
    if (!id) throw new Error("Conversation id must be provided");
    if (typeof id !== "string")
      throw new Error("Conversation id must be a string");
    if (id.trim().length < 1)
      throw new Error("Conversation id must be provided");

    if (membersIds.length < 2)
      throw new Error("Conversation should have at least two members.");

    membersIds.forEach((id) => {
      if (!id) throw new Error("Member id must be provided");
      if (typeof id !== "string") throw new Error("Member id must be a string");
      if (id.trim().length < 1) throw new Error("Member id must be provided");
      if (membersIds.filter((filteredId) => filteredId === id).length > 1)
        throw new Error("Member ids can not contain duplicate ids");
    });

    if (messages.length) {
      messages.forEach((msg) => {
        if (!msg instanceof Message)
          throw new Error("Message should be of type Message");
      });
    }
    this.#id = id;
    this.#membersIds = membersIds;
    this.#messages = messages;
  }

  getId() {
    return this.#id;
  }

  getMembersIds() {
    return this.#membersIds;
  }

  getMessages() {
    return this.#messages;
  }

  addMessage(msg) {
    if (!(msg instanceof Message))
      throw new Error("Message should be of type Message");
    this.#messages = [...this.#messages, msg];
    return this.#messages;
  }
}
