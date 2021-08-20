export default function respondWithError(code, msg, options = {}) {
  if (typeof code !== "number")
    throw new Error("error status code must be a number");
  if (typeof msg !== "string")
    throw new Error("error message must be a string");
  if (typeof options !== "object" || options === null || Array.isArray(options))
    throw new Error("options if provided should be an object");

  const body = {
    success: false,
    error: msg,
  };

  if (options.cookies) body.cookies = options.cookies;

  return {
    headers: {
      "Content-Type": "application/json",
    },
    statusCode: code,
    body,
  };
}
