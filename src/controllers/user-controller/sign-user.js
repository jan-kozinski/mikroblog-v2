import respondWithError from "../send-error.js";

export default function makeSignUser({ authUser, token }) {
  return async function signUser(httpRequest) {
    let user, tokenValue;
    try {
      user = await authUser(httpRequest.body);
      if (!user)
        return respondWithError(401, "Invalid credentials", {
          cookies: {
            token: "",
          },
        });
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
      statusCode: 200,
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
