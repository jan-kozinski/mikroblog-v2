import MockDate from "mockdate";
import dbMockup from "../../../__test__/utils/dbMockup";
import makeEditPost from "./edit-post.js";
describe("edit-post use case", () => {
  let validPostData, editPost;
  beforeAll(() => {
    validPostData = {
      id: "1",
      authorId: "user1",
      content: "some string",
    };
    editPost = makeEditPost({ dbGateway: dbMockup });
  });
  beforeEach(async () => {
    dbMockup._RESET_DB();
    MockDate.reset();
    await dbMockup.insert({
      ...validPostData,
      createdAt: new Date(),
      modifiedAt: new Date(),
    });
    dbMockup.insert.mockClear();
    dbMockup.find.mockClear();
    dbMockup.findById.mockClear();
    dbMockup.update.mockClear();
  });
  it("Should successfully edit a comment", async () => {
    expect(dbMockup.update).toBeCalledTimes(0);

    for (let i = 0; i < 5; i++) {
      let post = {
        authorId: validPostData.authorId,
        id: validPostData.id,
        content: `content-${i}-${Math.round(Math.random() * 10)}`,
      };
      await editPost(post);
      expect(dbMockup.update).toBeCalledTimes(i + 1);
      expect(dbMockup.update.mock.calls[i][0]).toEqual(
        expect.objectContaining({
          id: validPostData.id,
          authorId: validPostData.authorId,
          content: expect.any(String),
          createdAt: expect.any(Date),
          modifiedAt: expect.any(Date),
        })
      );
      expect(dbMockup.update.mock.calls[i][1]).toEqual(
        expect.objectContaining({ content: post.content })
      );
    }
  });
  it("Should not call the DB if new content does not differ from the old one", async () => {
    expect(dbMockup.update).toBeCalledTimes(0);
    MockDate.set(Date.now() + Math.round(Math.random() * 10000000));
    const returnedValue = await editPost(validPostData);
    expect(returnedValue.modifiedAt).toEqual(returnedValue.createdAt);
    expect(dbMockup.update).toBeCalledTimes(0);
  });
  it("Should throw an error if provided with invalid id", async () => {
    dbMockup._RESET_DB();

    await expect(editPost(validPostData)).rejects.toThrow(
      new Error("Post not found")
    );
  });

  it("Should throw an error if provided authorId doesn't match the atuhorId of post record in database", async () => {
    await expect(
      editPost({
        id: validPostData.id,
        content: validPostData.content,
        authorId: "not-an-actual-author",
      })
    ).rejects.toThrow();
  });
  it("Should return saved post data", async () => {
    for (let i = 0; i < 5; i++) {
      let newPostData = {
        authorId: validPostData.authorId,
        id: validPostData.id,
        content: `content-${i}-${Math.round(Math.random() * 10)}`,
      };
      MockDate.set(Date.now() + Math.round(Math.random() * 10000000));
      const returnValue = await editPost(newPostData);
      expect(returnValue).toEqual({
        id: validPostData.id,
        authorId: validPostData.authorId,
        content: newPostData.content,
        createdAt: expect.any(Date),
        modifiedAt: expect.any(Date),
      });
      expect(returnValue.modifiedAt).not.toEqual(returnValue.createdAt);
    }
  });
});
