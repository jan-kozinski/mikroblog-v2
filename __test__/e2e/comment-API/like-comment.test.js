import axios from "axios";

it("POST@api/comment/:commentId/likes Should successfully add a like and respond with an error if user already likes this comment", async () => {
  let userData = {
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
  userData = {
    name: "bad_guy",
    email: "bad_guy@test.com",
    password: "bad_guy123",
  };
  await axios.post("/api/user", userData);

  const Cookie = (
    await axios.post("/api/user/auth", {
      email: userData.email,
      password: userData.password,
    })
  ).headers["set-cookie"][0];

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

  let response = await axios.post(
    `/api/comment/${commentId}/likes`,
    {},
    {
      headers: {
        Cookie,
      },
    }
  );
  expect(response.status).toEqual(201);
  expect(response.data.success).toBe(true);

  expect(response.data.payload.likesCount).toEqual(1);
  expect(response.data.payload.likersIds).toEqual([expect.any(String)]);

  response = await axios.post(
    `/api/comment/${commentId}/likes`,
    {},
    {
      headers: {
        Cookie,
      },
    }
  );

  expect(response.status).toEqual(400);
  expect(response.data.success).toBe(false);

  expect(response.data.error).toEqual(expect.any(String));
});

it("POST@api/comment/:commentId/likes Should return an error if the comment is not found", async () => {
  let userData = {
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

  await axios.post("/api/user", userData);

  const Cookie = (
    await axios.post("/api/user/auth", {
      email: userData.email,
      password: userData.password,
    })
  ).headers["set-cookie"][0];

  const commentId = "NOT-AN-ACTUAL-ID";

  let response = await axios.post(
    `/api/comment/${commentId}/likes`,
    {},
    {
      headers: {
        Cookie,
      },
    }
  );

  expect(response.status).toEqual(404);
  expect(response.data.success).toBe(false);

  expect(response.data.error).toEqual(expect.any(String));
});

it("DELETE@api/comment/:commentId/likes Should return an error if the comment is not found", async () => {
  let userData = {
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

  await axios.post("/api/user", userData);

  const Cookie = (
    await axios.post("/api/user/auth", {
      email: userData.email,
      password: userData.password,
    })
  ).headers["set-cookie"][0];

  const commentId = "NOT-AN-ACTUAL-ID";

  let response = await axios.delete(
    `/api/comment/${commentId}/likes`,

    {
      headers: {
        Cookie,
      },
    }
  );

  expect(response.status).toEqual(404);
  expect(response.data.success).toBe(false);

  expect(response.data.error).toEqual(expect.any(String));
});

it("DELETE@/api/comment/:commentId/likes Should successfully remove a like and respond with an error if user does not like this commment", async () => {
  let userData = {
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
  userData = {
    name: "bad_guy",
    email: "bad_guy@test.com",
    password: "bad_guy123",
  };
  await axios.post("/api/user", userData);

  const Cookie = (
    await axios.post("/api/user/auth", {
      email: userData.email,
      password: userData.password,
    })
  ).headers["set-cookie"][0];

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
  await axios.post(
    `/api/comment/${commentId}/likes`,
    {},
    {
      headers: {
        Cookie,
      },
    }
  );
  let response = await axios.delete(
    `/api/comment/${commentId}/likes`,

    {
      headers: {
        Cookie,
      },
    }
  );
  expect(response.status).toEqual(200);
  expect(response.data.success).toBe(true);

  expect(response.data.payload.likesCount).toEqual(0);
  expect(response.data.payload.likersIds).toEqual([]);

  response = await axios.delete(
    `/api/comment/${commentId}/likes`,

    {
      headers: {
        Cookie,
      },
    }
  );

  expect(response.status).toEqual(400);
  expect(response.data.success).toBe(false);

  expect(response.data.error).toEqual(expect.any(String));
});
