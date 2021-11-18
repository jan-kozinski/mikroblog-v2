export default function makeMessage({
  id,
  authorId,
  conversationId,
  text,
  createdAt = new Date(),
  modifiedAt = createdAt,
} = {}) {
  return new Message(id, authorId, conversationId, text, createdAt, modifiedAt);
}

export class Message {
  #id;
  #authorId;
  #conversationId;
  #text;
  #createdAt;
  #modifiedAt;
  constructor(id, authorId, conversationId, text, createdAt, modifiedAt) {
    if (!id) throw new Error("Message id must be provided");
    if (typeof id !== "string") throw new Error("Message id must be a string");
    if (id.trim().length < 1) throw new Error("Message id must be provided");

    if (!authorId) throw new Error("Author id must be provided");
    if (typeof authorId !== "string")
      throw new Error("Author id must be a string");
    if (authorId.trim().length < 1)
      throw new Error("Author id must be provided");

    if (!conversationId) throw new Error("Conversation id must be provided");
    if (typeof conversationId !== "string")
      throw new Error("Conversation id must be a string");
    if (conversationId.trim().length < 1)
      throw new Error("Conversation id must be provided");

    if (!text) throw new Error("Message text must be provided");
    if (typeof text !== "string")
      throw new Error("Message text must be a string");
    if (text.trim().length < 1)
      throw new Error("Message text must be provided");

    if (!createdAt instanceof Date)
      throw new Error("createdAt should be of type date");
    if (!modifiedAt instanceof Date)
      throw new Error("modifiedAt should be of type date");
    if (modifiedAt < createdAt)
      throw new Error(
        "modifiedAt is in invalid state. Message can't be modified before its creation."
      );

    this.#id = id;
    this.#authorId = authorId;
    this.#conversationId = conversationId;
    this.#text = text;
    this.#createdAt = createdAt;
    this.#modifiedAt = modifiedAt;
  }

  getId() {
    return this.#id;
  }
  getAuthorId() {
    return this.#authorId;
  }
  getConversationId() {
    return this.#conversationId;
  }
  getText() {
    return this.#text;
  }
  getCreatedAt() {
    return this.#createdAt;
  }
  getModifiedAt() {
    return this.#modifiedAt;
  }
}
