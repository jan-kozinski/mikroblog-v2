import { jest } from "@jest/globals";
import makeUnlikeComment from "./unlike-comment.js";

describe("Unlike comment controller", () => {
  let validCommData, undoLike, unlikeComment, token;
  beforeAll(() => {
    validCommData = {
      authorId: `user-${Math.round(Math.random() * 100)}`,
      originalPostId: `user-${Math.round(Math.random() * 100)}`,
      content: `content-${Math.round(Math.random() * 100)}`,
      likesCount: 1,
      likersIds: ["user123"],
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    };
    undoLike = jest.fn(({ commentId, userId }) =>
      userId === "user123"
        ? Promise.resolve({
            ...validCommData,
            id: commentId,
            likesCount: 0,
            likersIds: [],
          })
        : new Promise(() => {
            throw new Error("User doesn't like this post");
          })
    );
    token = {
      resolve: jest.fn((t) => (t === "legit" ? { id: "user123" } : null)),
    };
    unlikeComment = makeUnlikeComment({ undoLike, token });
  });
  afterEach(() => {
    undoLike.mockClear();
    token.resolve.mockClear();
  });
  it("Should respond with an error if request dosen't contain a cookie with JWT token", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    expect(undoLike).toBeCalledTimes(0);
    const actual = await unlikeComment(request);

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
    expect(undoLike).toBeCalledTimes(0);
  });

  it("Should respond with an error if request contains a cookie with invalid JWT token", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      cookies: {
        token: "invalid",
      },
    };

    expect(undoLike).toBeCalledTimes(0);
    const actual = await unlikeComment(request);

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
    expect(undoLike).toBeCalledTimes(0);
  });
  it("Should successfully unlike a comment", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      cookies: {
        token: "legit",
      },
      params: {
        commentId: "post321",
      },
    };

    expect(undoLike).toBeCalledTimes(0);
    expect(token.resolve).toBeCalledTimes(0);
    const actual = await unlikeComment(request);

    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 200,
      body: {
        success: true,
        payload: {
          likesCount: 0,
          likersIds: [],
        },
      },
    };

    expect(actual).toEqual(expected);
    expect(undoLike).toBeCalledTimes(1);

    expect(undoLike).toBeCalledWith({
      commentId: request.params.commentId,
      userId: "user123",
    });

    expect(token.resolve).toBeCalledTimes(1);
    expect(token.resolve).toBeCalledWith(request.cookies.token);
  });
  it("If error occurs, should respond with correct status code", async () => {
    const commentId = `ID-${Math.round(Math.random() * 100)}`;
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        commentId,
      },

      cookies: {
        token: "legit",
      },
    };

    let undoLikeErr = jest.fn(
      (p) =>
        new Promise(() => {
          throw new Error("Something went wrong...");
        })
    );
    let unlikeCommentErr = makeUnlikeComment({
      undoLike: undoLikeErr,
      token,
    });

    let actual = await unlikeCommentErr(request);

    let expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 500,
      body: {
        success: false,
        error: "Something went wrong...",
      },
    };

    expect(actual).toEqual(expected);

    undoLikeErr = jest.fn(
      (p) =>
        new Promise(() => {
          throw new Error("Comment not found");
        })
    );
    unlikeCommentErr = makeUnlikeComment({
      undoLike: undoLikeErr,
      token,
    });

    actual = await unlikeCommentErr(request);

    expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 404,
      body: {
        success: false,
        error: "Comment not found",
      },
    };

    expect(actual).toEqual(expected);
  });
});
