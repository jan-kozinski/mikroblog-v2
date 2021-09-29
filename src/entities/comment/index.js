export default function makeComment({
  id,
  authorId,
  content,
  originalPostId,
  isDeleted = false,
  likesCount = 0,
  likersIds = [],
  createdAt = new Date(),
  modifiedAt = createdAt,
} = {}) {
  if (!id) throw new Error("Comment id must be provided");
  if (typeof id !== "string") throw new Error("Comment id must be a string");
  if (id.trim().length < 1) throw new Error("Comment id must be provided");

  if (!authorId) throw new Error("Author id must be provided");
  if (typeof authorId !== "string")
    throw new Error("Author id must be a string");
  if (authorId.trim().length < 1) throw new Error("Author id must be provided");

  validateContent(content);

  if (!originalPostId) throw new Error("Original post id must be provided");
  if (typeof originalPostId !== "string")
    throw new Error("Original post id must be a string");
  if (originalPostId.trim().length < 1)
    throw new Error("Original post id must be provided");

  return Object.freeze({
    getId: () => id,
    getAuthorId: () => authorId,
    getOriginalPostId: () => originalPostId,
    getContent: () => content,
    getCreatedAt: () => createdAt,
    getModifiedAt: () => modifiedAt,
    getLikesCount: () => likesCount,
    getLikersIds: () => likersIds,
    giveLike: (userId) => {
      if (isDeleted) throw new Error("Can not give like to a deleted comment");
      if (!userId) throw new Error("User id must be provided");
      if (typeof userId !== "string")
        throw new Error("User id must be a string");
      if (likersIds.includes(userId))
        throw new Error("User already likes this comment");

      likersIds.push(userId);
      likesCount++;
      return likesCount;
    },
    isDeleted: () => isDeleted,
    undoLike: (userId) => {
      if (isDeleted)
        throw new Error("Can not revoke like from a deleted comment");
      if (!userId) throw new Error("User id must be provided");
      if (typeof userId !== "string")
        throw new Error("User id must be a string");
      if (!likersIds.includes(userId))
        throw new Error("User does not like this comment");

      likersIds = likersIds.filter((l) => l !== userId);
      likesCount--;
      return likesCount;
    },
    markDeleted: () => {
      isDeleted = true;
      content = "This comment has been deleted";
      return content;
    },
    changeContent: (newContent) => {
      if (isDeleted)
        throw new Error("Can not update the content of deleted comment");
      if (!newContent) throw new Error("Content must be provided");
      if (newContent === content) return content;
      validateContent(newContent);
      content = newContent;
      modifiedAt = new Date();
      return content;
    },
  });
}

function validateContent(content) {
  if (!content) throw new Error("Content must be provided");
  if (typeof content !== "string")
    throw new Error("Comment content must be a string");
  if (content.trim().length < 1) throw new Error("Content must be provided");
}
