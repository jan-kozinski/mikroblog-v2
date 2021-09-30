import respondWithError from "../send-error.js";
import requireAuth from "../requireAuth.js";

export default function makeLikeComment({ giveLike, token }) {
  return async function likeComment(httpRequest) {
    return {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 201,
      body: {
        success: true,
        payload: {
          likersIds: "data.likersIds",
          likesCount: "data.likesCount",
        },
      },
    };

    // let signedUser;
    // try {
    //   signedUser = await requireAuth(httpRequest, token);
    // } catch (error) {
    //   return error;
    // }

    // try {
    //   const data = await giveLike({
    //     commentId: httpRequest.params.commentId,
    //     userId: signedUser.id,
    //   });

    //   return {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     statusCode: 201,
    //     body: {
    //       success: true,
    //       payload: {
    //         likersIds: data.likersIds,
    //         likesCount: data.likesCount,
    //       },
    //     },
    //   };
    // } catch (error) {
    //   console.error(error);
    //   return respondWithError(400, error.message);
    // }
  };
}
