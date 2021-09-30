import { jest } from "@jest/globals";
import makeLikeComment from "./like-comment";

describe("Like comment controller", () => {
  let validCommData, giveLike, likeComment, token;

  beforeAll(() => {
    validCommData = {
      originalCommId: `user-${Math.round(Math.random() * 100)}`,
      authorId: `user-${Math.round(Math.random() * 100)}`,
      content: `content-${Math.round(Math.random() * 100)}`,
      likesCount: 0,
      likersIds: [],
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    };
    giveLike = jest.fn(({ commentId, userId }) =>
      Promise.resolve({
        ...validCommData,
        id: commentId,
        likesCount: 1,
        likersIds: [userId],
      })
    );
    token = {
      resolve: jest.fn((t) => (t === "legit" ? { id: "user123" } : null)),
    };
    likeComment = makeLikeComment({ giveLike, token });
  });
  afterEach(() => {
    giveLike.mockClear();
    token.resolve.mockClear();
  });

  it("Should respond with an error if request dosen't contain a cookie with JWT token", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    expect(giveLike).toBeCalledTimes(0);
    const actual = await likeComment(request);

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
    expect(giveLike).toBeCalledTimes(0);
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

    expect(giveLike).toBeCalledTimes(0);
    const actual = await likeComment(request);

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
    expect(giveLike).toBeCalledTimes(0);
  });

  it("Should successfully like a post", async () => {
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

    expect(giveLike).toBeCalledTimes(0);
    expect(token.resolve).toBeCalledTimes(0);
    const actual = await likeComment(request);

    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 201,
      body: {
        success: true,
        payload: {
          likesCount: 1,
          likersIds: ["user123"],
        },
      },
    };

    expect(actual).toEqual(expected);
    expect(giveLike).toBeCalledTimes(1);

    expect(giveLike).toBeCalledWith({
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

    let giveLikeErr = jest.fn(
      (p) =>
        new Promise(() => {
          throw new Error("Something went wrong...");
        })
    );
    let likeCommentErr = makeLikeComment({
      giveLike: giveLikeErr,
      token,
    });

    let actual = await likeCommentErr(request);

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

    giveLikeErr = jest.fn(
      (p) =>
        new Promise(() => {
          throw new Error("Comment not found");
        })
    );
    likeCommentErr = makeLikeComment({
      giveLike: giveLikeErr,
      token,
    });

    actual = await likeCommentErr(request);

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
