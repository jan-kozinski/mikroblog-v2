import dbMockup from "../../../__test__/utils/dbMockup";
import makeUndoLike from "./undo-like.js";
describe("post undo-like use case", () => {
  let validPostData, undoLike;
  beforeAll(() => {
    validPostData = {
      id: "1",
      authorId: "user1",
      content: "some string",
    };
    undoLike = makeUndoLike({ dbGateway: dbMockup });
  });

  beforeEach(async () => {
    dbMockup._RESET_DB();
    await dbMockup.insert({
      ...validPostData,
      createdAt: new Date(),
      modifiedAt: new Date(),
      likesCount: 1,
      likersIds: ["user123"],
    });
    dbMockup.insert.mockClear();
    dbMockup.find.mockClear();
    dbMockup.findById.mockClear();
    dbMockup.update.mockClear();
  });
  it("Should successfully undo a like", async () => {
    expect(dbMockup.update).toBeCalledTimes(0);

    await undoLike({ postId: validPostData.id, userId: "user123" });
    expect(dbMockup.update).toBeCalledTimes(1);
    expect(dbMockup.update.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        id: validPostData.id,
        authorId: validPostData.authorId,
        content: validPostData.content,
        likesCount: 1,
        likersIds: ["user123"],
        createdAt: expect.any(Date),
        modifiedAt: expect.any(Date),
      })
    );
    expect(dbMockup.update.mock.calls[0][1]).toEqual(
      expect.objectContaining({
        likesCount: 0,
        likersIds: [],
      })
    );
  });
  it("Should return saved post data", async () => {
    const returnValue = await undoLike({
      postId: validPostData.id,
      userId: "user123",
    });
    expect(returnValue).toEqual({
      id: validPostData.id,
      authorId: validPostData.authorId,
      content: validPostData.content,
      likesCount: 0,
      likersIds: [],
      createdAt: expect.any(Date),
      modifiedAt: expect.any(Date),
    });
  });

  it("Should throw an error if comment is not found", async () => {
    expect(
      async () =>
        await undoLike({
          postId: "non-existing-comm-id",
          userId: "doesn't matter",
        })
    ).rejects.toThrow();
  });
});
