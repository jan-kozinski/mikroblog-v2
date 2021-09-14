import respondWithError from "../send-error.js";

export default function makeSignUser({ authUser, token }) {
  return async function signUser(httpRequest) {
    try {
      const user = await authUser(httpRequest.body);
      if (user) {
        const tok = await token.create({
          ip: httpRequest.ip,
          id: user.id,
          name: user.name,
          email: user.email,
          memberSince: user.memberSince.toString(),
        });
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
          cookies: {
            token: tok,
          },
        };
      } else {
        return respondWithError(401, "Invalid credentials", {
          cookies: {
            token: "",
          },
        });
      }
    } catch (error) {
      return respondWithError(400, error.message, {
        cookies: {
          token: "",
        },
      });
    }
  };
}
