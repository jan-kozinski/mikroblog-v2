import makePost from "../../entities/post/index.js";

export default function makeUndoLike({ dbGateway }) {
  return async function undoLike({ postId, userId }) {
    let record = await dbGateway.findById(postId);

    if (!record) throw new Error("Post not found");

    const post = makePost({
      id: record.id,
      authorId: record.authorId,
      content: record.content,
      likesCount: record.likesCount,
      likersIds: record.likersIds,
      createdAt: record.createdAt,
      modifiedAt: record.modifiedAt,
    });
    post.undoLike(userId);
    return await dbGateway.update(record, {
      id: post.getId(),
      authorId: post.getAuthorId(),
      content: post.getContent(),
      likesCount: post.getLikesCount(),
      likersIds: post.getLikersIds(),
      createdAt: post.getCreatedAt(),
      modifiedAt: post.getModifiedAt(),
    });
  };
}
