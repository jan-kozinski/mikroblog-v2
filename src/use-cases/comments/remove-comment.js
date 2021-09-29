import makeComment from "../../entities/comment/index.js";
export default function makeRemoveComment({ dbGateway }) {
  return async function removeComment(commentId) {
    const record = await dbGateway.findById(commentId);
    if (!record) throw new Error("Comment not found");
    const entity = makeComment(record);
    entity.markDeleted();

    const data = {
      id: entity.getId(),
      originalPostId: entity.getOriginalPostId(),
      authorId: entity.getAuthorId(),
      content: entity.getContent(),
      likesCount: entity.getLikesCount(),
      likersIds: entity.getLikersIds(),
      createdAt: entity.getCreatedAt(),
      modifiedAt: entity.getModifiedAt(),
      isDeleted: entity.isDeleted(),
    };

    return await dbGateway.update(record, data);
  };
}
