import { jest } from "@jest/globals";
import makeDeleteComment from "./delete-comment";

describe("Delete comment controller", () => {
  let validCommentData, deleteComment, removeComment, token, commentId;
  beforeAll(() => {
    validCommentData = {
      authorId: `user-${Math.round(Math.random() * 100)}`,
      originalPostId: `op-${Math.round(Math.random() * 100)}`,
      content: `content-${Math.round(Math.random() * 100)}`,
    };
    commentId = `id-${Math.round(Math.random() * 100)}`;
    token = {
      resolve: jest.fn((t) =>
        t === "legit" ? { id: validCommentData.authorId } : null
      ),
    };
    removeComment = jest.fn((p) =>
      Promise.resolve({
        id: commentId,
        isDeleted: true,
        content: "comment deleted",
      })
    );
    deleteComment = makeDeleteComment({ removeComment, token });
  });

  afterEach(() => {
    token.resolve.mockClear();
    removeComment.mockClear();
  });

  it("Should respond with an error if request doesn't contain a param with comment id", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    expect(removeComment).toBeCalledTimes(0);
    const actual = await deleteComment(request);

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

    expect(actual).toEqual(expected);
    expect(removeComment).toBeCalledTimes(0);
  });

  it("Should respond with an error if request dosen't contain a cookie with auth token", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        commentId,
      },
    };

    expect(removeComment).toBeCalledTimes(0);
    const actual = await deleteComment(request);

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
    expect(removeComment).toBeCalledTimes(0);
  });

  it("Should respond with an error if request contains a cookie with invalid auth token", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        commentId,
      },
      cookies: {
        token: "invalid",
      },
    };

    expect(removeComment).toBeCalledTimes(0);
    const actual = await deleteComment(request);

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
    expect(removeComment).toBeCalledTimes(0);
  });

  it("Should succesfully delete a comment", async () => {
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
    expect(removeComment).toBeCalledTimes(0);
    expect(token.resolve).toBeCalledTimes(0);
    const actual = await deleteComment(request);

    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 200,
      body: {
        success: true,
        payload: {
          id: commentId,
          content: expect.stringContaining("delete"),
          isDeleted: true,
        },
      },
    };

    expect(actual).toEqual(expected);
    expect(removeComment).toBeCalledTimes(1);
    expect(removeComment).toBeCalledWith(commentId);
    expect(token.resolve).toBeCalledTimes(1);
    expect(token.resolve).toBeCalledWith(request.cookies.token);
  });

  it("If error occurs, should respond with correct status code", async () => {
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

    let removeCommentErr = jest.fn(
      (p) =>
        new Promise(() => {
          throw new Error("Something went wrong...");
        })
    );
    let updateCommentErr = makeDeleteComment({
      removeComment: removeCommentErr,
      token,
    });

    let actual = await updateCommentErr(request);

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

    removeCommentErr = jest.fn(
      (p) =>
        new Promise(() => {
          throw new Error("Comment not found");
        })
    );
    updateCommentErr = makeDeleteComment({
      removeComment: removeCommentErr,
      token,
    });

    actual = await updateCommentErr(request);

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

    removeCommentErr = jest.fn(
      (p) =>
        new Promise(() => {
          throw new Error("User not allowed to delete this comment");
        })
    );
    updateCommentErr = makeDeleteComment({
      removeComment: removeCommentErr,
      token,
    });

    actual = await updateCommentErr(request);

    expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 403,
      body: {
        success: false,
        error: "User not allowed to delete this comment",
      },
    };

    expect(actual).toEqual(expected);
  });
});
