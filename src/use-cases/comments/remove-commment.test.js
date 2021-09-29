import { jest } from "@jest/globals";
import dbMockup from "../../../__test__/utils/dbMockup";
import makeRemoveComment from "./remove-comment";

describe("remove comment use case", () => {
  let commId, commentRecord, removeComment;
  beforeAll(() => {
    commId = "id-" + genRandomInt();
    removeComment = makeRemoveComment({ dbGateway: dbMockup });

    commentRecord = {
      id: commId,
      originalPostId: `post-${genRandomInt()}-id`,
      authorId: `user-${genRandomInt()}-id`,
      content: `some-content-${genRandomInt()}`,
      likersIds: [],
      likesCount: 0,
      createdAt: new Date(),
      modifiedAt: new Date(),
      isDeleted: false,
    };
  });

  beforeEach(() => {
    dbMockup._RESET_DB();
    dbMockup.insert(commentRecord);
    dbMockup.insert.mockClear();
    dbMockup.update.mockClear();
    dbMockup.findById.mockClear();
  });

  it("Should successfully delete record", async () => {
    expect(dbMockup.update).toBeCalledTimes(0);
    expect(dbMockup.findById).toBeCalledTimes(0);

    await removeComment(commId);

    expect(dbMockup.update).toBeCalledTimes(1);
    expect(dbMockup.findById).toBeCalledTimes(1);
    expect(dbMockup.findById).toBeCalledWith(commId);
    expect(dbMockup.update.mock.calls[0][0]).toEqual(commentRecord);
    expect(dbMockup.update.mock.calls[0][1]).toEqual(
      expect.objectContaining({
        ...commentRecord,
        isDeleted: true,
        content: expect.stringContaining("deleted"),
      })
    );
  });

  it("Should throw an error if the comment to be deleted is not found", async () => {
    await expect(removeComment("not-an-actual-id")).rejects.toThrow();
  });
  it("Should return comment data after changing its state to deleted", async () => {
    const comm = await removeComment(commId);
    expect(comm).toEqual({
      id: commentRecord.id,
      originalPostId: commentRecord.originalPostId,
      authorId: commentRecord.authorId,
      content: expect.stringContaining("deleted"),
      likesCount: 0,
      likersIds: [],
      createdAt: expect.any(Date),
      modifiedAt: expect.any(Date),
      isDeleted: true,
    });
  });
});
function genRandomInt() {
  return Math.round(Math.random() * 10);
}
