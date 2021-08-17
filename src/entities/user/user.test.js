import { jest } from "@jest/globals";
import buildMakeUser from "./user.js";

const hasherMock = {
  hash: jest.fn((password) => `hashed-${password}`),
};
const makeUser = buildMakeUser({ hasher: hasherMock });

const validUserData = {
  id: "string",
  name: "string",
  email: "valid@email.com",
  password: "eigthcharacters",
};

describe("makeUser", () => {
  it("Should throw an error if no id is provided", () => {
    const user = { ...validUserData, id: undefined };
    expect(() => makeUser(user)).toThrow();
  });
  it("Should throw an error if provided id is not a string", () => {
    const invalidIds = [1, Math.random(), [], {}];
    invalidIds.forEach((id) => {
      let user = { ...validUserData, id };
      expect(() => makeUser(user)).toThrow();
    });
  });

  it("Should throw an error if no name is provided", () => {
    const user = { ...validUserData, name: undefined };
    expect(() => makeUser(user)).toThrow();
  });
  it("Should throw an error if provided name is not a string", () => {
    const invalidNames = [1, Math.random(), [], {}];
    invalidNames.forEach((name) => {
      let user = { ...validUserData, name };
      expect(() => makeUser(user)).toThrow();
    });
  });
  it("Should throw an error if provided name is shorter than 3 characters", () => {
    const user = { ...validUserData, name: "ab" };
    expect(() => makeUser(user)).toThrow();
  });
  it("Should throw an error if provided name is longer than 32 characters", () => {
    let name = "";
    for (let i = 0; i < 33; i++) {
      name += "A";
    }
    const user = { ...validUserData, name };
    expect(() => makeUser(user)).toThrow();
  });

  it("Should throw an error if no email is provided", () => {
    const user = { ...validUserData, email: undefined };
    expect(() => makeUser(user)).toThrow();
  });
  it("Should throw an error if provided email is not a string", () => {
    const invalidEmails = [1, Math.random(), [], {}];
    invalidEmails.forEach((email) => {
      let user = { ...validUserData, email };
      expect(() => makeUser(user)).toThrow();
    });
  });

  it("Should throw an error if provided email is invalid", () => {
    const user = { ...validUserData, email: "not-a-valid-email" };
    expect(() => makeUser(user)).toThrow();
  });

  it("Should throw an error if no password is provided", () => {
    const user = { ...validUserData, password: undefined };
    expect(() => makeUser(user)).toThrow();
  });
  it("Should throw an error if provided password is not a string", () => {
    const invalidPasswords = [1, Math.random(), [], {}];
    invalidPasswords.forEach((password) => {
      let user = { ...validUserData, password };
      expect(() => makeUser(user)).toThrow();
    });
  });
  it("Should throw an error if provided password is shorter than 8 characters", () => {
    const user = { ...validUserData, password: "a123b" };
    expect(() => makeUser(user)).toThrow();
  });
  it("Should throw an error if provided password is longer than 32 characters", () => {
    let password = "";
    for (let i = 0; i < 129; i++) {
      password += "A";
    }
    const user = { ...validUserData, password };
    expect(() => makeUser(user)).toThrow();
  });

  it("Should return a user object with getters for each property given the correct input data", () => {
    const user = makeUser(validUserData);

    expect(user).toEqual(
      expect.objectContaining({
        getId: expect.any(Function),
        getName: expect.any(Function),
        getHashedPassword: expect.any(Function),
        getMemberSince: expect.any(Function),
      })
    );
  });
  it("Newly crated user properties getters should return proper values", () => {
    const user = makeUser(validUserData);

    expect(user.getId()).toEqual(validUserData.id);
    expect(user.getName()).toEqual(validUserData.name);
    expect(user.getEmail()).toEqual(validUserData.email);
    expect(user.getHashedPassword()).toEqual(
      `hashed-${validUserData.password}`
    );
    expect(user.getMemberSince()).toBeInstanceOf(Date);
  });
});
