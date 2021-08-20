export default function makePost({
  id,
  authorId,
  content,
  createdAt = new Date(),
  modifiedAt = createdAt,
} = {}) {
  if (!id) throw new Error("Post id must be provided");
  if (typeof id !== "string") throw new Error("Post id must be a string");
  if (id.trim().length < 1) throw new Error("Post id must be provided");

  if (!authorId) throw new Error("Author id must be provided");
  if (typeof authorId !== "string")
    throw new Error("Author id must be a string");
  if (authorId.trim().length < 1) throw new Error("Author id must be provided");

  if (!content) throw new Error("Content must be provided");
  if (typeof content !== "string")
    throw new Error("Post content must be a string");
  if (content.trim().length < 1) throw new Error("Content must be provided");

  return Object.freeze({
    getId: () => id,
    getAuthorId: () => authorId,
    getContent: () => content,
    getCreatedAt: () => createdAt,
    getModifiedAt: () => modifiedAt,
    changeContent: (newContent) => {
      if (!newContent) throw new Error("New content must be provided");
      if (newContent === content) return content;
      content = newContent;
      modifiedAt = new Date();
      return content;
    },
  });
}
