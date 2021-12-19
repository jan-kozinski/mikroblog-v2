import { jest } from "@jest/globals";
import dbMockup from "../../../__test__/utils/dbMockup";
import makeListConvs from "./list-user-conversations";

describe("list all conversations of a user", () => {
  let listConvs, userId, convsDb;
  beforeAll(() => {
    convsDb = {
      find: jest.fn(() => Promise.resolve()),
    };
    listConvs = makeListConvs({ dbGateway: convsDb });
    userId = `user-${Math.round(Math.random() * 1000)}`;
  });
  afterEach(() => {
    dbMockup._RESET_DB();
    dbMockup.insert.mockClear();
    dbMockup.find.mockClear();
    dbMockup.findById.mockClear();
  });

  it("Should throw an error if userId param is not provided", async () => {
    await expect(listConvs()).rejects.toThrow();
  });
  it("Should return all conversations of a user", async () => {
    await listConvs(userId);
    expect(convsDb.find).toBeCalledTimes(1);
    let findArgs = convsDb.find.mock.calls[0];
    expect(findArgs[0]).toEqual({ membersIds: [userId] });
    expect(findArgs[1]).toEqual({
      matchAny: expect.arrayContaining(["membersIds"]),
    });

    await listConvs(userId, { matchAny: ["random-field-for-test-purpose"] });
    expect(convsDb.find).toBeCalledTimes(2);
    findArgs = convsDb.find.mock.calls[1];
    expect(findArgs[0]).toEqual({ membersIds: [userId] });
    expect(findArgs[1]).toEqual({
      matchAny: expect.arrayContaining(["membersIds"]),
    });
  });
});
