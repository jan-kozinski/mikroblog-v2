import axios from "axios";
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

  const Cookie = (
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
        Cookie,
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
        Cookie,
      },
    }
  );
  expect(response.status).toEqual(404);
  expect(response.data.success).toBe(false);
  expect(response.data.error).toEqual("Post not found");
});
it("PUT@/api/post/:postId Should respond with an error if a user tries to update a post that he is not the author of", async () => {
  let userData = {
    name: "legit",
    email: "legit@test.com",
    password: "legit123",
  };
  await axios.post("/api/user", userData);

  const authorCookie = (
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
        Cookie: authorCookie,
      },
    }
  );

  const posts = (await axios.get("/api/post")).data.payload;
  userData = {
    name: "bad_guy",
    email: "bad_guy@test.com",
    password: "bad_guy123",
  };
  await axios.post("/api/user", userData);

  const badCookie = (
    await axios.post("/api/user/auth", {
      email: userData.email,
      password: userData.password,
    })
  ).headers["set-cookie"][0];

  const response = await axios.put(
    `/api/post/${posts[0].id}`,
    {
      content: "a new content",
    },
    {
      headers: {
        Cookie: badCookie,
      },
    }
  );

  expect(response.status).toEqual(403);
  expect(response.data.success).toBe(false);

  expect(response.data.error).toEqual("User not allowed to edit this post");
});

it("PUT@/api/post/:postId Should respond with an error if provided content is invalid", async () => {
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
      content: [],
    },
    {
      headers: {
        Cookie: cookie,
      },
    }
  );
  expect(response.status).toEqual(400);
  expect(response.data.success).toBe(false);
  expect(response.data.error).toEqual(expect.any(String));
});
