import respondWithError from "./send-error";

describe("send-error", () => {
  it("Should respond with proper error", () => {
    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 400 + Math.floor(Math.random() * 10),
      body: {
        success: false,
        error: `test error-${Math.floor(Math.random() * 1000)}`,
      },
    };
    const actual = respondWithError(expected.statusCode, expected.body.error);
    expect(actual).toEqual(expected);
  });

  it("Should throw an error if no status code is provided or the status code is not a number", () => {
    const invalidCodes = [undefined, null, "", "some string", [], {}];
    invalidCodes.forEach((c) => {
      expect(() => respondWithError(c, "message")).toThrow();
    });
  });

  it("Should throw an error if no message is provided or the message is not a string", () => {
    const invalidMsgs = [
      undefined,
      null,
      1,
      Math.floor(Math.random() * 10),
      [],
      {},
    ];
    invalidMsgs.forEach((msg) => {
      expect(() => respondWithError(400, msg)).toThrow();
    });
  });
  it("Should throw an error if options are provided but are not an object", () => {
    const invalidOptions = [
      null,
      "",
      "string",
      1,
      Math.floor(Math.random() * 10),
      [],
    ];
    invalidOptions.forEach((op) => {
      expect(() => respondWithError(400, "message", op)).toThrow();
    });
  });
});
