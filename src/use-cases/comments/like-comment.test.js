import dbMockup from "../../../__test__/utils/dbMockup";
import makeLikeComment from "./like-comment";

describe("like-comment use case", () => {
  let validCommData, likeComment;
  beforeAll(() => {
    validCommData = {
      id: `id-${Math.round(Math.random() * 100)}`,
      originalPostId: `post-${Math.round(Math.random() * 100)}`,
      authorId: `author-${Math.round(Math.random() * 100)}`,
      content: `content-${Math.round(Math.random() * 100)}`,
    };
    likeComment = makeLikeComment({ dbGateway: dbMockup });
  });
  beforeEach(async () => {
    dbMockup._RESET_DB();
    await dbMockup.insert({
      ...validCommData,
      createdAt: new Date(),
      modifiedAt: new Date(),
      likesCount: 0,
      likersIds: [],
    });
    dbMockup.insert.mockClear();
    dbMockup.find.mockClear();
    dbMockup.findById.mockClear();
    dbMockup.update.mockClear();
  });
  it("Should successfully give a like", async () => {
    expect(dbMockup.update).toBeCalledTimes(0);

    for (let i = 0; i < 5; i++) {
      let user = `user-${i}-${Math.round(Math.random() * 100)}`;
      await likeComment({ commentId: validCommData.id, userId: user });
      expect(dbMockup.update).toBeCalledTimes(i + 1);
      expect(dbMockup.update.mock.calls[i][0]).toEqual(
        expect.objectContaining({
          id: validCommData.id,
          authorId: validCommData.authorId,
          content: validCommData.content,
          likesCount: i,
          likersIds: expect.any(Array),
          createdAt: expect.any(Date),
          modifiedAt: expect.any(Date),
        })
      );
      expect(dbMockup.update.mock.calls[i][1]).toEqual(
        expect.objectContaining({
          likesCount: i + 1,
          likersIds: expect.arrayContaining([user]),
        })
      );
    }
  });

  it("Should return comment data", async () => {
    for (let i = 0; i < 5; i++) {
      let user = `user-${i}-${Math.round(Math.random() * 10)}`;
      const returnValue = await likeComment({
        commentId: validCommData.id,
        userId: user,
      });
      expect(returnValue).toEqual({
        id: validCommData.id,
        originalPostId: validCommData.originalPostId,
        authorId: validCommData.authorId,
        content: validCommData.content,
        likesCount: i + 1,
        likersIds: expect.arrayContaining([user]),
        isDeleted: false,
        createdAt: expect.any(Date),
        modifiedAt: expect.any(Date),
      });
    }
  });

  it("Should throw an error if comment is not found", async () => {
    expect(
      async () =>
        await likeComment({
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
      likesCount: 0,
      likersIds: [],
    };

    await dbMockup.insert(anotherComment);
    await expect(
      async () =>
        await likeComment({
          commentId: anotherComment.id,
          userId: "doesn't matter",
        })
    ).rejects.toThrow();
  });
});
