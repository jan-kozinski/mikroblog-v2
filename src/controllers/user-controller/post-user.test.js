import { jest } from "@jest/globals";
import makePostUser from "./post-user";
describe("Post user controller", () => {
  let validUserData, saveUser, postUser;
  beforeAll(() => {
    validUserData = {
      name: `user-${Math.round(Math.random() * 100)}`,
      email: `first-${Math.round(Math.random() * 100)}@user.com`,
      password: "doesn't matter",
    };

    saveUser = jest.fn((u) => u);
    postUser = makePostUser({ saveUser });
  });

  afterEach(() => {
    saveUser.mockClear();
  });

  it("Successfully posts a user", async () => {
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      body: validUserData,
    };

    expect(saveUser).toBeCalledTimes(0);

    const actual = await postUser(request);

    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 201,
      body: {
        success: true,
        payload: {
          name: validUserData.name,
          email: validUserData.email,
          memberSince: expect.any(Date),
        },
      },
    };

    expect(actual).toEqual(expected);
    expect(saveUser).toBeCalledTimes(1);
    expect(saveUser.mock.calls[0][0]).toEqual({
      name: validUserData.name,
      email: validUserData.email,
      password: validUserData.password,
    });
  });
  it("Returns error response if saving user doesn't procede due to an error", async () => {
    postUser = makePostUser({
      saveUser: jest.fn(() => {
        throw new Error("test error");
      }),
    });
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      body: validUserData,
    };

    expect(saveUser).toBeCalledTimes(0);

    const actual = await postUser(request);

    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 400,
      body: {
        success: false,
        error: "test error",
      },
    };
    expect(actual).toEqual(expected);
  });
});
