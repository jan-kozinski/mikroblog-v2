import { jest } from "@jest/globals";
import makeSendMsg from "./send-message";
import { randomBytes } from "crypto";

describe("Send message controller", () => {
  let validMsgData, addMessage, sendMsg, createdAt, modifiedAt, token;

  createdAt = new Date(Date.now() + randomInt(1000000));
  modifiedAt = new Date(Date.now() + randomInt(2000000));

  beforeAll(() => {
    validMsgData = {
      authorId: `author-id-${randomInt()}`,
      conversationId: `conv-id-${randomInt()}`,
      text: `text-${randomInt()}`,
      createdAt,
      modifiedAt,
    };
    addMessage = jest.fn((msg) => {
      if (msg.conversationId === validMsgData.conversationId)
        return Promise.resolve({
          id: randomBytes(16).toString("hex"),
          authorId: msg.authorId,
          text: msg.text,
          conversationId: msg.conversationId,
          createdAt,
          modifiedAt,
        });
      else return Promise.reject(new Error("Post not found"));
    });
    token = {
      resolve: jest.fn((t) =>
        t === "legit" ? { id: validMsgData.authorId } : null
      ),
    };
    sendMsg = makeSendMsg({ addMessage, token });
  });
  afterEach(() => {
    addMessage.mockClear();
    token.resolve.mockClear();
  });

  it("Should respond with an error if request doesn't contain conversationId param", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        authorId: validMsgData.authorId,
        text: validMsgData.text,
      },
    };
    const actual = await sendMsg(request);

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
    expect(addMessage).toBeCalledTimes(0);
    expect(actual).toEqual(expected);
  });

  it("Should respond with an error if request doesn't contain a cookie with auth token", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        conversationId: validMsgData.conversationId,
      },
      body: {
        authorId: validMsgData.authorId,
        text: validMsgData.text,
      },
    };

    expect(addMessage).toBeCalledTimes(0);
    const actual = await sendMsg(request);

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
    expect(addMessage).toBeCalledTimes(0);
  });

  it("Should respond with an error if request contains a cookie with invalid auth token", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        conversationId: validMsgData.conversationId,
      },
      body: {
        authorId: validMsgData.authorId,
        content: validMsgData.content,
      },
      cookies: {
        token: "invalid",
      },
    };

    expect(addMessage).toBeCalledTimes(0);
    const actual = await sendMsg(request);

    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 403,
      body: {
        success: false,
        error: "Access denied-token invalid",
      },
    };

    expect(actual).toEqual(expected);
    expect(addMessage).toBeCalledTimes(0);
  });

  it("Should successfully send a message", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        conversationId: validMsgData.conversationId,
      },
      body: {
        content: validMsgData.content,
      },
      cookies: {
        token: "legit",
      },
    };

    expect(addMessage).toBeCalledTimes(0);
    expect(token.resolve).toBeCalledTimes(0);
    const actual = await sendMsg(request);

    expect(addMessage).toBeCalledTimes(1);
    expect(addMessage).toBeCalledWith({
      conversationId: validMsgData.conversationId,
      authorId: validMsgData.authorId,
      content: validMsgData.content,
    });

    const expectedPayload = await addMessage.mock.results[0].value;

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
});

function randomInt(max = 100, min = 1) {
  return Math.round(Math.random() * max + min);
}
