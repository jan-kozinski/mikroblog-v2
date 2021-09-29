import makeComment from "../../entities/comment/index.js";

export default function makeSaveComment({ commentsDb, usersDb, postsDb, Id }) {
  return async function saveComment(commData) {
    const originalPostExists = await postsDb.findById(commData.originalPostId);
    if (!originalPostExists)
      throw new Error(
        "Original post does not exist. Make sure it wasn't deleted."
      );

    commData.id = commData.id || Id.genId();
    const comment = makeComment(commData);

    const idAlreadyTaken = !!(await commentsDb.findById(comment.getId()));
    if (idAlreadyTaken)
      throw new Error("comment with provided id already exists");

    const author = await usersDb.findById(commData.authorId);
    const commentProps = {
      id: comment.getId(),
      originalPostId: comment.getOriginalPostId(),
      authorId: comment.getAuthorId(),
      author: author.name,
      content: comment.getContent(),
      likesCount: comment.getLikesCount(),
      likersIds: comment.getLikersIds(),
      createdAt: comment.getCreatedAt(),
      modifiedAt: comment.getModifiedAt(),
      isDeleted: comment.isDeleted(),
    };
    await commentsDb.insert(commentProps);
    return commentProps;
  };
}
