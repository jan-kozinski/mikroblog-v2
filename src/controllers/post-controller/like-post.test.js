import { jest } from "@jest/globals";
import makeLikePost from "./like-post.js";

describe("Like post controller", () => {
  let validPostData, giveLike, likePost, token;

  beforeAll(() => {
    validPostData = {
      authorId: `user-${Math.round(Math.random() * 100)}`,
      content: `content-${Math.round(Math.random() * 100)}`,
      likesCount: 0,
      likersIds: [],
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    };
    giveLike = jest.fn(({ postId, userId }) =>
      Promise.resolve({
        ...validPostData,
        id: postId,
        likesCount: 1,
        likersIds: [userId],
      })
    );
    token = {
      resolve: jest.fn((t) => (t === "legit" ? { id: "user123" } : null)),
    };
    likePost = makeLikePost({ giveLike, token });
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
    const actual = await likePost(request);

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
    const actual = await likePost(request);

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
        postId: "post321",
      },
    };

    expect(giveLike).toBeCalledTimes(0);
    expect(token.resolve).toBeCalledTimes(0);
    const actual = await likePost(request);

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
      postId: request.params.postId,
      userId: "user123",
    });

    expect(token.resolve).toBeCalledTimes(1);
    expect(token.resolve).toBeCalledWith(request.cookies.token);
  });
});
