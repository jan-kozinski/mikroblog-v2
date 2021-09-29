import respondWithError from "../send-error.js";
import requireAuth from "../requireAuth.js";

export default function makeDeleteComment({ removeComment, token }) {
  return async function (httpRequest) {
    if (!httpRequest.params || !httpRequest.params.commentId)
      return respondWithError(404, "Comment not found");

    let signedUser;
    try {
      signedUser = await requireAuth(httpRequest, token);
    } catch (error) {
      return error;
    }

    try {
      const result = await removeComment(httpRequest.params.commentId);
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 200,
        body: {
          success: true,
          payload: {
            id: result.id,
            content: result.content,
            isDeleted: result.isDeleted,
          },
        },
      };
    } catch (error) {
      let status = 400;
      if (error.message === "Comment not found") status = 404;
      if (error.message === "User not allowed to delete this comment")
        status = 403;
      if (error.message === "Something went wrong...") status = 500;

      return respondWithError(status, error.message);
    }
  };
}
