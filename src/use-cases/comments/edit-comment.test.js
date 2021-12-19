import MockDate from "mockdate";
import dbMockup from "../../../__test__/utils/dbMockup";
import makeEditComment from "./edit-comment.js";
describe("edit-comment use case", () => {
  let validCommData, editComm;
  beforeAll(() => {
    validCommData = {
      id: "1",
      originalPostId: `post-${randomInt()}-id`,
      authorId: "user1",
      content: "some string",
    };
    editComm = makeEditComment({ dbGateway: dbMockup });
  });
  beforeEach(async () => {
    dbMockup._RESET_DB();
    MockDate.reset();
    await dbMockup.insert({
      ...validCommData,
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
      let comm = {
        authorId: validCommData.authorId,
        originalPostId: validCommData.originalPostId,
        id: validCommData.id,
        content: `content-${i}-${randomInt()}`,
      };
      await editComm(comm);
      expect(dbMockup.update).toBeCalledTimes(i + 1);
      expect(dbMockup.update.mock.calls[i][0]).toEqual(
        expect.objectContaining({
          id: validCommData.id,
          originalPostId: validCommData.originalPostId,
          authorId: validCommData.authorId,
          content: expect.any(String),
          createdAt: expect.any(Date),
          modifiedAt: expect.any(Date),
        })
      );
      expect(dbMockup.update.mock.calls[i][1]).toEqual(
        expect.objectContaining({ content: comm.content })
      );
    }
  });
  it("Should not call the DB if new content does not differ from the old one", async () => {
    expect(dbMockup.update).toBeCalledTimes(0);
    MockDate.set(Date.now() + randomInt() * 1000000);
    const returnedValue = await editComm(validCommData);
    expect(returnedValue.modifiedAt).toEqual(returnedValue.createdAt);
    expect(dbMockup.update).toBeCalledTimes(0);
  });
  it("Should throw an error if provided authorId doesn't match the atuhorId of post record in database", async () => {
    await expect(
      editComm({
        id: validCommData.id,
        content: validCommData.content,
        authorId: "not-an-actual-author",
      })
    ).rejects.toThrow();
  });
  it("Should return saved post data", async () => {
    for (let i = 0; i < 5; i++) {
      let newCommData = {
        authorId: validCommData.authorId,
        id: validCommData.id,
        originalPostId: validCommData.originalPostId,
        content: `content-${i}-${randomInt()}`,
      };
      MockDate.set(Date.now() + randomInt(1000000, 1000000));
      const returnValue = await editComm(newCommData);
      expect(returnValue).toEqual({
        id: validCommData.id,
        originalPostId: validCommData.originalPostId,
        authorId: validCommData.authorId,
        content: newCommData.content,
        createdAt: expect.any(Date),
        modifiedAt: expect.any(Date),
      });
      expect(returnValue.modifiedAt).not.toEqual(returnValue.createdAt);
    }
  });
});

function randomInt(max = 1000, min = 1) {
  return Math.round(Math.random() * max + min);
}
