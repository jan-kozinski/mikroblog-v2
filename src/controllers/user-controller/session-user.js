import respondWithError from "../send-error.js";

export default function makeSessionUser({ token }) {
  return async function sessionUser(httpRequest) {
    try {
      const { token: providedToken } = httpRequest.cookies;
      const userData = await token.resolve(providedToken);
      return {
        body: {
          payload: {
            email: userData.email,
            id: userData.id,
            name: userData.name,
            memberSince: userData.memberSince,
          },
          success: true,
        },
        cookies: { token: providedToken },
        headers: { "Content-Type": "application/json" },
        statusCode: 200,
      };
    } catch (error) {
      return respondWithError(401, "Session timed out", {
        cookies: {
          token: "",
        },
      });
    }
  };
}
