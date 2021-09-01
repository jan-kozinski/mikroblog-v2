export default function makePost({
  id,
  authorId,
  content,
  likesCount = 0,
  likersIds = [],
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

  if (typeof likesCount !== "number")
    throw new Error("Likes count must be a number");
  if (likesCount < 0)
    throw new Error("Likes count may not be a negative value");
  if (!Array.isArray(likersIds))
    throw new Error(
      "Likers ids must be an array containing string value of the likers ids"
    );
  likersIds.forEach((l) => {
    if (typeof l !== "string")
      throw new Error(
        "Likers ids must be an array containing string value of the likers ids"
      );
  });

  return Object.freeze({
    getId: () => id,
    getAuthorId: () => authorId,
    getContent: () => content,
    getCreatedAt: () => createdAt,
    getModifiedAt: () => modifiedAt,
    getLikesCount: () => likesCount,
    getLikersIds: () => likersIds,
    giveLike: (userId) => {
      if (!userId) throw new Error("User id must be provided");
      if (typeof userId !== "string")
        throw new Error("User id must be a string");
      if (likersIds.includes(userId))
        throw new Error("User already likes this post");

      likersIds.push(userId);
      likesCount++;
      return likesCount;
    },
    undoLike: (userId) => {
      if (!userId) throw new Error("User id must be provided");
      if (typeof userId !== "string")
        throw new Error("User id must be a string");
      if (!likersIds.includes(userId))
        throw new Error("User does not like this post");

      likersIds = likersIds.filter((l) => l !== userId);
      likesCount--;
      return likesCount;
    },
    changeContent: (newContent) => {
      if (!newContent) throw new Error("Content must be provided");
      if (newContent === content) return content;
      content = newContent;
      modifiedAt = new Date();
      return content;
    },
  });
}
