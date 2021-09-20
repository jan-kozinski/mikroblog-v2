import respondWithError from "../send-error.js";
import requireAuth from "../requireAuth.js";

export default function makeAddComment({ saveComment, token }) {
  return async function addComment(httpRequest) {
    if (!httpRequest.params || !httpRequest.params.originalPostId)
      return respondWithError(400, "Original post id must be provided");

    let signedUser;
    try {
      signedUser = await requireAuth(httpRequest, token);
    } catch (error) {
      return error;
    }

    try {
      const comment = await saveComment({
        ...httpRequest.body,
        originalPostId: httpRequest.params.originalPostId,
        authorId: signedUser.id,
      });

      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 201,
        body: {
          success: true,
          payload: comment,
        },
      };
    } catch (error) {
      return respondWithError(400, error.message);
    }
  };
}
