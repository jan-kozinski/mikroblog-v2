import respondWithError from "../send-error.js";

export default function makeGetPosts({ listPosts }) {
  return async function getPost({ query }) {
    const limit = !Object.is(+query.limit, NaN) ? +query.limit : undefined;
    const skip = !Object.is(+query.skip, NaN) ? +query.skip : undefined;

    try {
      const posts = await listPosts({
        limit,
        skip,
        after: query.after,
        before: query.before,
        byNewest: query.sortby === "newest",
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
