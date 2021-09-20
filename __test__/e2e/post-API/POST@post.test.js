import axios from "axios";

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
