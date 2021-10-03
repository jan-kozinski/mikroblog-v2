import axios from "axios";

it("DELETE@/api/post/:postId Should successfully delete post record", async () => {
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

  let posts = (await axios.get("/api/post")).data.payload;

  expect(posts.length).toBe(1);

  const response = await axios.delete(`/api/post/${posts[0].id}`, {
    headers: {
      Cookie: cookie,
    },
  });
  expect(response.status).toEqual(200);
  expect(response.data.success).toBe(true);
  posts = (await axios.get("/api/post")).data.payload;

  expect(posts.length).toBe(0);
});

it("DELETE@/api/post/:postId Should throw an error if trying to delete non-existant post", async () => {
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

  const response = await axios.delete("/api/post/not-an-id", {
    headers: {
      Cookie: cookie,
    },
  });
  expect(response.status).toEqual(404);
  expect(response.data.success).toBe(false);
});

it("DELETE@/api/post/:postId Should throw an error if trying to delete post that user is not the auhor of", async () => {
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

  const maliciousUserData = {
    name: "not-author",
    email: "not@author.com",
    password: "password",
  };
  cookie = (await axios.post("/api/user", maliciousUserData)).headers[
    "set-cookie"
  ][0];

  let posts = (await axios.get("/api/post")).data.payload;

  expect(posts.length).toBe(1);

  const response = await axios.delete(`/api/post/${posts[0].id}`, {
    headers: {
      Cookie: cookie,
    },
  });
  expect(response.status).toEqual(403);
  expect(response.data.success).toBe(false);
});
