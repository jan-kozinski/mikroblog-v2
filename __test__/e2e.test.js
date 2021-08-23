import axios from "axios";
import startExpressApp, {
  server,
} from "../src/adapters/express-adapter/index.js";
import dotenv from "dotenv";
import path from "path";

const PORT = process.env.PORT || 3000;

describe("end to end API endpoints test", () => {
  beforeAll(async () => {
    dotenv.config({
      path: path.resolve(process.cwd(), "./src/config.env"),
    });
    startExpressApp();

    axios.defaults.baseURL = `http://localhost:${PORT}`;
    axios.defaults.headers.common["Content-Type"] = "application/json";
    axios.defaults.validateStatus = function (status) {
      // Throw only if the status code is greater than or equal to 500
      return status < 500;
    };
  });

  afterAll(() => {
    server.close();
  });
  it("POST@/api/user Should succesfully create a user", async () => {
    const response = await axios.post("/api/user", {
      email: "test@test.com",
      name: "dżony",
      password: "password",
    });
    expect(response.status).toEqual(201);
    expect(response.data.success).toBe(true);
    expect(response.data.payload).toEqual({
      email: "test@test.com",
      name: "dżony",
      memberSince: expect.any(String),
    });
  });
  it("POST@/api/user Should respond with proper error if given invalid input", async () => {
    let response = await axios.post("/api/user", {
      email: undefined,
      name: "dżony",
      password: "password",
    });
    expect(response.status).toEqual(400);
    expect(response.data.success).toBe(false);
    expect(response.data.error).toBe("User email must be provided");

    response = await axios.post("/api/user", {
      email: "test@test.com",
      name: undefined,
      password: "password",
    });
    expect(response.status).toEqual(400);
    expect(response.data.success).toBe(false);
    expect(response.data.error).toBe("User name must be provided");

    response = await axios.post("/api/user", {
      email: "test@test.com",
      name: "dżony",
      password: undefined,
    });
    expect(response.status).toEqual(400);
    expect(response.data.success).toBe(false);
    expect(response.data.error).toBe("User password must be provided");
  });
  it("POST@/api/user/auth Should respond with 200 and set a cookie with JWT token if given valid credentials", async () => {
    const userData = {
      name: "legit",
      email: "legit@test.com",
      password: "legit123",
    };
    await axios.post("/api/user", userData);
    const response = await axios.post("/api/user/auth", {
      email: userData.email,
      password: userData.password,
    });
    expect(response.status).toEqual(200);
    expect(response.data.success).toBe(true);
    expect(response.headers["set-cookie"]).toBeDefined();
    const cookie = response.headers["set-cookie"][0];
    expect(/^token/.test(cookie)).toBe(true);
  });
  it("POST@/api/user/auth Should respond with 401 and empty token cookie if given invalid credentials", async () => {
    const userData = {
      name: "legit",
      email: "legit@test.com",
      password: "legit123",
    };
    await axios.post("/api/user", userData);

    let response = await axios.post("/api/user/auth", {
      email: "fake@mail.com",
      password: userData.password,
    });
    expect(response.status).toEqual(401);
    expect(response.data.success).toBe(false);
    expect(response.headers["set-cookie"]).toBeDefined();
    let cookie = response.headers["set-cookie"][0];
    expect(/^token=;/.test(cookie)).toBe(true);

    response = await axios.post("/api/user/auth", {
      email: userData.email,
      password: "fake",
    });
    expect(response.status).toEqual(401);
    expect(response.data.success).toBe(false);
    expect(response.headers["set-cookie"]).toBeDefined();
    cookie = response.headers["set-cookie"][0];
    expect(/^token=;/.test(cookie)).toBe(true);
  });
  it("POST@/api/user/auth Should respond with 400 and empty token a cookie if given invalid input", async () => {
    const userData = {
      name: "legit",
      email: "legit@test.com",
      password: "legit123",
    };
    await axios.post("/api/user", userData);
    let response = await axios.post("/api/user/auth", {
      email: undefined,
      password: userData.password,
    });
    expect(response.status).toEqual(400);
    expect(response.data.success).toBe(false);
    expect(response.data.error).toBe(
      "Please provide with an email in order to procede"
    );
    expect(response.headers["set-cookie"]).toBeDefined();
    let cookie = response.headers["set-cookie"][0];
    expect(/^token=;/.test(cookie)).toBe(true);

    response = await axios.post("/api/user/auth", {
      email: userData.email,
      password: undefined,
    });
    expect(response.status).toEqual(400);
    expect(response.data.success).toBe(false);
    expect(response.data.error).toBe(
      "Please provide with a password in order to procede"
    );
    expect(response.headers["set-cookie"]).toBeDefined();
    cookie = response.headers["set-cookie"][0];
    expect(/^token=;/.test(cookie)).toBe(true);
  });
  it("POST@/api/post Should sucessfully create a post", async () => {
    const userData = {
      name: "legit",
      email: "legit@test.com",
      password: "legit123",
    };
    await axios.post("/api/user", userData);
    const cookie = (
      await axios.post("/api/user/auth", {
        email: userData.email,
        password: userData.password,
      })
    ).headers["set-cookie"][0];

    const response = await axios.post(
      "/api/post",
      {
        content: "blah blah blah",
      },
      {
        headers: {
          Cookie: cookie,
        },
      }
    );
    expect(response.status).toEqual(201);
    expect(response.data.success).toBe(true);
    expect(response.data.payload).toEqual(
      expect.objectContaining({
        author: expect.any(String),
        createdAt: expect.any(String),
        modifiedAt: expect.any(String),
        content: "blah blah blah",
      })
    );
  });
  it("POST@/api/post Should respond with proper error if token is either invalid or not present at all", async () => {
    let response = await axios.post("/api/post", {
      content: "blah blah blah",
    });
    expect(response.status).toEqual(403);
    expect(response.data.success).toBe(false);
    expect(response.data.error).toBe("Access denied-no token");

    response = await axios.post(
      "/api/post",
      {
        content: "blah blah blah",
      },
      {
        headers: {
          Cookie: "token=not-a-real-token;",
        },
      }
    );
    expect(response.status).toEqual(403);
    expect(response.data.success).toBe(false);
    expect(response.data.error).toBe("Access denied-token invalid");
  });
  it("POST@/api/post Should respond with 400 if given invalid input", async () => {
    const userData = {
      name: "legit",
      email: "legit@test.com",
      password: "legit123",
    };
    await axios.post("/api/user", userData);
    const cookie = (
      await axios.post("/api/user/auth", {
        email: userData.email,
        password: userData.password,
      })
    ).headers["set-cookie"][0];

    const response = await axios.post(
      "/api/post",
      {},
      {
        headers: {
          Cookie: cookie,
        },
      }
    );
    expect(response.status).toEqual(400);
    expect(response.data.success).toBe(false);
    expect(response.data.error).toBe("Content must be provided");
  });
  it("GET@/api/post Should list all posts", async () => {
    const userData = {
      name: "legit",
      email: "legit@test.com",
      password: "legit123",
    };
    await axios.post("/api/user", userData);

    const cookie = (
      await axios.post("/api/user/auth", {
        email: userData.email,
        password: userData.password,
      })
    ).headers["set-cookie"][0];

    await axios.post(
      "/api/post",
      {
        content: "blah blah blah",
      },
      {
        headers: {
          Cookie: cookie,
        },
      }
    );

    const response = await axios.get("/api/post");
    expect(response.status).toEqual(200);
    expect(response.data.success).toBe(true);
    const expectedBody = expect.arrayContaining([
      expect.objectContaining({
        authorId: expect.any(String),
        createdAt: expect.any(String),
        modifiedAt: expect.any(String),
        content: "blah blah blah",
      }),
    ]);
    expect(response.data.payload).toEqual(expectedBody);
  });
  it("PUT@/api/post/:postId Should successfully update a post", async () => {
    const userData = {
      name: "legit",
      email: "legit@test.com",
      password: "legit123",
    };
    await axios.post("/api/user", userData);

    const cookie = (
      await axios.post("/api/user/auth", {
        email: userData.email,
        password: userData.password,
      })
    ).headers["set-cookie"][0];

    await axios.post(
      "/api/post",
      {
        content: "blah blah blah",
      },
      {
        headers: {
          Cookie: cookie,
        },
      }
    );

    const posts = (await axios.get("/api/post")).data.payload;

    const response = await axios.put(
      `/api/post/${posts[0].id}`,
      {
        content: "a new content",
      },
      {
        headers: {
          Cookie: cookie,
        },
      }
    );
    expect(response.status).toEqual(200);
    expect(response.data.success).toBe(true);
    const expectedBody = expect.objectContaining({
      createdAt: expect.any(String),
      modifiedAt: expect.any(String),
      content: "a new content",
    });

    expect(response.data.payload).toEqual(expectedBody);
  });
  it("PUT@/api/post/:postId Should respond with proper error if token is either invalid or not present at all", async () => {
    const userData = {
      name: "legit",
      email: "legit@test.com",
      password: "legit123",
    };
    await axios.post("/api/user", userData);

    const cookie = (
      await axios.post("/api/user/auth", {
        email: userData.email,
        password: userData.password,
      })
    ).headers["set-cookie"][0];

    await axios.post(
      "/api/post",
      {
        content: "blah blah blah",
      },
      {
        headers: {
          Cookie: cookie,
        },
      }
    );
    const posts = (await axios.get("/api/post")).data.payload;

    let response = await axios.put(`/api/post/${posts[0].id}`, {
      content: "a new content",
    });
    expect(response.status).toEqual(403);
    expect(response.data.success).toBe(false);
    expect(response.data.error).toBe("Access denied-no token");

    response = await axios.put(
      `/api/post/${posts[0].id}`,
      {
        content: "a new content",
      },
      {
        headers: {
          Cookie: "token=not-a-real-token",
        },
      }
    );
    expect(response.status).toEqual(403);
    expect(response.data.success).toBe(false);
    expect(response.data.error).toBe("Access denied-token invalid");
  });
  it("PUT@/api/post/:postId Should respond with 400 if no content is provided", async () => {
    const userData = {
      name: "legit",
      email: "legit@test.com",
      password: "legit123",
    };
    await axios.post("/api/user", userData);

    const cookie = (
      await axios.post("/api/user/auth", {
        email: userData.email,
        password: userData.password,
      })
    ).headers["set-cookie"][0];

    await axios.post(
      "/api/post",
      {
        content: "blah blah blah",
      },
      {
        headers: {
          Cookie: cookie,
        },
      }
    );

    const posts = (await axios.get("/api/post")).data.payload;

    const response = await axios.put(
      `/api/post/${posts[0].id}`,
      {},
      {
        headers: {
          Cookie: cookie,
        },
      }
    );
    expect(response.status).toEqual(400);
    expect(response.data.success).toBe(false);
    expect(response.data.error).toEqual("Content must be provided");
  });
  it("PUT@/api/post/:postId Should respond with 404 if given invalid postId param", async () => {
    const userData = {
      name: "legit",
      email: "legit@test.com",
      password: "legit123",
    };
    await axios.post("/api/user", userData);

    const cookie = (
      await axios.post("/api/user/auth", {
        email: userData.email,
        password: userData.password,
      })
    ).headers["set-cookie"][0];

    await axios.post(
      "/api/post",
      {
        content: "blah blah blah",
      },
      {
        headers: {
          Cookie: cookie,
        },
      }
    );

    const posts = (await axios.get("/api/post")).data.payload;

    const response = await axios.put(
      `/api/post/not-an-id`,
      {
        content: "a new content",
      },
      {
        headers: {
          Cookie: cookie,
        },
      }
    );
    expect(response.status).toEqual(404);
    expect(response.data.success).toBe(false);
    expect(response.data.error).toEqual("Post not found");
  });
});
