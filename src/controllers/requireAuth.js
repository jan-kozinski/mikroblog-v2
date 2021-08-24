import respondWithError from "./send-error.js";

export default function requireAuth(httpRequest, token) {
  if (!httpRequest.cookies || !httpRequest.cookies.token)
    throw respondWithError(403, "Access denied-no token");
  const { token: jwt } = httpRequest.cookies;

  const decoded = token.resolve(jwt);
  if (!decoded || !decoded.id)
    throw respondWithError(403, "Access denied-token invalid");
  else return decoded;
}
