import makeComment from "../../entities/comment/index.js";

export default function makeLikeComment({ dbGateway }) {
  return async function likeComment({ commentId, userId }) {
    let record = await dbGateway.findById(commentId);

    if (!record) throw new Error("Comment not found");

    const comment = makeComment({
      id: record.id,
      originalPostId: record.originalPostId,
      authorId: record.authorId,
      content: record.content,
      likesCount: record.likesCount,
      likersIds: record.likersIds,
      createdAt: record.createdAt,
      modifiedAt: record.modifiedAt,
      isDeleted: record.isDeleted,
    });
    comment.giveLike(userId);
    return await dbGateway.update(record, {
      id: comment.getId(),
      authorId: comment.getAuthorId(),
      content: comment.getContent(),
      likesCount: comment.getLikesCount(),
      likersIds: comment.getLikersIds(),
      createdAt: comment.getCreatedAt(),
      modifiedAt: comment.getModifiedAt(),
      isDeleted: comment.isDeleted(),
    });
  };
}
