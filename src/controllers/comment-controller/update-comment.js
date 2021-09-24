import respondWithError from "../send-error.js";
import requireAuth from "../requireAuth.js";

export default function makeUpdateComment({ editComment, token }) {
  return async function updateComment(httpRequest) {
    if (!httpRequest.params || !httpRequest.params.commentId)
      return respondWithError(404, "Comment not found");

    let signedUser;
    try {
      signedUser = await requireAuth(httpRequest, token);
    } catch (error) {
      return error;
    }

    try {
      const post = await editComment({
        ...httpRequest.body,
        authorId: signedUser.id,
        id: httpRequest.params.commentId,
      });
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 200,
        body: {
          success: true,
          payload: {
            content: post.content,
            createdAt: post.createdAt,
            modifiedAt: post.modifiedAt,
          },
        },
      };
    } catch (error) {
      let status = 400;
      if (error.message === "Comment not found") status = 404;
      if (error.message === "User not allowed to edit this comment")
        status = 403;
      if (error.message === "Something went wrong...") status = 500;

      return respondWithError(status, error.message);
    }
  };
}
