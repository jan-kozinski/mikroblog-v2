import respondWithError from "../send-error.js";
import requireAuth from "../requireAuth.js";

export default function makeUnlikeComment({ undoLike, token }) {
  return async function unlikePost(httpRequest) {
    let signedUser;
    try {
      signedUser = await requireAuth(httpRequest, token);
    } catch (error) {
      return error;
    }

    try {
      const data = await undoLike({
        commentId: httpRequest.params.commentId,
        userId: signedUser.id,
      });
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 200,
        body: {
          success: true,
          payload: {
            likesCount: data.likesCount,
            likersIds: data.likersIds,
          },
        },
      };
    } catch (error) {
      return respondWithError(400, error.message);
    }
  };
}
