import { expect, jest } from "@jest/globals";
import dbMockup from "../../__test__/utils/dbMockup";
import makeSaveUser from "./save-user";

describe("create user", () => {
  let validUserData;
  let saveUser;
  let genId;
  beforeAll(() => {
    validUserData = {
      id: "1",
      name: "user1",
      email: "second@user.com",
      password: "doesn't matter",
      memberSince: "doesn't matter",
    };
    dbMockup.insert({
      id: "0",
      name: "user0",
      email: "first@user.com",
      password: "doesn't matter",
      memberSince: "doesn't matter",
    });
    genId = jest.fn(() => "this is and id");
    saveUser = makeSaveUser({
      dbGateway: dbMockup,
      Id: { genId },
    });
  });

  afterEach(() => {
    dbMockup.insert.mockClear();
    dbMockup.find.mockClear();
    dbMockup.findById.mockClear();
    genId.mockClear();
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
  it("Given no id should generate one", async () => {
    expect(genId).toBeCalledTimes(0);
    await saveUser({ ...validUserData, id: undefined });
    expect(genId).toBeCalledTimes(1);
  });
});
