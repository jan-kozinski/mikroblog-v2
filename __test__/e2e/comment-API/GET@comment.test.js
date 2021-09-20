import axios from "axios";

it("Should succesfully get all comments of a post", async () => {
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

  for (let i = 0; i < 5; i++) {
    await axios.post(
      `/api/comment/${posts[0].id}`,
      {
        content: `this is a comment number ${i + 1}`,
      },
      {
        headers: {
          Cookie: cookie,
        },
      }
    );
  }

  const response = await axios.get(`/api/comment/${posts[0].id}`);
  expect(response.status).toEqual(200);
  expect(response.data.success).toBe(true);
  expect(response.data.payload).toEqual(expect.any(Array));
  expect(response.data.payload.length).toBe(5);
  const expectedFirstCommData = expect.objectContaining({
    authorId: expect.any(String),
    originalPostId: expect.any(String),
    createdAt: expect.any(String),
    modifiedAt: expect.any(String),
    likesCount: 0,
    likersIds: [],
    content: "this is a comment number 1",
  });
  expect(response.data.payload[0]).toEqual(expectedFirstCommData);
});
