import respondWithError from "../send-error.js";

export default function makeAddPost({ savePost, token }) {
  return async function addPost(httpRequest) {
    try {
      if (!httpRequest.cookies || !httpRequest.cookies.token)
        return respondWithError(403, "Access denied-no token");
      const { token: jwt } = httpRequest.cookies;

      const decoded = token.resolve(jwt);
      if (!decoded || !decoded.id)
        return respondWithError(403, "Access denied-token invalid");
      const post = await savePost({
        ...httpRequest.body,
        authorId: decoded.id,
      });
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 201,
        body: {
          success: true,
          payload: {
            authorId: post.authorId,
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
