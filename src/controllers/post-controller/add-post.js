import respondWithError from "../send-error.js";
import requireAuth from "../requireAuth.js";

export default function makeAddPost({ savePost, token }) {
  return async function addPost(httpRequest) {
    try {
      let signedUser;
      try {
        signedUser = requireAuth(httpRequest, token);
      } catch (error) {
        return error;
      }
      const post = await savePost({
        ...httpRequest.body,
        authorId: signedUser.id,
      });
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 201,
        body: {
          success: true,
          payload: {
            id: post.id,
            author: post.author,
            content: post.content,
            createdAt: post.createdAt,
            modifiedAt: post.modifiedAt,
          },
        },
      };
    } catch (error) {
      return respondWithError(400, error.message);
    }
  };
}
