import sanitizeQueries from "../sanitize-queries.js";
import respondWithError from "../send-error.js";
import requireAuth from "../requireAuth.js";

export default function makeGetUserConvs({ listUserConvs, token }) {
  return async function getUserConvs(httpRequest) {
    let signedUser;
    try {
      signedUser = await requireAuth(httpRequest, token);
    } catch (error) {
      return error;
    }

    const queries = sanitizeQueries(httpRequest.queries || {});

    try {
      const posts = await listUserConvs(signedUser.id, queries);

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
