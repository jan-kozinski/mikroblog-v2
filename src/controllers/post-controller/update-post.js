import respondWithError from "../send-error.js";
import requireAuth from "../requireAuth.js";

export default function makeUpdatePost({ editPost, token }) {
  return async function updatePost(httpRequest) {
    try {
      if (!httpRequest.params || !httpRequest.params.postId)
        return respondWithError(404, "Post not found");

      let signedUser;
      try {
        signedUser = requireAuth(httpRequest, token);
      } catch (error) {
        return error;
      }

      const post = await editPost({
        ...httpRequest.body,
        authorId: signedUser.id,
        id: httpRequest.params.postId,
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
      const status = error.message === "Post not found" ? 404 : 400;
      return respondWithError(status, error.message);
    }
  };
}
