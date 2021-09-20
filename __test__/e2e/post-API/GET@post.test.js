import axios from "axios";
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
      likesCount: 0,
      likersIds: [],
      content: "blah blah blah",
    }),
  ]);
  expect(response.data.payload).toEqual(expectedBody);
});

it("Should apply query to result", async () => {
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

  for (let i = 0; i < 5; i++) {
    await axios.post(
      "/api/post",
      {
        content: `post number ${i + 1}`,
      },
      {
        headers: {
          Cookie: cookie,
        },
      }
    );
  }

  const response = await axios.get("/api/post?limit=2");
  console.log(response.data);
  expect(response.data.payload.length).toBe(2);
});
