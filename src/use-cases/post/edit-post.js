import makePost from "../../entities/post/index.js";

export default function makeEditPost({ dbGateway }) {
  return async function editPost(postData) {
    let record = await dbGateway.findById(postData.id);

    if (!record) throw new Error("Post not found");
    const post = makePost({
      id: record.id,
      authorId: postData.authorId,
      createdAt: record.createdAt,
      content: postData.content,
      modifiedAt: new Date(),
    });
    if (postData.authorId !== record.authorId)
      throw new Error("User not allowed to edit this post");
    return await dbGateway.update(record, {
      id: post.getId(),
      authorId: post.getAuthorId(),
      content: post.getContent(),
      createdAt: post.getCreatedAt(),
      modifiedAt: post.getModifiedAt(),
    });
  };
}
