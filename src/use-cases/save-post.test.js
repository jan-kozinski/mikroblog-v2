import { jest } from "@jest/globals";
import dbMockup from "../../__test__/utils/dbMockup";
import makeSavePost from "./save-post.js";
import makePost from "../entities/post/index.js";

describe("save post use case", () => {
  let validPostData, savePost, genId;

  beforeAll(() => {
    validPostData = {
      id: "1",
      authorId: "user1",
      content: "some string",
    };

    genId = jest.fn(() => "this is an id");
    savePost = makeSavePost({
      dbGateway: dbMockup,
      Id: { genId },
    });
  });

  beforeEach(() => {
    dbMockup._RESET_DB();
    dbMockup.insert.mockClear();
    dbMockup.find.mockClear();
    dbMockup.findById.mockClear();
    genId.mockClear();
  });

  it("Given proper input should insert the post into database", async () => {
    expect(dbMockup.insert).toBeCalledTimes(0);

    for (let i = 0; i < 5; i++) {
      let post = {
        id: `${i}-${Math.round(Math.random() * 10)}`,
        authorId: `user-${i}-${Math.round(Math.random() * 10)}`,
        content: `content-${i}-${Math.round(Math.random() * 10)}`,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };
      await savePost(post);
      expect(dbMockup.insert).toBeCalledTimes(i + 1);
      expect(dbMockup.insert.mock.calls[i][0]).toEqual(
        expect.objectContaining({
          id: post.id,
          authorId: post.authorId,
          content: post.content,
          createdAt: post.createdAt,
          modifiedAt: post.modifiedAt,
        })
      );
    }
  });
  it("Should throw an error if provided with already taken id", async () => {
    dbMockup.insert(validPostData);

    await expect(savePost(validPostData)).rejects.toThrow(
      new Error("post of provided id already exists")
    );
  });

  it("Should return saved post data", async () => {
    const post = await savePost(validPostData);
    expect(post).toEqual({
      ...validPostData,
      createdAt: expect.any(Date),
      modifiedAt: expect.any(Date),
    });
  });

  it("Given no id should generate one", async () => {
    expect(genId).toBeCalledTimes(0);
    await savePost({ ...validPostData, id: undefined });
    expect(genId).toBeCalledTimes(1);
  });
});
