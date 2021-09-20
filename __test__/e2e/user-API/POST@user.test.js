import axios from "axios";

it("POST@/api/user Should succesfully create a user", async () => {
  const response = await axios.post("/api/user", {
    email: "test@test.com",
    name: "dżony",
    password: "password",
  });
  expect(response.status).toEqual(201);
  expect(response.data.success).toBe(true);
  expect(response.data.payload).toEqual({
    id: expect.any(String),
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
  expect(response.data.payload.name).toEqual(userData.name);
  expect(response.data.payload.email).toEqual(userData.email);
  expect(response.data.payload.memberSince).toEqual(expect.any(String));
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
    "Please provide with email in order to procede"
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
    "Please provide with password in order to procede"
  );
  expect(response.headers["set-cookie"]).toBeDefined();
  cookie = response.headers["set-cookie"][0];
  expect(/^token=;/.test(cookie)).toBe(true);
});
it("POST@/api/user/auth/session Supplied with valid token should respond with the user data. Supplied with bad token or no token at all should respond with an error", async () => {
  const userData = {
    name: "legit",
    email: "legit@test.com",
    password: "legit123",
  };
  await axios.post("/api/user", userData);
  let cookie = (
    await axios.post("/api/user/auth", {
      email: userData.email,
      password: userData.password,
    })
  ).headers["set-cookie"][0];
  let response = await axios.post(
    "/api/user/auth/session",
    {},
    {
      headers: {
        Cookie: cookie,
      },
    }
  );
  expect(response.status).toEqual(200);
  expect(response.data.success).toBe(true);
  expect(response.data.payload.name).toEqual(userData.name);
  expect(response.data.payload.email).toEqual(userData.email);
  expect(response.data.payload.memberSince).toEqual(expect.any(String));
  expect(response.headers["set-cookie"]).toBeDefined();
  cookie = response.headers["set-cookie"][0];
  expect(/^token/.test(cookie)).toBe(true);

  response = await axios.post("/api/user/auth/session");
  expect(response.status).toEqual(401);
  expect(response.data.success).toBe(false);
  expect(response.data.error).toBe("Session timed out");
  expect(response.headers["set-cookie"]).toBeDefined();
  cookie = response.headers["set-cookie"][0];
  expect(/^token=;/.test(cookie)).toBe(true);
});
