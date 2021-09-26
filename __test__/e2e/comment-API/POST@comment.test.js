import axios from "axios";
it("Should succesfully add a comment", async () => {
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

  const response = await axios.post(
    `/api/comment/${posts[0].id}`,
    {
      content: "this is a comment",
    },
    {
      headers: {
        Cookie: cookie,
      },
    }
  );
  expect(response.status).toEqual(201);
  expect(response.data.success).toBe(true);
  const expectedBody = expect.objectContaining({
    authorId: expect.any(String),
    originalPostId: expect.any(String),
    createdAt: expect.any(String),
    modifiedAt: expect.any(String),
    likesCount: 0,
    likersIds: [],
    content: "this is a comment",
  });

  expect(response.data.payload).toEqual(expectedBody);
});

it("Should respond with an error if the originalPostId param is invalid", async () => {
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
  expect(response.status).toEqual(400);
  expect(response.data.success).toBe(false);
  expect(response.data.error).toEqual(expect.any(String));
});

it("Should respond with an error if no content is provided", async () => {
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

  const response = await axios.post(
    `/api/comment/${posts[0].id}`,
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

it("Should respond with an error if provided content is invalid", async () => {
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

  const response = await axios.post(
    `/api/comment/${posts[0].id}`,
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
