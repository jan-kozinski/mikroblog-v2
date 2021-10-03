import makePost from "../../entities/post/index.js";

export default function makeEditPost({ dbGateway }) {
  return async function editPost(postData) {
    const record = await dbGateway.findById(postData.id);

    if (!record) throw new Error("Post not found");
    const post = makePost(record);
    if (postData.authorId !== post.getAuthorId())
      throw new Error("User not allowed to edit this post");
    if (post.getContent() === postData.content)
      return {
        id: post.getId(),
        authorId: post.getAuthorId(),
        content: post.getContent(),
        createdAt: post.getCreatedAt(),
        modifiedAt: post.getModifiedAt(),
      };

    post.changeContent(postData.content);

    return await dbGateway.update(record, {
      id: post.getId(),
      content: post.getContent(),
      createdAt: post.getCreatedAt(),
      modifiedAt: post.getModifiedAt(),
    });
  };
}
