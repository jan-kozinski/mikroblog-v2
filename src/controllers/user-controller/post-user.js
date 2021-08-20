import respondWithError from "../send-error.js";

export default function makePostUser({ saveUser }) {
  return async function postUser(httpRequest) {
    try {
      await saveUser(httpRequest.body);
    } catch (error) {
      return respondWithError(400, error.message);
    }

    return {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 201,
      body: {
        success: true,
        payload: {
          name: httpRequest.body.name,
          email: httpRequest.body.email,
          memberSince: new Date(),
        },
      },
    };
  };
}
