import { jest } from "@jest/globals";
import makeCreateConv from "./create-conversation";
import { randomBytes } from "crypto";

describe("Create  conversation controller", () => {
  let validConvData, saveConversation, createConv, token;
  beforeAll(() => {
    validConvData = {
      membersIds: [`user-1-${randomInt()}`, `user-2-${randomInt()}`],
      messages: [],
    };
    saveConversation = jest.fn((p) => {
      return Promise.resolve({
        id: randomBytes(16).toString("hex"),
        membersIds: validConvData.membersIds,
        messages: validConvData.messages,
      });
    });
    token = {
      resolve: jest.fn((t) =>
        t === "legit" ? { id: validConvData.membersIds[0] } : null
      ),
    };
    createConv = makeCreateConv({ saveConversation, token });
  });
  afterEach(() => {
    saveConversation.mockClear();
    token.resolve.mockClear();
  });
  it("Should respond with an error if request doesn't contain a cookie with auth token", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        membersIds: validConvData.membersIds,
      },
    };
    expect(saveConversation).toBeCalledTimes(0);
    const actual = await createConv(request);

    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 403,
      body: {
        success: false,
        error: "Access denied-no token",
      },
    };

    expect(actual).toEqual(expected);
    expect(saveConversation).toBeCalledTimes(0);
  });

  it("Should successfully create a conversation", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        membersIds: validConvData.membersIds,
      },
      cookies: {
        token: "legit",
      },
    };

    expect(saveConversation).toBeCalledTimes(0);
    expect(token.resolve).toBeCalledTimes(0);
    const actual = await createConv(request);

    expect(saveConversation).toBeCalledTimes(1);
    expect(saveConversation).toBeCalledWith(
      expect.objectContaining({ ...validConvData })
    );

    const expectedPayload = await saveConversation.mock.results[0].value;

    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 201,
      body: {
        success: true,
        payload: expectedPayload,
      },
    };

    expect(actual).toEqual(expected);

    expect(token.resolve).toBeCalledTimes(1);
    expect(token.resolve).toBeCalledWith(request.cookies.token);
  });
  it("Should respond with an error if conversation members ids doesn't include the request sender's id", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        membersIds: ["three", "random", "people"],
      },
      cookies: {
        token: "legit",
      },
    };

    expect(saveConversation).toBeCalledTimes(0);
    expect(token.resolve).toBeCalledTimes(0);
    const actual = await createConv(request);

    expect(saveConversation).toBeCalledTimes(0);

    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 400,
      body: {
        success: false,
        error: expect.any(String),
      },
    };

    expect(actual).toEqual(expected);

    expect(token.resolve).toBeCalledTimes(1);
    expect(token.resolve).toBeCalledWith(request.cookies.token);
  });
});

function randomInt(max = 100, min = 1) {
  return Math.round(Math.random() * max + min);
}
