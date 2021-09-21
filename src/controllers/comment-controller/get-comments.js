import sanitizeQueries from "../sanitize-queries.js";
import respondWithError from "../send-error.js";

export default function makeGetComments({ listComments }) {
  return async function getComments(httpRequest) {
    const queries = sanitizeQueries(httpRequest.query);
    const { originalPostId } = httpRequest.params;

    try {
      const comments = await listComments(originalPostId, queries);
      const body = {
        success: true,
        payload: comments,
      };
      if (comments.totalCount) body.totalCount = comments.totalCount;
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 200,
        body,
      };
    } catch (error) {
      respondWithError(500, "Something went wrong...");
    }
  };
}
