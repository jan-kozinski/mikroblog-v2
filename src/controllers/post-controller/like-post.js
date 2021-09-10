import respondWithError from "../send-error.js";
import requireAuth from "../requireAuth.js";

export default function makeLikePost({ giveLike, token }) {
  return async function likePost(httpRequest) {
    try {
      let signedUser;
      try {
        signedUser = await requireAuth(httpRequest, token);
      } catch (error) {
        return error;
      }

      const data = await giveLike({
        postId: httpRequest.params.postId,
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
