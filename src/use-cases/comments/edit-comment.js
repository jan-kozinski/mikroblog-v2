import makeComment from "../../entities/comment/index.js";

export default function makeEditComment({ dbGateway }) {
  return async function editComment(commData) {
    let record;
    try {
      record = await dbGateway.findById(commData.id);
    } catch (error) {
      console.error(error);
      throw new Error("Something went wrong...");
    }

    if (!record) throw new Error("Comment not found");
    const comm = makeComment(record);
    if (commData.authorId !== comm.getAuthorId())
      throw new Error("User not allowed to edit this comment");
    if (comm.getContent() === commData.content)
      return {
        id: comm.getId(),
        authorId: comm.getAuthorId(),
        content: comm.getContent(),
        createdAt: comm.getCreatedAt(),
        modifiedAt: comm.getModifiedAt(),
      };

    comm.changeContent(commData.content);
    try {
      return await dbGateway.update(record, {
        id: comm.getId(),
        content: comm.getContent(),
        createdAt: comm.getCreatedAt(),
        modifiedAt: comm.getModifiedAt(),
      });
    } catch (error) {
      console.error(error);
      throw new Error("Something went wrong...");
    }
  };
}
