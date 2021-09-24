import { jest } from "@jest/globals";
import makeUpdatePost from "./update-post";

describe("Update post controller", () => {
  let validPostData, updatePost, editPost, token, createdAt, modifiedAt, postId;
  beforeAll(() => {
    validPostData = {
      authorId: `user-${Math.round(Math.random() * 100)}`,
      content: `content-${Math.round(Math.random() * 100)}`,
    };
    postId = `id-${Math.round(Math.random() * 100)}`;
    createdAt = new Date(Date.now() + Math.round(Math.random() * 1000000));
    modifiedAt = new Date(Date.now() + Math.round(Math.random() * 2000000));

    editPost = jest.fn((p) =>
      Promise.resolve({
        author: p.authorId,
        content: p.content,
        createdAt,
        modifiedAt,
      })
    );
    token = {
      resolve: jest.fn((t) =>
        t === "legit" ? { id: validPostData.authorId } : null
      ),
    };

    updatePost = makeUpdatePost({ editPost, token });
  });
  afterEach(() => {
    editPost.mockClear();
    token.resolve.mockClear();
  });
  it("Should respond with an error if request doesn't contain a param with post id", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        content: validPostData.content,
      },
    };

    expect(editPost).toBeCalledTimes(0);
    const actual = await updatePost(request);

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
    expect(editPost).toBeCalledTimes(0);
  });
  it("Should respond with an error if request doesn't contain a cookie with auth token", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        postId: postId,
      },
      body: {
        content: validPostData.content,
      },
    };

    expect(editPost).toBeCalledTimes(0);
    const actual = await updatePost(request);

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
    expect(editPost).toBeCalledTimes(0);
  });
  it("Should respond with an error if request contains a cookie with invalid auth token", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        postId: postId,
      },
      body: {
        content: validPostData.content,
      },
      cookies: {
        token: "invalid",
      },
    };

    expect(editPost).toBeCalledTimes(0);
    const actual = await updatePost(request);

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
    expect(editPost).toBeCalledTimes(0);
  });
  it("Should successfully update a post", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        postId: postId,
      },
      body: {
        content: validPostData.content,
      },
      cookies: {
        token: "legit",
      },
    };

    expect(editPost).toBeCalledTimes(0);
    expect(token.resolve).toBeCalledTimes(0);
    const actual = await updatePost(request);

    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 200,
      body: {
        success: true,
        payload: {
          content: validPostData.content,
          createdAt,
          modifiedAt,
        },
      },
    };

    expect(actual).toEqual(expected);
    expect(editPost).toBeCalledTimes(1);
    expect(editPost).toBeCalledWith({
      id: postId,
      authorId: validPostData.authorId,
      content: validPostData.content,
    });
    expect(token.resolve).toBeCalledTimes(1);
    expect(token.resolve).toBeCalledWith(request.cookies.token);
  });
  it("Should respond with an error if saving a post doesn't procede due to an error", async () => {
    const errorMsg = `test-error-${Math.round(Math.random() * 100)}`;

    const updatePostErr = makeUpdatePost({
      editPost: jest.fn(
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
        body: { content: validPostData.content },
      },
      params: {
        postId: postId,
      },
      cookies: {
        token: "legit",
      },
    };
    expect(editPost).toBeCalledTimes(0);

    const actual = await updatePostErr(request);

    expect(editPost).toBeCalledTimes(0);

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
  it("If error occurs, should respond with correct status code", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        postId,
      },
      body: {
        content: validPostData.content,
      },
      cookies: {
        token: "legit",
      },
    };

    let editPostErr = jest.fn(
      (p) =>
        new Promise(() => {
          throw new Error("Something went wrong...");
        })
    );
    let updatePostErr = makeUpdatePost({
      editPost: editPostErr,
      token,
    });

    let actual = await updatePostErr(request);

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

    editPostErr = jest.fn(
      (p) =>
        new Promise(() => {
          throw new Error("Post not found");
        })
    );
    updatePostErr = makeUpdatePost({
      editPost: editPostErr,
      token,
    });

    actual = await updatePostErr(request);

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

    editPostErr = jest.fn(
      (p) =>
        new Promise(() => {
          throw new Error("User not allowed to edit this post");
        })
    );
    updatePostErr = makeUpdatePost({
      editPost: editPostErr,
      token,
    });

    actual = await updatePostErr(request);

    expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 403,
      body: {
        success: false,
        error: "User not allowed to edit this post",
      },
    };

    expect(actual).toEqual(expected);
  });
});
