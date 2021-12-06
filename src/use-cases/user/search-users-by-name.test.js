import { jest } from "@jest/globals";
import dbMockup from "../../../__test__/utils/dbMockup";
import makeSearchUsers from "./search-users-by-name";

describe("search users use-case", () => {
  let searchUsers, dbGateway;
  beforeAll(() => {
    dbGateway = {
      find: jest.fn((u) =>
        Promise.resolve([
          {
            name: "name",
            id: "id",
            unwanted_field: "uff",
          },
        ])
      ),
    };
    searchUsers = makeSearchUsers({ dbGateway });
  });
  afterEach(() => {
    dbMockup._RESET_DB();
    dbMockup.insert.mockClear();
    dbMockup.find.mockClear();
    dbMockup.findById.mockClear();
  });
  it("Should search for users", async () => {
    const name = `name-${Math.round(Math.random() * 100)}`;
    const user = (await searchUsers(name))[0];
    expect(user.name).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.unwanted_field).not.toBeDefined();

    expect(dbGateway.find).toBeCalledTimes(1);
    expect(dbGateway.find).toBeCalledWith({ name }, { treatAsPattern: true });
  });
});
