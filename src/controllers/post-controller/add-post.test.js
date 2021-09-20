import { jest } from "@jest/globals";
import makeAddPost from "./add-post.js";

describe("Add post controller", () => {
  let validPostData, savePost, addPost, createdAt, modifiedAt, token;
  beforeAll(() => {
    validPostData = {
      authorId: `user-${Math.round(Math.random() * 100)}`,
      content: `content-${Math.round(Math.random() * 100)}`,
    };
    createdAt = new Date(Date.now() + Math.round(Math.random() * 1000000));
    modifiedAt = new Date(Date.now() + Math.round(Math.random() * 2000000));
    savePost = jest.fn((p) =>
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
    addPost = makeAddPost({ savePost, token });
  });

  afterEach(() => {
    savePost.mockClear();
    token.resolve.mockClear();
  });

  it("Should respond with an error if request dosen't contain a cookie with auth token", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        authorId: validPostData.authorId,
        content: validPostData.content,
      },
    };

    expect(savePost).toBeCalledTimes(0);
    const actual = await addPost(request);

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
    expect(savePost).toBeCalledTimes(0);
  });
  it("Should respond with an error if request contains a cookie with invalid auth token", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        authorId: validPostData.authorId,
        content: validPostData.content,
      },
      cookies: {
        token: "invalid",
      },
    };

    expect(savePost).toBeCalledTimes(0);
    const actual = await addPost(request);

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
    expect(savePost).toBeCalledTimes(0);
  });
  it("Should successfully add a post", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        content: validPostData.content,
      },
      cookies: {
        token: "legit",
      },
    };

    expect(savePost).toBeCalledTimes(0);
    expect(token.resolve).toBeCalledTimes(0);
    const actual = await addPost(request);

    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 201,
      body: {
        success: true,
        payload: {
          author: validPostData.authorId,
          content: validPostData.content,
          createdAt,
          modifiedAt,
        },
      },
    };

    expect(actual).toEqual(expected);
    expect(savePost).toBeCalledTimes(1);
    expect(savePost).toBeCalledWith({
      authorId: validPostData.authorId,
      content: validPostData.content,
    });
    expect(token.resolve).toBeCalledTimes(1);
    expect(token.resolve).toBeCalledWith(request.cookies.token);
  });
  it("Should respond with an error if saving a post doesn't procede due to an error", async () => {
    const errorMsg = `test-error-${Math.round(Math.random() * 100)}`;

    const addPostErr = makeAddPost({
      savePost: jest.fn(
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
      cookies: {
        token: "legit",
      },
    };
    expect(savePost).toBeCalledTimes(0);

    const actual = await addPostErr(request);

    expect(savePost).toBeCalledTimes(0);

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
