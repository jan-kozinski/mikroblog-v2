import respondWithError from "../send-error.js";
export default function makeGetUsers({ searchUsers }) {
  return async function getUsers(httpRequest) {
    if (!httpRequest.query || !httpRequest.query.name) {
      return respondWithError(400, "Query name must be provided");
    }

    const { name } = httpRequest.query;

    try {
      const users = await searchUsers(name);

      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 200,
        body: {
          success: true,
          payload: users,
        },
      };
    } catch (error) {
      console.error(error);
      return respondWithError(500, "Something went wrong...");
    }
  };
}
