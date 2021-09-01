import { jest } from "@jest/globals";
import makeUnlikePost from "./unlike-post.js";

describe("Unlike post controller", () => {
  let validPostData, undoLike, unlikePost, token;

  beforeAll(() => {
    validPostData = {
      authorId: `user-${Math.round(Math.random() * 100)}`,
      content: `content-${Math.round(Math.random() * 100)}`,
      likesCount: 1,
      likersIds: ["user123"],
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    };
    undoLike = jest.fn(({ postId, userId }) =>
      userId === "user123"
        ? Promise.resolve({
            ...validPostData,
            id: postId,
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
    unlikePost = makeUnlikePost({ undoLike, token });
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
    const actual = await unlikePost(request);

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
    const actual = await unlikePost(request);

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
  it("Should successfully unlike a post", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      cookies: {
        token: "legit",
      },
      params: {
        postId: "post321",
      },
    };

    expect(undoLike).toBeCalledTimes(0);
    expect(token.resolve).toBeCalledTimes(0);
    const actual = await unlikePost(request);

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
      postId: request.params.postId,
      userId: "user123",
    });

    expect(token.resolve).toBeCalledTimes(1);
    expect(token.resolve).toBeCalledWith(request.cookies.token);
  });
});
