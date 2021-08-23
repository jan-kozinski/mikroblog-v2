import respondWithError from "../send-error.js";

export default function makeGetPosts({ listPosts }) {
  return async function addPost() {
    try {
      const posts = await listPosts();
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 200,
        body: {
          success: true,
          payload: posts,
        },
      };
    } catch (error) {
      respondWithError(500, "Something went wrong...");
    }
  };
}
