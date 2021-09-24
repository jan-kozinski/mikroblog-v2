import { jest } from "@jest/globals";
import makeUpdateComment from "./update-comment";

describe("Update comment controller", () => {
  let validCommentData,
    updateComment,
    editComment,
    token,
    createdAt,
    modifiedAt,
    commentId;
  beforeAll(() => {
    validCommentData = {
      authorId: `user-${Math.round(Math.random() * 100)}`,
      originalPostId: `op-${Math.round(Math.random() * 100)}`,
      content: `content-${Math.round(Math.random() * 100)}`,
    };
    commentId = `id-${Math.round(Math.random() * 100)}`;
    createdAt = new Date(Date.now() + Math.round(Math.random() * 1000000));
    modifiedAt = new Date(Date.now() + Math.round(Math.random() * 2000000));

    editComment = jest.fn((p) =>
      Promise.resolve({
        author: p.authorId,
        originalPostId: p.originalPostId,
        content: p.content,
        createdAt,
        modifiedAt,
      })
    );
    token = {
      resolve: jest.fn((t) =>
        t === "legit" ? { id: validCommentData.authorId } : null
      ),
    };

    updateComment = makeUpdateComment({ editComment, token });
  });
  afterEach(() => {
    editComment.mockClear();
    token.resolve.mockClear();
  });
  it("Should respond with an error if request doesn't contain a param with comment id", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        authorId: validCommentData.authorId,
        content: validCommentData.content,
      },
    };

    expect(editComment).toBeCalledTimes(0);
    const actual = await updateComment(request);

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
    expect(editComment).toBeCalledTimes(0);
  });

  it("Should respond with an error if request dosen't contain a cookie with auth token", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        commentId,
      },
      body: {
        content: validCommentData.content,
      },
    };

    expect(editComment).toBeCalledTimes(0);
    const actual = await updateComment(request);

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
    expect(editComment).toBeCalledTimes(0);
  });
  it("Should respond with an error if request contains a cookie with invalid auth token", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        commentId,
      },
      body: {
        authorId: validCommentData.authorId,
        content: validCommentData.content,
      },
      cookies: {
        token: "invalid",
      },
    };

    expect(editComment).toBeCalledTimes(0);
    const actual = await updateComment(request);

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
    expect(editComment).toBeCalledTimes(0);
  });
  it("Should successfully update a comment", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        commentId,
      },
      body: {
        content: validCommentData.content,
      },
      cookies: {
        token: "legit",
      },
    };

    expect(editComment).toBeCalledTimes(0);
    expect(token.resolve).toBeCalledTimes(0);
    const actual = await updateComment(request);

    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 200,
      body: {
        success: true,
        payload: {
          content: validCommentData.content,
          createdAt,
          modifiedAt,
        },
      },
    };

    expect(actual).toEqual(expected);
    expect(editComment).toBeCalledTimes(1);
    expect(editComment).toBeCalledWith({
      id: commentId,
      authorId: validCommentData.authorId,
      content: validCommentData.content,
    });
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
      body: {
        content: validCommentData.content,
      },
      cookies: {
        token: "legit",
      },
    };

    let editCommentErr = jest.fn(
      (p) =>
        new Promise(() => {
          throw new Error("Something went wrong...");
        })
    );
    let updateCommentErr = makeUpdateComment({
      editComment: editCommentErr,
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

    editCommentErr = jest.fn(
      (p) =>
        new Promise(() => {
          throw new Error("Comment not found");
        })
    );
    updateCommentErr = makeUpdateComment({
      editComment: editCommentErr,
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

    editCommentErr = jest.fn(
      (p) =>
        new Promise(() => {
          throw new Error("User not allowed to edit this comment");
        })
    );
    updateCommentErr = makeUpdateComment({
      editComment: editCommentErr,
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
        error: "User not allowed to edit this comment",
      },
    };

    expect(actual).toEqual(expected);
  });
});
