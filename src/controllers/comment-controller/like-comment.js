import respondWithError from "../send-error.js";
import requireAuth from "../requireAuth.js";

export default function makeLikeComment({ giveLike, token }) {
  return async function likeComment(httpRequest) {
    let signedUser;
    try {
      signedUser = await requireAuth(httpRequest, token);
    } catch (error) {
      return error;
    }

    try {
      const data = await giveLike({
        commentId: httpRequest.params.commentId,
        userId: signedUser.id,
      });

      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 201,
        body: {
          success: true,
          payload: {
            likersIds: data.likersIds,
            likesCount: data.likesCount,
          },
        },
      };
    } catch (error) {
      let status = 400;
      if (error.message === "Comment not found") status = 404;
      if (error.message === "Something went wrong...") status = 500;

      return respondWithError(status, error.message);
    }
  };
}
