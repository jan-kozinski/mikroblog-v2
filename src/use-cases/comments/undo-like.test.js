import dbMockup from "../../../__test__/utils/dbMockup";
import makeUndoLike from "./undo-like";
describe("comment undo-like use case", () => {
  let validCommData, undoLike;
  beforeAll(() => {
    validCommData = {
      id: `id-${Math.round(Math.random() * 100)}`,
      originalPostId: `post-${Math.round(Math.random() * 100)}`,
      authorId: `author-${Math.round(Math.random() * 100)}`,
      content: `content-${Math.round(Math.random() * 100)}`,
    };
    undoLike = makeUndoLike({ dbGateway: dbMockup });
  });
  beforeEach(async () => {
    dbMockup._RESET_DB();
    await dbMockup.insert({
      ...validCommData,
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

    await undoLike({ commentId: validCommData.id, userId: "user123" });
    expect(dbMockup.update).toBeCalledTimes(1);
    expect(dbMockup.update.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        id: validCommData.id,
        authorId: validCommData.authorId,
        content: validCommData.content,
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
      commentId: validCommData.id,
      userId: "user123",
    });
    expect(returnValue).toEqual({
      id: validCommData.id,
      originalPostId: validCommData.originalPostId,
      authorId: validCommData.authorId,
      content: validCommData.content,
      likesCount: 0,
      likersIds: [],
      isDeleted: false,
      createdAt: expect.any(Date),
      modifiedAt: expect.any(Date),
    });
  });

  it("Should throw an error if comment is not found", async () => {
    expect(
      async () =>
        await undoLike({
          commentId: "non-existing-comm-id",
          userId: "doesn't matter",
        })
    ).rejects.toThrow();
  });

  it("Should throw an error if comment is deleted", async () => {
    const anotherComment = {
      id: `id-${Math.round(Math.random() * 100)}`,
      originalPostId: `post-${Math.round(Math.random() * 100)}`,
      authorId: `author-${Math.round(Math.random() * 100)}`,
      content: `content-${Math.round(Math.random() * 100)}`,
      isDeleted: true,
      createdAt: new Date(),
      modifiedAt: new Date(),
      likesCount: 1,
      likersIds: ["user123"],
    };

    await dbMockup.insert(anotherComment);
    await expect(
      async () =>
        await undoLike({
          commentId: anotherComment.id,
          userId: "user123",
        })
    ).rejects.toThrow();
  });
});
