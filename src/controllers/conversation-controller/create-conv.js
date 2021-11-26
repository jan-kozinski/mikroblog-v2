import respondWithError from "../send-error.js";
import requireAuth from "../requireAuth.js";

export default function makeCreateConv({ saveConversation, token }) {
  return async function createConv(httpRequest) {
    let signedUser;
    try {
      signedUser = await requireAuth(httpRequest, token);
    } catch (error) {
      return error;
    }

    try {
      sanitizeBody(httpRequest.body);

      const { membersIds } = httpRequest.body;
      if (!membersIds.includes(signedUser.id))
        throw new Error(
          "User is not allowed to create a conversation that doesn't include him"
        );

      const conversation = await saveConversation({
        membersIds: httpRequest.body.membersIds,
        messages: [],
      });
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 201,
        body: {
          success: true,
          payload: conversation,
        },
      };
    } catch (error) {
      return respondWithError(400, error.message);
    }
  };
}

function sanitizeBody(body) {
  if (!body || !body.membersIds || !(body.membersIds instanceof Array))
    throw new Error("Please provide conversation members ids");
}
