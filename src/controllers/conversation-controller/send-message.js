import respondWithError from "../send-error.js";
import requireAuth from "../requireAuth.js";

export default function makeSendMsg({ addMessage, token }) {
  return async function sendMsg(httpRequest) {
    if (!httpRequest.params || !httpRequest.params.conversationId)
      return respondWithError(400, "conversation id must be provided");

    let signedUser;
    try {
      signedUser = await requireAuth(httpRequest, token);
    } catch (error) {
      return error;
    }

    try {
      const message = await addMessage({
        ...httpRequest.body,
        conversationId: httpRequest.params.conversationId,
        authorId: signedUser.id,
      });

      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 201,
        body: {
          success: true,
          payload: message,
        },
      };
    } catch (error) {
      return respondWithError(400, error.message);
    }
  };
}
