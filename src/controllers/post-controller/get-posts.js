import respondWithError from "../send-error.js";

export default function makeGetPosts({ listPosts }) {
  return async function getPost({ query: queries }) {
    const limit = parseIntOrUndefined(queries.limit);
    const skip = parseIntOrUndefined(queries.skip);

    try {
      const posts = await listPosts({
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
          payload: posts,
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
