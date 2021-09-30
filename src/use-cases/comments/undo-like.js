import makeComment from "../../entities/comment/index.js";

export default function makeUndoLike({ dbGateway }) {
  return async function undoLike({ commentId, userId }) {
    let record = await dbGateway.findById(commentId);

    if (!record) throw new Error("Comment not found");

    const comment = makeComment({
      id: record.id,
      originalPostId: record.originalPostId,
      authorId: record.authorId,
      content: record.content,
      likesCount: record.likesCount,
      likersIds: record.likersIds,
      isDeleted: record.isDeleted,
      createdAt: record.createdAt,
      modifiedAt: record.modifiedAt,
    });
    comment.undoLike(userId);
    return await dbGateway.update(record, {
      id: comment.getId(),
      originalPostId: comment.getOriginalPostId(),
      authorId: comment.getAuthorId(),
      content: comment.getContent(),
      likesCount: comment.getLikesCount(),
      likersIds: comment.getLikersIds(),
      isDeleted: comment.isDeleted(),
      createdAt: comment.getCreatedAt(),
      modifiedAt: comment.getModifiedAt(),
    });
  };
}
