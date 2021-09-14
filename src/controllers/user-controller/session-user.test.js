import { jest } from "@jest/globals";
import makeSessionUser from "./session-user";
import { randomBytes } from "crypto";

describe("Session user controller", () => {
  let token, validSessionToken, sessionUser, userData;

  beforeAll(() => {
    validSessionToken = randomBytes(4).toString("hex");
    userData = {
      email: `first-${Math.round(Math.random() * 100)}@user.com`,
      name: `fust-user-${Math.round(Math.random() * 100)}`,
      id: randomBytes(4).toString("hex"),
    };
    token = {
      resolve: jest.fn((t) => {
        if (t === validSessionToken) return userData;
        else return null;
      }),
    };
    sessionUser = makeSessionUser({ token });
  });
  afterEach(() => {
    token.resolve.mockClear();
  });
  it("Should sign a user if supplied with valid session token", async () => {
    expect(token.resolve).toBeCalledTimes(0);

    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      cookies: {
        token: validSessionToken,
      },
    };
    const actual = await sessionUser(request);
    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 200,
      body: {
        success: true,
        payload: userData,
      },
      cookies: {
        token: validSessionToken,
      },
    };

    expect(actual).toEqual(expected);
    expect(token.resolve).toBeCalledTimes(1);
    expect(token.resolve).toBeCalledWith(validSessionToken);
  });
  it("Should respond with an error if supplied with invalid token", async () => {
    expect(token.resolve).toBeCalledTimes(0);

    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      cookies: {
        token: "invalid-token",
      },
    };
    const actual = await sessionUser(request);
    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 401,
      body: {
        success: false,
        error: "Session timed out",
      },
      cookies: {
        token: "",
      },
    };

    expect(actual).toEqual(expected);
    expect(token.resolve).toBeCalledTimes(1);
    expect(token.resolve).toBeCalledWith("invalid-token");
  });
});
