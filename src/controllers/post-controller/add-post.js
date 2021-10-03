import respondWithError from "../send-error.js";
import requireAuth from "../requireAuth.js";

export default function makeAddPost({ savePost, token }) {
  return async function addPost(httpRequest) {
    let signedUser;
    try {
      signedUser = await requireAuth(httpRequest, token);
    } catch (error) {
      return error;
    }
    try {
      const post = await savePost({
        ...httpRequest.body,
        authorId: signedUser.id,
      });
      post.commentsTotal = 0;
      post.comments = [];
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 201,
        body: {
          success: true,
          payload: post,
        },
      };
    } catch (error) {
      return respondWithError(400, error.message);
    }
  };
}
