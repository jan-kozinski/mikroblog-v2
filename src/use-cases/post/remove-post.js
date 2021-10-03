import makePost from "../../entities/post/index.js";

export default function makeRemovePost({ postsDb, commentsDb }) {
  return async function removePost(postId, userId) {
    const postRecord = await postsDb.findById(postId);
    if (!postRecord) throw new Error("Post not found");
    const postEntity = makePost({ ...postRecord });

    if (userId !== postEntity.getAuthorId())
      throw new Error("User not allowed to delete this post");
    await postsDb.deleteById(postId);
    await commentsDb.deleteMany({ originalPostId: postId });
  };
}
