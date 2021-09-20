import axios from "axios";

it("POST@/api/post/:postId/likes Should successfully add a like and respond with an error if user already likes a post", async () => {
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

  let response = await axios.post(
    `/api/post/${posts[0].id}/likes`,
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
    `/api/post/${posts[0].id}/likes`,
    {},
    {
      headers: {
        Cookie,
      },
    }
  );

  expect(response.status).toEqual(400);
  expect(response.data.success).toBe(false);

  expect(response.data.error).toBe("User already likes this post");
});

it("DELETE@/api/post/:postId/likes Should successfully remove a like and respond with an error if user does not like a post", async () => {
  let userData = {
    name: "legit",
    email: "legit@test.com",
    password: "legit123",
  };
  const authorCookie = (await axios.post("/api/user", userData)).headers[
    "set-cookie"
  ][0];

  await axios.post("/api/user/auth", {
    email: userData.email,
    password: userData.password,
  });

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

  const Cookie = (
    await axios.post("/api/user/auth", {
      email: userData.email,
      password: userData.password,
    })
  ).headers["set-cookie"][0];

  await axios.post(
    `/api/post/${posts[0].id}/likes`,
    {},
    {
      headers: {
        Cookie,
      },
    }
  );

  let response = await axios.delete(`/api/post/${posts[0].id}/likes`, {
    headers: {
      Cookie,
    },
  });

  expect(response.status).toEqual(200);
  expect(response.data.success).toBe(true);

  expect(response.data.payload.likesCount).toEqual(0);
  expect(response.data.payload.likersIds).toEqual([]);

  response = await axios.delete(`/api/post/${posts[0].id}/likes`, {
    headers: {
      Cookie,
    },
  });

  expect(response.status).toEqual(400);
  expect(response.data.success).toBe(false);

  expect(response.data.error).toBe("User does not like this post");
});
