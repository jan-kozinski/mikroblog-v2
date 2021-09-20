import respondWithError from "../send-error.js";

export default function makeGetComments({ listComments }) {
  return async function getComments(httpRequest) {
    const queries = httpRequest.query;
    const { originalPostId } = httpRequest.params;

    const limit = parseIntOrUndefined(queries.limit);
    const skip = parseIntOrUndefined(queries.skip);

    try {
      const comments = await listComments(originalPostId, {
        limit,
        skip,
        after: queries.after,
        before: queries.before,
        byNewest: queries.sortby === "newest",
      });

      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 200,
        body: {
          success: true,
          payload: comments,
        },
      };
    } catch (error) {
      respondWithError(500, "Something went wrong...");
    }
  };
}

function parseIntOrUndefined(num) {
  if (Object.is(+num, NaN)) return undefined;
  else return +num;
}
