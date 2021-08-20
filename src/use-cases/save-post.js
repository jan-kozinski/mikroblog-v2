import makePost from "../entities/post/index.js";

export default function makeSavePost({ dbGateway, Id }) {
  return async function savePost(postData) {
    if (!postData.id) postData.id = Id.genId();
    const post = makePost(postData);
    const idAlreadyTaken = !!(await dbGateway.findById(post.getId()));
    if (idAlreadyTaken) throw new Error("post of provided id already exists");
    return await dbGateway.insert({
      id: post.getId(),
      authorId: post.getAuthorId(),
      content: post.getContent(),
      createdAt: post.getCreatedAt(),
      modifiedAt: post.getModifiedAt(),
    });
  };
}
