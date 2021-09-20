import { jest } from "@jest/globals";
import makeAddComment from "./add-comm.js";
import { randomBytes } from "crypto";

describe("Add comment controller", () => {
  let validCommData, saveComment, addComment, createdAt, modifiedAt, token;
  beforeAll(() => {
    validCommData = {
      authorId: `user-${Math.round(Math.random() * 100)}`,
      originalPostId: `user-${Math.round(Math.random() * 100)}`,
      content: `content-${Math.round(Math.random() * 100)}`,
    };
    createdAt = new Date(Date.now() + Math.round(Math.random() * 1000000));
    modifiedAt = new Date(Date.now() + Math.round(Math.random() * 2000000));
    saveComment = jest.fn((p) => {
      if (p.originalPostId === validCommData.originalPostId)
        return Promise.resolve({
          id: randomBytes(16).toString("hex"),
          author: p.authorId,
          content: p.content,
          originalPostId: p.originalPostId,
          likesCount: Math.round(Math.random() * 10),
          likersIds: [randomBytes(16).toString("hex")],
          createdAt,
          modifiedAt,
        });
      else return Promise.reject(new Error("Post not found"));
    });
    token = {
      resolve: jest.fn((t) =>
        t === "legit" ? { id: validCommData.authorId } : null
      ),
    };
    addComment = makeAddComment({ saveComment, token });
  });

  afterEach(() => {
    saveComment.mockClear();
    token.resolve.mockClear();
  });

  it("Should respond with an error if request doesn't contain originalPostId param", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        authorId: validCommData.authorId,
        content: validCommData.content,
      },
    };
    const actual = await addComment(request);

    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 404,
      body: {
        success: false,
        error: expect.any(String),
      },
    };
    expect(saveComment).toBeCalledTimes(0);
    expect(actual).toEqual(expected);
  });
  it("Should respond with an error if request doesn't contain a cookie with auth token", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        originalPostId: validCommData.originalPostId,
      },
      body: {
        authorId: validCommData.authorId,
        content: validCommData.content,
      },
    };

    expect(saveComment).toBeCalledTimes(0);
    const actual = await addComment(request);

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
    expect(saveComment).toBeCalledTimes(0);
  });
  it("Should respond with an error if request contains a cookie with invalid auth token", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        originalPostId: validCommData.originalPostId,
      },
      body: {
        authorId: validCommData.authorId,
        content: validCommData.content,
      },
      cookies: {
        token: "invalid",
      },
    };

    expect(saveComment).toBeCalledTimes(0);
    const actual = await addComment(request);

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
    expect(saveComment).toBeCalledTimes(0);
  });

  it("Should successfully add a comment", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        originalPostId: validCommData.originalPostId,
      },
      body: {
        content: validCommData.content,
      },
      cookies: {
        token: "legit",
      },
    };

    expect(saveComment).toBeCalledTimes(0);
    expect(token.resolve).toBeCalledTimes(0);
    const actual = await addComment(request);

    expect(saveComment).toBeCalledTimes(1);
    expect(saveComment).toBeCalledWith({
      originalPostId: validCommData.originalPostId,
      authorId: validCommData.authorId,
      content: validCommData.content,
    });

    const expectedPayload = await saveComment.mock.results[0].value;

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

  it("Should respond with an error if saving a post doesn't procede due to an error", async () => {
    const errorMsg = `test-error-${Math.round(Math.random() * 100)}`;

    const addCommErr = makeAddComment({
      saveComment: jest.fn(
        () =>
          new Promise(() => {
            throw new Error(errorMsg);
          })
      ),
      token,
    });

    const request = {
      headers: {
        "Content-Type": "application/json",
        body: { content: validCommData.content },
      },
      params: {
        originalPostId: validCommData.originalPostId,
      },
      cookies: {
        token: "legit",
      },
    };

    const actual = await addCommErr(request);

    expect(saveComment).toBeCalledTimes(0);

    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 400,
      body: {
        success: false,
        error: errorMsg,
      },
    };
    expect(actual).toEqual(expected);
  });
});
