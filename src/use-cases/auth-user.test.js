import { expect, jest } from "@jest/globals";
import dbMockup from "../../__test__/utils/dbMockup.js";
import makeAuthUser from "./auth-user.js";

describe("auth user use case", () => {
  let authUser, hasherMock, userData;
  beforeAll(() => {
    hasherMock = {
      compare: jest.fn((provided, hashed) => provided === hashed),
    };
    authUser = makeAuthUser({
      dbGateway: dbMockup,
      hasher: hasherMock,
    });
    userData = {
      id: "doesn't matter",
      name: "doesn't matter",
      email: "first@user.com",
      password: "verystrongpassword",
      memberSince: "doesn't matter",
    };
  });

  beforeEach(() => {
    dbMockup._RESET_DB();
    dbMockup.insert.mockClear();
    dbMockup.find.mockClear();
    dbMockup.findById.mockClear();
    hasherMock.compare.mockClear();
  });
  it("Should throw an error if given no email", async () => {
    await expect(authUser({ password: "anything" })).rejects.toThrow(
      new Error("Please provide with an email in order to procede")
    );
  });
  it("Should throw an error if given no password", async () => {
    await expect(authUser({ email: "i@am.fake" })).rejects.toThrow(
      new Error("Please provide with a password in order to procede")
    );
  });
  it("Should return null if no user of given email exists", async () => {
    await expect(
      await authUser({ email: "i@am.fake", password: "anything" })
    ).toEqual(null);
  });

  it("Should return null if provided with valid email and wrong password", async () => {
    expect(hasherMock.compare).toBeCalledTimes(0);
    dbMockup.insert(userData);
    await expect(
      await authUser({
        email: "first@user.com",
        password: "notavalidpassword",
      })
    ).toEqual(null);
    expect(hasherMock.compare).toBeCalledTimes(1);
  });

  it("Should return true if provided with legit credentials", async () => {
    expect(hasherMock.compare).toBeCalledTimes(0);
    dbMockup.insert(userData);
    await expect(
      await authUser({
        email: "first@user.com",
        password: "verystrongpassword",
      })
    ).toBe(userData);
    expect(hasherMock.compare).toBeCalledTimes(1);
  });
});
