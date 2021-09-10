import respondWithError from "./send-error.js";

export default async function requireAuth(httpRequest, token) {
  if (!httpRequest.cookies || !httpRequest.cookies.token)
    throw respondWithError(403, "Access denied-no token");
  const { token: providedToken } = httpRequest.cookies;
  try {
    const decoded = await token.resolve(providedToken);
    if (!decoded || !decoded.id) throw new Error();
    return decoded;
  } catch (error) {
    throw respondWithError(403, "Access denied-token invalid");
  }
}
