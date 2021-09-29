import { jest } from "@jest/globals";
import dbMockup from "../../../__test__/utils/dbMockup";
import makeSaveComment from "./save-comment.js";

describe("save comment use case", () => {
  let validCommData, saveComment, genId, usersDb;
  beforeAll(() => {
    validCommData = {
      id: "1",
      originalPostId: `post-${genRandomInt()}-id`,
      authorId: "user1",
      content: "some string",
    };
    genId = jest.fn(() => "this is an id");
    usersDb = {
      findById: jest.fn((id) => {
        if (id === validCommData.authorId)
          return Promise.resolve({
            id,
            name: `name-${genRandomInt()}-${validCommData.authorId}`,
            email: `${validCommData.authorId}@test.com`,
          });
        else return Promise.resolve(null);
      }),
    };
    saveComment = makeSaveComment({
      commentsDb: dbMockup,
      postsDb: {
        findById: jest.fn((id) => {
          if (id === validCommData.originalPostId)
            return Promise.resolve({
              id,
              authorId: validCommData.authorId,
              content: "a post",
            });
          else return Promise.resolve(null);
        }),
      },
      usersDb,
      Id: { genId },
    });
  });
  beforeEach(() => {
    dbMockup._RESET_DB();
    dbMockup.insert.mockClear();
    dbMockup.find.mockClear();
    dbMockup.findById.mockClear();
    usersDb.findById.mockClear();
    genId.mockClear();
  });

  it("Given proper input should insert the comment into database", async () => {
    expect(dbMockup.insert).toBeCalledTimes(0);

    for (let i = 0; i < 5; i++) {
      let comment = {
        id: `${i}-${genRandomInt()}`,
        originalPostId: validCommData.originalPostId,
        authorId: validCommData.authorId,
        content: `content-${i}-${genRandomInt()}`,
      };
      await saveComment(comment);
      let author = await usersDb.findById.mock.results[i].value;
      expect(usersDb.findById).toBeCalledTimes(i + 1);
      expect(usersDb.findById).toBeCalledWith(comment.authorId);
      expect(dbMockup.insert).toBeCalledTimes(i + 1);
      expect(dbMockup.insert.mock.calls[i][0]).toEqual(
        expect.objectContaining({
          id: comment.id,
          originalPostId: validCommData.originalPostId,
          authorId: comment.authorId,
          author: author.name,
          content: comment.content,
          likesCount: 0,
          likersIds: [],
          createdAt: expect.any(Date),
          modifiedAt: expect.any(Date),
          isDeleted: false,
        })
      );
    }
  });

  it("Should throw an error if provided with already taken id", async () => {
    dbMockup.insert(validCommData);

    await expect(saveComment(validCommData)).rejects.toThrow();
  });

  it("Should throw an error if original post is not found", async () => {
    await expect(
      saveComment({
        ...validCommData,
        originalPostId: `not-real-${genRandomInt()}`,
      })
    ).rejects.toThrow();
  });

  it("Should return saved comment data", async () => {
    const comm = await saveComment(validCommData);
    let author = await usersDb.findById.mock.results[0].value;
    expect(comm).toEqual({
      id: validCommData.id,
      originalPostId: validCommData.originalPostId,
      authorId: author.id,
      author: author.name,
      content: validCommData.content,
      likesCount: 0,
      likersIds: [],
      createdAt: expect.any(Date),
      modifiedAt: expect.any(Date),
      isDeleted: false,
    });
  });

  it("Given no id should generate one", async () => {
    expect(genId).toBeCalledTimes(0);
    await saveComment({ ...validCommData, id: undefined });
    expect(genId).toBeCalledTimes(1);
  });
});

function genRandomInt() {
  return Math.round(Math.random() * 10);
}
