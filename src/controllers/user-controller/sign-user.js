export default function makeSignUser({ authUser, token }) {
  return async function signUser(httpRequest) {
    try {
      const isAuthed = await authUser(httpRequest.body);
      if (isAuthed) {
        const tok = token.create({ email: httpRequest.body.email });
        return {
          headers: {
            "Content-Type": "application/json",
          },
          statusCode: 200,
          body: {
            success: true,
            cookies: {
              token: tok,
            },
          },
        };
      } else {
        return respondWithError(401, "Invalid credentials");
      }
    } catch (error) {
      return respondWithError(400, error.message);
    }
  };
}

const respondWithError = (code, msg) => {
  if (typeof code !== "number")
    throw new Error("error status code must be a number");
  if (typeof msg !== "string")
    throw new Error("error message must be a string");
  return {
    headers: {
      "Content-Type": "application/json",
    },
    statusCode: code,
    body: {
      success: false,
      error: msg,
      cookies: {
        token: "",
      },
    },
  };
};
