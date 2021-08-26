import { jest } from "@jest/globals";
import { randomBytes } from "crypto";
import makeSignUser from "./sign-user";
describe("Sign user controller", () => {
  let validUserData, token, tokenValue;
  beforeAll(() => {
    validUserData = {
      email: `first-${Math.round(Math.random() * 100)}@user.com`,
      password: "doesn't matter",
    };
    tokenValue = randomBytes(4).toString("hex");
    token = { create: jest.fn(() => tokenValue) };
  });
  afterEach(() => {
    token.create.mockClear();
  });
  it("Successfully signs a user", async () => {
    const authUser = jest.fn(() => ({
      id: "good-looking-id",
      name: "even-better-looking-name",
    }));
    const signUser = makeSignUser({ authUser, token });
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      body: validUserData,
    };

    expect(authUser).toBeCalledTimes(0);
    expect(token.create).toBeCalledTimes(0);

    const actual = await signUser(request);

    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 200,
      body: {
        success: true,
      },
      cookies: {
        token: tokenValue,
      },
    };

    expect(actual).toEqual(expected);
    expect(authUser).toBeCalledTimes(1);
    expect(authUser).toBeCalledWith({
      email: validUserData.email,
      password: validUserData.password,
    });
    authUser.mockClear();

    expect(token.create).toBeCalledTimes(1);
    expect(token.create).toBeCalledWith({
      id: "good-looking-id",
      name: "even-better-looking-name",
    });
  });
  it("Responds with an error if authentication fails", async () => {
    const authUser = jest.fn(() => false);
    const signUser = makeSignUser({ authUser, token });
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      body: validUserData,
    };

    expect(authUser).toBeCalledTimes(0);
    expect(token.create).toBeCalledTimes(0);

    const actual = await signUser(request);

    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 401,
      body: {
        success: false,
        error: "Invalid credentials",
      },
      cookies: {
        token: "",
      },
    };

    expect(actual).toEqual(expected);
    expect(authUser).toBeCalledTimes(1);
    expect(authUser).toBeCalledWith({
      email: validUserData.email,
      password: validUserData.password,
    });
    authUser.mockClear();

    expect(token.create).toBeCalledTimes(0);
  });
  it("Responds with an error if authentication proceeds to throw one", async () => {
    const error = randomBytes(4).toString("hex");
    const authUser = jest.fn(() => {
      throw new Error(`test error-${error}`);
    });
    const signUser = makeSignUser({ authUser, token });
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      body: validUserData,
    };

    expect(authUser).toBeCalledTimes(0);
    expect(token.create).toBeCalledTimes(0);

    const actual = await signUser(request);

    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 400,
      body: {
        success: false,
        error: `test error-${error}`,
      },
      cookies: {
        token: "",
      },
    };

    expect(actual).toEqual(expected);
    expect(authUser).toBeCalledTimes(1);
    expect(authUser).toBeCalledWith({
      email: validUserData.email,
      password: validUserData.password,
    });
    authUser.mockClear();

    expect(token.create).toBeCalledTimes(0);
  });
});
