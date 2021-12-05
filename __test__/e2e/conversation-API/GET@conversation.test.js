import axios from "axios";

describe("GET@/api/conversation", () => {
  let conversationId, creatorId, cookie, recipientId;
  beforeAll(async () => {
    const creatorData = {
      name: "legit",
      email: "legit@test.com",
      password: "legit123",
    };
    creatorId = (await axios.post("/api/user", creatorData)).data.payload.id;

    cookie = (
      await axios.post("/api/user/auth", {
        email: creatorData.email,
        password: creatorData.password,
      })
    ).headers["set-cookie"][0];

    const recipientData = {
      name: "recipient",
      email: "recipient@test.com",
      password: "legit123",
    };

    recipientId = (await axios.post("/api/user", recipientData)).data.payload
      .id;

    conversationId = (
      await axios.post(
        "/api/conversation",
        {
          membersIds: [creatorId, recipientId],
        },
        {
          headers: {
            Cookie: cookie,
          },
        }
      )
    ).data.payload.id;
    console.log(
      (
        await axios.post(
          `/api/conversation/${conversationId}`,
          {
            text: "test-text",
          },
          {
            headers: { Cookie: cookie },
          }
        )
      ).data
    );
  });
  it("Should respond with user's conversations", async () => {
    const response = await axios.get("/api/conversation", {
      headers: {
        Cookie: cookie,
      },
    });
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.payload).toEqual(expect.any(Array));
  });
  it("Should respond with an error if user is not logged in", async () => {
    const response = await axios.get("/api/conversation");
    expect(response.status).toBe(403);
    expect(response.data.success).toBe(false);
    expect(response.data.error).toEqual(expect.any(String));
  });
});
