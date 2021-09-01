import dbMockup from "../../../__test__/utils/dbMockup";
import makeGiveLike from "./give-like.js";
describe("give-like use case", () => {
  let validPostData, giveLike;
  beforeAll(() => {
    validPostData = {
      id: "1",
      authorId: "user1",
      content: "some string",
    };
    giveLike = makeGiveLike({ dbGateway: dbMockup });
  });

  beforeEach(async () => {
    dbMockup._RESET_DB();
    await dbMockup.insert({
      ...validPostData,
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
  it("Should successfully leave a like", async () => {
    expect(dbMockup.update).toBeCalledTimes(0);

    for (let i = 0; i < 5; i++) {
      let user = `user-${i}-${Math.round(Math.random() * 10)}`;
      await giveLike({ postId: validPostData.id, userId: user });
      expect(dbMockup.update).toBeCalledTimes(i + 1);
      expect(dbMockup.update.mock.calls[i][0]).toEqual(
        expect.objectContaining({
          id: validPostData.id,
          authorId: validPostData.authorId,
          content: validPostData.content,
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
  it("Should return saved post data", async () => {
    for (let i = 0; i < 5; i++) {
      let user = `user-${i}-${Math.round(Math.random() * 10)}`;
      const returnValue = await giveLike({
        postId: validPostData.id,
        userId: user,
      });
      expect(returnValue).toEqual({
        id: validPostData.id,
        authorId: validPostData.authorId,
        content: validPostData.content,
        likesCount: i + 1,
        likersIds: expect.arrayContaining([user]),
        createdAt: expect.any(Date),
        modifiedAt: expect.any(Date),
      });
    }
  });
});
