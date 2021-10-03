import respondWithError from "../send-error.js";
import requireAuth from "../requireAuth.js";

export default function makeDeletePost({ removePost, token }) {
  return async function deletePost(httpRequest) {
    if (!httpRequest.params || !httpRequest.params.postId)
      return respondWithError(404, "Post not found");

    let signedUser;
    try {
      signedUser = await requireAuth(httpRequest, token);
    } catch (error) {
      return error;
    }
    try {
      await removePost(httpRequest.params.postId, signedUser.id);
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 200,
        body: {
          success: true,
        },
      };
    } catch (error) {
      let status = 400;
      if (error.message === "Post not found") status = 404;
      if (error.message === "User not allowed to delete this post")
        status = 403;
      if (error.message === "Something went wrong...") status = 500;
      return respondWithError(status, error.message);
    }
  };
}
