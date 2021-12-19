import { jest } from "@jest/globals";
import makeGetUsers from "./get-users";

describe("Get user controller", () => {
  let searchUsers, getUsers;
  beforeAll(() => {
    searchUsers = jest.fn((u) => Promise.resolve([]));
    getUsers = makeGetUsers({ searchUsers });
  });
  it("Should respond with an error if request doesn't contain any query or particularly the name query", async () => {
    let request = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let response = await getUsers(request);
    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toEqual(expect.any(String));

    request = {
      headers: {
        "Content-Type": "application/json",
      },
      queries: {},
    };

    expect(searchUsers).toBeCalledTimes(0);
    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toEqual(expect.any(String));
  });
  it("Should succesfully search for users with provided name", async () => {
    let request = {
      headers: {
        "Content-Type": "application/json",
      },
      query: { name: `string-${Math.round(Math.random() * 100)}` },
    };
    let response = await getUsers(request);
    expect(searchUsers).toBeCalledTimes(1);
    expect(searchUsers).toBeCalledWith(request.query.name);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.payload).toEqual(expect.any(Array));
  });
});
