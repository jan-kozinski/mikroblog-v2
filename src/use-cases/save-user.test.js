import { jest } from "@jest/globals";
import makeSaveUser from "./save-user";

const dbMockup = {
  _users: [
    {
      id: "0",
      name: "user0",
      email: "first@user.com",
      password: "doesn't matter",
      memberSince: "doesn't matter",
    },
  ],
  findById(id) {
    if (id === "0") return this._users[0];
  },
  find(queries) {
    for (let q in queries) {
      for (let u of this._users) {
        if (u[q] === queries[q]) return u;
      }
    }
    return null;
  },
  insert: jest.fn(),
};

const validUserData = {
  id: "1",
  name: "user1",
  email: "second@user.com",
  password: "doesn't matter",
  memberSince: "doesn't matter",
};

const saveUser = makeSaveUser({ dbGateway: dbMockup });
describe("createUser", () => {
  afterEach(() => {
    dbMockup.insert.mockClear();
  });
  it("Should throw an error if provided with already taken id", async () => {
    await expect(saveUser({ ...validUserData, id: "0" })).rejects.toThrow(
      new Error("user of provided id already exists")
    );
  });
  it("Should throw an error if provided with already taken email", async () => {
    await expect(
      saveUser({ ...validUserData, email: "first@user.com" })
    ).rejects.toThrow(new Error("user of provided email already exists"));
  });
  it("Given proper input should insert data to the database", async () => {
    expect(dbMockup.insert).toBeCalledTimes(0);

    for (let i = 0; i < 5; i++) {
      let user = {
        id: `${i}-${Math.round(Math.random() * 10)}`,
        name: `user-${i}-${Math.round(Math.random() * 10)}`,
        email: `mail-${i}-${Math.round(Math.random() * 10)}@mail.com`,
        password: "doesn't matter",
        memberSince: new Date(),
      };
      await saveUser(user);
      expect(dbMockup.insert).toBeCalledTimes(i + 1);
      expect(dbMockup.insert.mock.calls[i][0]).toEqual(
        expect.objectContaining({
          id: user.id,
          name: user.name,
          email: user.email,
          password: expect.any(String),
          memberSince: expect.any(Date),
        })
      );
    }
  });
});
