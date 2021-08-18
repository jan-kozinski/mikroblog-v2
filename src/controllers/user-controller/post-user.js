export default function makePostUser({ saveUser }) {
  return async function postUser(httpRequest) {
    try {
      await saveUser(httpRequest.body);
    } catch (error) {
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 400,
        body: {
          error: error.message,
        },
      };
    }

    return {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 201,
      body: {
        name: httpRequest.body.name,
        email: httpRequest.body.email,
        memberSince: new Date(),
      },
    };
  };
}
