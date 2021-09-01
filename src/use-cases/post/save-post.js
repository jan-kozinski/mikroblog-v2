import makePost from "../../entities/post/index.js";

export default function makeSavePost({ postsDb, usersDb, Id }) {
  return async function savePost(postData) {
    if (!postData.id) postData.id = Id.genId();
    const post = makePost(postData);
    const idAlreadyTaken = !!(await postsDb.findById(post.getId()));
    if (idAlreadyTaken) throw new Error("post of provided id already exists");
    const author = await usersDb.findById(post.getAuthorId());
    if (!author) throw new Error("User doesn't exist");
    const postProps = {
      id: post.getId(),
      authorId: post.getAuthorId(),
      author: author.name,
      content: post.getContent(),
      likesCount: post.getLikesCount(),
      likersIds: post.getLikersIds(),
      createdAt: post.getCreatedAt(),
      modifiedAt: post.getModifiedAt(),
    };
    await postsDb.insert(postProps);
    return postProps;
  };
}
