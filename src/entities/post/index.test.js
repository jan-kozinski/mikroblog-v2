import makePost from "./index.js";
import MockDate from "mockdate";

describe("makePost", () => {
  let validPostData;
  beforeAll(() => {
    validPostData = {
      id: "string",
      authorId: "otherString",
      content: "a lovely story",
    };
  });
  it("Should throw an error if no id is provided", () => {
    const post = { ...validPostData, id: undefined };
    expect(() => makePost(post)).toThrow();
  });
  it("Should throw an error if provided id is not a string or is empty", () => {
    const invalidIds = [1, Math.random(), [], {}, "    "];
    invalidIds.forEach((id) => {
      let post = { ...validPostData, id };
      expect(() => makePost(post)).toThrow();
    });
  });

  it("Should throw an error if no authorId is provided", () => {
    const post = { ...validPostData, authorId: undefined };
    expect(() => makePost(post)).toThrow();
  });
  it("Should throw an error if provided authorId is not a string or is empty", () => {
    const invalidIds = [1, Math.random(), [], {}, "    "];
    invalidIds.forEach((id) => {
      let post = { ...validPostData, authorId: id };
      expect(() => makePost(post)).toThrow();
    });
  });

  it("Should throw an error if no content is provided", () => {
    const post = { ...validPostData, content: undefined };
    expect(() => makePost(post)).toThrow();
  });
  it("Should throw an error if provided content is not a string or is empty", () => {
    const invalidContents = [1, Math.random(), [], {}, "    "];
    invalidContents.forEach((c) => {
      let post = { ...validPostData, content: c };
      expect(() => makePost(post)).toThrow();
    });
  });

  it("Should return a post object with getters for each property given the correct input data", () => {
    const post = makePost(validPostData);

    expect(post).toEqual(
      expect.objectContaining({
        getId: expect.any(Function),
        getAuthorId: expect.any(Function),
        getContent: expect.any(Function),
        getLikesCount: expect.any(Function),
        getLikersIds: expect.any(Function),
        getCreatedAt: expect.any(Function),
        getModifiedAt: expect.any(Function),
      })
    );
  });

  it("Newly crated post properties getters should return proper values", () => {
    const post = makePost(validPostData);

    expect(post.getId()).toEqual(validPostData.id);
    expect(post.getAuthorId()).toEqual(validPostData.authorId);
    expect(post.getContent()).toEqual(validPostData.content);

    expect(post.getCreatedAt()).toBeInstanceOf(Date);
    expect(post.getModifiedAt()).toBeInstanceOf(Date);
    expect(post.getModifiedAt()).toEqual(post.getCreatedAt());
  });

  it("post's changeContent method should update content properly", () => {
    const post = makePost(validPostData);
    const newContent = "not so much of a lovely story";
    MockDate.set(Date.now() + 10000);
    post.changeContent(newContent);
    expect(post.getContent()).toEqual(newContent);
    expect(post.getModifiedAt()).not.toEqual(post.getCreatedAt());
    MockDate.reset();
  });
  it("post's changeContent method should not update the content if provided with new content that equally matches the old content", () => {
    const post = makePost(validPostData);
    const newContent = validPostData.content;
    MockDate.set(Date.now() + 10000);
    post.changeContent(newContent);
    expect(post.getContent()).toEqual(validPostData.content);
    expect(post.getModifiedAt()).toEqual(post.getCreatedAt());
    MockDate.reset();
  });
  it("post's changeContent method should throw an error if new content is not supplied", () => {
    const post = makePost(validPostData);
    expect(() => post.changeContent()).toThrow();
  });
  it("posts' giveLike method should successfully add a like", () => {
    const post = makePost(validPostData);

    for (let i = 0; i < 5; i++) {
      post.giveLike("userId" + i);
      expect(post.getLikesCount()).toEqual(i + 1);
    }
  });
  it("post's giveLike method should throw an error if userId is not supplied or is not a string", () => {
    const post = makePost(validPostData);
    expect(() => post.giveLike()).toThrow();
    expect(() => post.giveLike([])).toThrow();
    expect(() => post.giveLike({})).toThrow();
    expect(() => post.giveLike(12)).toThrow();
    expect(() => post.giveLike(NaN)).toThrow();
    expect(() => post.giveLike(null)).toThrow();
  });
  it("post's giveLike method should throw an error if user already likes this post", () => {
    const post = makePost(validPostData);
    post.giveLike("userId");
    expect(() => post.giveLike("userId")).toThrow();
  });

  it("posts' undoLike method should succesffully undo a like", () => {
    const post = makePost(validPostData);
    post.giveLike("userId");
    post.undoLike("userId");
    expect(post.getLikesCount()).toEqual(0);
    expect(post.getLikersIds()).toEqual([]);
  });
  it("post's undoLike method should throw an error if userId is not supplied or is not a string", () => {
    const post = makePost(validPostData);
    expect(() => post.undoLike()).toThrow();
    expect(() => post.undoLike([])).toThrow();
    expect(() => post.undoLike({})).toThrow();
    expect(() => post.undoLike(12)).toThrow();
    expect(() => post.undoLike(NaN)).toThrow();
    expect(() => post.undoLike(null)).toThrow();
  });
  it("post's undoLike method should throw an error if user does not like this post", () => {
    const post = makePost(validPostData);
    expect(() => post.undoLike("userId")).toThrow();
  });
});
