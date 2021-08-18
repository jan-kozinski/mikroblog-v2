import dbMockup from "../../__test__/utils/dbMockup";
import makeListUsers from "./list-users";

describe("list all users", () => {
  let listUsers;
  beforeAll(() => {
    listUsers = makeListUsers({ dbGateway: dbMockup });
  });
  afterEach(() => {
    dbMockup.insert.mockClear();
    dbMockup.find.mockClear();
    dbMockup.findById.mockClear();
  });
  it("Should return users ", async () => {
    let users = [];
    for (let i = 0; i < 5; i++) {
      let user = {
        id: `${i}-${Math.round(Math.random() * 10)}`,
        name: `user-${i}-${Math.round(Math.random() * 10)}`,
        email: `mail-${i}-${Math.round(Math.random() * 10)}@mail.com`,
        password: "doesn't matter",
        memberSince: "doesn't matter",
      };
      await dbMockup.insert(user);
      users.push(user);
    }

    const returnedUsers = await listUsers();
    expect(returnedUsers).toEqual(users);
  });
});
