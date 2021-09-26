import axios from "axios";
it("PUT@/api/comment/:commentId Should succesfully update a comment", async () => {
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

  const commentId = (
    await axios.post(
      `/api/comment/${posts[0].id}`,
      {
        content: "this is a comment",
      },
      {
        headers: {
          Cookie: cookie,
        },
      }
    )
  ).data.payload.id;

  const response = await axios.put(
    `/api/comment/${commentId}`,
    {
      content: "new, updated content",
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
    content: "new, updated content",
  });

  expect(response.data.payload).toEqual(expectedBody);
});

it("PUT@/api/comment/:commentId Should respond with an error if the commentId param is invalid", async () => {
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

  const response = await axios.put(
    `/api/comment/invalid-param`,
    {
      content: "this is a comment",
    },
    {
      headers: {
        Cookie: cookie,
      },
    }
  );
  expect(response.status).toEqual(404);
  expect(response.data.success).toBe(false);
  expect(response.data.error).toEqual(expect.any(String));
});

it("PUT@/api/comment/:commentId Should respond with an error if no content is provided", async () => {
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

  const commentId = (
    await axios.post(
      `/api/comment/${posts[0].id}`,
      {
        content: "this is a comment",
      },
      {
        headers: {
          Cookie: cookie,
        },
      }
    )
  ).data.payload.id;

  const response = await axios.put(
    `/api/comment/${commentId}`,
    {},
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

it("PUT@/api/comment/:commentId Should respond with an error if provided content is invalid", async () => {
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

  const commentId = (
    await axios.post(
      `/api/comment/${posts[0].id}`,
      {
        content: "this is a comment",
      },
      {
        headers: {
          Cookie: cookie,
        },
      }
    )
  ).data.payload.id;

  const response = await axios.put(
    `/api/comment/${commentId}`,
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
