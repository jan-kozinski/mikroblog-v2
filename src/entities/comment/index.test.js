import makeComment from "./index.js";
import MockDate from "mockdate";

describe("makeComment", () => {
  let validCommentData;
  beforeAll(() => {
    validCommentData = {
      id: "string",
      authorId: "the-other-string",
      content: "another-string",
      originalPostId: "yet-another-string",
    };
  });

  it("Should throw an error if no id is provided", () => {
    const comment = { ...validCommentData, id: undefined };
    expect(() => makeComment(comment)).toThrow();
  });
  it("Should throw an error if provided id is not a string or is empty", () => {
    const invalidIds = [1, Math.random(), [], {}, "    "];
    invalidIds.forEach((id) => {
      let comment = { ...validCommentData, id };
      expect(() => makeComment(comment)).toThrow();
    });
  });

  it("Should throw an error if no authorId is provided", () => {
    const comment = { ...validCommentData, authorId: undefined };
    expect(() => makeComment(comment)).toThrow();
  });
  it("Should throw an error if provided authorId is not a string or is empty", () => {
    const invalidIds = [1, Math.random(), [], {}, "    "];
    invalidIds.forEach((id) => {
      let comment = { ...validCommentData, authorId: id };
      expect(() => makeComment(comment)).toThrow();
    });
  });

  it("Should throw an error if no content is provided", () => {
    const comment = { ...validCommentData, content: undefined };
    expect(() => makeComment(comment)).toThrow();
  });
  it("Should throw an error if provided content is not a string or is empty", () => {
    const invalidContents = [
      0,
      1,
      NaN,
      null,
      Math.random(),
      [],
      {},
      "",
      "    ",
    ];
    invalidContents.forEach((c) => {
      let comment = { ...validCommentData, content: c };
      expect(() => makeComment(comment)).toThrow();
    });
  });

  it("Should throw an error if no originalPostiId is provided", () => {
    const comment = { ...validCommentData, originalPostId: undefined };
    expect(() => makeComment(comment)).toThrow();
  });
  it("Should throw an error if provided originalPostiId is not a string or is empty", () => {
    const invalidIds = [1, Math.random(), [], {}, "    "];
    invalidIds.forEach((id) => {
      let comment = { ...validCommentData, originalPostId: id };
      expect(() => makeComment(comment)).toThrow();
    });
  });

  it("Should return a comment object with getters for each property if supplied with the correct input data", () => {
    const comment = makeComment(validCommentData);

    expect(comment).toEqual(
      expect.objectContaining({
        getId: expect.any(Function),
        getAuthorId: expect.any(Function),
        getOriginalPostId: expect.any(Function),
        getContent: expect.any(Function),
        getCreatedAt: expect.any(Function),
        getModifiedAt: expect.any(Function),
        isDeleted: expect.any(Function),
      })
    );
  });
  it("Newly crated comment properties getters should return proper values", () => {
    const comment = makeComment(validCommentData);

    expect(comment.getId()).toEqual(validCommentData.id);
    expect(comment.getAuthorId()).toEqual(validCommentData.authorId);
    expect(comment.getOriginalPostId()).toEqual(
      validCommentData.originalPostId
    );
    expect(comment.getContent()).toEqual(validCommentData.content);

    expect(comment.getCreatedAt()).toBeInstanceOf(Date);
    expect(comment.getModifiedAt()).toBeInstanceOf(Date);
    expect(comment.getModifiedAt()).toEqual(comment.getCreatedAt());

    expect(comment.isDeleted()).toBe(false);
  });

  it("Should succesfully delete a comment", () => {
    const comment = makeComment(validCommentData);
    comment.delete();
    expect(comment.isDeleted()).toBe(true);
    expect(comment.getContent()).not.toEqual(validCommentData.content);
  });

  it("comment's changeContent method should update content properly", () => {
    const comment = makeComment(validCommentData);
    const newContent = "not so much of a lovely story";
    MockDate.set(Date.now() + 10000);
    comment.changeContent(newContent);
    expect(comment.getContent()).toEqual(newContent);
    expect(comment.getModifiedAt()).not.toEqual(comment.getCreatedAt());
    MockDate.reset();
  });

  it("comment's changeContent method should not update the content if provided with new content that equally matches the old content", () => {
    const comment = makeComment(validCommentData);
    const newContent = validCommentData.content;
    MockDate.set(Date.now() + 10000);
    comment.changeContent(newContent);
    expect(comment.getContent()).toEqual(validCommentData.content);
    expect(comment.getModifiedAt()).toEqual(comment.getCreatedAt());
    MockDate.reset();
  });
  it("comment's changeContent method should throw an error if new content is not supplied", () => {
    const comment = makeComment(validCommentData);
    expect(() => comment.changeContent()).toThrow();
  });

  it("comment's changeContent method should throw an error if new content is not a string or is empty", () => {
    const badInputs = [[], ["comment"], 0, 69, NaN, null, "", " "];
    for (let i of badInputs) {
      const comment = makeComment(validCommentData);
      expect(() => comment.changeContent(badInputs[i])).toThrow();
    }
  });
  it("comment's changeContent method should throw an error if the comment is deleted", () => {
    const comment = makeComment(validCommentData);
    comment.delete();
    expect(() => comment.changeContent("new content")).toThrow();
  });
  it("comments' giveLike method should successfully add a like", () => {
    const comment = makeComment(validCommentData);

    for (let i = 0; i < 5; i++) {
      comment.giveLike("userId" + i);
      expect(comment.getLikesCount()).toEqual(i + 1);
    }
  });
  it("comment's giveLike method should throw an error if userId is not supplied or is not a string", () => {
    const comment = makeComment(validCommentData);
    expect(() => comment.giveLike()).toThrow();
    expect(() => comment.giveLike([])).toThrow();
    expect(() => comment.giveLike({})).toThrow();
    expect(() => comment.giveLike(12)).toThrow();
    expect(() => comment.giveLike(NaN)).toThrow();
    expect(() => comment.giveLike(null)).toThrow();
  });
  it("comment's giveLike method should throw an error if user already likes this comment", () => {
    const comment = makeComment(validCommentData);
    comment.giveLike("userId");
    expect(() => comment.giveLike("userId")).toThrow();
  });

  it("comment's giveLike method should throw an error if the comment is deleted", () => {
    const comment = makeComment(validCommentData);
    comment.delete();
    expect(() => comment.giveLike("userId")).toThrow();
  });

  it("comments' undoLike method should succesffully undo a like", () => {
    const comment = makeComment(validCommentData);
    comment.giveLike("userId");
    comment.undoLike("userId");
    expect(comment.getLikesCount()).toEqual(0);
    expect(comment.getLikersIds()).toEqual([]);
  });
  it("comment's undoLike method should throw an error if userId is not supplied or is not a string", () => {
    const comment = makeComment(validCommentData);
    expect(() => comment.undoLike()).toThrow();
    expect(() => comment.undoLike([])).toThrow();
    expect(() => comment.undoLike({})).toThrow();
    expect(() => comment.undoLike(12)).toThrow();
    expect(() => comment.undoLike(NaN)).toThrow();
    expect(() => comment.undoLike(null)).toThrow();
  });
  it("comment's undoLike method should throw an error if user does not like this comment", () => {
    const comment = makeComment(validCommentData);
    expect(() => comment.undoLike("userId")).toThrow();
  });

  it("comment's undoLike method should throw an error if the comment is deleted", () => {
    const comment = makeComment(validCommentData);
    comment.giveLike("userId");
    comment.delete();
    expect(() => comment.undoLike("userId")).toThrow();
  });
});
