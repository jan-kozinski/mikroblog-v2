import { jest } from "@jest/globals";
import makeDeletePost from "./delete-post";

describe("Delete post controller", () => {
  let postId, deletePost, removePost, token;
  beforeAll(() => {
    postId = `id-${Math.round(Math.random() * 100)}`;
    removePost = jest.fn((id) => {
      if (id === postId) return Promise.resolve();
      return new Promise(() => {
        throw new Error("Entity not found");
      });
    });

    token = {
      resolve: jest.fn((t) =>
        t === "legit" ? { id: "legitimate-user" } : null
      ),
    };

    deletePost = makeDeletePost({ removePost, token });
  });
  afterEach(() => {
    removePost.mockClear();
    token.resolve.mockClear();
  });
  it("Should respond with an error if request doesn't contain a param with post id", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    expect(removePost).toBeCalledTimes(0);
    const actual = await deletePost(request);

    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 404,
      body: {
        success: false,
        error: "Post not found",
      },
    };

    expect(actual).toEqual(expected);
    expect(removePost).toBeCalledTimes(0);
  });
  it("Should respond with an error if request doesn't contain a cookie with auth token", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        postId: postId,
      },
    };

    expect(removePost).toBeCalledTimes(0);
    const actual = await deletePost(request);

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
    expect(removePost).toBeCalledTimes(0);
  });
  it("Should respond with an error if request contains a cookie with invalid auth token", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        postId: postId,
      },

      cookies: {
        token: "invalid",
      },
    };

    expect(removePost).toBeCalledTimes(0);
    const actual = await deletePost(request);

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
    expect(removePost).toBeCalledTimes(0);
  });
  it("Should successfully delete a post", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        postId,
      },
      cookies: {
        token: "legit",
      },
    };
    const actual = await deletePost(request);

    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 200,
      body: {
        success: true,
      },
    };
    expect(actual).toEqual(expected);
    expect(removePost).toBeCalledTimes(1);
    expect(removePost.mock.calls[0][0]).toEqual(postId);
    expect(removePost.mock.calls[0][1]).toEqual("legitimate-user");
  });

  it("If error occurs, should respond with correct status code", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        postId,
      },
      cookies: {
        token: "legit",
      },
    };

    let removePostErr = jest.fn(
      (p) =>
        new Promise(() => {
          throw new Error("Something went wrong...");
        })
    );
    let deletePostErr = makeDeletePost({
      removePost: removePostErr,
      token,
    });

    let actual = await deletePostErr(request);

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

    removePostErr = jest.fn(
      (p) =>
        new Promise(() => {
          throw new Error("Post not found");
        })
    );
    deletePostErr = makeDeletePost({
      removePost: removePostErr,
      token,
    });

    actual = await deletePostErr(request);

    expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 404,
      body: {
        success: false,
        error: "Post not found",
      },
    };

    expect(actual).toEqual(expected);

    removePostErr = jest.fn(
      (p) =>
        new Promise(() => {
          throw new Error("User not allowed to delete this post");
        })
    );
    deletePostErr = makeDeletePost({
      removePost: removePostErr,
      token,
    });

    actual = await deletePostErr(request);

    expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 403,
      body: {
        success: false,
        error: "User not allowed to delete this post",
      },
    };

    expect(actual).toEqual(expected);
  });
});
