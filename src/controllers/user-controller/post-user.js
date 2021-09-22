import respondWithError from "../send-error.js";

export default function makePostUser({ saveUser, token }) {
  return async function postUser(httpRequest) {
    let user, tokenValue;
    try {
      user = await saveUser(httpRequest.body);
    } catch (error) {
      return respondWithError(400, error.message, {
        cookies: {
          token: "",
        },
      });
    }
    try {
      tokenValue = await token.create({
        ip: httpRequest.ip,
        id: user.id,
        name: user.name,
        email: user.email,
        memberSince: user.memberSince.toString(),
      });
    } catch (error) {
      return respondWithError(500, "Something went wrong...", {
        cookies: {
          token: "",
        },
      });
    }

    return {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 201,
      body: {
        success: true,
        payload: {
          id: user.id,
          name: user.name,
          email: user.email,
          memberSince: user.memberSince,
        },
      },
      cookies: { token: tokenValue },
    };
  };
}
