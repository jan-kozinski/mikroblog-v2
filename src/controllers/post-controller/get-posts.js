import sanitizeQueries from "../sanitize-queries.js";
import respondWithError from "../send-error.js";

export default function makeGetPosts({ listPosts, listComments }) {
  return async function getPost({ query: queries }) {
    queries = sanitizeQueries(queries);

    try {
      const posts = await listPosts(queries);

      // Function makes a separate query for each of the posts.
      // Probably could be done with one good query.
      for (let i in posts) {
        const post = posts[i];
        const bestComments = await listComments(post.id, {
          limit: 2,
          byLikesCount: true,
          returnTotal: true,
        });
        if (!bestComments) {
          post.commentsTotal = 0;
          post.comments = [];
        } else {
          post.commentsTotal = bestComments.totalCount;
          delete bestComments.totalCount;
          post.comments = bestComments;
        }
      }

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
      console.error(error);
      return respondWithError(500, "Something went wrong...");
    }
  };
}
